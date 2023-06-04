export function apiGetUsername(userId: string) {
  return fetch(`${process.env.REACT_APP_BASE_URL}/users/${userId}`);
}
