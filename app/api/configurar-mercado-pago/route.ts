import {
  configureMercadoPago,
  mercadoPagoIsConfigured,
} from "@/lib/mercado-pago";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(
    { configured: await mercadoPagoIsConfigured() },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  if (await mercadoPagoIsConfigured()) {
    return Response.json(
      { error: "O Mercado Pago já está configurado." },
      { status: 409, headers: { "Cache-Control": "no-store" } },
    );
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return Response.json({ error: "Solicitação inválida." }, { status: 415 });
  }

  const body = (await request.json().catch(() => null)) as {
    accessToken?: unknown;
  } | null;

  if (typeof body?.accessToken !== "string") {
    return Response.json(
      { error: "Informe o Access Token de produção." },
      { status: 400 },
    );
  }

  try {
    await configureMercadoPago(body.accessToken);
    return Response.json(
      { configured: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Não foi possível validar a credencial.";
    return Response.json(
      { error: message },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }
}
