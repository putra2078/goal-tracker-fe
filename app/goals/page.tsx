"use client";

import { useState, useEffect, useCallback } from "react";
import { Target, CheckCircle2, Circle, Clock, Filter, Search, Plus, Loader2, Tag } from "lucide-react";
import Link from "next/link";
import { CreateGoalModal } from "@/components/CreateModals";
import { EditGoalModal } from "@/components/EditModals";
import Dropdown from "@/components/Dropdown";
import api from "@/lib/axios";
import { Goal, Category } from "@/lib/types";

// Status helper
const getStatusConfig = (progress: number) => {
    if (progress === 100) return { label: "Completed", icon: CheckCircle2, className: "text-accent-green bg-accent-green/10" };
    if (progress > 0) return { label: "In Progress", icon: Clock, className: "text-amber-500 bg-amber-500/10" };
    return { label: "Pending", icon: Circle, className: "text-disabled bg-foreground/5" };
};

const getGoalColor = (goalId: string) => {
    const colors = ["text-primary", "text-accent-purple", "text-accent-green", "text-blue-400"];
    const bgs = ["bg-primary/10", "bg-accent-purple/10", "bg-accent-green/10", "bg-blue-400/10"];
    const index = goalId.length % colors.length;
    return { color: colors[index], bg: bgs[index] };
};

export default function GoalPage() {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [goalsRes, categoriesRes] = await Promise.all([
                api.get("/goal/"),
                api.get("/category/")
            ]);
            setGoals(Array.isArray(goalsRes.data) ? goalsRes.data : []);
            setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleEdit = (goal: Goal) => {
        setEditingGoal(goal);
        setIsEditModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this goal?")) return;
        try {
            await api.delete(`/goal/${id}`);
            fetchData();
        } catch (error) {
            console.error("Failed to delete goal:", error);
        }
    };

    const filteredGoals = goals.filter(g =>
        g.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8 py-8">
            {/* Header & Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-foreground">Your Goals</h1>
                    <p className="text-secondary mt-2">Break down your big goals into manageable tasks.</p>
                </div>

                <div className="flex items-center gap-3 overflow-x-auto pb-2 lg:pb-0">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-disabled" size={18} />
                        <input
                            type="text"
                            placeholder="Search goals..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-card border border-border rounded-2xl py-2.5 pl-11 pr-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm text-foreground placeholder:text-disabled"
                        />
                    </div>
                    <button className="p-2.5 rounded-2xl bg-card border border-border text-secondary hover:text-foreground transition-colors shadow-sm">
                        <Filter size={20} />
                    </button>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-2xl premium-gradient text-white font-semibold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all outline-none whitespace-nowrap"
                    >
                        <Plus size={20} />
                        New Goal
                    </button>
                </div>
            </div>

            {/* Goals List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : filteredGoals.length === 0 ? (
                    <div className="text-center py-12 glass rounded-[2rem]">
                        <p className="text-secondary">No goals found. Create one to get started!</p>
                    </div>
                ) : (
                    filteredGoals.map((goal) => {
                        const taskCount = goal.tasks?.length || 0;
                        const completedTasks = goal.tasks?.filter(t => t.status === 'completed').length || 0;
                        const progress = taskCount > 0 ? Math.round((completedTasks / taskCount) * 100) : 0;

                        const { label: statusLabel, icon: StatusIcon, className: statusClass } = getStatusConfig(progress);
                        const { color, bg } = getGoalColor(goal.id);
                        const categoryName = categories.find(c => c.id === goal.category_id)?.name || "Uncategorized";

                        return (
                            <Link
                                key={goal.id}
                                href={`/goals/${goal.id}/tasks`}
                                className="glass p-5 md:p-6 rounded-[2rem] flex flex-col md:flex-row md:items-center gap-6 group hover:border-primary/20 transition-colors cursor-pointer block relative"
                            >
                                <div className={`p-4 rounded-2xl ${bg} ${color} hidden md:block`}>
                                    <Target size={28} />
                                </div>

                                <div className="flex-1 space-y-4 md:space-y-0">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="text-xl font-bold text-foreground">{goal.title}</h3>
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusClass}`}>
                                                    {statusLabel}
                                                </span>
                                                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-foreground/5 text-secondary border border-border">
                                                    <Tag size={10} />
                                                    {categoryName}
                                                </span>
                                            </div>
                                            <p className="text-sm text-secondary flex items-center gap-2">
                                                <span>{goal.description}</span>
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="text-right hidden sm:block">
                                                <p className="text-[10px] text-disabled font-bold uppercase mb-1">Tasks</p>
                                                <p className="font-bold text-foreground">{completedTasks}/{taskCount}</p>
                                            </div>
                                            <div onClick={(e) => e.stopPropagation()}>
                                                <Dropdown
                                                    onEdit={() => handleEdit(goal)}
                                                    onDelete={() => handleDelete(goal.id)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 pt-2">
                                        <div className="flex justify-between text-[11px] font-bold mb-1">
                                            <span className="text-disabled uppercase">Overall Progress</span>
                                            <span className="text-primary">{progress}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-foreground/5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full premium-gradient rounded-full transition-all duration-1000 ease-out"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })
                )}
            </div>

            <CreateGoalModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={fetchData}
            />
            <EditGoalModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setEditingGoal(null);
                }}
                onSuccess={fetchData}
                data={editingGoal}
            />
        </div>
    );
}
