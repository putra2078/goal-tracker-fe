"use client";

import { useState, useEffect } from "react";
import { Tag, Target, Calendar, Info, Loader2 } from "lucide-react";
import Modal from "./Modal";
import api from "@/lib/axios";
import { Category, Goal, Task } from "@/lib/types";

interface BaseEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export function EditCategoryModal({ isOpen, onClose, onSuccess, data }: BaseEditModalProps & { data: Category | null }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (data) {
            setName(data.name || "");
            setDescription(data.description || "");
        }
    }, [data, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!data) return;
        setLoading(true);
        setError(null);

        try {
            await api.put(`/category/${data.id}`, { name, description });
            onSuccess?.();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Category">
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                    {error && (
                        <p className="text-red-500 text-sm font-medium px-1">{error}</p>
                    )}
                    <div className="space-y-2">
                        <label className="text-sm font-medium ml-1 text-foreground">Category Name</label>
                        <div className="relative group">
                            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-disabled group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Personal, Work, Fitness"
                                required
                                disabled={loading}
                                className="w-full bg-background border border-border rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-disabled disabled:opacity-50"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium ml-1 text-foreground">Description</label>
                        <div className="relative group">
                            <Info className="absolute left-4 top-4 text-disabled group-focus-within:text-primary transition-colors" size={18} />
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="What is this category for?"
                                rows={3}
                                disabled={loading}
                                className="w-full bg-background border border-border rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-disabled disabled:opacity-50 resize-none"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={loading || !name}
                        className="flex-1 premium-gradient text-white font-semibold py-4 rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:scale-100"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Updating...
                            </span>
                        ) : "Update Category"}
                    </button>
                    <button type="button" onClick={onClose} className="px-6 py-4 rounded-2xl bg-foreground/5 hover:bg-foreground/10 font-medium transition-all text-foreground">
                        Cancel
                    </button>
                </div>
            </form>
        </Modal>
    );
}

export function EditGoalModal({ isOpen, onClose, onSuccess, data }: BaseEditModalProps & { data: Goal | null }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            api.get("/category/").then(res => setCategories(res.data));
        }
    }, [isOpen]);

    useEffect(() => {
        if (data) {
            setTitle(data.title || "");
            setDescription(data.description || "");
            setCategoryId(data.category_id || "");
        }
    }, [data, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!data) return;
        setLoading(true);
        setError(null);

        try {
            await api.put(`/goal/${data.id}`, { title, description, category_id: categoryId });
            onSuccess?.();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Goal">
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                    {error && (
                        <p className="text-red-500 text-sm font-medium px-1">{error}</p>
                    )}
                    <div className="space-y-2">
                        <label className="text-sm font-medium ml-1 text-foreground">Goal Title</label>
                        <div className="relative group">
                            <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-disabled group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="What do you want to achieve?"
                                required
                                disabled={loading}
                                className="w-full bg-background border border-border rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-disabled disabled:opacity-50"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium ml-1 text-foreground">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Details about this goal..."
                            rows={3}
                            disabled={loading}
                            className="w-full bg-background border border-border rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none text-foreground placeholder:text-disabled disabled:opacity-50"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium ml-1 text-foreground">Category</label>
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            disabled={loading}
                            className="w-full bg-background border border-border rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer text-foreground disabled:opacity-50"
                        >
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={loading || !title || !categoryId}
                        className="flex-1 premium-gradient text-white font-semibold py-4 rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:scale-100"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Updating...
                            </span>
                        ) : "Update Goal"}
                    </button>
                    <button type="button" onClick={onClose} className="px-6 py-4 rounded-2xl bg-foreground/5 hover:bg-foreground/10 font-medium transition-all text-foreground">
                        Cancel
                    </button>
                </div>
            </form>
        </Modal>
    );
}

export function EditTaskModal({ isOpen, onClose, onSuccess, data }: BaseEditModalProps & { data: Task | null }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (data) {
            setTitle(data.title || "");
            setDescription(data.description || "");
            if (data.due_date) {
                // Backend returns d-M-Y, need Y-m-d for <input type="date">
                try {
                    const [d, m, y] = data.due_date.split('-');
                    setDueDate(`${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`);
                } catch (e) {
                    setDueDate("");
                }
            }
        }
    }, [data, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!data) return;
        setLoading(true);
        setError(null);

        // API expects d-M-Y format
        const dateObj = new Date(dueDate);
        const formattedDate = `${dateObj.getDate()}-${dateObj.getMonth() + 1}-${dateObj.getFullYear()}`;

        try {
            await api.put(`/task/${data.id}`, {
                goals_id: data.goals_id,
                title,
                description,
                status: data.status,
                due_date: formattedDate
            });
            onSuccess?.();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Task">
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                    {error && (
                        <p className="text-red-500 text-sm font-medium px-1">{error}</p>
                    )}
                    <div className="space-y-2">
                        <label className="text-sm font-medium ml-1 text-foreground">Task Name</label>
                        <div className="relative group">
                            <Info className="absolute left-4 top-1/2 -translate-y-1/2 text-disabled group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Task description..."
                                required
                                disabled={loading}
                                className="w-full bg-background border border-border rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-disabled disabled:opacity-50"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium ml-1 text-foreground">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add more details..."
                            rows={3}
                            disabled={loading}
                            className="w-full bg-background border border-border rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none text-foreground placeholder:text-disabled disabled:opacity-50"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium ml-1 text-foreground">Due Date</label>
                        <div className="relative group">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-disabled group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                required
                                disabled={loading}
                                className="w-full bg-background border border-border rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground disabled:opacity-50"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={loading || !title || !dueDate}
                        className="flex-1 premium-gradient text-white font-semibold py-4 rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:scale-100"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Updating...
                            </span>
                        ) : "Update Task"}
                    </button>
                    <button type="button" onClick={onClose} className="px-6 py-4 rounded-2xl bg-foreground/5 hover:bg-foreground/10 font-medium transition-all text-foreground">
                        Cancel
                    </button>
                </div>
            </form>
        </Modal>
    );
}
