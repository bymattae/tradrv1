import { useState, useEffect } from 'react';

interface User {
  photoURL?: string | null;
  displayName?: string | null;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  // This is a placeholder. In a real app, this would connect to Firebase Auth
  useEffect(() => {
    // Simulate loading user data
    const mockUser = {
      photoURL: null,
      displayName: null
    };
    setUser(mockUser);
  }, []);

  return { user };
} 