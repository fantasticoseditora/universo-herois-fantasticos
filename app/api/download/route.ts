import {
  getEpub,
  verifyDownloadToken,
} from "@/lib/ebook-delivery";
import { verifyApprovedEbookPayment } from "@/lib/mercado-pago";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const paymentId = requestUrl.searchParams.get("payment_id") ?? "";
  const expires = Number(requestUrl.searchParams.get("expires"));
  const signature = requestUrl.searchParams.get("signature") ?? "";

  const validToken = await verifyDownloadToken(
    paymentId,
    expires,
    signature,
  ).catch(() => false);
  if (!validToken) {
    return new Response("Link de download inválido ou expirado.", {
      status: 403,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const approved = await verifyApprovedEbookPayment(paymentId).catch(
    () => false,
  );
  if (!approved) {
    return new Response("Pagamento não confirmado.", {
      status: 403,
      headers: { "Cache-Control": "no-store" },
    });
  }

  try {
    const epub = await getEpub(requestUrl.origin);
    return new Response(epub, {
      headers: {
        "Cache-Control": "private, no-store, max-age=0",
        "Content-Disposition":
          'attachment; filename="Universo-Herois-Fantasticos-Vol-1.epub"',
        "Content-Type": "application/epub+zip",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response(
      "Não foi possível preparar o arquivo. Tente novamente em instantes.",
      {
        status: 503,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}
