const DEVICE_ID_KEY = 'agri-device-id-v1';

/** স্থায়ী র‍্যান্ডম ডিভাইস টোকেনের SHA-256; হার্ডওয়্যার ফিঙ্গারপ্রিন্ট নয়। */
export async function getDeviceFingerprint(): Promise<string> {
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(deviceId));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}
