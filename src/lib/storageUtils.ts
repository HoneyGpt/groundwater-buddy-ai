/**
 * Storage utilities to separate data between public and official contexts
 */

export type UserContext = 'public' | 'official';

// Storage keys for different contexts
const STORAGE_KEYS = {
  public: {
    profile: 'ingres_public_profile',
    chats: 'ingres_chats',
    budgetHistory: 'budget_bro_history',
    waterPoints: 'ingres_water_points',
    documents: 'ingres_documents'
  },
  official: {
    profile: 'ingres_official_profile', 
    chats: 'ingres_official_chats',
    budgetHistory: 'official_budget_bro_history',
    waterPoints: 'ingres_official_water_points',
    documents: 'ingres_official_documents'
  }
};

/**
 * Get storage key based on context
 */
export const getStorageKey = (context: UserContext, type: keyof typeof STORAGE_KEYS.public) => {
  return STORAGE_KEYS[context][type];
};

/**
 * Get current user context from URL or session
 */
export const getCurrentContext = (): UserContext => {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname;
    return path.includes('official') || path.includes('playground') ? 'official' : 'public';
  }
  return 'public';
};

/**
 * Context-aware profile operations
 */
export const ProfileStorage = {
  get: (context?: UserContext) => {
    const ctx = context || getCurrentContext();
    const key = getStorageKey(ctx, 'profile');
    const profile = localStorage.getItem(key);
    return profile ? JSON.parse(profile) : null;
  },
  
  set: (profile: any, context?: UserContext) => {
    const ctx = context || getCurrentContext();
    const key = getStorageKey(ctx, 'profile');
    localStorage.setItem(key, JSON.stringify(profile));
  },
  
  clear: (context?: UserContext) => {
    const ctx = context || getCurrentContext();
    const key = getStorageKey(ctx, 'profile');
    localStorage.removeItem(key);
  }
};

/**
 * Context-aware chat operations
 */
export const ChatStorage = {
  get: (context?: UserContext) => {
    const ctx = context || getCurrentContext();
    const key = getStorageKey(ctx, 'chats');
    const chats = localStorage.getItem(key);
    return chats ? JSON.parse(chats) : [];
  },
  
  add: (chatData: any, context?: UserContext) => {
    const ctx = context || getCurrentContext();
    const key = getStorageKey(ctx, 'chats');
    const existingChats = ChatStorage.get(ctx);
    const updatedChats = [chatData, ...existingChats].slice(0, 20);
    localStorage.setItem(key, JSON.stringify(updatedChats));
  },
  
  update: (chats: any[], context?: UserContext) => {
    const ctx = context || getCurrentContext();
    const key = getStorageKey(ctx, 'chats');
    localStorage.setItem(key, JSON.stringify(chats));
  },
  
  delete: (chatId: string, context?: UserContext) => {
    const ctx = context || getCurrentContext();
    const chats = ChatStorage.get(ctx);
    const updatedChats = chats.filter((chat: any) => chat.id !== chatId);
    ChatStorage.update(updatedChats, ctx);
  }
};

/**
 * Context-aware budget history operations
 */
export const BudgetStorage = {
  get: (context?: UserContext) => {
    const ctx = context || getCurrentContext();
    const key = getStorageKey(ctx, 'budgetHistory');
    const history = localStorage.getItem(key);
    return history ? JSON.parse(history) : [];
  },
  
  add: (sessionData: any, context?: UserContext) => {
    const ctx = context || getCurrentContext();
    const key = getStorageKey(ctx, 'budgetHistory');
    const history = BudgetStorage.get(ctx);
    history.unshift(sessionData);
    const updatedHistory = history.slice(0, 50);
    localStorage.setItem(key, JSON.stringify(updatedHistory));
  }
};

/**
 * Generate consistent user ID based on context and name
 */
export const generateContextualUserId = (name: string, context?: UserContext): string => {
  const ctx = context || getCurrentContext();
  // Add context prefix to ensure different IDs for same user in different contexts
  const contextualName = `${ctx}_${name}`;
  
  let hash = 0;
  for (let i = 0; i < contextualName.length; i++) {
    const char = contextualName.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  const hashStr = Math.abs(hash).toString(16).padStart(8, '0');
  return `${hashStr.slice(0,8)}-${hashStr.slice(0,4)}-4${hashStr.slice(1,4)}-8${hashStr.slice(0,3)}-${hashStr.padEnd(12, '0').slice(0,12)}`;
};

/**
 * Get current user ID with context awareness
 */
export const getCurrentUserId = (context?: UserContext): string | null => {
  const ctx = context || getCurrentContext();
  const profile = ProfileStorage.get(ctx);
  if (!profile?.name) return null;
  
  return generateContextualUserId(profile.name, ctx);
};