import { Clock, PenLine } from "lucide-react";


// 2025/01/01 15:30
export function formatDate(isoString: string): string {
  const date = new Date(isoString);

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();

  return `${year}/${month}/${day} ${hour}:${minute}`;
}

// 2025/01/01
export function formatDateShort(iso: string) {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${y}/${m}/${day}`;
}


const twTimestamp = `text-sm flex items-center gap-2 text-muted-foreground stroke-muted-foreground`;
const twIcon = `w-4 h-4`;


export function DateList({ createdAt, updatedAt }: { createdAt: string; updatedAt?: string }) {
  return (
    <>
      <div className={twTimestamp}>
        <Clock className={twIcon} />
        <span className="">{createdAt}</span>
      </div>
      {updatedAt &&
        <div className={twTimestamp}>
          <PenLine className={twIcon} />
          <span>{updatedAt}</span>
        </div>
      }
    </>
  )
}