import api from './client';

export async function createInvite(payload) {
  const { data } = await api.post('/invites', payload);
  return data;
}

export async function inviteStatus() {
  const { data } = await api.get('/invites/status');
  return data;
}

export async function validateInvite(token) {
  const { data } = await api.get(`/invites/validate?token=${token}`);
  return data;
}
