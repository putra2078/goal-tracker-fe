"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const isLoginPage = pathname?.startsWith("/login");

        if (!token && !isLoginPage) {
            router.replace("/login");
        } else if (token && isLoginPage) {
            router.replace("/");
        } else {
            setIsChecking(false);
        }
    }, [pathname, router]);

    // Prevent rendering protected content while checking auth status
    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    return <>{children}</>;
}
