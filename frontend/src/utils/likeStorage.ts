// src/utils/likeStorage.ts

const SAVED_LIKES_KEY = 'app_liked_ids';

export const loadLikedIdsFromStorage = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(SAVED_LIKES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading liked IDs from storage:', error);
    return [];
  }
};

export const saveLikedIdsToStorage = (ids: string[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SAVED_LIKES_KEY, JSON.stringify(ids));
  } catch (error) {
    console.error('Error saving liked IDs to storage:', error);
  }
};

export const toggleLikedIdInStorage = (id: string): string[] => {
  const currentIds = loadLikedIdsFromStorage();
  const exists = currentIds.includes(id);
  
  const updatedIds = exists
    ? currentIds.filter((item) => item !== id)
    : [...currentIds, id];

  saveLikedIdsToStorage(updatedIds);
  return updatedIds;
};

export const clearLikedIdsFromStorage = (): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(SAVED_LIKES_KEY);
  } catch (error) {
    console.error('Error removing liked IDs from storage:', error);
  }
};