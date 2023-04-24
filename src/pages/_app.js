import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { useState } from "react";
import AuthProvider from "../../context";

export default function App({ Component, pageProps }) {
  const [status, setStatus] = useState(false);
  return (
    <AuthProvider>
      <ChakraProvider>
        <Navbar status={status} />
        <Component setStatus={setStatus} status={status} {...pageProps} />
      </ChakraProvider>
    </AuthProvider>
  );
}
