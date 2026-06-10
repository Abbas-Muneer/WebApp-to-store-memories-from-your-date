const PENDING_KEY = 'amnaBirthdayExperiencePending';
const completedKey = (email) =>
  `amnaBirthdayExperienceCompleted:${email.toLowerCase()}`;

export function setBirthdayExperiencePending(email) {
  localStorage.setItem(
    PENDING_KEY,
    JSON.stringify({ email: email.toLowerCase(), createdAt: Date.now() })
  );
}

export function getBirthdayExperiencePending() {
  try {
    return JSON.parse(localStorage.getItem(PENDING_KEY));
  } catch {
    return null;
  }
}

export function clearBirthdayExperiencePending() {
  localStorage.removeItem(PENDING_KEY);
}

export function setBirthdayExperienceCompleted(email) {
  localStorage.setItem(completedKey(email), '1');
}

export function isBirthdayExperienceCompleted(email) {
  return localStorage.getItem(completedKey(email.toLowerCase())) === '1';
}

export function clearBirthdayExperienceCompleted(email) {
  localStorage.removeItem(completedKey(email.toLowerCase()));
}

export function shouldShowBirthdayExperience(user) {
  if (!user?.email) return false;
  const pending = getBirthdayExperiencePending();
  if (!pending) return false;
  if (pending.email !== user.email.toLowerCase()) return false;
  if (isBirthdayExperienceCompleted(user.email)) return false;
  return true;
}
