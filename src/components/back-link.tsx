"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import styles from "./back-link.module.scss";

export default function BackLink() {
  const pathname = usePathname();
  const fragments = pathname.split("/");
  const backPath = fragments.slice(0, fragments.length - 1).join("/");

  return (
    <>
      {fragments.length != 2 &&
        <div className={styles.container}>
          <Link href={backPath} className={styles.link}>
            <NavigateBeforeIcon className={styles.icon} />
            <div className={styles.text}>{backPath}</div>
          </Link>
        </div>
      }
    </>
  )
}
