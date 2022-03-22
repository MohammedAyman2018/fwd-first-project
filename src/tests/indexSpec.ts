import supertest from 'supertest';
import app from '../index';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
const request = supertest(app);

describe('Test query validation', () => {
  it('Should give status 400 if no fileName query', async () => {
    const response = await request.get('/api/images?width=300&height=200');
    expect(response.status).toBe(400);
    expect(response.body).toBe('please provide fileName query');
  });
  it('Should give status 400 if no width query', async () => {
    const response = await request.get('/api/images?fileName=fjord&height=200');
    expect(response.status).toBe(400);
    expect(response.body).toBe('please provide width query');
  });
  it('Should give status 400 if no height query', async () => {
    const response = await request.get('/api/images?fileName=fjord&width=200');
    expect(response.status).toBe(400);
    expect(response.body).toBe('please provide height query');
  });
  it('Should give status 400 if width query is not a number ', async () => {
    const response = await request.get(
      '/api/images?fileName=fjord&width=2fd0&height=200'
    );
    expect(response.status).toBe(400);
    expect(response.body).toBe('please provide valid width query');
  });
  it('Should give status 400 if height query is not a number.', async () => {
    const response = await request.get(
      '/api/images?fileName=fjord&width=200&height=2fd0'
    );
    expect(response.status).toBe(400);
    expect(response.body).toBe('please provide valid height query');
  });
});

describe('Test the logic', () => {
  it('Should return 500 status with message image not found', async () => {
    const response = await request.get(
      '/api/images?fileName=anything&width=300&height=200'
    );
    expect(response.status).toBe(500);
    expect(response.body).toBe("Can't find this image.");
  });

  it('Test image processing function in isolation without sending a request to server.', () => {
    fs.readFile(
      path.join(__dirname, '..', '..', 'images', 'fjord.png'),

      async (err: Error | null, data: Buffer) => {
        if (err) throw err;
        sharp(data)
          .resize(300, 600)
          .toFile(
            path.join(__dirname, '..', '..', 'images', `fjord.png`),
            (err, info) => {
              if (err) throw err;
              expect(info.width).toBe(300);
              expect(info.height).toBe(600);
            }
          );
      }
    );
  });

  it('Api Should return a buffer image of 300 width and 600 height', async () => {
    const response = await request.get(
      '/api/images?fileName=fjord.jpg&width=300&height=600'
    );
    expect(response.body).toBeInstanceOf(Buffer);
    expect(response.type).toBe('image/png');
    const metadata = await sharp(response.body).metadata();
    expect(metadata.width).toBe(300);
    expect(metadata.height).toBe(600);
    expect(response.status).toBe(200);
  });
});
