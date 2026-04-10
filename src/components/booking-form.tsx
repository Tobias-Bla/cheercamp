'use client';

import { useState, type FormEvent } from 'react';
import type { Camp } from '@/data/camps';

type SubmitState = {
  error: string | null;
  loading: boolean;
};

function getBooleanValue(formData: FormData, key: string): boolean {
  return formData.get(key) === 'on';
}

export function BookingForm({ camp }: { camp: Camp }) {
  const [submitState, setSubmitState] = useState<SubmitState>({
    error: null,
    loading: false,
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setSubmitState({ error: null, loading: true });

    const formData = new FormData(event.currentTarget);
    const payload = {
      campSlug: camp.slug,
      participantFirstName: String(formData.get('participantFirstName') ?? ''),
      participantLastName: String(formData.get('participantLastName') ?? ''),
      participantBirthDate: String(formData.get('participantBirthDate') ?? ''),
      guardianName: String(formData.get('guardianName') ?? ''),
      guardianEmail: String(formData.get('guardianEmail') ?? ''),
      guardianPhone: String(formData.get('guardianPhone') ?? ''),
      emergencyContactName: String(formData.get('emergencyContactName') ?? ''),
      emergencyContactPhone: String(formData.get('emergencyContactPhone') ?? ''),
      experienceLevel: String(formData.get('experienceLevel') ?? ''),
      stuntFormat: String(formData.get('stuntFormat') ?? ''),
      teamName: String(formData.get('teamName') ?? ''),
      stuntPartnerOrGroup: String(formData.get('stuntPartnerOrGroup') ?? ''),
      saturdayWish: String(formData.get('saturdayWish') ?? ''),
      privateInterest: String(formData.get('privateInterest') ?? 'NONE'),
      tshirtSize: String(formData.get('tshirtSize') ?? ''),
      allergies: String(formData.get('allergies') ?? ''),
      notes: String(formData.get('notes') ?? ''),
      photoConsent: getBooleanValue(formData, 'photoConsent'),
      acceptedTerms: getBooleanValue(formData, 'acceptedTerms'),
    };

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as { error?: string; url?: string };

      if (!response.ok || !result.url) {
        setSubmitState({
          error: result.error ?? 'Die Buchung konnte gerade nicht gestartet werden.',
          loading: false,
        });
        return;
      }

      window.location.href = result.url;
    } catch {
      setSubmitState({
        error: 'Beim Start der Zahlung ist ein technischer Fehler aufgetreten.',
        loading: false,
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="participantFirstName" className="mb-2 block text-sm font-medium text-slate-200">
            Vorname Teilnehmer*in
          </label>
          <input id="participantFirstName" name="participantFirstName" required className="field" />
        </div>
        <div>
          <label htmlFor="participantLastName" className="mb-2 block text-sm font-medium text-slate-200">
            Nachname Teilnehmer*in
          </label>
          <input id="participantLastName" name="participantLastName" required className="field" />
        </div>
        <div>
          <label htmlFor="participantBirthDate" className="mb-2 block text-sm font-medium text-slate-200">
            Geburtsdatum
          </label>
          <input id="participantBirthDate" name="participantBirthDate" type="date" required className="field" />
        </div>
        <div>
          <label htmlFor="experienceLevel" className="mb-2 block text-sm font-medium text-slate-200">
            Leistungsstand
          </label>
          <select id="experienceLevel" name="experienceLevel" required className="field" defaultValue="INTERMEDIATE">
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="stuntFormat" className="mb-2 block text-sm font-medium text-slate-200">
            Format
          </label>
          <select id="stuntFormat" name="stuntFormat" required className="field" defaultValue="PARTNER_STUNT">
            <option value="PARTNER_STUNT">Partnerstunt</option>
            <option value="GROUP_STUNT">Groupstunt</option>
          </select>
        </div>
        <div>
          <label htmlFor="teamName" className="mb-2 block text-sm font-medium text-slate-200">
            Teamname (optional)
          </label>
          <input id="teamName" name="teamName" className="field" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="stuntPartnerOrGroup" className="mb-2 block text-sm font-medium text-slate-200">
            Partner*in oder Group-Mitglieder
          </label>
          <input
            id="stuntPartnerOrGroup"
            name="stuntPartnerOrGroup"
            className="field"
            placeholder="z. B. Lisa Müller / Group: Anna, Bea, Chris"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="guardianName" className="mb-2 block text-sm font-medium text-slate-200">
            Name Kontaktperson
          </label>
          <input id="guardianName" name="guardianName" required className="field" />
        </div>
        <div>
          <label htmlFor="guardianEmail" className="mb-2 block text-sm font-medium text-slate-200">
            E-Mail
          </label>
          <input id="guardianEmail" name="guardianEmail" type="email" required className="field" />
        </div>
        <div>
          <label htmlFor="guardianPhone" className="mb-2 block text-sm font-medium text-slate-200">
            Telefonnummer
          </label>
          <input id="guardianPhone" name="guardianPhone" required className="field" />
        </div>
        <div>
          <label htmlFor="tshirtSize" className="mb-2 block text-sm font-medium text-slate-200">
            T-Shirt-Größe
          </label>
          <select id="tshirtSize" name="tshirtSize" required className="field" defaultValue="M">
            <option value="YXS">YXS</option>
            <option value="YS">YS</option>
            <option value="YM">YM</option>
            <option value="YL">YL</option>
            <option value="XS">XS</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
          </select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="emergencyContactName" className="mb-2 block text-sm font-medium text-slate-200">
            Notfallkontakt Name
          </label>
          <input id="emergencyContactName" name="emergencyContactName" required className="field" />
        </div>
        <div>
          <label htmlFor="emergencyContactPhone" className="mb-2 block text-sm font-medium text-slate-200">
            Notfallkontakt Telefon
          </label>
          <input id="emergencyContactPhone" name="emergencyContactPhone" required className="field" />
        </div>
      </div>

      <div className="grid gap-5">
        <div>
          <label htmlFor="saturdayWish" className="mb-2 block text-sm font-medium text-slate-200">
            Wünsche fürs Samstag-Camp
          </label>
          <textarea
            id="saturdayWish"
            name="saturdayWish"
            rows={4}
            className="field min-h-32"
            placeholder="Welche Stunts oder Themen sollen im General Camp idealerweise behandelt werden?"
          />
        </div>
        <div>
          <label htmlFor="privateInterest" className="mb-2 block text-sm font-medium text-slate-200">
            Interesse an einem Private am Sonntag
          </label>
          <select id="privateInterest" name="privateInterest" className="field" defaultValue="NONE">
            {camp.privateOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs leading-6 text-slate-400">{camp.privatePaymentNote}</p>
        </div>
        <div>
          <label htmlFor="allergies" className="mb-2 block text-sm font-medium text-slate-200">
            Allergien / Unverträglichkeiten
          </label>
          <textarea id="allergies" name="allergies" rows={3} className="field min-h-28" />
        </div>
        <div>
          <label htmlFor="notes" className="mb-2 block text-sm font-medium text-slate-200">
            Sonstige Hinweise
          </label>
          <textarea id="notes" name="notes" rows={4} className="field min-h-32" />
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-sm text-slate-300">
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-xs leading-6 text-slate-300">
          Online bezahlt wird nur das General Camp. Privates am Sonntag werden separat organisiert und bar direkt an den Coach gezahlt.
        </div>
        <label className="flex items-start gap-3">
          <input name="photoConsent" type="checkbox" className="mt-1 h-4 w-4 rounded border-white/20 bg-slate-900" />
          <span>
            Ich stimme zu, dass Bilder/Videos aus dem Camp-Kontext für Website und Social Media genutzt werden dürfen.
          </span>
        </label>
        <label className="flex items-start gap-3">
          <input name="acceptedTerms" type="checkbox" required className="mt-1 h-4 w-4 rounded border-white/20 bg-slate-900" />
          <span>
            Ich habe Datenschutz und Buchungsbedingungen gelesen und stimme der kostenpflichtigen Anmeldung für das General Camp zu.
          </span>
        </label>
      </div>

      {submitState.error ? (
        <div className="rounded-2xl border border-rose-400/40 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
          {submitState.error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={submitState.loading}
        className="inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitState.loading ? 'Weiterleitung zu Stripe…' : 'General Camp kostenpflichtig buchen'}
      </button>
    </form>
  );
}
