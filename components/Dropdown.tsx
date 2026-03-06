"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical, Edit3, Trash2 } from "lucide-react";

interface DropdownProps {
    onEdit: () => void;
    onDelete: () => void;
    align?: "left" | "right";
}

export default function Dropdown({ onEdit, onDelete, align = "right" }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const alignmentClass = align === "right" ? "right-0" : "left-0";

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-foreground/40 hover:text-foreground"
            >
                <MoreVertical size={18} />
            </button>

            {isOpen && (
                <div
                    className={`absolute ${alignmentClass} mt-2 w-48 glass rounded-2xl shadow-xl z-50 overflow-hidden animate-fade-in origin-top-right`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-2 space-y-1">
                        <button
                            onClick={() => {
                                onEdit();
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/10 text-sm font-medium transition-colors text-foreground/70 hover:text-foreground"
                        >
                            <Edit3 size={16} />
                            Edit
                        </button>
                        <button
                            onClick={() => {
                                onDelete();
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-red-500/10 text-sm font-medium transition-colors text-red-500 hover:text-red-400"
                        >
                            <Trash2 size={16} />
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
