import { nghiLeSongs, baiHatSongs, dieuVuSongs } from "../data/songs";

function collectByType() {
  const audio = new Set();
  const video = new Set();
  const pdf = new Set();

  [nghiLeSongs, baiHatSongs, dieuVuSongs].forEach(list => {
    list.forEach(item => {
      if (item.file && item.file.match(/\.(mp3|wav|ogg)$/)) {
        audio.add(item.file);
      }
      if (item.video && item.video.match(/\.(mp4|webm)$/)) {
        video.add(item.video);
      }
    });
  });

  return {
    audio: Array.from(audio),
    video: Array.from(video),
    pdf: Array.from(pdf),
  };
}

async function fetchWithSize(url) {
  const res = await fetch(url, { cache: "reload" });
  const size = Number(res.headers.get("content-length")) || 0;
  return size;
}

export async function preloadAllMedia(onProgress) {
  const groups = collectByType();
  const order = [
    { name: "Audio", files: groups.audio },
    { name: "Video", files: groups.video },
    { name: "Tài liệu", files: groups.pdf },
  ];

  let loadedFiles = 0;
  const totalFiles = order.reduce((s, g) => s + g.files.length, 0);
  let loadedMB = 0;

  for (const group of order) {
    for (const url of group.files) {
      try {
        const size = await fetchWithSize(url);
        loadedMB += size / (1024 * 1024);
      // eslint-disable-next-line no-unused-vars
      } catch (e) {
        console.warn("Không tải được:", url);
      }

      loadedFiles++;
      onProgress({
        percent: Math.round((loadedFiles / totalFiles) * 100),
        loadedMB: loadedMB.toFixed(1),
        group: group.name,
      });
    }
  }
}
