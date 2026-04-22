import { useEffect, useState } from "react";

const STORAGE_KEY = "comicwall-recent";
const MAX = 8;

export function getRecentlyViewed(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function recordRecentlyViewed(productId: string) {
  try {
    const current = getRecentlyViewed().filter((id) => id !== productId);
    current.unshift(productId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current.slice(0, MAX)));
  } catch {
    // no-op
  }
}

export function useRecentlyViewed(excludeId?: string): string[] {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    const list = getRecentlyViewed();
    setIds(excludeId ? list.filter((id) => id !== excludeId) : list);
  }, [excludeId]);

  return ids;
}
