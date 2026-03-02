import React, { useState } from 'react';
import { api } from '../api/client';
import { Send, AlertTriangle, Bug, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ReportBug = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess(false);

        try {
            await api.post('/api/report-bug', { title, description });
            setSuccess(true);
            setTitle('');
            setDescription('');
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit bug report.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-50 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-[10%] left-[20%] w-[30%] h-[40%] rounded-full bg-red-600/10 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[10%] right-[20%] w-[40%] h-[30%] rounded-full bg-orange-600/10 blur-[100px] pointer-events-none" />

            <div className="w-full max-w-lg z-10 glass p-8 sm:p-12 rounded-3xl border border-white/5 space-y-8">
                <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                        <Bug className="text-red-400" size={32} />
                    </div>
                    <h1 className="text-3xl font-bold">Report an Issue</h1>
                    <p className="text-slate-400">Help us improve the platform by reporting bugs directly to the admin team.</p>
                </div>

                {success && (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-center font-medium">
                        Bug reported successfully! Thank you for your feedback.
                    </div>
                )}

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-start gap-3 text-sm">
                        <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Issue Title</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                            placeholder="e.g. Cannot evaluate student 5 in Exam 10"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Detailed Description</label>
                        <textarea
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 min-h-[150px]"
                            placeholder="Please describe exactly what happened and any steps to reproduce the issue..."
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-colors border border-white/5"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !title || !description}
                            className="w-full py-3 px-4 bg-red-600 hover:bg-red-500 text-white font-medium rounded-xl shadow-lg shadow-red-500/25 transition-all duration-300 flex items-center justify-center disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18} className="mr-2" /> Submit Report</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
