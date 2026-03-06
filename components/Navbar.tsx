"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Target, LogIn } from "lucide-react";

const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Categories", href: "/categories", icon: LayoutGrid },
    { name: "Goals", href: "/goals", icon: Target },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4">
            <div className="glass flex items-center gap-2 rounded-full px-6 py-3 shadow-lg">
                {navLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${isActive
                                    ? "premium-gradient text-white shadow-md"
                                    : "hover:bg-foreground/5 text-foreground/70 hover:text-foreground"
                                }`}
                        >
                            <Icon size={18} />
                            <span className="text-sm font-medium hidden md:block">{link.name}</span>
                        </Link>
                    );
                })}
                <div className="w-px h-6 bg-divider mx-2" />
                <Link
                    href="/login"
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${pathname === "/login"
                            ? "premium-gradient text-white shadow-md"
                            : "hover:bg-foreground/5 text-foreground/70 hover:text-foreground"
                        }`}
                >
                    <LogIn size={18} />
                    <span className="text-sm font-medium hidden md:block">Login</span>
                </Link>
            </div>
        </nav>
    );
}
