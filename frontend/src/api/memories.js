import api from './client';

export async function fetchRecent(limit = 3) {
  const { data } = await api.get(`/memories/recent?limit=${limit}`);
  return data;
}

export async function fetchMemories(params) {
  const query = new URLSearchParams(params).toString();
  const { data } = await api.get(`/memories?${query}`);
  return data;
}

export async function createMemory(payload) {
  const { data } = await api.post('/memories', payload);
  return data;
}

export async function updateMemory(id, payload) {
  const { data } = await api.put(`/memories/${id}`, payload);
  return data;
}

export async function deleteMemory(id) {
  await api.delete(`/memories/${id}`);
}

export async function uploadImages(id, files) {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));
  const { data } = await api.post(`/memories/${id}/images`, formData);
  return data;
}

export async function deleteImage(imageId) {
  await api.delete(`/images/${imageId}`);
}
