import "dotenv/config";
import ImageKit, { toFile } from "@imagekit/nodejs";

const privateKey = process.env.IMAGEKIT_PRIVATE_KEY?.trim();

if (!privateKey) {
  throw new Error("IMAGEKIT_PRIVATE_KEY is missing in .env");
}

const imagekit = new ImageKit({
  privateKey,
});

export default async function uploadFile(
  fileBuffer,
  originalName = "track.mp3",
  mimeType = "audio/mpeg",
) {
  if (!Buffer.isBuffer(fileBuffer)) {
    throw new Error("Invalid audio buffer received");
  }

  const safeName = originalName.replace(
    /[^a-zA-Z0-9._-]/g,
    "_",
  );

  const audioFile = await toFile(
    fileBuffer,
    safeName,
    {
      type: mimeType,
    },
  );

  const result = await imagekit.files.upload({
    file: audioFile,
    fileName: `music_${Date.now()}_${safeName}`,
    folder: "/music",
    useUniqueFileName: true,
  });

  if (!result?.url) {
    throw new Error("ImageKit did not return an audio URL");
  }

  return result;
}