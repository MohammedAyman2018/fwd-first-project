import express, { Response, Request } from 'express';
import fs from 'fs';
import path from 'path';
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
    if (isNaN(Number(width)))
      return res.status(400).json('please provide valid width query');
    if (!height) return res.status(400).json('please provide height query');
    if (isNaN(Number(height)))
      return res.status(400).json('please provide valid height query');

    // Get the required image.
    const imagesPath = path.join(__dirname, '..', 'images');
    const exactImagePath = path.join(imagesPath, fileName as string);
    try {
      fs.readFile(exactImagePath, (err: Error | null) => {
        if (err) return res.status(500).json("Can't find this image.");
        createThump(String(fileName), Number(width), Number(height));
        return res.sendFile(
          path.join(__dirname, '..', 'thump', `${fileName}.png`)
        );
      });
    } catch (error) {
      return res.status(500).json(`Something wrong happened ${error}`);
    }
  }
);

app.listen(port, () => {
  console.info(`Server is listening on port ${port}`);
});

export default app;
