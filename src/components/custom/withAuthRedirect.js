import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";

const withAuthRedirect = (WrappedComponent) => {
  const Wrapper = (props) => {
    const [user, loading] = useAuthState(auth);
    const router = useRouter();

    useEffect(() => {
      if (!loading && user) {
        router.push("/"); // Redirect to the homepage or another page when logged in
      }
    }, [user, loading, router]);

    if (loading || user) {
      return null; // Optionally show a loading spinner or return null while redirecting
    }

    return <WrappedComponent {...props} />;
  };

  Wrapper.displayName = `withAuthRedirect(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return Wrapper;
};

export default withAuthRedirect;
