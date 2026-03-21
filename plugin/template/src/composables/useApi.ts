/**
 * Simple API composable for frontend-to-backend communication.
 *
 * Production mapping: These calls map to Vuex store actions using
 * addOrEditItem/getItems/deleteItem from the real frontend's src/store/api.js
 */
export function useApi() {
  async function request<T>(method: string, url: string, body?: unknown): Promise<T> {
    const res = await fetch(url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : {},
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(error.message || `${method} ${url} failed: ${res.status}`);
    }
    return res.json();
  }

  return {
    get: <T>(url: string) => request<T>("GET", url),
    post: <T>(url: string, body: unknown) => request<T>("POST", url, body),
    patch: <T>(url: string, body: unknown) => request<T>("PATCH", url, body),
    delete: <T>(url: string) => request<T>("DELETE", url),
  };
}
