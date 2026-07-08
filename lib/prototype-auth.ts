export type PrototypeRole = "user" | "rider" | "admin";

export type PrototypeAccount = {
  id: string;
  role: PrototypeRole;
  name: string;
  email: string;
  phone: string;
  password: string;
  createdAt: string;
};

export function accountKey(role: PrototypeRole) {
  return `rr_${role}_accounts`;
}

export function sessionKey(role: PrototypeRole) {
  return `rr_${role}_session`;
}

export function getAccounts(role: PrototypeRole): PrototypeAccount[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(accountKey(role)) || "[]");
}

export function saveAccounts(role: PrototypeRole, accounts: PrototypeAccount[]) {
  localStorage.setItem(accountKey(role), JSON.stringify(accounts));
}

export function createAccount(role: PrototypeRole, name: string, email: string, phone: string, password: string) {
  const accounts = getAccounts(role);
  const existing = accounts.find((account) => account.email.toLowerCase() === email.toLowerCase());
  if (existing) return { account: existing, created: false };
  const account: PrototypeAccount = {
    id: `${role}-${Date.now()}`,
    role,
    name,
    email,
    phone,
    password,
    createdAt: new Date().toISOString()
  };
  saveAccounts(role, [account, ...accounts]);
  return { account, created: true };
}

export function loginAccount(role: PrototypeRole, email: string, password: string) {
  const account = getAccounts(role).find((item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password);
  if (!account) return null;
  localStorage.setItem(sessionKey(role), JSON.stringify(account));
  return account;
}

export function getSession(role: PrototypeRole): PrototypeAccount | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(sessionKey(role));
  return stored ? JSON.parse(stored) : null;
}

export function setSession(role: PrototypeRole, account: PrototypeAccount) {
  localStorage.setItem(sessionKey(role), JSON.stringify(account));
}

export function logout(role: PrototypeRole) {
  localStorage.removeItem(sessionKey(role));
}
