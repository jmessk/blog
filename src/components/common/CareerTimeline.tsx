import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";


export type TimelineEntry = {
  date: string;
  title: string;
  content?: string;
};

type TimeLineProps = {
  items: TimelineEntry[];
};


export function TimeLine({ items }: TimeLineProps) {
  return (
    <div className="relative">
      <Separator
        orientation="vertical"
        className="absolute left-2 top-4 h-full bg-muted"
      />
      {items.map((entry, index) => (
        <div key={index} className="relative mb-8 pl-8 last:mb-0">
          <div className="absolute left-0 top-3.5 flex h-4 w-4 items-center justify-center rounded-full bg-foreground" />
          <h3 className="py-1 text-md text-paragraph font-semibold tracking-tight xl:mb-2 xl:px-1">
            {entry.title}
          </h3>
          <p className="text-sm font-medium tracking-tight text-muted-foreground">
            {entry.date}
          </p>
          {entry.content && (
            <Card className="mt-3 border-none bg-transparent p-0 shadow-none">
              <CardContent className="px-0 py-2">
                <p className="text-sm leading-relaxed text-paragraph">
                  {entry.content}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      ))}
    </div>
  );
}
