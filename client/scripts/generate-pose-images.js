// Batch script to generate pose-image mapping using Pexels API
const fs = require('fs');
const fetch = require('node-fetch');

const apiKey = '9xrwilpPGa1PF9tKMBqWgbbCS5JmuZhVCfyYfh8ijc38UOrYA503iyZK';
const poseNamesPath = '../server/yoga-pose-names.txt';
const outputPath = './public/pose-images.json';

async function getPexelsImage(poseName) {
  // Try with English name, then with 'asana' appended, then pick a random result if duplicate
  const queries = [
    `${poseName} yoga pose`,
    `${poseName} asana`,
    `${poseName} yoga posture`,
    `yoga ${poseName}`,
  ];
  let lastUrl = '';
  for (const q of queries) {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=10`;
    try {
      const res = await fetch(url, {
        headers: {
          Authorization: apiKey
        }
      });
      const data = await res.json();
      if (data.photos && data.photos.length > 0) {
        // Pick a random image if duplicate
        let chosen = data.photos[0].src.medium;
        if (chosen === lastUrl && data.photos.length > 1) {
          chosen = data.photos[Math.floor(Math.random() * data.photos.length)].src.medium;
        }
        lastUrl = chosen;
        return chosen;
      }
    } catch (e) {
      // continue to next query
    }
  }
  // fallback image
  return 'https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg?auto=compress&w=400&h=300';
}

async function main() {
  const poseNames = fs.readFileSync(poseNamesPath, 'utf-8').split('\n').map(x => x.trim()).filter(Boolean);
  const mapping = {};
  for (const pose of poseNames) {
    console.log('Fetching image for:', pose);
    mapping[pose] = await getPexelsImage(pose);
  }
  fs.writeFileSync(outputPath, JSON.stringify(mapping, null, 2));
  console.log('Pose-image mapping saved to', outputPath);
}

main();
