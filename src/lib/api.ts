import type { CreateStoreItemPayload, StoreItem } from "@/lib/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const ITEMS_CACHE_TTL_MS = 60_000;

let itemsCache: StoreItem[] | null = null;
let itemsCacheAt = 0;
let itemsRequestInFlight: Promise<StoreItem[]> | null = null;

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
  const now = Date.now();
  if (itemsCache && now - itemsCacheAt < ITEMS_CACHE_TTL_MS) {
    return itemsCache;
  }

  if (itemsRequestInFlight) {
    return itemsRequestInFlight;
  }

  itemsRequestInFlight = (async () => {
  const response = await fetch(`${API_BASE_URL}/api/items`);
  const data = await parseResponse<{ items: StoreItem[] }>(response);
    itemsCache = data.items;
    itemsCacheAt = Date.now();
    return data.items;
  })();

  try {
    return await itemsRequestInFlight;
  } finally {
    itemsRequestInFlight = null;
  }
}

export async function getStoreItemById(id: number): Promise<StoreItem> {
  if (itemsCache) {
    const cached = itemsCache.find((item) => item.id === id);
    if (cached) return cached;
  }

  const response = await fetch(`${API_BASE_URL}/api/items/${id}`);
  const data = await parseResponse<{ item: StoreItem }>(response);
  return data.item;
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
  itemsCache = null;
  itemsCacheAt = 0;
  return data.id;
}

export async function updateStoreItem(id: number, payload: CreateStoreItemPayload, token: string): Promise<number> {
  const response = await fetch(`${API_BASE_URL}/api/admin/items/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  const data = await parseResponse<{ id: number }>(response);
  itemsCache = null;
  itemsCacheAt = 0;
  return data.id;
}

export async function deleteStoreItem(id: number, token: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/admin/items/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const message = (data as { error?: string }).error || "Failed to delete item";
    throw new Error(message);
  }

  itemsCache = null;
  itemsCacheAt = 0;
}
