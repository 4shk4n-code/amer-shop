"use client";

import Image from "next/image";
import { Search, ShoppingCart, Menu, ChevronDown, User, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/contexts/CartContext";

const categories = [
  { 
    name: "Electronics", 
    href: "/category/electronics",
    submenu: [
      { name: "TV", href: "/category/electronics/tv" },
    ]
  },
  { name: "Fashion", href: "/category/fashion" },
  { 
    name: "Home & Garden", 
    href: "/category/home-garden",
    submenu: [
      { name: "Artificial Grass", href: "/category/home-garden/artificial-grass" },
    ]
  },
  { name: "Sports", href: "/category/sports" },
  { name: "Automotive", href: "/category/automotive" },
  { name: "Toys", href: "/category/toys" },
];

export default function Header() {
  const { data: session } = useSession();
  const { cart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [electronicsSubmenuOpen, setElectronicsSubmenuOpen] = useState(false);
  const [homeGardenSubmenuOpen, setHomeGardenSubmenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
    setUserMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/images/logo/amerlogo.png"
              alt="AMERSHOP! Logo"
              width={120}
              height={40}
              className="h-10 w-auto"
              priority
              unoptimized
            />
            <span className="text-2xl font-extrabold hidden sm:block bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent drop-shadow-lg animate-pulse hover:animate-none transition-all duration-300 hover:scale-105">
              AMERSHOP!
            </span>
          </Link>

          {/* Search Bar - Centered */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 h-10"
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {session?.user ? (
              <>
                <div className="hidden md:block relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                  >
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                    <span className="hidden lg:inline text-sm">
                      {session.user.name || session.user.email}
                    </span>
                  </Button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-md shadow-lg z-50">
                      <div className="p-2">
                        <div className="px-3 py-2 text-sm border-b">
                          <p className="font-medium">{session.user.name}</p>
                          <p className="text-xs text-muted-foreground">{session.user.email}</p>
                        </div>
                        <Button
                          variant="ghost"
                          className="w-full justify-start mt-2"
                          onClick={handleSignOut}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign Out
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </Button>
              </>
            ) : (
              <>
                <Link href="/signin" className="hidden md:block">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup" className="hidden md:block">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cart.itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                    {cart.itemCount > 99 ? "99+" : cart.itemCount}
                  </span>
                )}
                <span className="sr-only">Shopping cart</span>
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 h-10"
            />
          </div>
        </div>

        {/* Navigation Menu - Centered */}
        <nav className="hidden md:flex items-center justify-center h-14 border-t">
          <ul className="flex items-center space-x-8">
            <li>
              <Link
                href="/refurbished"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Refurbished
              </Link>
            </li>
            {categories.map((category) => (
              <li 
                key={category.name}
                className="relative group"
                onMouseEnter={() => {
                  if (category.submenu) {
                    if (category.name === "Electronics") {
                      setElectronicsSubmenuOpen(true);
                    } else if (category.name === "Home & Garden") {
                      setHomeGardenSubmenuOpen(true);
                    }
                  }
                }}
                onMouseLeave={() => {
                  if (category.name === "Electronics") {
                    setElectronicsSubmenuOpen(false);
                  } else if (category.name === "Home & Garden") {
                    setHomeGardenSubmenuOpen(false);
                  }
                }}
              >
                {category.submenu ? (
                  <>
                    <Link
                      href={category.href}
                      className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1"
                    >
                      {category.name}
                      <ChevronDown className="h-4 w-4" />
                    </Link>
                    {((category.name === "Electronics" && electronicsSubmenuOpen) ||
                      (category.name === "Home & Garden" && homeGardenSubmenuOpen)) && (
                      <div 
                        className="absolute top-full left-0 pt-2 w-48 z-50"
                        onMouseEnter={() => {
                          if (category.name === "Electronics") {
                            setElectronicsSubmenuOpen(true);
                          } else if (category.name === "Home & Garden") {
                            setHomeGardenSubmenuOpen(true);
                          }
                        }}
                        onMouseLeave={() => {
                          if (category.name === "Electronics") {
                            setElectronicsSubmenuOpen(false);
                          } else if (category.name === "Home & Garden") {
                            setHomeGardenSubmenuOpen(false);
                          }
                        }}
                      >
                        <div className="bg-popover border border-border rounded-md shadow-lg">
                          <ul className="py-2">
                            {category.submenu.map((item) => (
                              <li key={item.name}>
                                <Link
                                  href={item.href}
                                  className="block px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-primary transition-colors"
                                >
                                  {item.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={category.href}
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {category.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t py-4">
            <ul className="flex flex-col space-y-2">
              <li>
                <Link
                  href="/refurbished"
                  className="block px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Refurbished
                </Link>
              </li>
              {categories.map((category) => (
                <li key={category.name}>
                  <Link
                    href={category.href}
                    className="block px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                  {category.submenu && (
                    <ul className="ml-4 mt-1 space-y-1">
                      {category.submenu.map((item) => (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
              {!session?.user && (
                <>
                  <li>
                    <Link
                      href="/signin"
                      className="block px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/signup"
                      className="block px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
              {session?.user && (
                <li>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
                  >
                    Sign Out
                  </button>
                </li>
              )}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}

