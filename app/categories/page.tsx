"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, LayoutGrid, ListTodo, Calendar, Palette, HeartPulse, Wallet, GraduationCap, Loader2 } from "lucide-react";
import { CreateCategoryModal } from "@/components/CreateModals";
import { EditCategoryModal } from "@/components/EditModals";
import Dropdown from "@/components/Dropdown";
import api from "@/lib/axios";
import { Category } from "@/lib/types";

// Helper to map backend colors or generic categories to icons
const getCategoryIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("work")) return LayoutGrid;
    if (n.includes("health")) return HeartPulse;
    if (n.includes("finan")) return Wallet;
    if (n.includes("learn")) return GraduationCap;
    return Palette;
};

const getCategoryColor = (index: number) => {
    const colors = ["bg-blue-500", "bg-purple-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500"];
    return colors[index % colors.length];
};

export default function CategoryPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const fetchCategories = useCallback(async () => {
        try {
            const response = await api.get("/category/");
            setCategories(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setIsEditModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this category?")) return;
        try {
            await api.delete(`/category/${id}`);
            fetchCategories();
        } catch (error) {
            console.error("Failed to delete category:", error);
        }
    };

    return (
        <div className="space-y-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-foreground">Categories</h1>
                    <p className="text-secondary mt-2">Organize your goals into meaningful groups.</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl premium-gradient text-white font-semibold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all outline-none"
                >
                    <Plus size={20} />
                    Add Category
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : (
                    categories.map((cat, index) => {
                        const Icon = getCategoryIcon(cat.name);
                        const colorClass = getCategoryColor(index);
                        const goalCount = cat.goals?.length || 0;
                        const taskCount = cat.goals?.reduce((acc, goal) => acc + (goal.tasks?.length || 0), 0) || 0;
                        const completedTaskCount = cat.goals?.reduce((acc, goal) => acc + (goal.tasks?.filter(t => t.status === 'completed').length || 0), 0) || 0;
                        const progress = taskCount > 0 ? Math.round((completedTaskCount / taskCount) * 100) : 0;

                        return (
                            <div key={cat.id} className="glass p-6 rounded-[2rem] group hover:scale-[1.02] transition-all duration-300 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <Dropdown
                                        onEdit={() => handleEdit(cat)}
                                        onDelete={() => handleDelete(cat.id)}
                                    />
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className={`p-4 rounded-2xl ${colorClass} text-white shadow-lg`}>
                                        <Icon size={24} />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-bold text-foreground">{cat.name}</h3>
                                        <div className="flex items-center gap-3 text-sm text-secondary">
                                            <span className="flex items-center gap-1">
                                                <ListTodo size={14} />
                                                {goalCount} Goals
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar size={14} />
                                                {taskCount} Tasks
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 space-y-3">
                                    <div className="h-2 w-full bg-foreground/5 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${colorClass} rounded-full transition-all duration-1000`}
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-xs font-medium text-disabled font-mono">
                                        <span>PROGRESS</span>
                                        <span>{progress}%</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}

                {/* New Category Placeholder */}
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="border-2 border-dashed border-divider rounded-[2rem] p-8 flex flex-col items-center justify-center gap-4 text-disabled hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 group"
                >
                    <div className="p-4 rounded-full bg-foreground/5 group-hover:bg-primary/10 transition-colors">
                        <Plus size={32} />
                    </div>
                    <span className="font-semibold">New Category</span>
                </button>
            </div>

            <CreateCategoryModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={fetchCategories}
            />
            <EditCategoryModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setEditingCategory(null);
                }}
                onSuccess={fetchCategories}
                data={editingCategory}
            />
        </div>
    );
}
