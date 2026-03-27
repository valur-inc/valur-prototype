/**
 * Shared TypeScript types.
 *
 * Production mapping: These types define the API contract between
 * frontend and backend. In production:
 * - Frontend uses these shapes in Vuex store modules
 * - Backend defines these as DRF serializers (valur/api/serializers/)
 * - Model service uses Pydantic models or ModelParams classes
 */

// Base fields present on every record (maps to Django BaseModel + BaseSafeMixin)
export interface BaseRecord {
  id: number;
  is_deleted: number;
  created_at: string;
  updated_at: string;
}

// Example: define your data types here
export interface Example extends BaseRecord {
  name: string;
}
