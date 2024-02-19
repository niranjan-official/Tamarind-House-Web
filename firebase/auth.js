import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from './config'; 

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          setUser(user);
          localStorage.setItem('studentData', JSON.stringify(user));
        } else {
          setUser(null);
          localStorage.removeItem('studentData');
          router.push('/login');
        }
      });

      return () => unsubscribe();
   
  }, [router]);

  return user;
};