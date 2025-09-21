import { Island } from "@/components/Island";
import Link from "next/link";


export default function Experimental() {
  return (
    <>
      <Island>
        <Link href="/experimental/MetaViewer">MetaViewer</Link>
      </Island>
      <Island>Island</Island>
      <Island>Island</Island>
    </>
  );
}
