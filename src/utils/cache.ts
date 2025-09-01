interface CacheEntry {
  data: any;
  timestamp: number;
  expiresAt: number;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number;
}

export class CacheManager {
  private cache = new Map<string, CacheEntry>();
  private options: Required<CacheOptions>;

  constructor(options: CacheOptions = {}) {
    this.options = {
      ttl: options.ttl || 5 * 60 * 1000, // 5 minutes default
      maxSize: options.maxSize || 100
    };
  }

  set(key: string, data: any, ttl?: number): void {
    const expiresAt = Date.now() + (ttl || this.options.ttl);
    
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.options.maxSize) {
      const oldestKey = this.getOldestKey();
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresAt
    });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  private getOldestKey(): string | null {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    }

    return oldestKey;
  }
}

// Create singleton instances for different cache types
export const sessionCache = new CacheManager({ ttl: 5 * 60 * 1000 }); // 5 minutes
export const messageCache = new CacheManager({ ttl: 2 * 60 * 1000 }); // 2 minutes
export const userCache = new CacheManager({ ttl: 10 * 60 * 1000 }); // 10 minutes

// LocalStorage utilities for persistent caching
export const localStorageCache = {
  set(key: string, data: any, ttl?: number): void {
    const expiresAt = Date.now() + (ttl || 30 * 60 * 1000); // 30 minutes default
    const entry = {
      data,
      expiresAt
    };
    localStorage.setItem(key, JSON.stringify(entry));
  },

  get(key: string): any | null {
    const stored = localStorage.getItem(key);
    if (!stored) return null;

    try {
      const entry = JSON.parse(stored);
      if (Date.now() > entry.expiresAt) {
        localStorage.removeItem(key);
        return null;
      }
      return entry.data;
    } catch {
      localStorage.removeItem(key);
      return null;
    }
  },

  remove(key: string): void {
    localStorage.removeItem(key);
  },

  clear(): void {
    localStorage.clear();
  }
};

// SessionStorage utilities for session-based caching
export const sessionStorageCache = {
  set(key: string, data: any): void {
    sessionStorage.setItem(key, JSON.stringify(data));
  },

  get(key: string): any | null {
    const stored = sessionStorage.getItem(key);
    if (!stored) return null;

    try {
      return JSON.parse(stored);
    } catch {
      sessionStorage.removeItem(key);
      return null;
    }
  },

  remove(key: string): void {
    sessionStorage.removeItem(key);
  },

  clear(): void {
    sessionStorage.clear();
  }
};