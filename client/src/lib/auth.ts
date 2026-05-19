export type AuthUser = {
  name: string;
  email: string;
};

type StoredUser = AuthUser & {
  password: string;
};

const USERS_KEY = "lumiere_users";
const CURRENT_USER_KEY = "lumiere_current_user";
const AUTH_EVENT = "lumiere-auth-change";

function readUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function notifyAuthChange() {
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function getCurrentUser(): AuthUser | null {
  if (typeof window === "undefined") return null;

  try {
    return JSON.parse(localStorage.getItem(CURRENT_USER_KEY) ?? "null");
  } catch {
    return null;
  }
}

export function registerUser(name: string, email: string, password: string): AuthUser {
  const normalizedEmail = email.trim().toLowerCase();
  const users = readUsers();

  if (users.some((user) => user.email === normalizedEmail)) {
    throw new Error("An account already exists for this email.");
  }

  const user = { name: name.trim(), email: normalizedEmail, password };
  users.push(user);
  writeUsers(users);
  loginUser(normalizedEmail, password);

  return { name: user.name, email: user.email };
}

export function loginUser(email: string, password: string): AuthUser {
  const normalizedEmail = email.trim().toLowerCase();
  const user = readUsers().find((item) => item.email === normalizedEmail && item.password === password);

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const currentUser = { name: user.name, email: user.email };
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
  notifyAuthChange();
  return currentUser;
}

export function logoutUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
  notifyAuthChange();
}

export function getAuthEventName() {
  return AUTH_EVENT;
}

export function requireAuth() {
  return getCurrentUser();
}
