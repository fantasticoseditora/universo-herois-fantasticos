import { env } from "cloudflare:workers";

const EPUB_OBJECT_KEY = "ebooks/universo-herois-fantasticos-vol1.epub";
const ENCRYPTED_ASSET_PATH = "/protected-assets/uhf-vol1.epub.enc";
const DOWNLOAD_LIFETIME_SECONDS = 24 * 60 * 60;

type RuntimeEnv = {
  BUCKET?: {
    get(key: string): Promise<{
      body: ReadableStream;
      size?: number;
    } | null>;
    put(
      key: string,
      value: ArrayBuffer,
      options?: {
        httpMetadata?: { contentType?: string };
        customMetadata?: Record<string, string>;
      },
    ): Promise<unknown>;
  };
  EBOOK_ENCRYPTION_KEY?: string;
  DOWNLOAD_SIGNING_KEY?: string;
};

function runtimeEnv() {
  return env as unknown as RuntimeEnv;
}

export async function createDownloadToken(paymentId: string) {
  const expires = Math.floor(Date.now() / 1000) + DOWNLOAD_LIFETIME_SECONDS;
  const signature = await sign(`${paymentId}.${expires}`);
  return { expires, signature };
}

export async function verifyDownloadToken(
  paymentId: string,
  expires: number,
  signature: string,
) {
  if (!Number.isInteger(expires) || expires < Math.floor(Date.now() / 1000)) {
    return false;
  }

  const key = signingKey();
  const importedKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );

  return crypto.subtle.verify(
    "HMAC",
    importedKey,
    fromBase64Url(signature),
    new TextEncoder().encode(`${paymentId}.${expires}`),
  );
}

export async function getEpub(origin: string) {
  const bucket = runtimeEnv().BUCKET;
  if (!bucket) throw new Error("Armazenamento indisponível.");

  const stored = await bucket.get(EPUB_OBJECT_KEY);
  if (stored) return stored.body;

  const encryptedResponse = await fetch(
    new URL(ENCRYPTED_ASSET_PATH, origin),
    { cache: "no-store" },
  );
  if (!encryptedResponse.ok) {
    throw new Error("Arquivo protegido indisponível.");
  }

  const epub = await decryptEpub(await encryptedResponse.arrayBuffer());
  await bucket.put(EPUB_OBJECT_KEY, epub, {
    httpMetadata: { contentType: "application/epub+zip" },
    customMetadata: { title: "Universo Heróis Fantásticos — Vol. I" },
  });

  return epub;
}

async function sign(value: string) {
  const importedKey = await crypto.subtle.importKey(
    "raw",
    signingKey(),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    importedKey,
    new TextEncoder().encode(value),
  );
  return toBase64Url(new Uint8Array(signature));
}

async function decryptEpub(payload: ArrayBuffer) {
  const bytes = new Uint8Array(payload);
  if (bytes.length < 29) throw new Error("Arquivo protegido inválido.");

  const iv = bytes.slice(0, 12);
  const tag = bytes.slice(12, 28);
  const ciphertext = bytes.slice(28);
  const sealed = new Uint8Array(ciphertext.length + tag.length);
  sealed.set(ciphertext);
  sealed.set(tag, ciphertext.length);

  const key = await crypto.subtle.importKey(
    "raw",
    encryptionKey(),
    "AES-GCM",
    false,
    ["decrypt"],
  );

  return crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, sealed);
}

function signingKey() {
  const value = runtimeEnv().DOWNLOAD_SIGNING_KEY;
  if (!value) throw new Error("Assinatura de download indisponível.");
  return fromBase64(value);
}

function encryptionKey() {
  const value = runtimeEnv().EBOOK_ENCRYPTION_KEY;
  if (!value) throw new Error("Chave do e-book indisponível.");
  return fromBase64(value);
}

function fromBase64(value: string) {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
}

function toBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function fromBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  return fromBase64(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "="));
}
