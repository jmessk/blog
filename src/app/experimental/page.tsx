import { Island } from "@/components/common/Island";
import Link from "next/link";


export default function Experimental() {
  return (
    <>
      <Island>Island</Island>
      <Island onMobileExpand>Island onMobileExpand</Island>
      <Island><Link href="/experimental/post">post</Link></Island>
      <Island><Link href="/experimental/list">list</Link></Island>
    </>
  );
}
