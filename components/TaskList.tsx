
import React, { useMemo } from 'react';
import { Task, Priority } from '../types';
import TaskItem from './TaskItem';

interface TaskListProps {
    tasks: Task[];
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onEdit, onDelete }) => {
    const groupedTasks = useMemo(() => {
        const initialGroups: { [key in Priority]: Task[] } = {
            [Priority.High]: [],
            [Priority.Medium]: [],
            [Priority.Low]: [],
        };

        const grouped = tasks.reduce((acc, task) => {
            acc[task.priority] = acc[task.priority] || [];
            acc[task.priority].push(task);
            return acc;
        }, initialGroups);

        // Sort tasks within each group by time
        for (const key in grouped) {
            const priorityKey = key as Priority;
            grouped[priorityKey].sort((a, b) => {
                if (!a.time && !b.time) return 0;
                if (!a.time) return 1; // Tasks without a time go to the end
                if (!b.time) return -1;
                return a.time.localeCompare(b.time);
            });
        }

        return grouped;
    }, [tasks]);

    const priorityOrder = [Priority.High, Priority.Medium, Priority.Low];

    if (tasks.length === 0) {
        return (
            <div className="text-center py-16 px-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
                <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-slate-900 dark:text-white">No tasks yet</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Get started by adding a new task.</p>
            </div>
        );
    }
    
    return (
        <div className="space-y-8">
            {priorityOrder.map(priority => {
                const tasksInGroup = groupedTasks[priority];
                if (tasksInGroup.length === 0) return null;

                const getPriorityClass = () => {
                    switch (priority) {
                        case Priority.High: return { border: 'border-red-500', text: 'text-red-500' };
                        case Priority.Medium: return { border: 'border-yellow-500', text: 'text-yellow-500' };
                        case Priority.Low: return { border: 'border-green-500', text: 'text-green-500' };
                        default: return { border: 'border-slate-500', text: 'text-slate-500' };
                    }
                };
                const priorityClass = getPriorityClass();

                return (
                    <div key={priority}>
                        <h2 className={`text-xl font-semibold mb-3 flex items-center ${priorityClass.text}`}>
                             <span className={`w-3 h-3 rounded-full mr-2 ${priorityClass.border.replace('border-', 'bg-')}`}></span>
                             {priority} Priority
                        </h2>
                        <div className="space-y-3">
                            {tasksInGroup.map(task => (
                                <TaskItem key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default TaskList;