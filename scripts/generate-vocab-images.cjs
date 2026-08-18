const fs = require('fs');
const path = require('path');

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('ERROR: GEMINI_API_KEY environment variable is required.');
  process.exit(1);
}

const batchSize = parseInt(process.env.BATCH_SIZE || '8', 10);
const vocabDir = path.join(__dirname, '../public/images/vocab');
const vocabJsonPath = path.join(__dirname, '../vocabulary.json');

if (!fs.existsSync(vocabDir)) {
  fs.mkdirSync(vocabDir, { recursive: true });
}

const vocabulary = JSON.parse(fs.readFileSync(vocabJsonPath, 'utf-8'));
const existingFiles = new Set(fs.readdirSync(vocabDir).map(f => f.replace(/\.[^.]+$/, '')));

const missingItems = vocabulary.filter(item => !existingFiles.has(item.id));
console.log(`Total vocabulary: ${vocabulary.length}`);
console.log(`Already generated: ${existingFiles.size}`);
console.log(`Missing illustrations: ${missingItems.length}`);

if (missingItems.length === 0) {
  console.log('🎉 All vocabulary illustrations are already generated!');
  process.exit(0);
}

const itemsToProcess = missingItems.slice(0, batchSize);
console.log(`Processing batch of ${itemsToProcess.length} items...`);

const styleSuffix = 'Clean bold outlines, warm minimalist color palette, Kyoto lacquer red accents, warm cream and ink black, solid clean neutral off-white background. No text, no words, no letters.';

// Custom contextual prompt mapping for Japanese vocab items
function buildPrompt(item) {
  return `Minimalist 2D vector flat Japanese style illustration of: ${item.english} (${item.italian}). ${styleSuffix}`;
}

async function generateImage(prompt) {
  const models = [
    'imagen-3.0-generate-002',
    'imagen-3.0-fast-generate-001'
  ];

  let lastError = null;

  for (const model of models) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:predict?key=${apiKey}`;
    const payload = {
      instances: [{ prompt }],
      parameters: {
        sampleCount: 1,
        aspectRatio: '1:1',
        outputMimeType: 'image/jpeg'
      }
    };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.warn(`Model ${model} returned ${res.status}: ${errorText.slice(0, 200)}`);
        lastError = new Error(`HTTP ${res.status}: ${errorText}`);
        continue;
      }

      const data = await res.json();
      const base64Data = data?.predictions?.[0]?.bytesBase64Encoded;
      if (base64Data) {
        return Buffer.from(base64Data, 'base64');
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('Failed to generate image from available models');
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  let successCount = 0;

  for (const item of itemsToProcess) {
    const prompt = buildPrompt(item);
    console.log(`\nGenerating [${item.id}] ${item.kana} (${item.romaji} - ${item.italian})...`);
    
    try {
      const imgBuffer = await generateImage(prompt);
      const targetFile = path.join(vocabDir, `${item.id}.jpg`);
      fs.writeFileSync(targetFile, imgBuffer);
      console.log(`✅ Saved ${item.id}.jpg (${imgBuffer.length} bytes)`);
      successCount++;

      // Polite delay between API calls to stay within rate limits
      await delay(4000);
    } catch (err) {
      console.error(`❌ Error generating ${item.id}:`, err.message);
      if (err.message.includes('429') || err.message.includes('QUOTA')) {
        console.warn('⚠️ Quota reached for current window. Ending current batch gracefully.');
        break;
      }
    }
  }

  console.log(`\nBatch finished: ${successCount}/${itemsToProcess.length} images generated successfully.`);
}

run().catch(err => {
  console.error('Fatal error during execution:', err);
  process.exit(1);
});
