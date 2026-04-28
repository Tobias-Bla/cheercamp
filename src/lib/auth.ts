import 'server-only';

import { randomBytes, scrypt as scryptCallback, timingSafeEqual, createHash } from 'node:crypto';
import { promisify } from 'node:util';
import { cookies } from 'next/headers';
import { getPrismaClient } from '@/lib/prisma';

const scrypt = promisify(scryptCallback);
const sessionCookieName = 'cheercamp_session';
const sessionDurationDays = 30;
const sessionDurationMs = sessionDurationDays * 24 * 60 * 60 * 1000;

export type AccountProfile = {
  email: string;
  name: string;
  participantFirstName: string;
  participantLastName: string;
  participantBirthDate: string;
  contactPhone: string;
  participantMobile: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  teamName: string;
  stuntPartnerOrGroup: string;
  allergies: string;
  notes: string;
};

export type CurrentUser = {
  id: string;
  profile: AccountProfile;
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function hashSessionToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

function dateToInputValue(date: Date | null): string {
  return date ? date.toISOString().slice(0, 10) : '';
}

function userToCurrentUser(user: {
  id: string;
  email: string;
  name: string | null;
  participantFirstName: string | null;
  participantLastName: string | null;
  participantBirthDate: Date | null;
  contactPhone: string | null;
  participantMobile: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  teamName: string | null;
  stuntPartnerOrGroup: string | null;
  allergies: string | null;
  notes: string | null;
}): CurrentUser {
  return {
    id: user.id,
    profile: {
      email: user.email,
      name: user.name ?? '',
      participantFirstName: user.participantFirstName ?? '',
      participantLastName: user.participantLastName ?? '',
      participantBirthDate: dateToInputValue(user.participantBirthDate),
      contactPhone: user.contactPhone ?? '',
      participantMobile: user.participantMobile ?? '',
      emergencyContactName: user.emergencyContactName ?? '',
      emergencyContactPhone: user.emergencyContactPhone ?? '',
      teamName: user.teamName ?? '',
      stuntPartnerOrGroup: user.stuntPartnerOrGroup ?? '',
      allergies: user.allergies ?? '',
      notes: user.notes ?? '',
    },
  };
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;

  return `${salt}:${derivedKey.toString('hex')}`;
}

export async function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  const [salt, storedHash] = passwordHash.split(':');

  if (!salt || !storedHash) {
    return false;
  }

  const storedBuffer = Buffer.from(storedHash, 'hex');
  const derivedKey = (await scrypt(password, salt, storedBuffer.length)) as Buffer;

  return storedBuffer.length === derivedKey.length && timingSafeEqual(storedBuffer, derivedKey);
}

export async function createUserSession(userId: string): Promise<void> {
  const token = randomBytes(32).toString('base64url');
  const tokenHash = hashSessionToken(token);
  const expiresAt = new Date(Date.now() + sessionDurationMs);
  const prisma = getPrismaClient();

  await prisma.userSession.create({
    data: {
      tokenHash,
      userId,
      expiresAt,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(sessionCookieName, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: sessionDurationDays * 24 * 60 * 60,
  });
}

export async function clearUserSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName)?.value;

  if (token) {
    const prisma = getPrismaClient();
    await prisma.userSession.deleteMany({
      where: {
        tokenHash: hashSessionToken(token),
      },
    });
  }

  cookieStore.delete(sessionCookieName);
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName)?.value;

  if (!token) {
    return null;
  }

  const prisma = getPrismaClient();
  const session = await prisma.userSession.findUnique({
    where: {
      tokenHash: hashSessionToken(token),
    },
    include: {
      user: true,
    },
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt < new Date()) {
    await prisma.userSession.delete({
      where: {
        id: session.id,
      },
    });
    cookieStore.delete(sessionCookieName);
    return null;
  }

  return userToCurrentUser(session.user);
}

export async function getUserByEmail(email: string): Promise<{ id: string; email: string; passwordHash: string } | null> {
  const prisma = getPrismaClient();

  return prisma.user.findUnique({
    where: {
      email: normalizeEmail(email),
    },
    select: {
      id: true,
      email: true,
      passwordHash: true,
    },
  });
}

export { normalizeEmail };
