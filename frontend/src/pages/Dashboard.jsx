import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Users, FileText, CheckCircle, AlertTriangle, Search, Activity, Upload } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Dashboard = () => {
    const [stats, setStats] = useState({ totalTests: 0, exams: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/api/instructor/dashboard');
            // Expected shape: { totalTests: number, exams: array of exams }
            setStats(response.data);
        } catch (err) {
            console.error('Failed to fetch dashboard data:', err);
            // Defaulting to mock if real API not available, but user said NO MOCK, just endpoints.
            // Still we need a safe fallback empty state
            setStats({ totalTests: 0, exams: [] });
            setError('Failed to load dashboard data. Ensure the backend is running.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading Dashboard...</div>;
    }

    return (
        <div className="min-h-screen bg-slate-950 p-6 lg:p-12 text-slate-50">
            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Instructor Dashboard</h1>
                    <p className="text-slate-400 mt-2">Manage your assessments and monitor student performance.</p>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/create-exam" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 transition-colors rounded-xl font-medium shadow-lg shadow-blue-500/25 flex items-center gap-2">
                        <FileText size={18} />
                        Create New Exam
                    </Link>
                    <Link to="/profile" className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors border border-white/5">
                        <Users size={20} />
                    </Link>
                </div>
            </header>

            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
                    {error}
                </div>
            )}

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-slate-900/50 border border-white/5 p-6 rounded-2xl glass">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-slate-400 font-medium">Total Tests Conducted</h3>
                        <Activity className="text-blue-400" size={24} />
                    </div>
                    <p className="text-4xl font-bold">{stats.totalTests}</p>
                </div>
            </div>

            {/* Tests List */}
            <div className="bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden glass">
                <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <h2 className="text-xl font-semibold">Recent Examinations</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900/80 border-b border-white/5 text-slate-400 text-sm">
                                <th className="p-4 font-medium">Exam Name</th>
                                <th className="p-4 font-medium">Students Taken</th>
                                <th className="p-4 font-medium">Scores (Avg/Best/Worst)</th>
                                <th className="p-4 font-medium">Malpractice</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {stats.exams && stats.exams.length > 0 ? (
                                stats.exams.map((exam) => (
                                    <tr key={exam.id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="p-4">
                                            <p className="font-medium text-slate-200">{exam.name}</p>
                                            <span className="text-xs text-slate-500 uppercase tracking-wider">{exam.type}</span>
                                        </td>
                                        <td className="p-4 text-slate-300">{exam.studentsCount} Students</td>
                                        <td className="p-4">
                                            <div className="flex gap-2 text-sm text-slate-300">
                                                <span className="text-blue-400">{exam.avgScore}%</span> /
                                                <span className="text-emerald-400">{exam.bestScore}%</span> /
                                                <span className="text-red-400">{exam.worstScore}%</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {exam.malpracticedStudentsCount > 0 ? (
                                                <div className="flex items-center gap-2 text-red-400">
                                                    <AlertTriangle size={16} />
                                                    <span>{exam.malpracticedStudentsCount} Detected</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-emerald-400">
                                                    <CheckCircle size={16} />
                                                    <span>Clean</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 flex items-center justify-end gap-3 text-sm">
                                            {/* Answer Key upload */}
                                            <Link to={`/upload-answer-key/${exam.id}`} title="Upload Answer Key" className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                                                <Upload size={18} />
                                            </Link>

                                            {exam.isEvaluated ? (
                                                <button
                                                    onClick={() => navigate(`/results/${exam.id}`)}
                                                    className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 rounded-lg transition-colors font-medium"
                                                >
                                                    Show Results
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => navigate(`/evaluate/${exam.id}`)}
                                                    className="px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 rounded-lg transition-colors font-medium"
                                                >
                                                    Evaluate
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-500">
                                        No exams conducted yet. Start by creating a new exam.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
