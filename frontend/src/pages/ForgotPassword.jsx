import React, { useState } from 'react';
import { api } from '../api/client';
import { Mail, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            await api.post('/api/auth/forgot-password', { email });
            setMessage('If an account exists for this email, we have sent password reset instructions.');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-50 relative">
            <div className="absolute top-[10%] left-[20%] w-[30%] h-[40%] rounded-full bg-blue-600/10 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[10%] right-[20%] w-[40%] h-[30%] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />

            <div className="w-full max-w-md z-10 glass p-8 sm:p-10 rounded-3xl border border-white/5 space-y-6">
                <Link to="/login" className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft size={16} className="mr-2" /> Back to Login
                </Link>

                <div className="space-y-2 pt-2">
                    <h1 className="text-3xl font-bold">Reset Password</h1>
                    <p className="text-slate-400">Enter your email address to receive password reset instructions.</p>
                </div>

                {message && (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-start gap-3 text-sm font-medium">
                        <CheckCircle size={18} className="shrink-0 mt-0.5" />
                        <span>{message}</span>
                    </div>
                )}

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail size={18} className="text-slate-500" />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                placeholder="name@university.edu"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !email}
                        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-300 flex items-center justify-center disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Send Reset Link'}
                    </button>
                </form>
            </div>
        </div>
    );
};
