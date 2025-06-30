export function adminIsAuthenticated() {
  const token = localStorage.getItem("admin_token");
  if (!token) return false;
  return true;
}

export function adminSetToken(token) {
  localStorage.setItem('admin_token', token);
}

export function adminGetUserNameFromToken() {
  const token = localStorage.getItem("admin_token");
  if (!token) return null;
  try {
    // JWT tokens are usually in the format header.payload.signature
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userName || payload.name || payload.username || null;
  } catch (e) {
    return null;
  }
}



export function adminLogout() {
  localStorage.removeItem("admin_token");
  window.location.href = "/" 
}


export function adminLogin(token) {
  localStorage.setItem("admin_token", token);
  window.location.reload()
}

export function adminGetToken() {
  return localStorage.getItem("admin_token");
}