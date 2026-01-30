import api from './client';

export async function fetchProfile() {
  const { data } = await api.get('/profile');
  return data;
}

export async function deleteAccount() {
  await api.delete('/profile');
}
