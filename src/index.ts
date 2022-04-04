import express, { Response, Request } from 'express';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import createThump from './utilities/imageResizing';
const app = express();
const port = 3000;

app.get(
  '/api/images',
  async (
    req: Request,
    res: Response
  ): Promise<express.Response<string, Record<string, string>> | undefined> => {
    const { fileName, width, height } = req.query;
    // Validate all queries are provided.
    if (!fileName) return res.status(400).json('please provide fileName query');
    if (!width) return res.status(400).json('please provide width query');
    if (isNaN(Number(width)) || Number(width) <= 0)
      return res.status(400).json('please provide valid width query');
    if (!height) return res.status(400).json('please provide height query');
    if (isNaN(Number(height)) || Number(height) <= 0)
      return res.status(400).json('please provide valid height query');

    // Get the required image.
    const imagesPath = path.join(__dirname, '..', 'images');
    const exactImagePath = path.join(imagesPath, `${fileName}.jpg`);
    try {
      await fs.readFile(
        exactImagePath,
        async (err: Error | null, theData: Buffer) => {
          if (err) return res.status(500).json("Can't find this image.");
          await fs.readFile(
            path.join(__dirname, '..', 'thump', `${fileName}.jpg`),
            async (err: Error | null, data: Buffer) => {
              if (data) {
                // This means there is thump with that name already.
                const metadata = await sharp(data).metadata();
                if (
                  metadata.width === Number(width) &&
                  metadata.height === Number(height)
                )
                  console.log('cached before');

                return res.sendFile(
                  path.join(__dirname, '..', 'thump', `${fileName}.jpg`)
                );
              } else {
                console.log('creating now');

                await createThump(
                  theData,
                  `${fileName}`,
                  Number(width),
                  Number(height)
                );
                process.nextTick(() => {
                  return res.sendFile(
                    path.join(__dirname, '..', 'thump', `${fileName}.jpg`)
                  );
                });
              }
            }
          );
        }
      );
    } catch (error) {
      return res.status(500).json(`Something wrong happened ${error}`);
    }
  }
);

app.listen(port, () => {
  console.info(`Server is listening on port ${port}`);
});

export default app;
