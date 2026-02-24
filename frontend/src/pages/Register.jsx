import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Loader2, ArrowRight, Phone, Building2, Calendar, GraduationCap, Briefcase, Target, BadgeCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../api/client';

const InputField = ({ id, label, type = "text", icon: Icon, value, onChange, placeholder, required = true }) => (
    <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300" htmlFor={id}>{label}</label>
        <div className="relative">
            {Icon && (
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Icon size={18} />
                </div>
            )}
            <input
                id={id}
                type={type}
                required={required}
                value={value}
                onChange={onChange}
                className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2 bg-slate-900/50 border border-white/10 rounded-xl text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all duration-300`}
                placeholder={placeholder}
            />
        </div>
    </div>
);

const ToggleGroup = ({ label, options, value, onChange }) => (
    <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">{label}</label>
        <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/10">
            {options.map((opt) => (
                <button
                    key={opt.value}
                    type="button"
                    onClick={() => onChange(opt.value)}
                    className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${value === opt.value ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30' : 'text-slate-400 hover:text-slate-200'}`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    </div>
);

export const Register = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',

        role: 'CANDIDATE',
        candidateType: 'STUDENT',
        isWorking: 'YES',
        conductorType: 'INSTITUTION',

        institutionName: '',
        phoneNumber: '',
        yearOfPassing: '',
        registerNumber: '',
        companyName: '',
        designation: '',
        purpose: '',
        institutionId: '',
        dob: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleToggle = (key, val) => {
        setFormData({ ...formData, [key]: val });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Build dynamic payload based on selected groups
            let payload = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role
            };

            if (formData.role === 'CANDIDATE') {
                payload.candidateType = formData.candidateType;
                if (formData.candidateType === 'STUDENT') {
                    payload.institutionName = formData.institutionName;
                    payload.phoneNumber = formData.phoneNumber;
                    payload.yearOfPassing = formData.yearOfPassing;
                    payload.registerNumber = formData.registerNumber;
                } else {
                    payload.isWorkingProfessional = formData.isWorking === 'YES';
                    if (formData.isWorking === 'YES') {
                        payload.companyName = formData.companyName;
                        payload.designation = formData.designation;
                    } else {
                        payload.phoneNumber = formData.phoneNumber;
                        payload.purpose = formData.purpose;
                    }
                }
            } else {
                payload.conductorType = formData.conductorType;
                if (formData.conductorType === 'INSTITUTION') {
                    payload.institutionName = formData.institutionName;
                    payload.institutionId = formData.institutionId;
                } else {
                    payload.phoneNumber = formData.phoneNumber;
                    payload.dob = formData.dob;
                }
            }

            await api.post('/api/auth/register', payload);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.detail || 'Failed to register. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full relative overflow-hidden bg-slate-950 flex items-center justify-center p-4 py-10">
            {/* Dynamic Background Elements */}
            <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/20 blur-[120px] animate-blob" />
                <div className="absolute top-[20%] left-[-10%] w-[35%] h-[45%] rounded-full bg-teal-600/20 blur-[120px] animate-blob" style={{ animationDelay: '2s' }} />
                <div className="absolute bottom-[-20%] right-[20%] w-[50%] h-[50%] rounded-full bg-cyan-600/20 blur-[120px] animate-blob" style={{ animationDelay: '4s' }} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg z-10"
            >
                <div className="glass rounded-2xl p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto scrollbar-hide flex flex-col">
                    <div className="text-center space-y-2 shrink-0">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-50">Enroll Today</h1>
                        <p className="text-slate-400">Join our community and start advancing your skills</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 shrink-0 relative">
                        {error && (
                            <div className="p-3 text-sm bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg shrink-0">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">

                            {/* Common Details */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InputField id="name" label="Full Name" icon={User} value={formData.name} onChange={handleChange} placeholder="John Doe" />
                                <InputField id="email" label="Email" type="email" icon={Mail} value={formData.email} onChange={handleChange} placeholder="student@university.edu" />
                            </div>

                            {/* Role Toggle */}
                            <ToggleGroup
                                label="I am registering as a..."
                                value={formData.role}
                                onChange={(val) => handleToggle('role', val)}
                                options={[
                                    { label: "Candidate / Student", value: "CANDIDATE" },
                                    { label: "Test Conductor", value: "CONDUCTOR" }
                                ]}
                            />

                            <AnimatePresence mode="wait">
                                {formData.role === 'CANDIDATE' && (
                                    <motion.div
                                        key="candidate"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-4"
                                    >
                                        <ToggleGroup
                                            label="Current Status"
                                            value={formData.candidateType}
                                            onChange={(val) => handleToggle('candidateType', val)}
                                            options={[
                                                { label: "Student", value: "STUDENT" },
                                                { label: "Non-Student", value: "NON_STUDENT" }
                                            ]}
                                        />

                                        {formData.candidateType === 'STUDENT' && (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                                <InputField id="institutionName" label="Institution Name" icon={Building2} value={formData.institutionName} onChange={handleChange} placeholder="University of Technology" />
                                                <InputField id="phoneNumber" label="Phone Number" type="tel" icon={Phone} value={formData.phoneNumber} onChange={handleChange} placeholder="+1 (555) 000-0000" />
                                                <div className="grid grid-cols-2 gap-4">
                                                    <InputField id="yearOfPassing" label="Year of Passing" type="number" icon={GraduationCap} value={formData.yearOfPassing} onChange={handleChange} placeholder="2025" />
                                                    <InputField id="registerNumber" label="Register / Roll No" icon={BadgeCheck} value={formData.registerNumber} onChange={handleChange} placeholder="CS-2021-001" />
                                                </div>
                                            </motion.div>
                                        )}

                                        {formData.candidateType === 'NON_STUDENT' && (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                                <ToggleGroup
                                                    label="Are you a working professional?"
                                                    value={formData.isWorking}
                                                    onChange={(val) => handleToggle('isWorking', val)}
                                                    options={[
                                                        { label: "Yes", value: "YES" },
                                                        { label: "No", value: "NO" }
                                                    ]}
                                                />

                                                {formData.isWorking === 'YES' ? (
                                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                                        <InputField id="companyName" label="Company Name" icon={Building2} value={formData.companyName} onChange={handleChange} placeholder="Tech Corp Inc." />
                                                        <InputField id="designation" label="Designation" icon={Briefcase} value={formData.designation} onChange={handleChange} placeholder="Software Engineer" />
                                                    </motion.div>
                                                ) : (
                                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                                        <InputField id="phoneNumber" label="Contact Number" type="tel" icon={Phone} value={formData.phoneNumber} onChange={handleChange} placeholder="+1 (555) 000-0000" />
                                                        <InputField id="purpose" label="Purpose of Using App" icon={Target} value={formData.purpose} onChange={handleChange} placeholder="Personal assessment and learning" />
                                                    </motion.div>
                                                )}
                                            </motion.div>
                                        )}
                                    </motion.div>
                                )}

                                {formData.role === 'CONDUCTOR' && (
                                    <motion.div
                                        key="conductor"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-4"
                                    >
                                        <ToggleGroup
                                            label="Account Type"
                                            value={formData.conductorType}
                                            onChange={(val) => handleToggle('conductorType', val)}
                                            options={[
                                                { label: "Institution / Company", value: "INSTITUTION" },
                                                { label: "Self / Examiner", value: "SELF" }
                                            ]}
                                        />

                                        {formData.conductorType === 'INSTITUTION' ? (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                                <InputField id="institutionName" label="Institution / Company Name" icon={Building2} value={formData.institutionName} onChange={handleChange} placeholder="Global Testing Center" />
                                                <InputField id="institutionId" label="Institution / Company ID" icon={BadgeCheck} value={formData.institutionId} onChange={handleChange} placeholder="GTC-ORG-9921" />
                                            </motion.div>
                                        ) : (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <InputField id="phoneNumber" label="Contact Number" type="tel" icon={Phone} value={formData.phoneNumber} onChange={handleChange} placeholder="+1 (555) 000-0000" />
                                                <InputField id="dob" label="Date of Birth" type="date" icon={Calendar} value={formData.dob} onChange={handleChange} />
                                            </motion.div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Base Password Fields */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/5 pt-4">
                                <InputField id="password" label="Password" type="password" icon={Lock} value={formData.password} onChange={handleChange} placeholder="••••••••" />
                                <InputField id="confirmPassword" label="Confirm Password" type="password" icon={Lock} value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 px-4 mt-4 bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 hover:from-teal-400 hover:via-emerald-400 hover:to-cyan-400 text-white font-medium rounded-xl shadow-lg shadow-teal-500/25 focus:outline-none focus:ring-2 focus:ring-teal-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center group"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    Register
                                    <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>

                        <p className="text-center text-slate-400 text-sm pb-2">
                            Already enrolled?{' '}
                            <Link to="/login" className="text-teal-400 hover:text-teal-300 font-medium transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};
