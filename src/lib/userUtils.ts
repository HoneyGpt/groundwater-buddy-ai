/**
 * Generate a consistent UUID from a user's name
 * This ensures the same user gets the same UUID across sessions
 */
export const generateUserIdFromName = (name: string): string => {
  // Generate a consistent hash from the user's name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Convert hash to UUID format (pseudo-UUID that's consistent per user)
  const hashStr = Math.abs(hash).toString(16).padStart(8, '0');
  return `${hashStr.slice(0,8)}-${hashStr.slice(0,4)}-4${hashStr.slice(1,4)}-8${hashStr.slice(0,3)}-${hashStr.padEnd(12, '0').slice(0,12)}`;
};

/**
 * Get the current user's ID from their profile
 */
export const getCurrentUserId = (): string | null => {
  const profile = localStorage.getItem('ingres_public_profile');
  if (!profile) return null;
  
  try {
    const { name } = JSON.parse(profile);
    return generateUserIdFromName(name);
  } catch (error) {
    console.error('Error parsing user profile:', error);
    return null;
  }
};

/**
 * Get the current user's profile data
 */
export const getCurrentUserProfile = () => {
  const profile = localStorage.getItem('ingres_public_profile');
  if (!profile) return null;
  
  try {
    return JSON.parse(profile);
  } catch (error) {
    console.error('Error parsing user profile:', error);
    return null;
  }
};