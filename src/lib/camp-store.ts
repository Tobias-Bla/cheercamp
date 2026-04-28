import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { Camp } from '@/data/camps';

const campsFilePath = path.join(process.cwd(), 'src', 'data', 'camps.json');

export async function readCampsFromFile(): Promise<Camp[]> {
  const file = await readFile(campsFilePath, 'utf8');
  return JSON.parse(file) as Camp[];
}

export async function writeCampsToFile(camps: Camp[]): Promise<void> {
  await writeFile(campsFilePath, `${JSON.stringify(camps, null, 2)}\n`, 'utf8');
}

export async function updateCampInFile(updatedCamp: Camp): Promise<void> {
  const camps = await readCampsFromFile();
  const campIndex = camps.findIndex((camp) => camp.slug === updatedCamp.slug);

  if (campIndex < 0) {
    throw new Error(`Camp not found: ${updatedCamp.slug}`);
  }

  camps[campIndex] = updatedCamp;
  await writeCampsToFile(camps);
}

export async function deleteCampFromFile(slug: string): Promise<void> {
  const camps = await readCampsFromFile();
  const remainingCamps = camps.filter((camp) => camp.slug !== slug);

  if (remainingCamps.length === camps.length) {
    throw new Error(`Camp not found: ${slug}`);
  }

  await writeCampsToFile(remainingCamps);
}
