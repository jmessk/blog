// import ExportedImage from "next-image-export-optimizer";
import styles from "./md-img.module.scss";
// import imagepath from "src/assets/posts/test/nyancat.png";
import path from "path";
import fs from "fs";

export default function MdImg({ dir, src, alt }: {
  dir: string, 
  src: string,
  alt: string
}) {
  // C:\Users\sasak\workspace\html\next-app\src\assets\posts\test\nyancat.png
  const srcPath = path.join(process.cwd(), dir, src);

  // test
  const parentDir = dir.split(path.sep).pop() || "unknown";

  // C:\Users\sasak\workspace\html\next-app\public\images\test\nyancat.png
  const dstPath = path.join(process.cwd(), "public", "images", parentDir, src);

  fs.mkdirSync(path.join(process.cwd(), "public", "images", parentDir), { recursive: true });
  fs.copyFileSync(srcPath, dstPath);

  // /images/test/nyancat.png
  const srcUrl = path.join("/", "images", parentDir, src).replaceAll("\\", "/");

  return (
    // <img src={src} alt={alt} className={styles.mdImg} />
    <div className={styles.container}>
      <img
        src={srcUrl}
        alt={alt}
        className={styles.mdImg}
        // style={{objectFit: "contain", width: "100%"}}
      />
    </div>
  );
}