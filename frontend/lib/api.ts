const API = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');

/** Node fetch on Windows often prefers ::1 for "localhost"; force IPv4 loopback on the server. */
function preferIPv4Loopback(url: string): string {
  if (typeof window !== 'undefined') return url;
  return url.replace(/^(https?:\/\/)localhost(?=[:/])/i, '$1127.0.0.1');
}

export function apiUrl(path: string) {
  const p = path.startsWith('/') ? path : `/${path}`;
  if (API) {
    return preferIPv4Loopback(`${API}${p}`);
  }
  if (typeof window === 'undefined') {
    const site = (process.env.NEXT_PUBLIC_SITE_URL || 'http://127.0.0.1:3000').replace(/\/$/, '');
    return preferIPv4Loopback(`${site}${p}`);
  }
  return p;
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(apiUrl(path), {
    ...init,
    credentials: 'include',
    headers: {
      ...(init?.headers || {}),
    },
  });

  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { error: 'Invalid response' };
  }

  if (!res.ok) {
    const err = (data as { error?: string })?.error || 'Request failed';
    throw new Error(err);
  }

  return data as T;
}

export type Product = {
  _id?: string;
  id?: string;
  name: string;
  price: number;
  description: string;
  image: string;
  stock: number;
  createdAt?: string;
};

export type ProductsResponse = { products: Product[] };
export type ProductResponse = { product: Product };
export type MeResponse = { user: { email: string; role: string } | null };
