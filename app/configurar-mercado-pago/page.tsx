import type { Metadata } from "next";
import MercadoPagoSetup from "./setup";

export const metadata: Metadata = {
  title: "Configurar Mercado Pago",
  robots: { index: false, follow: false },
};

export default function ConfigurarMercadoPagoPage() {
  return (
    <main className="payment-page">
      <section className="payment-card setup-panel">
        <p className="section-kicker">Configuração privada</p>
        <h1>Conectar Mercado Pago</h1>
        <p>
          Cole abaixo somente o <strong>Access Token de produção</strong> da
          aplicação Fantásticos Editora. A credencial será validada e guardada
          de forma criptografada.
        </p>
        <MercadoPagoSetup />
        <p className="setup-security-note">
          Esta configuração não movimenta saldo, não cria cobranças e não
          acessa extratos.
        </p>
      </section>
    </main>
  );
}
