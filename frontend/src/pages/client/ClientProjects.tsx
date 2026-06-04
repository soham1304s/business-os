import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../../store/authStore';
import { CheckCircle, Clock, FileText, Upload, Plus, Bot, Send, Sparkles } from 'lucide-react';
import { API_URL } from '../../config';
import { FileUpload } from '../../components/ui/FileUpload';
import { Button } from '../../components/ui/Button';
import { useLiveUpdate } from '../../hooks/useLiveUpdate';

const STAGES = [
  { id: 'NEW_LEAD', label: 'Requirement Review' },
  { id: 'REQUIREMENT_REVIEW', label: 'Requirement Review' },
  { id: 'PROPOSAL_SENT', label: 'Proposal Sent' },
  { id: 'PAYMENT_RECEIVED', label: 'Payment Received' },
  { id: 'IN_PROGRESS', label: 'In Progress' },
  { id: 'UNDER_REVIEW', label: 'Under Review' },
  { id: 'COMPLETED', label: 'Completed' },
  { id: 'CLOSED', label: 'Closed' }
];

interface Project {
  id: string;
  serviceType: string;
  budget: number | null;
  timeline: string | null;
  status: string;
  createdAt: string;
  dealId?: string;
  title?: string;
  notes?: string;
}

interface Activity {
  id: string;
  action: string;
  details: string;
  createdAt: string;
}

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export function ClientProjects() {
  const { token } = useAuthStore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  // AI Chat State
  const [chatMessages, setChatMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm your AI Project Copilot. What kind of project would you like to start today? Tell me about your goals, and I'll help you structure it." }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_URL}/api/client/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setProjects(data);
        if (data.length > 0 && !selectedProject) {
          setSelectedProject(data[0]);
        }
      } else {
        setProjects([]);
      }
    } catch (err) {
      console.error(err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivity = async () => {
    if (!selectedProject?.dealId || selectedProject.status === 'DRAFT') return;
    try {
      const res = await fetch(`${API_URL}/api/client/projects/${selectedProject.dealId}/activity`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setActivities(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [token]);

  useEffect(() => {
    if (selectedProject?.status !== 'DRAFT') {
      fetchActivity();
    }
  }, [selectedProject, token]);

  useLiveUpdate(['metrics-updated', 'new-activity'], () => {
    fetchProjects();
    if (selectedProject?.status !== 'DRAFT') {
      fetchActivity();
    }
  });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAiTyping]);

  const handleCreateDraft = async () => {
    try {
      const res = await fetch(`${API_URL}/api/service-requests/draft`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          serviceType: 'New AI Draft'
        })
      });
      const data = await res.json();
      if (res.ok) {
        const newDraft = data.serviceRequest;
        setProjects(prev => [newDraft, ...prev]);
        setSelectedProject(newDraft);
        setChatMessages([{ role: 'assistant', content: "Hi! I'm your AI Project Copilot. What kind of project would you like to start today? Tell me about your goals, budget, and timeline." }]);
      }
    } catch (err) {
      console.error('Failed to create draft', err);
    }
  };

  const submitAiChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedProject) return;

    const newMsgs: Message[] = [...chatMessages, { role: 'user', content: inputMessage }];
    setChatMessages(newMsgs);
    setInputMessage('');
    setIsAiTyping(true);

    try {
      const res = await fetch(`${API_URL}/api/ai/draft-assistant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          messages: newMsgs.map(m => ({ role: m.role, content: m.content })),
          projectContext: selectedProject
        })
      });

      const data = await res.json();
      if (res.ok) {
        setChatMessages([...newMsgs, { role: 'assistant', content: data.message }]);
        
        // Update local selected project with AI recommendations
        if (data.updates) {
          setSelectedProject(prev => prev ? { ...prev, ...data.updates } : prev);
          setProjects(prev => prev.map(p => p.id === selectedProject.id ? { ...p, ...data.updates } : p));
        }
      }
    } catch (err) {
      console.error(err);
      setChatMessages([...newMsgs, { role: 'assistant', content: 'Sorry, I encountered an error.' }]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleFinalizeProject = async () => {
    if (!selectedProject) return;
    try {
      const res = await fetch(`${API_URL}/api/service-requests/${selectedProject.id}/submit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          budget: selectedProject.budget,
          timeline: selectedProject.timeline,
          notes: selectedProject.notes
        })
      });
      if (res.ok) {
        // Update local state to immediately show 'PENDING' without waiting for refresh
        const updatedProject = { ...selectedProject, status: 'PENDING' };
        setSelectedProject(updatedProject);
        setProjects(prev => prev.map(p => p.id === selectedProject.id ? updatedProject : p));
        alert('Project successfully submitted to the agency!');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to submit project');
    }
  };

  if (loading) return <div className="p-6 text-slate-500">Loading projects...</div>;

  return (
    <div className="h-full flex flex-col md:flex-row bg-slate-50 overflow-hidden">
      {/* Sidebar List */}
      <div className="w-full md:w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h2 className="font-bold text-slate-900">My Projects</h2>
          <Button onClick={handleCreateDraft} size="sm" variant="primary" className="bg-indigo-600 border-none px-3">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {projects.length === 0 ? (
            <div className="p-4 text-sm text-slate-500 text-center">No projects found. Click + to start a draft.</div>
          ) : (
            projects.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedProject(p)}
                className={`w-full text-left p-4 rounded-xl transition-all shadow-sm ${
                  selectedProject?.id === p.id 
                    ? 'bg-gradient-to-br from-indigo-50 to-white border border-indigo-200 ring-2 ring-indigo-500/20' 
                    : 'bg-white hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="font-bold text-slate-900 truncate pr-2">{p.title || p.serviceType}</div>
                  {p.status === 'DRAFT' && <Sparkles className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />}
                </div>
                <div className="text-xs font-semibold flex items-center gap-2">
                  <span className={`inline-block w-2 h-2 rounded-full ${p.status === 'DRAFT' ? 'bg-orange-500' : 'bg-indigo-500'}`}></span>
                  <span className={p.status === 'DRAFT' ? 'text-orange-600' : 'text-slate-500'}>
                    {p.status.replace('_', ' ')}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Detail Area */}
      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
        {selectedProject ? (
          <div className="max-w-5xl mx-auto space-y-6">
            
            {/* Header Card */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
              {selectedProject.status === 'DRAFT' && (
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-pink-500"></div>
              )}
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                    {selectedProject.title || selectedProject.serviceType}
                  </h1>
                  <p className="text-sm font-medium text-slate-500 mt-2">
                    {selectedProject.status === 'DRAFT' 
                      ? 'Drafting phase with AI Copilot' 
                      : `Requested on ${new Date(selectedProject.createdAt).toLocaleDateString()}`
                    }
                  </p>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm border ${
                  selectedProject.status === 'DRAFT' 
                    ? 'bg-orange-50 text-orange-600 border-orange-200'
                    : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                }`}>
                  {selectedProject.status.replace('_', ' ')}
                </div>
              </div>

              {/* Progress Bar (Only for non-drafts) */}
              {selectedProject.status !== 'DRAFT' && (
                <div className="relative mt-8 mb-2">
                  <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-1 bg-slate-100 rounded-full"></div>
                  <div className="relative flex justify-between">
                    {['NEW_LEAD', 'PROPOSAL_SENT', 'IN_PROGRESS', 'COMPLETED'].map((step, idx, arr) => {
                      const currentIndex = STAGES.findIndex(s => s.id === selectedProject.status);
                      const stepIndex = STAGES.findIndex(s => s.id === step);
                      const isCompleted = currentIndex >= stepIndex;
                      const isCurrent = currentIndex >= stepIndex && currentIndex < (STAGES.findIndex(s => s.id === arr[idx+1]) || 999);
                      
                      return (
                        <div key={step} className="flex flex-col items-center gap-2 z-10">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-4 transition-colors ${
                            isCompleted ? 'bg-indigo-600 border-indigo-100 text-white shadow-md' : 'bg-white border-slate-100 text-slate-400'
                          }`}>
                            {isCompleted ? <CheckCircle className="w-5 h-5" /> : idx + 1}
                          </div>
                          <div className={`text-xs font-bold ${isCurrent ? 'text-indigo-600' : 'text-slate-400'}`}>
                            {step.replace('_', ' ')}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {selectedProject.status === 'DRAFT' ? (
              // DRAFT VIEW: AI COPILOT
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
                  <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
                    <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Project Copilot</h3>
                      <p className="text-xs font-medium text-slate-500">I can help structure your project and budget</p>
                    </div>
                  </div>
                  
                  <div className="flex-1 p-6 overflow-y-auto space-y-6 custom-scrollbar bg-slate-50/50">
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                          msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gradient-to-br from-orange-400 to-pink-500 text-white'
                        }`}>
                          {msg.role === 'user' ? <div className="text-xs font-bold">You</div> : <Sparkles className="w-4 h-4" />}
                        </div>
                        <div className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-sm text-sm font-medium leading-relaxed ${
                          msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-white border border-slate-100 text-slate-700 rounded-tl-sm'
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {isAiTyping && (
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center shrink-0">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-1.5 shadow-sm">
                          <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-75"></div>
                          <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-150"></div>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  <div className="p-4 bg-white border-t border-slate-100">
                    <form onSubmit={submitAiChat} className="flex gap-3">
                      <input 
                        type="text" 
                        value={inputMessage}
                        onChange={e => setInputMessage(e.target.value)}
                        placeholder="Describe your project needs..."
                        className="flex-1 bg-slate-100 border-none rounded-xl px-5 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm font-medium"
                      />
                      <Button type="submit" disabled={isAiTyping || !inputMessage.trim()} variant="primary" className="bg-indigo-600 border-none rounded-xl px-4 shadow-sm shadow-indigo-500/20">
                        <Send className="w-4 h-4" />
                      </Button>
                    </form>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2 text-lg">
                      <FileText className="w-5 h-5 text-indigo-500" />
                      Draft Summary
                    </h3>
                    <div className="space-y-5">
                      <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Budget</div>
                        <div className="font-bold text-slate-900 text-xl">${selectedProject.budget || '0'}</div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Timeline</div>
                        <div className="font-medium text-slate-700">{selectedProject.timeline || 'Not specified'}</div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Notes</div>
                        <div className="text-sm font-medium text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
                          {selectedProject.notes || 'No notes yet.'}
                        </div>
                      </div>
                    </div>

                    <Button onClick={handleFinalizeProject} variant="primary" className="w-full mt-8 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 border-none shadow-lg shadow-emerald-500/20 font-bold py-3">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Submit to Agency
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              // ACTIVE PROJECT VIEW
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                  {/* Activity Feed */}
                  <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2 text-lg">
                      <Clock className="w-5 h-5 text-indigo-500" />
                      Project Updates
                    </h3>
                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                      {activities.length === 0 ? (
                        <p className="text-sm text-slate-500 pl-10 md:pl-0 md:text-center relative z-10 font-medium bg-white py-2">No updates yet.</p>
                      ) : (
                        activities.map((act) => (
                          <div key={act.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-indigo-100 text-indigo-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                              <div className="w-2.5 h-2.5 rounded-full bg-indigo-600"></div>
                            </div>
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                              <p className="text-sm font-bold text-slate-900">{act.action.replace('_', ' ')}</p>
                              <p className="text-sm font-medium text-slate-500 mt-1">{act.details}</p>
                              <p className="text-xs font-semibold text-slate-400 mt-2">{new Date(act.createdAt).toLocaleString()}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Details Card */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2 text-lg">
                      <FileText className="w-5 h-5 text-indigo-500" />
                      Request Details
                    </h3>
                    <div className="space-y-5">
                      <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Service</div>
                        <div className="font-bold text-slate-900">{selectedProject.serviceType}</div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Budget</div>
                        <div className="font-bold text-slate-900">${selectedProject.budget || '0'}</div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Timeline</div>
                        <div className="font-medium text-slate-700">{selectedProject.timeline || 'Not specified'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Upload Document Card */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-lg">
                      <Upload className="w-5 h-5 text-indigo-500" />
                      Upload Document
                    </h3>
                    <p className="text-xs font-medium text-slate-500 mb-5">Upload project requirements, assets, or references.</p>
                    <FileUpload 
                      label="Drop file here to upload"
                      onUploadSuccess={(url) => {
                        alert('File uploaded successfully! View at: ' + url);
                      }} 
                    />
                  </div>
                </div>
              </div>
            )}

          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500">
              <Sparkles className="w-8 h-8" />
            </div>
            <p className="font-medium text-lg text-slate-600">Select a project or create a new Draft to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
