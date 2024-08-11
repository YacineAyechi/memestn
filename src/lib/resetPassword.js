import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "./firebase";

export async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    return {
      success: true,
      message: "Password reset email sent successfully.",
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
}
