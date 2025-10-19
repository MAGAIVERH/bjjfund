"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Trophy, Menu, Heart } from "lucide-react";

const navigation = [
  { name: "Como Funciona", href: "#como-funciona" },
  { name: "Histórias", href: "#historias" },
  { name: "Campanhas", href: "/campaigns" },
  { name: "Sobre", href: "#sobre" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
              <Trophy className="text-primary-foreground h-5 w-5" />
            </div>
            <span className="text-xl font-bold">BJJ Fund</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-muted-foreground hover:text-foreground font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-4 md:flex">
            <Button asChild variant="ghost">
              <Link href="/authentication">Entrar</Link>
            </Button>
            <Button asChild>
              <Link href="/authentication">
                <Heart className="mr-2 h-4 w-4" />
                Começar
              </Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="mt-8 flex flex-col gap-6">
                <nav className="flex flex-col gap-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="hover:text-primary text-lg font-medium transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
                <div className="flex flex-col gap-3 border-t pt-6">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full bg-transparent"
                  >
                    <Link href="/login">Entrar</Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link href="/register">
                      <Heart className="mr-2 h-4 w-4" />
                      Começar Agora
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
