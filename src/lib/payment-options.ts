export const MANUAL_PAYPAL_ACCOUNT = 'Viola-blaschke@gmx.de';

export function formatEuroAmount(amountCents: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amountCents / 100);
}
