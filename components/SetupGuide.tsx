import React from 'react';

interface SetupGuideProps {
    onClose: () => void;
}

const SetupGuide: React.FC<SetupGuideProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] relative">
                <div className="p-6 border-b dark:border-slate-700">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Application Setup Guide</h2>
                     <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    <p className="mb-4 text-slate-600 dark:text-slate-300">
                        This application requires a Gemini API key for its AI prioritization feature to function. Follow these steps to get everything running.
                        In this special environment, the `API_KEY` for Gemini is pre-configured. For local development, you'll need to set up your own key.
                    </p>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-100">Step 1: Get Your Gemini API Key</h3>
                            <ol className="list-decimal list-inside space-y-2 text-slate-600 dark:text-slate-400">
                                <li>Go to the <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline">Google AI Studio</a>.</li>
                                <li>Click on <strong>"Get API key"</strong> and then <strong>"Create API key"</strong>.</li>
                                <li>Copy the generated key.</li>
                                <li>For local development, store this key in an environment variable named `API_KEY` (or `VITE_API_KEY` if using a Vite project):
                                    <pre className="bg-slate-100 dark:bg-slate-700 p-2 rounded-md mt-2 text-sm"><code># In a .env.local file
API_KEY="YOUR_GEMINI_API_KEY"</code></pre>
                                </li>
                            </ol>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-100">Step 2: Run the App</h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                Once your environment variable is set up, you can run the application. The app will automatically pick it up.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t dark:border-slate-700 text-right">
                     <button onClick={onClose} className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 shadow-sm">Got it!</button>
                </div>
            </div>
        </div>
    );
};

export default SetupGuide;