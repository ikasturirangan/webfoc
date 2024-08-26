"use client";

import { Button } from "@/components/ui/button";
import { CrossCircledIcon, GitHubLogoIcon, HamburgerMenuIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useState } from "react";


export const Header = () => {
  
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full left-0 bg-background border-b">
      <div className="container mx-auto flex items-center justify-between py-2">
        <div className="flex items-center space-x-12">

          <nav className="hidden lg:flex space-x-8">
           <h1 className="font-bold text-sm">  Web Field Oriented Controller </h1>
          </nav>
        </div>
        <div className="hidden lg:flex items-center space-x-4">
         
          <Link href="https://github.com/ikasturirangan" passHref>
            <Button variant="outline" className="text-sm font-bold"><GitHubLogoIcon className="mr-2 w-4 h-4"/>    Github</Button>
          </Link>
          
        </div>
        <div className="lg:hidden flex items-center">
          <Button variant="ghost" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <CrossCircledIcon className="w-5 h-5" /> : <HamburgerMenuIcon className="w-5 h-5" />}
          </Button>
        </div>
      </div>
     
    </header>
  );
};
