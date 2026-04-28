'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Prisma } from '@/generated/prisma';
import {
  clearUserSession,
  createUserSession,
  getCurrentUser,
  getUserByEmail,
  hashPassword,
  normalizeEmail,
  verifyPassword,
} from '@/lib/auth';
import { getPrismaClient } from '@/lib/prisma';

function text(formData: FormData, name: string): string {
  return String(formData.get(name) ?? '').trim();
}

function optionalDate(value: string): Date | null {
  return value ? new Date(value) : null;
}

export async function registerAction(formData: FormData): Promise<void> {
  const email = normalizeEmail(text(formData, 'email'));
  const password = text(formData, 'password');
  const name = text(formData, 'name');

  if (!email || password.length < 8) {
    redirect('/account/register?error=invalid');
  }

  const prisma = getPrismaClient();

  try {
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: await hashPassword(password),
        name: name || null,
      },
    });

    await createUserSession(user.id);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      redirect('/account/register?error=exists');
    }

    throw error;
  }

  redirect('/account?created=1');
}

export async function loginAction(formData: FormData): Promise<void> {
  const email = normalizeEmail(text(formData, 'email'));
  const password = text(formData, 'password');
  const user = await getUserByEmail(email);

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    redirect('/account/login?error=invalid');
  }

  await createUserSession(user.id);
  redirect('/account');
}

export async function logoutAction(): Promise<void> {
  await clearUserSession();
  redirect('/account/login?loggedOut=1');
}

export async function updateProfileAction(formData: FormData): Promise<void> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect('/account/login');
  }

  const prisma = getPrismaClient();

  await prisma.user.update({
    where: {
      id: currentUser.id,
    },
    data: {
      name: text(formData, 'name') || null,
      participantFirstName: text(formData, 'participantFirstName') || null,
      participantLastName: text(formData, 'participantLastName') || null,
      participantBirthDate: optionalDate(text(formData, 'participantBirthDate')),
      contactPhone: text(formData, 'contactPhone') || null,
      participantMobile: text(formData, 'participantMobile') || null,
      emergencyContactName: text(formData, 'emergencyContactName') || null,
      emergencyContactPhone: text(formData, 'emergencyContactPhone') || null,
      teamName: text(formData, 'teamName') || null,
      stuntPartnerOrGroup: text(formData, 'stuntPartnerOrGroup') || null,
      allergies: text(formData, 'allergies') || null,
      notes: text(formData, 'notes') || null,
    },
  });

  revalidatePath('/account');
  redirect('/account?saved=1');
}
