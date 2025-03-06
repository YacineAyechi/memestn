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
import withAuthRedirect from "@/components/custom/withAuthRedirect";

function LoginPage() {
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
      <title>DHA7AKNA | Sign In</title>
      <form
        onSubmit={handleSignIn}
        className="p-6 md:p-8 bg-[--primary-bg] rounded-lg shadow-lg w-full max-w-md"
      >
        {/* {error && <p className="text-red-500 mb-4">{error}</p>} */}
        {error && (
          <div className="bg-red-500 text-white p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

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
        <button
          type="submit"
          className="mt-6 bg-[#FEC601] text-white p-3 rounded-md w-full hover:bg-[#fec701e5] transition-colors duration-150"
        >
          Sign In
        </button>

        <div className="mt-6 flex flex-col md:flex-row items-center justify-center text-sm">
          <p className="text-white text-center">
            By logging in, you agree to our
            <Link
              href="/privacy-terms"
              className="ml-1 text-[#FEC601] hover:text-[#fec701e5] transition-colors duration-150"
            >
              Privacy Policy.
            </Link>
          </p>
        </div>

        <div className="mt-2 flex items-center justify-center text-sm">
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

export default withAuthRedirect(LoginPage);
