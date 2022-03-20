import express, { Response, Request } from 'express';
import fs from 'fs';
import path from 'path';
import createThump from './utilities/imageResizing';
const app = express();
const port = 3000;

app.get('/api/images', async (req: Request, res: Response) => {
  const { fileName, width, height } = req.query;
  // Validate all queries are provided.
  if (!fileName) return res.status(400).send('please provide fileName query');
  if (!width) return res.status(400).send('please provide width query');
  if (isNaN(Number(width)))
    return res.status(400).send('please provide valid width query');
  if (!height) return res.status(400).send('please provide height query');
  if (isNaN(Number(height)))
    return res.status(400).send('please provide valid height query');

  // Get the required image.
  const imagesPath = path.join(__dirname, '..', 'images');
  const exactImagePath = path.join(imagesPath, fileName as string);
  fs.readFile(exactImagePath, (err: Error | null, data: Buffer) => {
    if (err) return res.status(500).json(err);
    createThump(data, String(fileName), Number(width), Number(height));
    return res.sendFile(path.join(__dirname, '..', 'thump', `${fileName}.png`));
  });
});

app.listen(port, () => {
  console.info(`Server is listening on port ${port}`);
});
