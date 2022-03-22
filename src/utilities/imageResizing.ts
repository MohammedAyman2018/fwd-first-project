import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export default function (
  fileName: string,
  width: number,
  height: number
): void {
  fs.readFile(
    path.join(__dirname, '..', '..', 'thump', `${fileName}.png`),
    async (err: Error | null, data: Buffer) => {
      if (err) throw err;
      const metadata = await sharp(data).metadata();
      if (metadata.width === width && metadata.height === height) return;
      sharp(data)
        .resize(width, height)
        .toFile(
          path.join(__dirname, '..', '..', 'thump', `${fileName}.png`),
          (err) => {
            if (err) throw err;
          }
        );
    }
  );
}
