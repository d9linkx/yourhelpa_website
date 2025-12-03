/**
 * KV Store Helper - Google Apps Script Backend (FREE!)
 * No Google Cloud billing required - uses free Google Apps Script
 */

// Your Google Apps Script Web App URL
// Get this after deploying your Apps Script (see GOOGLE_APPS_SCRIPT_FREE.md)
const APPS_SCRIPT_URL = Deno.env.get('GOOGLE_APPS_SCRIPT_URL') || 'https://script.google.com/macros/s/AKfycbykhGJ5J0kIlwWlIP2dxx9ivw77hY_lGvQWbFo9uvENQMGW9bptChd8PhteyCA3FqZI/exec';
const KV_SHEET = 'KeyValue'; // The sheet tab name for key-value storage

/**
 * Make a request to the Google Apps Script web app
 */
async function appsScriptRequest(method: 'GET' | 'POST', params: any, body?: any): Promise<any> {
  const url = new URL(APPS_SCRIPT_URL);
  
  // Add query parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  });
  
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  if (body && method === 'POST') {
    options.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(url.toString(), options);
    
    if (!response.ok) {
      throw new Error(`Apps Script request failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    return data;
  } catch (error) {
    console.error('Apps Script request error:', error);
    throw error;
  }
}

/**
 * Get a single value by key
 */
export async function get(key: string): Promise<any> {
  try {
    const result = await appsScriptRequest('GET', {
      action: 'get',
      sheet: KV_SHEET,
      key: 'key',
      value: key
    });
    
    return result ? result.value : null;
  } catch (error) {
    console.error(`KV Get error for key ${key}:`, error);
    return null;
  }
}

/**
 * Set a single key-value pair
 */
export async function set(key: string, value: any): Promise<void> {
  try {
    // First, check if key exists
    const existing = await get(key);
    
    const data = {
      key,
      value,
      updatedAt: new Date().toISOString()
    };
    
    if (existing) {
      // Update existing row
      await appsScriptRequest('POST', {
        action: 'update',
        sheet: KV_SHEET
      }, {
        key: 'key',
        value: key,
        updates: data
      });
    } else {
      // Append new row
      await appsScriptRequest('POST', {
        action: 'append',
        sheet: KV_SHEET
      }, {
        ...data,
        createdAt: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error(`KV Set error for key ${key}:`, error);
    throw new Error(`Failed to save data: ${error.message}`);
  }
}

/**
 * Delete a single key
 */
export async function del(key: string): Promise<void> {
  try {
    await appsScriptRequest('POST', {
      action: 'delete',
      sheet: KV_SHEET
    }, {
      key: 'key',
      value: key
    });
  } catch (error) {
    console.error(`KV Delete error for key ${key}:`, error);
    throw new Error(`Failed to delete data: ${error.message}`);
  }
}

/**
 * Get multiple values by keys
 */
export async function mget(keys: string[]): Promise<any[]> {
  if (keys.length === 0) return [];
  
  try {
    const values = await Promise.all(keys.map(key => get(key)));
    return values;
  } catch (error) {
    console.error(`KV MGet error:`, error);
    return [];
  }
}

/**
 * Set multiple key-value pairs
 */
export async function mset(keys: string[], values: any[]): Promise<void> {
  if (keys.length === 0) return;
  
  try {
    await Promise.all(keys.map((key, i) => set(key, values[i])));
  } catch (error) {
    console.error(`KV MSet error:`, error);
    throw new Error(`Failed to save multiple records: ${error.message}`);
  }
}

/**
 * Delete multiple keys
 */
export async function mdel(keys: string[]): Promise<void> {
  if (keys.length === 0) return;
  
  try {
    await Promise.all(keys.map(key => del(key)));
  } catch (error) {
    console.error(`KV MDelete error:`, error);
    throw new Error(`Failed to delete multiple records: ${error.message}`);
  }
}

/**
 * Get all key-value pairs matching a prefix
 */
export async function getByPrefix(prefix: string): Promise<any[]> {
  try {
    const allRows = await appsScriptRequest('GET', {
      action: 'getAll',
      sheet: KV_SHEET
    });
    
    if (!Array.isArray(allRows)) return [];
    
    return allRows
      .filter(row => row.key && row.key.startsWith(prefix))
      .map(row => row.value);
  } catch (error) {
    console.error(`KV GetByPrefix error for prefix ${prefix}:`, error);
    return [];
  }
}