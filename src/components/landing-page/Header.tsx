"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      scrolled ? "bg-background/80 backdrop-blur-sm border-b" : "bg-transparent"
    )}>
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <Bot className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">MyBotMe</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-lg font-medium">
          <Link href="/#features" className="hover:text-primary transition-colors" prefetch={false}>
            Funcionalidades
          </Link>
          <Link href="/#faq" className="hover:text-primary transition-colors" prefetch={false}>
            FAQ
          </Link>
        </nav>
        <div className="flex items-center gap-2">
           <Button size="lg" variant="ghost" className="rounded-full font-bold" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button size="lg" className="rounded-full font-bold" asChild>
            <Link href="/cadastro">Comece Agora</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
