export default function PagamentoPendente() {
  return (
    <main className="payment-page">
      <div className="payment-card">
        <img
          src="/images/uhf-logo-cutout.png"
          alt=""
          width="88"
          height="88"
        />
        <p className="section-kicker">PAGAMENTO PENDENTE</p>
        <h1>Seu caminho está reservado.</h1>
        <p>
          Assim que o Mercado Pago confirmar a transação, retorne pelo
          comprovante ou pelo botão disponibilizado no checkout para liberar o
          e-book.
        </p>
        <a className="button button-secondary payment-refresh" href="/">
          Voltar ao site
        </a>
      </div>
    </main>
  );
}
