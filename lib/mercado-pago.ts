import { env } from "cloudflare:workers";

export const EBOOK_PRICE = 19.9;
export const EBOOK_REFERENCE = "UHF_EPUB_VOL1";

type MercadoPagoPayment = {
  id?: number;
  status?: string;
  currency_id?: string;
  transaction_amount?: number;
  external_reference?: string;
};

const STORED_TOKEN_KEY = "config/mercado-pago-access-token.enc";

type RuntimeEnv = {
  BUCKET?: {
    get(key: string): Promise<{ body: ReadableStream } | null>;
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
  MERCADO_PAGO_ACCESS_TOKEN?: string;
};

function runtimeEnv() {
  return env as unknown as RuntimeEnv;
}

async function accessToken() {
  const token = (env as unknown as { MERCADO_PAGO_ACCESS_TOKEN?: string })
    .MERCADO_PAGO_ACCESS_TOKEN;

  if (token) return token;

  const bucket = runtimeEnv().BUCKET;
  if (!bucket) throw new Error("Mercado Pago não configurado.");

  const stored = await bucket.get(STORED_TOKEN_KEY);
  if (!stored) throw new Error("Mercado Pago não configurado.");

  return decryptSecret(await new Response(stored.body).arrayBuffer());
}

export async function createCheckoutPreference(origin: string) {
  const response = await fetch(
    "https://api.mercadopago.com/checkout/preferences",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${await accessToken()}`,
        "Content-Type": "application/json",
        "X-Idempotency-Key": crypto.randomUUID(),
      },
      body: JSON.stringify({
        items: [
          {
            id: EBOOK_REFERENCE,
            title: "Universo Heróis Fantásticos — eBook",
            description:
              "Antologia de heróis brasileiros em um universo compartilhado.",
            quantity: 1,
            currency_id: "BRL",
            unit_price: EBOOK_PRICE,
          },
        ],
        external_reference: EBOOK_REFERENCE,
        statement_descriptor: "FANTASTICOS",
        back_urls: {
          success: `${origin}/pagamento/sucesso`,
          pending: `${origin}/pagamento/pendente`,
          failure: `${origin}/pagamento/recusado`,
        },
        auto_return: "approved",
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Não foi possível iniciar o pagamento.");
  }

  const preference = (await response.json()) as { init_point?: string };
  if (!preference.init_point) {
    throw new Error("O Mercado Pago não retornou o endereço do checkout.");
  }

  const checkoutUrl = new URL(preference.init_point);
  if (
    checkoutUrl.protocol !== "https:" ||
    (!checkoutUrl.hostname.endsWith(".mercadopago.com.br") &&
      checkoutUrl.hostname !== "mercadopago.com.br")
  ) {
    throw new Error("Endereço de checkout inválido.");
  }

  return checkoutUrl.toString();
}

export async function verifyApprovedEbookPayment(paymentId: string) {
  if (!/^\d{5,30}$/.test(paymentId)) return false;

  const response = await fetch(
    `https://api.mercadopago.com/v1/payments/${paymentId}`,
    {
      headers: {
        Authorization: `Bearer ${await accessToken()}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) return false;

  const payment = (await response.json()) as MercadoPagoPayment;
  return (
    payment.status === "approved" &&
    payment.currency_id === "BRL" &&
    payment.external_reference === EBOOK_REFERENCE &&
    Math.abs((payment.transaction_amount ?? 0) - EBOOK_PRICE) < 0.001
  );
}

export async function mercadoPagoIsConfigured() {
  if (runtimeEnv().MERCADO_PAGO_ACCESS_TOKEN) return true;
  const bucket = runtimeEnv().BUCKET;
  return Boolean(bucket && (await bucket.get(STORED_TOKEN_KEY)));
}

export async function configureMercadoPago(accessTokenValue: string) {
  const token = accessTokenValue.trim();
  if (
    token.length < 40 ||
    token.length > 512 ||
    !/^[A-Za-z0-9._-]+$/.test(token)
  ) {
    throw new Error("A credencial informada não tem um formato válido.");
  }

  const bucket = runtimeEnv().BUCKET;
  if (!bucket) throw new Error("Armazenamento privado indisponível.");
  if (await mercadoPagoIsConfigured()) {
    throw new Error("O Mercado Pago já está configurado.");
  }

  const validation = await fetch("https://api.mercadopago.com/users/me", {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!validation.ok) {
    throw new Error("O Mercado Pago não reconheceu essa credencial de produção.");
  }

  await bucket.put(STORED_TOKEN_KEY, await encryptSecret(token), {
    httpMetadata: { contentType: "application/octet-stream" },
    customMetadata: { purpose: "mercado-pago-production-access-token" },
  });
}

async function encryptSecret(value: string) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await crypto.subtle.importKey(
    "raw",
    encryptionKey(),
    "AES-GCM",
    false,
    ["encrypt"],
  );
  const ciphertext = new Uint8Array(
    await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      new TextEncoder().encode(value),
    ),
  );
  const sealed = new Uint8Array(iv.length + ciphertext.length);
  sealed.set(iv);
  sealed.set(ciphertext, iv.length);
  return sealed.buffer;
}

async function decryptSecret(payload: ArrayBuffer) {
  const bytes = new Uint8Array(payload);
  if (bytes.length < 29) throw new Error("Credencial armazenada inválida.");

  const key = await crypto.subtle.importKey(
    "raw",
    encryptionKey(),
    "AES-GCM",
    false,
    ["decrypt"],
  );
  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: bytes.slice(0, 12) },
    key,
    bytes.slice(12),
  );
  return new TextDecoder().decode(plaintext);
}

function encryptionKey() {
  const value = runtimeEnv().EBOOK_ENCRYPTION_KEY;
  if (!value) throw new Error("Chave de proteção indisponível.");
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
}
