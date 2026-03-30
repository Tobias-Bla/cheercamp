import { NextResponse } from 'next/server';
import { getMissingRequiredEnvs, getOptionalAdminEnvState } from '@/lib/env';

export async function GET(): Promise<Response> {
  const missing = getMissingRequiredEnvs();
  const admin = getOptionalAdminEnvState();

  return NextResponse.json({
    ok: missing.length === 0,
    missing,
    adminProtectionEnabled: admin.enabled,
  });
}
