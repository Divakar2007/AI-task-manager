import React, { useState, useEffect } from 'react';
import { Task } from './types';
import Header from './components/Header';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import SetupGuide from './components/SetupGuide';
import { getTaskPriority } from './services/geminiService';

const getNextAvailableTime = (existingTasks: Task[]): string | undefined => {
    const START_HOUR = 17; // 5 PM
    const END_HOUR = 22;   // 10 PM
    const assignedTimes = new Set(existingTasks.map(task => task.time).filter(Boolean));

    for (let hour = START_HOUR; hour < END_HOUR; hour++) {
        const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
        if (!assignedTimes.has(timeSlot)) {
            return timeSlot;
        }
    }

    return undefined; // All slots are booked
};


const App: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSetupGuideOpen, setIsSetupGuideOpen] = useState(false);
    
    // Load tasks from localStorage on initial load.
    // Also, check if it's a new day to clear the tasks.
    useEffect(() => {
        try {
            const lastClearDate = localStorage.getItem('lastClearDate');
            const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

            if (lastClearDate !== today) {
                // It's a new day, clear the tasks for a fresh start.
                setTasks([]);
                localStorage.setItem('lastClearDate', today);
            } else {
                // It's the same day, load existing tasks.
                const storedTasks = localStorage.getItem('tasks');
                if (storedTasks) {
                    setTasks(JSON.parse(storedTasks));
                }
            }
        } catch (e) {
            console.error("Failed to load tasks from local storage", e);
        }
    }, []);

    // Save tasks to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        } catch (e) {
            console.error("Failed to save tasks to local storage", e);
        }
    }, [tasks]);


    const handleFormSubmit = async (taskData: Omit<Task, 'id' | 'priority' | 'time'>, id?: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const priority = await getTaskPriority(taskData);

            if (id) { // Editing an existing task
                const taskToUpdate = tasks.find(t => t.id === id);
                if (!taskToUpdate) throw new Error("Task not found");
                
                const updatedTask: Task = { ...taskToUpdate, ...taskData, priority };
                setTasks(tasks.map(t => (t.id === id ? updatedTask : t)));

            } else { // Adding a new task
                const newTime = getNextAvailableTime(tasks);
                const newTask: Task = {
                    id: crypto.randomUUID(),
                    ...taskData,
                    priority,
                    time: newTime,
                };
                setTasks([...tasks, newTask]);
            }

        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
            console.error(err);
        } finally {
            setIsLoading(false);
            setIsFormOpen(false);
            setEditingTask(null);
        }
    };

    const handleEdit = (task: Task) => {
        setEditingTask(task);
        setIsFormOpen(true);
    };

    const handleDelete = (id: string) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    const openAddTaskForm = () => {
        setEditingTask(null);
        setIsFormOpen(true);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
            <Header
                onOpenSetupGuide={() => setIsSetupGuideOpen(true)}
            />
            <main className="container mx-auto p-4 md:p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Today's Tasks</h1>
                    <button
                        onClick={openAddTaskForm}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
                    >
                        + Add Task
                    </button>
                </div>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                {isLoading && (
                     <div className="fixed inset-0 bg-slate-900 bg-opacity-50 flex items-center justify-center z-50">
                        <div className="flex flex-col items-center bg-white dark:bg-slate-800 p-8 rounded-lg shadow-xl">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                            <p className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-300">Processing...</p>
                        </div>
                    </div>
                )}

                <TaskList tasks={tasks} onEdit={handleEdit} onDelete={handleDelete} />
                
                {isFormOpen && (
                    <TaskForm
                        onSubmit={handleFormSubmit}
                        onClose={() => { setIsFormOpen(false); setEditingTask(null); }}
                        task={editingTask}
                    />
                )}

                {isSetupGuideOpen && (
                    <SetupGuide onClose={() => setIsSetupGuideOpen(false)} />
                )}
            </main>
        </div>
    );
};

export default App;