import { ReactNode } from "react";

// imports: components
import Footer from "./Footer";
import Navbar from "./Navbar";

const DefaultLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default DefaultLayout;
