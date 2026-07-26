"use client";

import { FormEvent, useEffect, useState } from "react";

type Status = "checking" | "ready" | "saving" | "done" | "configured";

export default function MercadoPagoSetup() {
  const [status, setStatus] = useState<Status>("checking");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/configurar-mercado-pago", { cache: "no-store" })
      .then(async (response) => {
        const data = (await response.json()) as { configured?: boolean };
        setStatus(data.configured ? "configured" : "ready");
      })
      .catch(() => {
        setStatus("ready");
        setMessage("Não foi possível confirmar o estado atual.");
      });
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const accessToken = String(formData.get("accessToken") ?? "");

    try {
      const response = await fetch("/api/configurar-mercado-pago", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken }),
      });
      const data = (await response.json()) as {
        configured?: boolean;
        error?: string;
      };

      if (!response.ok || !data.configured) {
        throw new Error(data.error ?? "Não foi possível salvar a credencial.");
      }

      form.reset();
      setStatus("done");
      setMessage(
        "Integração concluída. O checkout digital já pode ser validado.",
      );
    } catch (error) {
      setStatus("ready");
      setMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar a credencial.",
      );
    }
  }

  if (status === "checking") {
    return <p className="setup-status">Verificando a configuração…</p>;
  }

  if (status === "configured" || status === "done") {
    return (
      <div className="setup-success" role="status">
        <strong>Mercado Pago conectado</strong>
        <span>
          {message ||
            "A credencial de produção já foi armazenada com segurança."}
        </span>
      </div>
    );
  }

  return (
    <form className="setup-form" onSubmit={submit}>
      <label htmlFor="accessToken">Access Token de produção</label>
      <input
        id="accessToken"
        name="accessToken"
        type="password"
        autoComplete="off"
        spellCheck={false}
        required
        disabled={status === "saving"}
        placeholder="APP_USR-••••••••••••••••"
      />
      <button className="button button-primary" disabled={status === "saving"}>
        {status === "saving" ? "Validando…" : "Conectar com segurança"}
      </button>
      {message ? (
        <p className="setup-error" role="alert">
          {message}
        </p>
      ) : null}
    </form>
  );
}
