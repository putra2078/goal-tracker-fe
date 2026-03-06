"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
            <div
                className="glass w-full max-w-lg rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-zoom-in"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-8 pb-4">
                    <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-foreground/40 hover:text-foreground"
                    >
                        <X size={24} />
                    </button>
                </div>
                <div className="p-8 pt-0">
                    {children}
                </div>
            </div>
        </div>
    );
}
