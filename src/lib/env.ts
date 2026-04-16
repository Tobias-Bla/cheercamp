const ADMIN_CREDENTIAL_ENV_KEYS = [
  ['ADMIN_USERNAME', 'ADMIN_PASSWORD'],
  ['ADMIN_USERNAME_2', 'ADMIN_PASSWORD_2'],
  ['ADMIN_USERNAME_3', 'ADMIN_PASSWORD_3'],
] as const;

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

export type AdminCredential = {
  username: string;
  password: string;
};

export function getAdminCredentials(): AdminCredential[] {
  return ADMIN_CREDENTIAL_ENV_KEYS.flatMap(([usernameKey, passwordKey]) => {
    const username = process.env[usernameKey];
    const password = process.env[passwordKey];

    if (!username || !password) {
      return [];
    }

    return [{ username, password }];
  });
}

export function getOptionalAdminEnvState(): { enabled: boolean } {
  const enabled = getAdminCredentials().length > 0;

  return { enabled };
}
