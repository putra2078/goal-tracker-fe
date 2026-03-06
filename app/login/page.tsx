"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn, Github, Mail, Lock, AlertCircle } from "lucide-react";
import api from "../../lib/axios";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await api.post("/login", { email, password });

            if (response.data?.access_token) {
                localStorage.setItem("token", response.data.access_token);
            }

            router.push("/");
        } catch (err: any) {
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError("An error occurred during login. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 glass p-8 md:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-accent-purple/20 rounded-full blur-3xl" />

                <div className="text-center space-y-2 relative z-10">
                    <h1 className="text-4xl font-black tracking-tight text-foreground">Welcome Back</h1>
                    <p className="text-secondary font-medium">Log in to track your progress</p>
                </div>

                <form className="space-y-6 relative z-10" onSubmit={handleLogin}>
                    {error && (
                        <div className="bg-red-500/10 text-red-500 border border-red-500/20 p-3 rounded-xl flex items-center gap-2 text-sm font-medium">
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold ml-1 text-foreground">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-disabled group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                    className="w-full bg-background border border-border rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-disabled font-medium disabled:opacity-50"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-bold text-foreground">Password</label>
                                <Link href="#" className="text-xs font-bold text-primary hover:underline">Forgot password?</Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-disabled group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                    className="w-full bg-background border border-border rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-disabled font-medium disabled:opacity-50"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full premium-gradient text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100 disabled:active:scale-100"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Signing in...
                            </span>
                        ) : (
                            <>
                                <LogIn size={20} /> Sign In
                            </>
                        )}
                    </button>
                </form>

                <div className="relative z-10 space-y-6">
                    <div className="relative flex items-center">
                        <div className="flex-grow border-t border-divider"></div>
                        <span className="flex-shrink mx-4 text-disabled text-xs font-bold uppercase tracking-widest">Or continue with</span>
                        <div className="flex-grow border-t border-divider"></div>
                    </div>

                    <button className="w-full bg-foreground text-background font-bold py-4 rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                        <Github size={20} /> GitHub
                    </button>

                    <p className="text-center text-sm text-secondary">
                        Don&apos;t have an account? <Link href="#" className="text-primary font-bold hover:underline">Sign up for free</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
