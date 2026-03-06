"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, Plus, CheckCircle2, Circle, Clock, Search, Filter, Loader2 } from "lucide-react";
import Link from "next/link";
import TaskDetailModal from "@/components/TaskDetailModal";
import { CreateTaskModal } from "@/components/CreateModals";
import { EditTaskModal } from "@/components/EditModals";
import Dropdown from "@/components/Dropdown";
import api from "@/lib/axios";
import { Task, Goal } from "@/lib/types";

// initialTasks removed

export default function GoalTasksPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const [goal, setGoal] = useState<Goal | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const fetchTasks = useCallback(async () => {
        try {
            const [goalRes, tasksRes] = await Promise.all([
                api.get(`/goal/${id}`),
                api.get(`/task/goal/${id}`)
            ]);
            setGoal(goalRes.data);
            setTasks(Array.isArray(tasksRes.data) ? tasksRes.data : []);
        } catch (error) {
            console.error("Failed to fetch tasks/goal:", error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const statusConfig = {
        "in_progress": { icon: Clock, color: "text-amber-500" },
        "pending": { icon: Circle, color: "text-disabled" },
        "completed": { icon: CheckCircle2, color: "text-accent-green" },
    };

    const handleOpenDetail = (task: Task) => {
        setSelectedTask(task);
        setIsDetailOpen(true);
    };

    const handleEdit = (task: Task) => {
        setEditingTask(task);
        setIsEditOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this task?")) return;
        try {
            await api.delete(`/task/${id}`);
            fetchTasks();
        } catch (error) {
            console.error("Failed to delete task:", error);
        }
    };

    const toggleStatus = async (task: Task) => {
        const nextStatusMap: Record<string, string> = {
            "pending": "in_progress",
            "in_progress": "completed",
            "completed": "pending"
        };
        const nextStatus = nextStatusMap[task.status] || "pending";
        try {
            await api.put(`/task/${task.id}`, { ...task, status: nextStatus });
            fetchTasks();
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    return (
        <div className="space-y-8 py-8">
            {/* Header */}
            <div className="space-y-4">
                <Link href="/goals" className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors font-medium">
                    <ChevronLeft size={20} />
                    Back to Goals
                </Link>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-foreground">{goal?.title || "Loading..."}</h1>
                        <p className="text-secondary mt-2">
                            {tasks.length} {tasks.length === 1 ? 'Task' : 'Tasks'} • {tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100) : 0}% Completed
                        </p>
                    </div>
                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 rounded-2xl premium-gradient text-white font-semibold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                    >
                        <Plus size={20} />
                        New Task
                    </button>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-disabled" size={18} />
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        className="w-full bg-card border border-border rounded-2xl py-2.5 pl-11 pr-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm text-foreground placeholder:text-disabled"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-card border border-border text-secondary hover:text-foreground transition-all text-sm font-medium shadow-sm">
                    <Filter size={18} />
                    Filter
                </button>
            </div>

            {/* Task List */}
            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="text-center py-12 glass rounded-[2rem]">
                        <p className="text-secondary">No tasks yet. Break down your goal!</p>
                    </div>
                ) : (
                    tasks.map((task) => {
                        const statusEntry = statusConfig[task.status as keyof typeof statusConfig] || statusConfig["pending"];
                        const StatusIcon = statusEntry.icon;
                        const statusColor = statusEntry.color;

                        return (
                            <div
                                key={task.id}
                                className="glass p-5 rounded-[2rem] flex items-center justify-between group hover:border-primary/20 transition-all cursor-pointer shadow-sm"
                                onClick={() => handleOpenDetail(task)}
                            >
                                <div className="flex items-center gap-5">
                                    <button
                                        className={`p-1 rounded-full hover:bg-foreground/5 transition-colors ${statusColor}`}
                                        onClick={(e) => { e.stopPropagation(); toggleStatus(task); }}
                                    >
                                        <StatusIcon size={24} />
                                    </button>
                                    <div className="space-y-0.5">
                                        <h3 className={`font-bold text-foreground ${task.status === "completed" ? "line-through text-disabled" : ""}`}>
                                            {task.title}
                                        </h3>
                                        <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-disabled">
                                            <span className="text-secondary">{goal?.title}</span>
                                            <span>•</span>
                                            <span>{task.due_date}</span>
                                        </div>
                                    </div>
                                </div>

                                <div onClick={(e) => e.stopPropagation()}>
                                    <Dropdown
                                        onEdit={() => handleEdit(task)}
                                        onDelete={() => handleDelete(task.id)}
                                    />
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Modals */}
            <TaskDetailModal
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                onSuccess={fetchTasks}
                task={selectedTask}
            />
            <CreateTaskModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSuccess={fetchTasks}
                goalId={id}
            />
            <EditTaskModal
                isOpen={isEditOpen}
                onClose={() => {
                    setIsEditOpen(false);
                    setEditingTask(null);
                }}
                onSuccess={fetchTasks}
                data={editingTask}
            />
        </div>
    );
}
