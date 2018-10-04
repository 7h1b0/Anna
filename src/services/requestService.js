import * as request from 'got';

export async function get(url) {
  const response = await request.get(url, { json: true });
  return response.body;
}

export async function put(url, body) {
  const response = await request.post(url, { body, json: true });
  return response.body;
}
