import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, TrendingUp, TrendingDown, ArrowLeft } from 'lucide-react';

export const ExamResults = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const [results, setResults] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchResults();
    }, [examId]);

    const fetchResults = async () => {
        try {
            setIsLoading(true);
            const response = await api.get(`/api/instructor/exam/${examId}/results`);
            setResults(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch results');
            setResults({
                examName: 'Unknown Exam',
                studentsCount: 0,
                avgScore: 0, bestScore: 0, worstScore: 0,
                students: []
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading Results...</div>;

    const renderEmptyState = () => (
        <div className="p-8 text-center text-slate-500 bg-slate-900/50 rounded-2xl glass border border-white/5">
            Results are not available or no students have been evaluated yet.
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-950 p-6 lg:p-12 text-slate-50">
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/dashboard')} className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors text-slate-400 hover:text-white">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold">{results?.examName} - Results</h1>
                        <p className="text-slate-400 mt-1">Detailed performance metrics</p>
                    </div>
                </div>
            </header>

            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
                    {error}
                </div>
            )}

            {!results || results.students?.length === 0 ? renderEmptyState() : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                        <div className="bg-slate-900/50 border border-white/5 p-6 rounded-2xl glass flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm font-medium mb-1">Total Students</p>
                                <p className="text-3xl font-bold">{results.studentsCount}</p>
                            </div>
                            <Users className="text-blue-400" size={28} />
                        </div>
                        <div className="bg-slate-900/50 border border-white/5 p-6 rounded-2xl glass flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm font-medium mb-1">Average Score</p>
                                <p className="text-3xl font-bold">{results.avgScore}%</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-400 font-bold">Avg</div>
                        </div>
                        <div className="bg-slate-900/50 border border-white/5 p-6 rounded-2xl glass flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm font-medium mb-1">Highest Score</p>
                                <p className="text-3xl font-bold text-emerald-400">{results.bestScore}%</p>
                            </div>
                            <TrendingUp className="text-emerald-400" size={28} />
                        </div>
                        <div className="bg-slate-900/50 border border-white/5 p-6 rounded-2xl glass flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm font-medium mb-1">Lowest Score</p>
                                <p className="text-3xl font-bold text-red-400">{results.worstScore}%</p>
                            </div>
                            <TrendingDown className="text-red-400" size={28} />
                        </div>
                    </div>

                    <div className="bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden glass">
                        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <h2 className="text-xl font-semibold">Student Scores</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-900/80 border-b border-white/5 text-slate-400 text-sm">
                                        <th className="p-4 font-medium">Rank</th>
                                        <th className="p-4 font-medium">Student Info</th>
                                        <th className="p-4 font-medium">Marks Obtained</th>
                                        <th className="p-4 font-medium">Percentage</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {results.students.sort((a, b) => b.percentage - a.percentage).map((student, idx) => (
                                        <tr key={student.id} className="hover:bg-slate-800/30 transition-colors">
                                            <td className="p-4 font-medium text-slate-300">#{idx + 1}</td>
                                            <td className="p-4">
                                                <p className="font-medium text-slate-200">{student.name}</p>
                                                <p className="text-xs text-slate-500">{student.email}</p>
                                            </td>
                                            <td className="p-4 text-slate-300">{student.marksObtained} / {student.maxMarks}</td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${student.percentage >= 80 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                        student.percentage >= 50 ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                            'bg-red-500/10 text-red-400 border border-red-500/20'
                                                    }`}>
                                                    {student.percentage}%
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
