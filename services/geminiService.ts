import { GoogleGenAI, Type } from "@google/genai";
import { Task, Priority } from '../types';

const API_KEY = process.env.API_KEY;

const prioritySchema = {
    type: Type.OBJECT,
    properties: {
        priority: {
            type: Type.STRING,
            enum: [Priority.High, Priority.Medium, Priority.Low],
            description: "The priority of the task."
        }
    },
    required: ["priority"]
};

export const getTaskPriority = async (task: Omit<Task, 'id' | 'priority' | 'time'>): Promise<Priority> => {
    if (!API_KEY) {
        console.warn("API_KEY environment variable not set. AI functionality is disabled. Returning Medium priority as default.");
        return Priority.Medium;
    }

    const ai = new GoogleGenAI({ apiKey: API_KEY });
    
    const prompt = `
        Analyze the following task and determine its priority level (High, Medium, or Low). 
        Consider the title, description, and deadline.
        - High priority is for urgent, important tasks, especially with a close deadline.
        - Medium priority is for important but not immediately urgent tasks.
        - Low priority is for tasks that are not time-sensitive or critical.
        
        Task Details:
        - Title: ${task.title}
        - Description: ${task.description || 'No description provided.'}
        - Deadline: ${task.deadline || 'No deadline specified.'}
        - Category: ${task.category || 'No category specified.'}

        Respond ONLY with the determined priority in the specified JSON format.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: prioritySchema
            }
        });

        const jsonString = response.text.trim();
        const parsed = JSON.parse(jsonString);

        if (Object.values(Priority).includes(parsed.priority)) {
            return parsed.priority as Priority;
        } else {
            console.warn(`Gemini returned an invalid priority: ${parsed.priority}. Defaulting to Medium.`);
            return Priority.Medium;
        }

    } catch (error) {
        console.error("Error getting task priority from Gemini:", error);
        // Fallback to a default priority in case of an API error
        return Priority.Medium;
    }
};