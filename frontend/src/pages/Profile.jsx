import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { getUserFromToken, removeToken } from '../lib/auth';
import { ArrowLeft, User, Mail, Shield, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            // First decode from token to get basic display info immediately
            const decoded = getUserFromToken();

            // Then fetch full detail from backend
            const response = await api.get('/api/user/profile');
            setUser({ ...decoded, ...response.data });
        } catch (err) {
            console.error(err);
            // Fallback to token data if profile endpoint fails
            setUser(getUserFromToken());
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        removeToken();
        navigate('/login');
    };

    if (isLoading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading Profile...</div>;

    const displayRole = () => {
        const r = user?.role || user?.roles || user?.authorities || 'USER';
        return Array.isArray(r) ? r[0] : r;
    };

    return (
        <div className="min-h-screen bg-slate-950 p-6 lg:p-12 text-slate-50">
            <header className="mb-8 flex items-center justify-between max-w-3xl mx-auto">
                <button onClick={() => navigate(-1)} className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors text-slate-400 hover:text-white">
                    <ArrowLeft size={20} />
                </button>
                <button onClick={handleLogout} className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 rounded-xl transition-colors font-medium flex items-center gap-2">
                    <LogOut size={16} /> Logout
                </button>
            </header>

            <div className="max-w-3xl mx-auto glass p-8 sm:p-12 rounded-3xl border border-white/5 space-y-8">
                <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-white/10">
                    <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-full flex items-center justify-center text-3xl font-bold shadow-lg shadow-blue-500/25">
                        {user?.name?.[0]?.toUpperCase() || user?.sub?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="text-center sm:text-left">
                        <h1 className="text-3xl font-bold mb-1">{user?.name || 'Instructor'}</h1>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider rounded-full border border-blue-500/20 mt-2">
                            <Shield size={12} /> {displayRole()}
                        </span>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-lg font-medium text-slate-200">Account Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-900/50 rounded-xl border border-white/5 flex items-start gap-4">
                            <User className="text-slate-400 mt-0.5" size={20} />
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Full Name</p>
                                <p className="text-slate-200">{user?.name || 'Not provided'}</p>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-900/50 rounded-xl border border-white/5 flex items-start gap-4">
                            <Mail className="text-slate-400 mt-0.5" size={20} />
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Email Address</p>
                                <p className="text-slate-200">{user?.email || user?.sub}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <Link to="/report-bug" className="text-sm text-slate-400 hover:text-white transition-colors underline underline-offset-4">
                        Report a Platform Bug
                    </Link>
                </div>
            </div>
        </div>
    );
};
