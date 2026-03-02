import React, { useState } from 'react';
import { api } from '../api/client';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { UploadCloud, CheckCircle, AlertTriangle, ArrowLeft, Loader2 } from 'lucide-react';

export const UploadAnswerKey = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setError('');
            setSuccess(false);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a file first.');
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccess(false);

        const formData = new FormData();
        formData.append('answerKey', file);

        try {
            await api.post(`/api/instructor/exam/${examId}/answer-key`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setSuccess(true);
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to upload answer key.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-50 relative">
            <div className="absolute top-[20%] left-[20%] w-[30%] h-[40%] rounded-full bg-emerald-600/10 blur-[100px] pointer-events-none" />

            <div className="w-full max-w-lg z-10 glass p-8 sm:p-10 rounded-3xl border border-white/5 space-y-6">
                <Link to="/dashboard" className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
                </Link>

                <div className="text-center space-y-2 pt-2">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                        <UploadCloud className="text-blue-400" size={32} />
                    </div>
                    <h1 className="text-3xl font-bold">Upload Answer Key</h1>
                    <p className="text-slate-400">Provide the answer key for students to review after the exam.</p>
                </div>

                {success && (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center gap-3 font-medium">
                        <CheckCircle size={18} />
                        Answer Key uploaded successfully!
                    </div>
                )}

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-start gap-3 text-sm">
                        <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleUpload} className="space-y-6">
                    <div className="p-8 border-2 border-dashed border-white/10 rounded-2xl bg-slate-900/50 flex flex-col items-center justify-center relative group hover:border-blue-500/50 hover:bg-slate-900/80 transition-colors">
                        <input
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handleFileChange}
                            accept=".pdf,.doc,.docx,.txt"
                        />
                        <UploadCloud size={40} className="text-slate-500 group-hover:text-blue-400 mb-3 transition-colors" />
                        {file ? (
                            <div className="text-center">
                                <p className="font-medium text-emerald-400">{file.name}</p>
                                <p className="text-xs text-slate-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                        ) : (
                            <div className="text-center">
                                <p className="font-medium text-slate-300">Click or drag file to upload</p>
                                <p className="text-xs text-slate-500 mt-1">Supports PDF, DOCX, TXT</p>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !file}
                        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-300 flex items-center justify-center disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Upload File'}
                    </button>
                </form>
            </div>
        </div>
    );
};
