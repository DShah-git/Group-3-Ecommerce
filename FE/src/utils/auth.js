export function isAuthenticated() {
  const token = localStorage.getItem("token");
  if (!token) return false;
  return true;
}

export function getUserNameFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    // JWT tokens are usually in the format header.payload.signature
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userName || payload.name || payload.username || null;
  } catch (e) {
    return null;
  }
}


export function setToken(token) {
  localStorage.setItem('token', token);
}


export function logout() {
  localStorage.removeItem("token");
  window.location.reload(); 
}

export function login(token) {
  localStorage.setItem("token", token);
  window.location.reload(); 
}

export function getToken() {
  return localStorage.getItem("token");
}