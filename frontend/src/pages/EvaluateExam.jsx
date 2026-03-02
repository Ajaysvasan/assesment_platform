import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Save, User } from 'lucide-react';

export const EvaluateExam = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const [examData, setExamData] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Submission structure expected: { studentId, studentName, answers: [{ questionId, questionText, studentAnswer, maxMarks, marksAwarded, type }] }
    const [currentSubIndex, setCurrentSubIndex] = useState(0);

    useEffect(() => {
        fetchSubmissions();
    }, [examId]);

    const fetchSubmissions = async () => {
        try {
            setIsLoading(true);
            const response = await api.get(`/api/instructor/exam/${examId}/evaluate`);
            setExamData(response.data.exam);
            setSubmissions(response.data.submissions);
        } catch (err) {
            setError('Failed to load submissions for evaluation. ' + (err.response?.data?.message || ''));
            // Mock structure to prevent crash if empty
            setSubmissions([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMarksChange = (qIndex, value) => {
        const newSubmissions = [...submissions];
        newSubmissions[currentSubIndex].answers[qIndex].marksAwarded = Number(value);
        setSubmissions(newSubmissions);
    };

    const handleSaveEvaluation = async () => {
        try {
            setIsLoading(true);
            const currentSub = submissions[currentSubIndex];
            await api.post(`/api/instructor/exam/${examId}/evaluate`, {
                studentId: currentSub.studentId,
                answers: currentSub.answers.map(a => ({
                    questionId: a.questionId,
                    marksAwarded: a.marksAwarded
                }))
            });

            if (currentSubIndex < submissions.length - 1) {
                setCurrentSubIndex(currentSubIndex + 1);
            } else {
                navigate('/dashboard'); // All evaluated
            }
        } catch (err) {
            setError('Failed to save evaluation.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && !submissions.length) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading Evaluation Details...</div>;

    if (error) return (
        <div className="min-h-screen bg-slate-950 p-6 flex items-center justify-center">
            <div className="bg-red-500/10 text-red-400 p-6 rounded-2xl glass border border-red-500/20 max-w-lg text-center font-medium">
                {error}
                <br /><button onClick={() => navigate('/dashboard')} className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-lg">Back to Dashboard</button>
            </div>
        </div>
    );

    if (submissions.length === 0) return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6">
            <CheckCircle size={64} className="text-emerald-500 mb-4" />
            <h2 className="text-2xl font-semibold">All Caught Up!</h2>
            <p className="text-slate-400 mt-2">No submissions left to evaluate for this exam.</p>
            <button onClick={() => navigate('/dashboard')} className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors font-medium text-white shadow-lg shadow-blue-500/25">Return to Dashboard</button>
        </div>
    );

    const currentSub = submissions[currentSubIndex];

    return (
        <div className="min-h-screen bg-slate-950 p-6 lg:p-12 text-slate-50">
            <header className="mb-8 border-b border-white/10 pb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Evaluation Mode</h1>
                    {examData && <p className="text-slate-400 mt-2">{examData.name} • {examData.type}</p>}
                </div>
                <div className="text-right">
                    <p className="font-medium">Evaluating Student {currentSubIndex + 1} of {submissions.length}</p>
                    <div className="flex items-center justify-end gap-2 text-slate-400 mt-1">
                        <User size={16} />
                        <span>{currentSub?.studentName || 'Anonymous Student'}</span>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto space-y-6">
                {currentSub?.answers.map((ans, qIdx) => (
                    <div key={qIdx} className="glass p-6 rounded-2xl border border-white/5 space-y-4">
                        <div className="flex justify-between items-start gap-4">
                            <h3 className="text-lg font-medium text-slate-200">Q{qIdx + 1}. {ans.questionText}</h3>
                            <span className="shrink-0 text-sm font-medium px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">
                                Max: {ans.maxMarks} Marks
                            </span>
                        </div>

                        <div className="p-4 bg-slate-900/80 rounded-xl border border-white/5 space-y-2">
                            <span className="text-xs text-slate-500 font-bold tracking-wider uppercase">Student's Answer:</span>
                            {ans.type === 'Coding' ? (
                                <pre className="text-sm font-mono text-emerald-300 overflow-x-auto whitespace-pre-wrap">{ans.studentAnswer}</pre>
                            ) : (
                                <p className="text-slate-300">{ans.studentAnswer}</p>
                            )}
                        </div>

                        <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                            <label className="text-sm font-medium text-slate-300">Marks Awarded:</label>
                            <input
                                type="number"
                                min="0"
                                max={ans.maxMarks}
                                value={ans.marksAwarded || ''}
                                onChange={(e) => handleMarksChange(qIdx, e.target.value)}
                                className="w-24 px-4 py-2 bg-slate-900/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 [color-scheme:dark]"
                            />
                        </div>
                    </div>
                ))}

                <div className="sticky bottom-6 flex justify-end pt-6">
                    <button
                        onClick={handleSaveEvaluation}
                        disabled={isLoading}
                        className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-medium rounded-xl shadow-lg shadow-emerald-500/25 transition-all duration-300 flex items-center gap-2"
                    >
                        <Save size={18} />
                        {currentSubIndex < submissions.length - 1 ? 'Save & Next Student' : 'Save & Finish'}
                    </button>
                </div>
            </div>
        </div>
    );
};
