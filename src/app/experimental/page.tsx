import { Island } from "@/components/Island";
import Link from "next/link";


export default function Experimental() {
  return (
    <>
      <Island>
        <Link href="/experimental/post">post</Link>
      </Island>
      <Island>Island</Island>
      <Island onMobileExpand>Island onMobileExpand</Island>
    </>
  );
}
