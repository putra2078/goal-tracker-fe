"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, Tag, AlignLeft, CheckCircle2, Circle, Loader2 } from "lucide-react";
import Modal from "./Modal";
import { Task } from "@/lib/types";
import api from "@/lib/axios";

interface TaskDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    task: Task | null;
}

const statusConfig = {
    "in_progress": { label: "In Progress", icon: Clock, className: "text-amber-500 bg-amber-500/10", border: "border-amber-500/20" },
    "pending": { label: "Pending", icon: Circle, className: "text-disabled bg-foreground/5", border: "border-border" },
    "completed": { label: "Completed", icon: CheckCircle2, className: "text-accent-green bg-accent-green/10", border: "border-accent-green/20" },
};

export default function TaskDetailModal({ isOpen, onClose, onSuccess, task }: TaskDetailModalProps) {
    const [currentStatus, setCurrentStatus] = useState<Task['status']>("pending");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (task) {
            setCurrentStatus(task.status);
        }
    }, [task, isOpen]);

    if (!task) return null;

    const activeStatus = statusConfig[currentStatus] || statusConfig["pending"];

    const handleUpdateStatus = async () => {
        setLoading(true);
        setError(null);
        try {
            await api.put(`/task/${task.id}`, {
                ...task,
                status: currentStatus
            });
            onSuccess?.();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to update status");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Task Details">
            <div className="space-y-6">
                {error && (
                    <p className="text-red-500 text-sm font-medium px-1">{error}</p>
                )}
                {/* Header with Title & Active Status */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <h3 className="text-3xl font-bold text-foreground">{task.title}</h3>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${activeStatus.className}`}>
                            <activeStatus.icon size={14} />
                            {activeStatus.label}
                        </div>
                    </div>

                    {/* Status Selector (Radio-style buttons) */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-disabled text-xs font-bold uppercase">
                            Update Status
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {Object.entries(statusConfig).map(([key, config]) => {
                                const Icon = config.icon;
                                const isActive = currentStatus === key;
                                return (
                                    <button
                                        key={key}
                                        onClick={() => setCurrentStatus(key as Task['status'])}
                                        disabled={loading}
                                        className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-300 gap-2 ${isActive
                                            ? `${config.className} ${config.border} scale-105 shadow-sm`
                                            : "bg-foreground/5 border-transparent text-disabled hover:bg-foreground/10"
                                            } disabled:opacity-50`}
                                    >
                                        <Icon size={20} />
                                        <span className="text-[10px] font-bold uppercase">{config.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="glass p-4 rounded-2xl space-y-1">
                        <div className="flex items-center gap-2 text-disabled text-xs font-bold uppercase">
                            <Calendar size={14} />
                            Due Date
                        </div>
                        <p className="font-semibold text-foreground">{task.due_date}</p>
                    </div>
                    <div className="glass p-4 rounded-2xl space-y-1">
                        <div className="flex items-center gap-2 text-disabled text-xs font-bold uppercase">
                            <Tag size={14} />
                            Category
                        </div>
                        <p className="font-semibold text-foreground">Goal ID: {task.goals_id}</p>
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-disabled text-xs font-bold uppercase">
                        <AlignLeft size={14} />
                        Description
                    </div>
                    <p className="text-secondary leading-relaxed bg-foreground/5 p-4 rounded-2xl min-h-[100px]">
                        {task.description || "No description provided."}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                    <button
                        onClick={handleUpdateStatus}
                        disabled={loading || currentStatus === task.status}
                        className="flex-1 px-6 py-3 rounded-2xl premium-gradient text-white font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                            </span>
                        ) : "Save Changes"}
                    </button>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-6 py-3 rounded-2xl bg-foreground/5 hover:bg-foreground/10 font-semibold transition-all text-foreground"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </Modal>
    );
}
