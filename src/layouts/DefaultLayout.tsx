import { useAuth } from "@/contexts/AuthProvider";
import { ReactNode } from "react";

// external imports
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import LoadingScreen from "@/screens/LoadingScreen";

const DefaultLayout = ({ children }: { children: ReactNode }) => {
  const { isLoading, user } = useAuth();

  if (isLoading || user === null) {
    return <LoadingScreen />;
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
