/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface PhoneProps extends HTMLAttributes<HTMLDivElement> {
  imgSrc: string;
  dark?: boolean;
}

export const Phone = ({
  imgSrc,
  dark = false,
  className,
  ...props
}: PhoneProps) => {
  return (
    <div
      className={cn(
        "relative pointer-events-none z-50 overflow-hidden ",
        className
      )}
      {...props}
    >
      <img
        src={dark ? "/blank-phone.png" : "/blank-phone.png"}
        alt="Phone case template"
        className="pointer-events-none z-50 select-none opacity-0 block h-[25rem] rounded-md overflow-hidden"
      />

      <div className="absolute -z-10 inset-0 rounded-md overflow-hidden">
        <img
          className="object-cover rounded-md"
          src={imgSrc}
          alt="Overlaying image"
        />
      </div>
    </div>
  );
};
