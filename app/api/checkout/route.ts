import { createCheckoutPreference } from "@/lib/mercado-pago";

export async function POST(request: Request) {
  const origin = new URL(request.url).origin;

  try {
    const checkoutUrl = await createCheckoutPreference(origin);
    return Response.redirect(checkoutUrl, 303);
  } catch {
    return Response.redirect(`${origin}/pagamento/indisponivel`, 303);
  }
}
