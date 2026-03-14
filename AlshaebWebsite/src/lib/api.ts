import type { CreateStoreItemPayload, StoreItem } from "@/lib/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const message = (data as { error?: string }).error || "Request failed";
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

function authHeaders(token: string) {
  return { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" };
}

export async function getStoreItems(): Promise<StoreItem[]> {
  const response = await fetch(`${API_BASE_URL}/api/items`);
  const data = await parseResponse<{ items: StoreItem[] }>(response);
  return data.items;
}

export async function adminLogin(username: string, password: string): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await parseResponse<{ token: string }>(response);
  return data.token;
}

export async function getAdminItems(token: string): Promise<StoreItem[]> {
  const response = await fetch(`${API_BASE_URL}/api/admin/items`, {
    headers: authHeaders(token),
  });
  const data = await parseResponse<{ items: StoreItem[] }>(response);
  return data.items;
}

export async function createStoreItem(payload: CreateStoreItemPayload, token: string): Promise<number> {
  const response = await fetch(`${API_BASE_URL}/api/admin/items`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  const data = await parseResponse<{ id: number }>(response);
  return data.id;
}
