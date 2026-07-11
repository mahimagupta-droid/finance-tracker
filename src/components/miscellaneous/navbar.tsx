"use client";
import Logo from "../../../public/dark-mode-logo.png";
import Image from "next/image";
import { SignInButton, SignOutButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { isSignedIn } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/user-profile", label: "User Profile" },
    { href: "/transactions", label: "Transactions" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/budget", label: "Budget" },
  ];

  return (
    <div className="sticky top-0 z-50 backdrop-blur-md bg-background dark:bg-black border-b border-border transition-colors duration-300">
      <div className="pl-4 pr-8 flex items-center justify-between h-24 md:h-30">
        <div className="flex items-center">
          <Image
            src={Logo}
            alt="projectLogo"
            className="w-42 md:w-52 h-auto object-contain dark:invert-0 invert"
          />
        </div>

        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-md font-lato transition-all duration-300 text-textColor/80 hover:text-primary dark:hover:text-cyan-300"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          {isSignedIn ? (
            <>
              <SignOutButton>
                <button className="px-4 py-2 rounded-full text-md font-lato bg-primary text-primary-textColor hover:opacity-90 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-primary/30">
                  Log Out
                </button>
              </SignOutButton>
              <UserButton />
            </>
          ) : (
            <SignInButton>
              <button className="px-5 py-2 rounded-full text-md font-lato bg-primary text-primary-textColor hover:opacity-90 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-primary/30">
                Sign In
              </button>
            </SignInButton>
          )}
        </div>

        <div className="flex md:hidden items-center gap-3">
          <ThemeToggle />
          {isSignedIn && <UserButton />}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-textColor"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden flex flex-col border-t border-border bg-background/95 px-6 py-4 gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-md font-lato text-textColor/80 hover:text-primary transition-all duration-300"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-border">
            {isSignedIn ? (
              <SignOutButton>
                <button className="w-full px-4 py-2 rounded-full text-md font-lato bg-primary text-primary-textColor hover:opacity-90 transition-all duration-300">
                  Log Out
                </button>
              </SignOutButton>
            ) : (
              <SignInButton>
                <button className="w-full px-4 py-2 rounded-full text-md font-lato bg-primary text-primary-textColor hover:opacity-90 transition-all duration-300">
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      )}
    </div>
  );
}