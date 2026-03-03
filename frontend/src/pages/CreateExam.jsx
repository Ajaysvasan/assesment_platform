import React, { useState } from "react";
import { api } from "../api/client";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Save, Plus, Trash2 } from "lucide-react";

export const CreateExam = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [examDetails, setExamDetails] = useState({
    name: "",
    type: "MCQ", // 'MCQ', 'Written', or 'Coding'
    scheduledDate: "",
    scheduledTime: "",
  });

  const [createdExamId, setCreatedExamId] = useState(null);
  const [questions, setQuestions] = useState([]);

  // Question structure depend on type
  const addQuestion = () => {
    if (examDetails.type === "MCQ") {
      setQuestions([
        ...questions,
        { question: "", options: ["", "", "", ""], correctAnswer: 0, marks: 1 },
      ]);
    } else if (examDetails.type === "Written") {
      setQuestions([...questions, { question: "", marks: 5 }]);
    } else if (examDetails.type === "Coding") {
      setQuestions([
        ...questions,
        {
          problemStatement: "",
          sampleTestCases: [{ input: "", output: "", explanation: "" }],
          hiddenTestCases: [{ input: "", output: "" }],
          marks: 10,
        },
      ]);
    }
  };

  const handleCreateExam = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post("/api/instructor/exam", examDetails);
      console.log(examDetails);
      setCreatedExamId(
        response.data.id || Math.random().toString(36).substr(2, 9)
      ); // fallback ID if needed
      setStep(2);
      addQuestion(); // Add first empty question
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create exam details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveQuestions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await api.post(`/api/instructor/exam/${createdExamId}/questions`, {
        questions,
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save questions.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const renderMCQForm = (q, i) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">
          Question Title / Text
        </label>
        <textarea
          value={q.question}
          onChange={(e) => updateQuestion(i, "question", e.target.value)}
          className="w-full px-4 py-2.5 bg-slate-900/50 border border-white/10 rounded-xl text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          rows="3"
          required
        />
      </div>
      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-300">Options</label>
        {q.options.map((opt, optIdx) => (
          <div key={optIdx} className="flex items-center gap-3">
            <input
              type="radio"
              name={`correct-${i}`}
              checked={q.correctAnswer === optIdx}
              onChange={() => updateQuestion(i, "correctAnswer", optIdx)}
              className="bg-slate-900 border-white/10 text-blue-500 focus:ring-blue-500"
            />
            <input
              type="text"
              value={opt}
              onChange={(e) => {
                const newOptions = [...q.options];
                newOptions[optIdx] = e.target.value;
                updateQuestion(i, "options", newOptions);
              }}
              className="w-full px-4 py-2 bg-slate-900/50 border border-white/10 rounded-lg text-slate-50"
              placeholder={`Option ${optIdx + 1}`}
              required
            />
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">Marks</label>
        <input
          type="number"
          value={q.marks}
          onChange={(e) => updateQuestion(i, "marks", e.target.value)}
          className="w-full px-4 py-2 bg-slate-900/50 border border-white/10 rounded-xl text-slate-50 max-w-[150px]"
          min="1"
          required
        />
      </div>
    </div>
  );

  const renderWrittenForm = (q, i) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">
          Question Text
        </label>
        <textarea
          value={q.question}
          onChange={(e) => updateQuestion(i, "question", e.target.value)}
          className="w-full px-4 py-2.5 bg-slate-900/50 border border-white/10 rounded-xl text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          rows="4"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">
          Marks Allocated
        </label>
        <input
          type="number"
          value={q.marks}
          onChange={(e) => updateQuestion(i, "marks", e.target.value)}
          className="w-full px-4 py-2 bg-slate-900/50 border border-white/10 rounded-xl text-slate-50 max-w-[150px]"
          min="1"
          required
        />
      </div>
    </div>
  );

  const renderCodingForm = (q, i) => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">
          Problem Statement
        </label>
        <textarea
          value={q.problemStatement}
          onChange={(e) =>
            updateQuestion(i, "problemStatement", e.target.value)
          }
          className="w-full px-4 py-2.5 bg-slate-900/50 border border-white/10 rounded-xl text-slate-50 min-h-[150px]"
          required
        />
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-slate-300">
            Sample Test Cases
          </label>
          <button
            type="button"
            onClick={() => {
              const newCases = [
                ...q.sampleTestCases,
                { input: "", output: "", explanation: "" },
              ];
              updateQuestion(i, "sampleTestCases", newCases);
            }}
            className="text-xs text-blue-400 hover:text-blue-300"
          >
            + Add Sample
          </button>
        </div>
        {q.sampleTestCases.map((tc, tcIdx) => (
          <div
            key={tcIdx}
            className="grid grid-cols-1 gap-2 p-3 bg-slate-900/80 rounded-lg border border-white/5"
          >
            <textarea
              placeholder="Input"
              value={tc.input}
              onChange={(e) => {
                const newCases = [...q.sampleTestCases];
                newCases[tcIdx].input = e.target.value;
                updateQuestion(i, "sampleTestCases", newCases);
              }}
              className="w-full bg-slate-950 p-2 text-sm rounded border border-white/5"
            />
            <textarea
              placeholder="Output"
              value={tc.output}
              onChange={(e) => {
                const newCases = [...q.sampleTestCases];
                newCases[tcIdx].output = e.target.value;
                updateQuestion(i, "sampleTestCases", newCases);
              }}
              className="w-full bg-slate-950 p-2 text-sm rounded border border-white/5"
            />
            <textarea
              placeholder="Explanation"
              value={tc.explanation}
              onChange={(e) => {
                const newCases = [...q.sampleTestCases];
                newCases[tcIdx].explanation = e.target.value;
                updateQuestion(i, "sampleTestCases", newCases);
              }}
              className="w-full bg-slate-950 p-2 text-sm rounded border border-white/5"
            />
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-slate-300">
            Hidden Test Cases (Used for Evaluation)
          </label>
          <button
            type="button"
            onClick={() => {
              const newCases = [
                ...q.hiddenTestCases,
                { input: "", output: "" },
              ];
              updateQuestion(i, "hiddenTestCases", newCases);
            }}
            className="text-xs text-blue-400 hover:text-blue-300"
          >
            + Add Hidden
          </button>
        </div>
        {q.hiddenTestCases.map((tc, tcIdx) => (
          <div
            key={tcIdx}
            className="grid grid-cols-2 gap-2 p-3 bg-slate-900/80 rounded-lg border border-white/5"
          >
            <textarea
              placeholder="Input"
              value={tc.input}
              onChange={(e) => {
                const newCases = [...q.hiddenTestCases];
                newCases[tcIdx].input = e.target.value;
                updateQuestion(i, "hiddenTestCases", newCases);
              }}
              className="w-full bg-slate-950 p-2 text-sm rounded border border-white/5"
            />
            <textarea
              placeholder="Expected Output"
              value={tc.output}
              onChange={(e) => {
                const newCases = [...q.hiddenTestCases];
                newCases[tcIdx].output = e.target.value;
                updateQuestion(i, "hiddenTestCases", newCases);
              }}
              className="w-full bg-slate-950 p-2 text-sm rounded border border-white/5"
            />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">
          Marks for this Coding Problem
        </label>
        <input
          type="number"
          value={q.marks}
          onChange={(e) => updateQuestion(i, "marks", e.target.value)}
          className="w-full px-4 py-2 bg-slate-900/50 border border-white/10 rounded-xl text-slate-50 max-w-[150px]"
          min="1"
          required
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 p-6 lg:p-12 text-slate-50">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Exam Setter</h1>
          <p className="text-slate-400 mt-2">
            Configure a new assessment for your students.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
            {error}
          </div>
        )}

        {/* Step 1: Basic Information */}
        {step === 1 && (
          <form
            onSubmit={handleCreateExam}
            className="glass border border-white/5 rounded-2xl p-6 sm:p-10 space-y-6"
          >
            <h2 className="text-xl font-semibold mb-6">
              Step 1: Exam Configuration
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Exam Name
                </label>
                <input
                  type="text"
                  required
                  value={examDetails.name}
                  onChange={(e) =>
                    setExamDetails({ ...examDetails, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-slate-900/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50"
                  placeholder="e.g. Midterm Computer Science"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Exam Type
                </label>
                <select
                  value={examDetails.type}
                  onChange={(e) =>
                    setExamDetails({ ...examDetails, type: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-slate-900/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="MCQ">Multiple Choice (MCQ)</option>
                  <option value="Written">Written Answers</option>
                  <option value="Coding">Coding</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Scheduled Date
                </label>
                <input
                  type="date"
                  required
                  value={examDetails.scheduledDate}
                  onChange={(e) =>
                    setExamDetails({
                      ...examDetails,
                      scheduledDate: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 bg-slate-900/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 [color-scheme:dark]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Scheduled Time
                </label>
                <input
                  type="time"
                  required
                  value={examDetails.scheduledTime}
                  onChange={(e) =>
                    setExamDetails({
                      ...examDetails,
                      scheduledTime: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 bg-slate-900/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 [color-scheme:dark]"
                />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-300 flex items-center"
              >
                Continue to Questions
                <ArrowRight size={18} className="ml-2" />
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Add Questions */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between glass border border-white/5 rounded-xl p-4">
              <h2 className="text-lg font-semibold">
                Step 2: Add {examDetails.type} Questions
              </h2>
              <p className="text-sm text-slate-400">
                Total Questions: {questions.length}
              </p>
            </div>

            {questions.map((q, i) => (
              <div
                key={i}
                className="glass border border-white/5 rounded-2xl p-6 sm:p-8 relative"
              >
                <div className="absolute top-6 right-6 flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 tracking-wider">
                    Q{i + 1}
                  </span>
                  {questions.length > 1 && (
                    <button
                      onClick={() => removeQuestion(i)}
                      className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                {examDetails.type === "MCQ" && renderMCQForm(q, i)}
                {examDetails.type === "Written" && renderWrittenForm(q, i)}
                {examDetails.type === "Coding" && renderCodingForm(q, i)}
              </div>
            ))}

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <button
                onClick={addQuestion}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-colors flex items-center gap-2 w-full sm:w-auto justify-center border border-white/5"
              >
                <Plus size={18} /> Add Another Question
              </button>

              <button
                onClick={handleSaveQuestions}
                disabled={isLoading}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl shadow-lg shadow-emerald-500/25 transition-all duration-300 flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                <Save size={18} /> Save & Publish Exam
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
