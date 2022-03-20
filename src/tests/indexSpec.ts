import supertest from 'supertest';
import app from '../index';

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
});
