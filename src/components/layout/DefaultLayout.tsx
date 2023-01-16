import { useAuth } from "@/contexts/AuthProvider";
import { ReactNode } from "react";

// imports: components
import Loader from "../Loader";
import Footer from "./Footer";
import Navbar from "./Navbar";

const DefaultLayout = ({ children }: { children: ReactNode }) => {
  const { isLoading, user } = useAuth();

  if (isLoading || user === null) {
    return <Loader />;
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default DefaultLayout;
