// src/utils/offlineSync.ts
// Utility for offline data sync using IndexedDB (via idb-keyval)
import { set, get, del, update, keys } from 'idb-keyval';

export async function saveOffline(key: string, value: any) {
  await set(key, value);
}
export async function getOffline(key: string) {
  return get(key);
}
export async function deleteOffline(key: string) {
  await del(key);
}
export async function listOfflineKeys() {
  return keys();
}
export async function queueAction(action: any) {
  const actions = (await get('offlineActions')) || [];
  actions.push(action);
  await set('offlineActions', actions);
}
export async function getQueuedActions() {
  return (await get('offlineActions')) || [];
}
export async function clearQueuedActions() {
  await set('offlineActions', []);
}
