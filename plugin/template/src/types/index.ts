/**
 * Shared TypeScript types.
 *
 * Production mapping: These types define the API contract between
 * frontend and backend. In production:
 * - Frontend uses these shapes in Vuex store modules
 * - Backend defines these as DRF serializers (valur/api/serializers/)
 * - Model service uses Pydantic models or ModelParams classes
 */

// Example: define your data types here
export interface Example {
  id: number;
  name: string;
  created_at: string;
}
