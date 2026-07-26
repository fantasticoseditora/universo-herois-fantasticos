import { createDownloadToken } from "@/lib/ebook-delivery";
import { verifyApprovedEbookPayment } from "@/lib/mercado-pago";

export const dynamic = "force-dynamic";

type SearchParams = Promise<
  Record<string, string | string[] | undefined>
>;

export default async function PagamentoAprovado({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const paymentId = singleValue(params.payment_id ?? params.collection_id);
  const approved = paymentId
    ? await verifyApprovedEbookPayment(paymentId).catch(() => false)
    : false;

  const token =
    approved && paymentId ? await createDownloadToken(paymentId) : null;

  return (
    <main className="payment-page">
      <div className="payment-card">
        <img
          src="/images/uhf-logo-cutout.png"
          alt=""
          width="88"
          height="88"
        />
        <p className="section-kicker">
          {approved ? "PAGAMENTO CONFIRMADO" : "CONFIRMANDO PAGAMENTO"}
        </p>
        <h1>
          {approved
            ? "Seu portal para este universo está aberto."
            : "Seu pagamento ainda está sendo processado."}
        </h1>
        <p>
          {approved
            ? "O e-book Universo Heróis Fantásticos — Vol. I está pronto para ser baixado. O link ficará disponível por 24 horas."
            : "Atualize esta página em alguns instantes. O arquivo será liberado somente depois da confirmação segura do Mercado Pago."}
        </p>
        {token && paymentId ? (
          <a
            className="button button-primary payment-download"
            href={`/api/download?payment_id=${encodeURIComponent(paymentId)}&expires=${token.expires}&signature=${encodeURIComponent(token.signature)}`}
          >
            Baixar o e-book em EPUB <span aria-hidden="true">↓</span>
          </a>
        ) : (
          <a className="button button-secondary payment-refresh" href="">
            Verificar novamente
          </a>
        )}
        <a className="payment-return" href="/">
          Voltar ao Universo Heróis Fantásticos
        </a>
      </div>
    </main>
  );
}

function singleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
