import { useState } from 'react';
import { auth } from '../firebaseConfig';

const GoogleSignIn = () => {
  const [error, setError] = useState(null);

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // Handle successful sign-in (e.g., redirect to a dashboard)
    } catch (error) {
      setError(error.message);
    }
  };

