
import React from 'react';
import { Task, Priority } from '../types';
import { EditIcon, DeleteIcon, CalendarIcon, ClockIcon } from './icons';

interface TaskItemProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, onDelete }) => {
    const getPriorityBorderClass = () => {
        switch (task.priority) {
            case Priority.High: return 'border-l-4 border-red-500';
            case Priority.Medium: return 'border-l-4 border-yellow-500';
            case Priority.Low: return 'border-l-4 border-green-500';
            default: return 'border-l-4 border-slate-400';
        }
    };

    return (
        <div className={`bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md flex items-start justify-between space-x-4 transition-shadow hover:shadow-lg ${getPriorityBorderClass()}`}>
            <div className="flex-1">
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{task.title}</h3>
                {task.description && <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{task.description}</p>}
                <div className="flex items-center flex-wrap gap-x-4 gap-y-2 mt-3 text-xs text-slate-500 dark:text-slate-400">
                    {task.time && (
                        <div className="flex items-center space-x-1">
                           <ClockIcon/>
                           <span>{task.time}</span>
                        </div>
                    )}
                    {task.deadline && (
                        <div className="flex items-center space-x-1">
                           <CalendarIcon/>
                           <span>{new Date(task.deadline + 'T00:00:00').toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                    )}
                    {task.category && <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 px-2 py-1 rounded-full font-medium">{task.category}</span>}
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <button onClick={() => onEdit(task)} className="p-2 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <EditIcon />
                </button>
                <button onClick={() => onDelete(task.id)} className="p-2 text-slate-500 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <DeleteIcon />
                </button>
            </div>
        </div>
    );
};

export default TaskItem;