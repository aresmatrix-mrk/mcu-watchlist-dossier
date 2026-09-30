import fs from 'fs';
import path from 'path';

const DATA_FILE_PATH = path.resolve('src/data/mcuData.js');

// Known latest release feeds for MCU chronology
const FEED_URL = 'https://raw.githubusercontent.com/ThatGuySam/marvelorder/master/src/data/timeline.json';

async function fetchLatestTimeline() {
  try {
    const response = await fetch(FEED_URL);
    if (!response.ok) {
      console.log('Unable to reach remote feed, skipping update.');
      return [];
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.warn('Fetch failed:', err.message);
    return [];
  }
}

async function run() {
  if (!fs.existsSync(DATA_FILE_PATH)) {
    console.error('Data file not found at:', DATA_FILE_PATH);
    process.exit(1);
  }

  // Load existing data
  const rawFile = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
  const jsonMatch = rawFile.match(/export const initialMcuData =\s*(\[[\s\S]*\]);/);
  if (!jsonMatch) {
    console.error('Could not parse initialMcuData format.');
    process.exit(1);
  }

  let localData = eval(jsonMatch[1]);
  const existingTitles = new Set(localData.map(m => m.title.toLowerCase().trim()));

  const remoteEntries = await fetchLatestTimeline();
  let addedCount = 0;

  for (const item of remoteEntries) {
    const itemTitle = (item.title || item.name || '').trim();
    if (!itemTitle) continue;

    if (!existingTitles.has(itemTitle.toLowerCase())) {
      const nextIndex = localData.length + 1;
      localData.push({
        id: Date.now() + nextIndex,
        watchlistIndex: nextIndex,
        title: itemTitle,
        releaseYear: item.release_year || item.year || new Date().getFullYear(),
        phase: item.phase ? `Phase ${item.phase}` : 'Phase 6',
        hasDossier: false,
        watched: false
      });
      existingTitles.add(itemTitle.toLowerCase());
      addedCount++;
    }
  }

  if (addedCount > 0) {
    console.log(`Added ${addedCount} new MCU entries.`);
    const updatedContent = `export const initialMcuData = ${JSON.stringify(localData, null, 2)};\n`;
    fs.writeFileSync(DATA_FILE_PATH, updatedContent, 'utf-8');
  } else {
    console.log('MCU timeline is already up to date.');
  }
}

run();
