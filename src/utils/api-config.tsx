import { projectId, publicAnonKey } from './supabase/info';

// Correct server prefix
export const SERVER_PREFIX = 'make-server-cb06d073';

// Base API URL - Still using Supabase for Edge Functions and Auth
// Data storage has been migrated to Google Sheets
export const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/${SERVER_PREFIX}`;

// Export for convenience
export { projectId, publicAnonKey };