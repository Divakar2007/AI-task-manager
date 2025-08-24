export enum Priority {
    High = 'High',
    Medium = 'Medium',
    Low = 'Low',
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    deadline?: string; // YYYY-MM-DD
    category?: string;
    priority: Priority;
    time?: string; // e.g., "17:00"
}