export default function PagamentoIndisponivel() {
  return (
    <main className="payment-page">
      <div className="payment-card">
        <img
          src="/images/uhf-logo-cutout.png"
          alt=""
          width="88"
          height="88"
        />
        <p className="section-kicker">PAGAMENTO INDISPONÍVEL</p>
        <h1>Não foi possível abrir o checkout.</h1>
        <p>
          Tente novamente em alguns instantes. Se o problema continuar, entre
          em contato com a Editora Fantásticos.
        </p>
        <a className="button button-secondary payment-refresh" href="/#livro">
          Voltar às opções
        </a>
      </div>
    </main>
  );
}
