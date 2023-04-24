import Homepage from "@/components/Homepage";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {

  return (
    <>
      <Homepage />
    </>
  );
}
