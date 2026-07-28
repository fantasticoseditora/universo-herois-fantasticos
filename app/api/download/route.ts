import {
  getEpub,
  verifyDownloadToken,
} from "@/lib/ebook-delivery";
import { verifyApprovedEbookPayment } from "@/lib/mercado-pago";

const SUPPORT_EMAIL = "fantasticoseditora@gmail.com";

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
    return downloadErrorResponse(paymentId);
  }
}

function downloadErrorResponse(paymentId: string) {
  const safePaymentId = paymentId.replace(/\D/g, "");
  const subject = encodeURIComponent(
    `Suporte ao download do UHF — transação ${safePaymentId}`,
  );
  const supportHref = `mailto:${SUPPORT_EMAIL}?subject=${subject}`;

  return new Response(
    `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Problema no download | Universo Heróis Fantásticos</title>
    <style>
      :root { color-scheme: light; }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 24px;
        background: #f4ecd8;
        color: #102019;
        font-family: Arial, Helvetica, sans-serif;
      }
      main {
        width: min(620px, 100%);
        padding: 40px;
        background: #fffdf7;
        border: 1px solid #d9cfb5;
        box-shadow: 0 24px 60px rgba(43, 39, 27, 0.14);
        text-align: center;
      }
      h1 { margin: 0 0 16px; font-size: clamp(2rem, 6vw, 3.3rem); line-height: 1.05; }
      p { margin: 12px 0; line-height: 1.65; }
      .transaction { margin-top: 20px; font-size: 0.95rem; }
      .support {
        display: inline-block;
        margin-top: 18px;
        padding: 14px 20px;
        background: #006248;
        color: #fff;
        font-weight: 700;
        text-decoration: none;
      }
      .return { display: block; margin-top: 22px; color: #006248; font-weight: 700; }
    </style>
  </head>
  <body>
    <main>
      <p><strong>UNIVERSO HERÓIS FANTÁSTICOS</strong></p>
      <h1>Não foi possível preparar o arquivo.</h1>
      <p>Seu pagamento foi confirmado, mas ocorreu um problema ao gerar o download.</p>
      <p>Envie um e-mail para <strong>${SUPPORT_EMAIL}</strong> informando o número da transação para receber seu e-book.</p>
      <p class="transaction">Número da transação: <strong>${safePaymentId}</strong></p>
      <a class="support" href="${supportHref}">Enviar e-mail para o suporte</a>
      <a class="return" href="/pagamento/sucesso?payment_id=${safePaymentId}">Voltar à página de confirmação</a>
    </main>
  </body>
</html>`,
    {
      status: 503,
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "text/html; charset=utf-8",
      },
    },
  );
}
