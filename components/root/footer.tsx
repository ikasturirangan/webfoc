"use client";

import { ModeToggle } from "./modetoggle";


export const Footer = () => {
  return (
    <footer className="w-full bg-background border-t mt-5">
      <div className="container mx-auto flex flex-row items-center justify-between py-4 px-4">
        <div className="text-md font-bold">Kasturirangan Iyengar</div>
        <ModeToggle />
      </div>
    </footer>
  );
};
