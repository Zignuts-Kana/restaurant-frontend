import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { useState } from "react";
import AuthProvider from "../../context";
import 'bootstrap/dist/css/bootstrap.min.css';


export default function App({ Component, pageProps }) {
  const [status, setStatus] = useState(false);
  return (
    <AuthProvider>
      <ChakraProvider>
        <Navbar status={status} setStatus={setStatus} />
        <Component setStatus={setStatus} status={status} {...pageProps} />
      </ChakraProvider>
    </AuthProvider>
  );
}
