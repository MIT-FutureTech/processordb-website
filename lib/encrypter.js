// Stores any string with an expiry time (default = 12 hours in ms)
export function setItemWithExpiry(key, value, ttl = 43200000) {
    const now = Date.now();
    const item = {
      value,
      expiry: now + ttl,
    };
    sessionStorage.setItem(key, JSON.stringify(item));
  }
  
  export function getItemWithExpiry(key) {
    const itemStr = sessionStorage.getItem(key);
    if (!itemStr) return null;
  
    try {
      const item = JSON.parse(itemStr);
      if (Date.now() > item.expiry) {
        sessionStorage.removeItem(key);
        return null;
      }
      return item.value;
    } catch {
      sessionStorage.removeItem(key);
      return null;
    }
  }
  