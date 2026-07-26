export default function PagamentoRecusado() {
  return (
    <main className="payment-page">
      <div className="payment-card">
        <img
          src="/images/uhf-logo-cutout.png"
          alt=""
          width="88"
          height="88"
        />
        <p className="section-kicker">PAGAMENTO NÃO CONCLUÍDO</p>
        <h1>O portal ainda não foi aberto.</h1>
        <p>
          Nenhum arquivo foi liberado. Você pode retornar à página e tentar
          novamente com outro meio de pagamento.
        </p>
        <a className="button button-primary payment-download" href="/#livro">
          Tentar novamente
        </a>
      </div>
    </main>
  );
}
