"use client";

import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

export default function LoginPage() {
  const router = useRouter();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleUsernameOrEmailChange = (e) => setUsernameOrEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const fetchEmailByUsername = async (username) => {
    const db = getFirestore();
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return userDoc.data().email;
    } else {
      throw new Error("No user found with this username.");
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      let email = usernameOrEmail;
      // Check if the input is a username or an email
      if (!usernameOrEmail.includes("@")) {
        email = await fetchEmailByUsername(usernameOrEmail);
      }
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-[76.9vh] px-4">
      <form
        onSubmit={handleSignIn}
        className="p-6 md:p-8 bg-[#1A202C] rounded-lg shadow-lg w-full max-w-md"
      >
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mt-5">
          <label className="text-white">Username or Email</label>
          <br />
          <input
            type="text"
            placeholder="Username or Email"
            value={usernameOrEmail}
            onChange={handleUsernameOrEmailChange}
            className="mt-1 border-2 border-[#4A5568] bg-[#2D3748] text-white px-3 py-3 rounded-md w-full focus:outline-none focus:border-[#FEC601]"
          />
        </div>
        <br />
        <div>
          <label className="text-white">Password</label>
          <br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            className="mt-1 border-2 border-[#4A5568] bg-[#2D3748] text-white px-3 py-3 rounded-md w-full focus:outline-none focus:border-[#FEC601]"
          />
        </div>
        {/* 
        <button
          onClick={handleGoogleSignIn}
          className="mt-6 mb-4 w-full rounded-md px-2 py-3 flex items-center justify-center border-2 gap-2 bg-[#1A202C] text-white hover:bg-[#8FA6CB] hover:border-[#8FA6CB] transition-colors duration-150"
        >
          <Image
            className="w-6 h-6"
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            loading="lazy"
            alt="google logo"
            width={24}
            height={24}
          />
          <span>Sign In with Google</span>
        </button> */}

        <button
          type="submit"
          className="mt-6 bg-[#FEC601] text-white p-3 rounded-md w-full hover:bg-[#fec701e5] transition-colors duration-150"
        >
          Sign In
        </button>

        <div className="mt-3 flex items-center justify-center text-sm">
          <p className="text-white">Forgot Your Password?</p>
          <Link
            href={"/reset"}
            className="ml-1 text-[#FEC601] hover:text-[#fec701e5] transition-colors duration-150"
            id="reset"
            name="reset"
          >
            Reset
          </Link>
        </div>
      </form>
    </div>
  );
}
