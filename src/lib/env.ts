const OPTIONAL_ENVIRONMENTS = ['ADMIN_USERNAME', 'ADMIN_PASSWORD'] as const;

export function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export function getMissingRequiredEnvs(): string[] {
  const required = ['DATABASE_URL', 'DIRECT_URL', 'STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'];

  return required.filter((key) => !process.env[key]);
}

export function getOptionalAdminEnvState(): { enabled: boolean } {
  const enabled = OPTIONAL_ENVIRONMENTS.every((key) => Boolean(process.env[key]));

  return { enabled };
}
