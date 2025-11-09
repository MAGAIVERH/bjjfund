"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Trophy, Menu, Heart } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Info, BookOpen, Flag, Users } from "lucide-react";

const navigation = [
  { name: "Como Funciona", href: "#como-funciona", icon: Info },
  { name: "Histórias", href: "#historias", icon: BookOpen },
  { name: "Campanhas", href: "#campanhas", icon: Flag },
  { name: "Todos Ganham", href: "#todos-ganham", icon: Users },
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
                <Heart className="mr-1 h-4 w-4" />
                Começar Agora
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
            <SheetContent side="right" className="flex w-80 flex-col">
              <div className="mt-8 flex flex-1 flex-col gap-6">
                {/* LINKS DO MENU MOBILE */}
                <div className="mt-6 flex flex-col gap-1">
                  {navigation.map((item, index) => (
                    <div key={item.name}>
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="hover:text-primary flex items-center gap-3 px-2 py-3 text-base font-medium transition-colors"
                      >
                        <item.icon className="text-primary h-5 w-5" />
                        {item.name}
                      </Link>
                      {index !== navigation.length - 1 && (
                        <Separator className="my-1 opacity-40" />
                      )}
                    </div>
                  ))}
                </div>

                {/* BOTÕES NO FINAL */}
                <div className="mt-auto flex flex-col gap-3 border-t px-4 pt-6 pb-6">
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/authentication">Entrar</Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link href="/authentication">
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
