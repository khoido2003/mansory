/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import { HTMLAttributes, useEffect, useRef, useState } from "react";

import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { Phone } from "./phone";
import { MaxWidthWrapper } from "./max-width-wrapper";

const PHONES = [
  "/design/8.png",
  "/design/1.png",
  "/design/2.png",
  "/design/9.png",
  "/design/5.png",
  "/design/6.png",
];

function splitArray<T>(array: Array<T>, numParts: number) {
  const result: Array<Array<T>> = [];

  for (let i = 0; i < array.length; i++) {
    const index = i % numParts;
    if (!result[index]) {
      result[index] = [];
    }
    result[index].push(array[i]);
  }

  return result;
}

function ReviewColumn({
  reviews,
  className,
  reviewClassName,
  msPerPixel = 0,
}: {
  reviews: string[];
  className?: string;
  reviewClassName?: (reviewIndex: number) => string;
  msPerPixel?: number;
}) {
  const columnRef = useRef<HTMLDivElement | null>(null);
  const [columnHeight, setColumnHeight] = useState(0);
  const duration = `${columnHeight * msPerPixel}ms`;

  useEffect(() => {
    if (!columnRef.current) return;

    const resizeObserver = new window.ResizeObserver(() => {
      setColumnHeight(columnRef.current?.offsetHeight ?? 0);
    });

    resizeObserver.observe(columnRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={columnRef}
      className={cn("animate-marquee space-y-8 py-4", className)}
      style={{ "--marquee-duration": duration } as React.CSSProperties}
    >
      {reviews.concat(reviews).map((imgSrc, reviewIndex) => (
        <Review
          key={reviewIndex}
          className={reviewClassName?.(reviewIndex % reviews.length)}
          imgSrc={imgSrc}
        />
      ))}
    </div>
  );
}

interface ReviewProps extends HTMLAttributes<HTMLDivElement> {
  imgSrc: string;
}

function Review({ imgSrc, className, ...props }: ReviewProps) {
  const POSSIBLE_ANIMATION_DELAYS = [
    "0s",
    "0.1s",
    "0.2s",
    "0.3s",
    "0.4s",
    "0.5s",
  ];

  const animationDelay =
    POSSIBLE_ANIMATION_DELAYS[
      Math.floor(Math.random() * POSSIBLE_ANIMATION_DELAYS.length)
    ];

  return (
    <div
      className={cn(
        "animate-fade-in rounded-[2.25rem] bg-white p-6 opacity-0 shadow-xl shadow-slate-900/5",
        className
      )}
      style={{ animationDelay }}
      {...props}
    >
      <Phone imgSrc={imgSrc} />
    </div>
  );
}

function ReviewGrid() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.4 });
  const columns = splitArray(PHONES, 3);
  const column1 = columns[0];
  const column2 = columns[1];
  const column3 = splitArray(columns[2], 2);

  return (
    <div
      ref={containerRef}
      className="relative -mx-4 grid h-[50rem] max-h-[150vh] grid-cols-1 items-start gap-8 overflow-hidden px-4 md:grid-cols-2 lg:grid-cols-3 "
    >
      {isInView ? (
        <>
          <ReviewColumn
            reviews={[...column1, ...column3.flat(), ...column2]}
            reviewClassName={(reviewIndex) =>
              cn({
                "md:hidden": reviewIndex >= column1.length + column3[0].length,
                "lg:hidden": reviewIndex >= column1.length,
              })
            }
            msPerPixel={10}
          />
          <ReviewColumn
            reviews={[...column2, ...column3[1]]}
            className="hidden md:block"
            reviewClassName={(reviewIndex) =>
              reviewIndex >= column2.length ? "lg:hidden" : ""
            }
            msPerPixel={15}
          />
          <ReviewColumn
            reviews={column3.flat()}
            className="hidden md:block"
            msPerPixel={10}
          />
        </>
      ) : null}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-pink-200" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-pink-200" />
    </div>
  );
}

export function Reviews() {
  return (
    <>
      <MaxWidthWrapper className="relative max-w-5xl">
        <img
          aria-hidden="true"
          src="/arrow.png"
          className="absolute w-80 select-none hidden xl:block -left-44 top-1/3"
        />

        <ReviewGrid />

        <button className="absolute xl:block hidden -right-32 top-[300px] bg-pink-500 hover:bg-pink-500/80 text-white px-8 py-10 rounded-md font-bold text-lg">
          <a href="https://docs.google.com/document/d/19sMXhTJ3O8BM1pnoEIUGSglWGFGspVA3xrV9hAmgAtM/edit">
            Check it out
          </a>
        </button>
      </MaxWidthWrapper>

      <button className="w-[90%] m-auto my-7 bg-pink-500 hover:bg-pink-500/80 text-white px-3 py-2 flex justify-center items-center rounded-md font-bold xl:hidden ">
        <a href="https://docs.google.com/document/d/19sMXhTJ3O8BM1pnoEIUGSglWGFGspVA3xrV9hAmgAtM/edit">
          See it
        </a>
      </button>
    </>
  );
}
