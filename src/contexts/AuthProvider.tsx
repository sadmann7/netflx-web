import { formatError } from "@/utils/format";
import { auth } from "auth/firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import Router from "next/router";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "react-toastify";

type Auth = {
  user: User | null;
  signup: (email: string, password: string) => Promise<void>;
  signin: (email: string, password: string) => Promise<void>;
  signout: () => Promise<void>;
  error: string | null;
  isLoading: boolean;
};

const AuthContext = createContext<Auth>({
  user: null,
  signup: async () => {},
  signin: async () => {},
  signout: async () => {},
  error: null,
  isLoading: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const persist = onAuthStateChanged(auth, (user) => {
      if (user !== null) {
        setUser(user);
        setIsLoading(false);
      } else {
        Router.push("/signin");
        setUser(null);
        setIsLoading(false);
      }
    });
    return () => persist();
  }, []);

  const signup = async (email: string, password: string) => {
    setIsLoading(true);

    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // signed in
        const user = userCredential.user;
        setUser(user);
        Router.push("/");
        setIsLoading(false);
        toast.success("Successfully signed up.", { toastId: "signupSuccess" });
      })
      .catch((err) => {
        const errorMessage = formatError(err.message);
        setError(errorMessage);
        toast.error(error, { toastId: "signupError" });
      })
      .finally(() => setIsLoading(false));
  };

  const signin = async (email: string, password: string) => {
    setIsLoading(true);

    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // signed in
        const user = userCredential.user;
        if (user === null) throw new Error("User is null.");
        Router.push("/");
        setUser(user);
        setIsLoading(false);
        toast.success("Successfully signed in.", { toastId: "signinSuccess" });
      })
      .catch((err) => {
        const errorMessage = formatError(err.message);
        setError(errorMessage);
        toast.error(error, { toastId: "signinError" });
      })
      .finally(() => setIsLoading(false));
  };

  const signout = async () => {
    setIsLoading(true);

    await signOut(auth)
      .then(() => {
        // signed out
        setUser(null);
        setIsLoading(false);
      })
      .catch((err) => {
        const errorMessage = formatError(err.message);
        setError(errorMessage);
        toast.error(error, { toastId: "signoutError" });
      })
      .finally(() => setIsLoading(false));
  };

  const memoedValue = useMemo(
    () => ({
      user,
      signup,
      signin,
      signout,
      isLoading,
      error,
    }),
    [user, isLoading, error]
  );

  return (
    <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
