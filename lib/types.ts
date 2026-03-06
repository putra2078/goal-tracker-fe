export interface Category {
    id: string;
    name: string;
    description?: string;
    progress: number;
    created_at: string;
    updated_at: string;
    goals?: Goal[];
}

export interface Goal {
    id: string;
    category_id: string;
    title: string;
    description: string;
    progress: number;
    created_at: string;
    updated_at: string;
    tasks?: Task[];
}

export interface Task {
    id: string;
    goals_id: string;
    title: string;
    description: string;
    status: 'pending' | 'completed' | 'in_progress';
    due_date: string;
    created_at: string;
    updated_at: string;
}
