import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

/**
 * This Endpoint returns the thumb if it matches user specifications or create new one.
 * @param { Buffer } imageData The Buffer of the image in images folder
 * @param { String } fileName The name of the image user requests
 * @param { Number } width The new width of the image
 * @param { Number } height The new height of the image
 */
export default async function (
  imageData: Buffer,
  fileName: string,
  width: number,
  height: number
): Promise<void> {
  // This means there is no thump with that name OR there is thumb but it's not with same dimensions
  await sharp(imageData)
    .resize(width, height)
    .toFile(path.join(__dirname, '..', '..', 'thump', `${fileName}.jpg`));
}
