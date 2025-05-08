// import { getPageMeta } from "@/utils/page-info";
import styles from "./link-card.module.scss";
import Script from "next/script";


export default async function LinkCard({ href }: { href: string }) {
  const domain = new URL(href).hostname;
  switch (domain) {
    case "www.youtube.com":
      return <YoutubeCard href={href} />;

    case "twitter.com":
      return <TwitterCard href={href} />;

    default:
      // return <Card href={href} />;
      return <></>
  }
}


// async function Card({ href }: { href: string }) {
//   const { title, description, imgURL } = await getPageMeta(href);

//   return (
//     <a className={styles.container} href={href}>
//       <div className={styles.innerContainer}>
//         <div>
//           <div className={styles.title}>{title}</div>
//           <div className={styles.description}>{description}</div>
//         </div>
//         <div className={styles.url}>{href}</div>
//       </div>
//       <img src={imgURL} alt="" className={styles.imgContainer} />
//     </a>
//   )
// }


function YoutubeCard({ href }: { href: string }) {
  const id = new URL(href).searchParams.get("v");
  return (
    <div className={styles.youtube}>
      <iframe src={`https://www.youtube.com/embed/${id}`} allowFullScreen></iframe>
    </div>
  )
}


function TwitterCard({ href }: { href: string }) {
  return (
    <div className={styles.twitter}>
      <blockquote className="twitter-tweet">
        <p>Setting up twttr...</p>
        <a href={href}>{href}</a>
      </blockquote>
      <Script src="https://platform.twitter.com/widgets.js" />
    </div>
  )
}