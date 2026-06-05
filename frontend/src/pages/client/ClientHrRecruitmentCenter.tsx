import { useState, useEffect, useRef } from 'react';
import { Users, Briefcase, Bot, CheckCircle, FileText, Send, X, Plus } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { HrRecruitmentServiceRequestModal } from '../../components/client/HrRecruitmentServiceRequestModal';
import { useAuthStore } from '../../store/authStore';
import { API_URL } from '../../config';

export function ClientHrRecruitmentCenter() {
  const [showModal, setShowModal] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const { token } = useAuthStore();
  
  const [jobs, setJobs] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    openRoles: 0,
    totalCandidates: 0,
    hiresThisMonth: 0,
    avgTimeToHire: 0,
    candidatesByStage: {}
  });
  
  const [recentRequests, setRecentRequests] = useState<any[]>([]);

  const [chatMessages, setChatMessages] = useState<{role: string, content: string}[]>([
    { role: 'assistant', content: 'Hi there! I am your AI HR & Hiring Assistant. Ask me about your recruitment pipeline, HR policies, or how to structure a job description.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch Jobs & Stats
      const jobsRes = await fetch(`${API_URL}/api/recruitment/jobs`, { headers });
      if (jobsRes.ok) setJobs(await jobsRes.json());

      const statsRes = await fetch(`${API_URL}/api/recruitment/stats`, { headers });
      if (statsRes.ok) setStats(await statsRes.json());
      
      // Fetch Recent HR/Recruitment Requests
      const reqRes = await fetch(`${API_URL}/api/service-requests?type=HR Management,Recruitment`, { headers });
      if (reqRes.ok) {
        const data = await reqRes.json();
        setRecentRequests(data.slice(0, 5)); // Just show recent 5 on client dashboard
      }

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  useEffect(() => {
    if (showChat) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, showChat]);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    
    const newMessages = [...chatMessages, { role: 'user', content: chatInput }];
    setChatMessages(newMessages);
    setChatInput('');
    setIsTyping(true);

    try {
      const res = await fetch(`${API_URL}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ messages: newMessages })
      });
      
      const data = await res.json();
      setChatMessages([...newMessages, { role: 'assistant', content: data.message || "I'm having trouble connecting right now." }]);
    } catch (err) {
      console.error(err);
      setChatMessages([...newMessages, { role: 'assistant', content: "Sorry, I encountered a network error." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-8 space-y-8 overflow-y-auto custom-scrollbar bg-[#FAFAFA] relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
            HR & Recruitment Hub
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">Manage policies, team requests, and hiring pipelines.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => setShowChat(true)} variant="outline" className="shadow-sm">
            <Bot className="w-4 h-4 mr-2 text-indigo-500" />
            Ask Assistant
          </Button>
          <Button onClick={() => setShowModal(true)} variant="primary" className="bg-indigo-600 hover:bg-indigo-700 border-none shadow-lg shadow-indigo-500/20">
            <Plus className="w-4 h-4 mr-2" />
            New Request
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col hover:border-indigo-200 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <Briefcase className="w-5 h-5 text-indigo-500" />
            <h3 className="font-bold text-slate-800">Open Positions</h3>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-2">{stats.openRoles || 0}</div>
          <p className="text-sm text-slate-500">{stats.totalCandidates || 0} Candidates in pipeline</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col hover:border-indigo-200 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-5 h-5 text-blue-500" />
            <h3 className="font-bold text-slate-800">Active Policies</h3>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-2">8</div>
          <p className="text-sm text-slate-500">Updated last week</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col hover:border-indigo-200 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            <h3 className="font-bold text-slate-800">Hires this Year</h3>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-2">{stats.hiresThisMonth || 0}</div>
          <p className="text-sm text-slate-500">Time-to-hire average: {stats.avgTimeToHire || 0} days</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Service Requests */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 flex flex-col">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            Recent HR & Hiring Requests
          </h2>
          <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar">
            {recentRequests.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No recent requests found. Submit a new request!</div>
            ) : (
              recentRequests.map(req => (
                <div key={req.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 gap-4 hover:border-indigo-200 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      req.serviceType === 'Recruitment' ? 'bg-blue-100 text-blue-600' : 'bg-indigo-100 text-indigo-600'
                    }`}>
                      {req.serviceType === 'Recruitment' ? <Briefcase className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{req.serviceType}</h4>
                      <p className="text-xs text-slate-500 line-clamp-1">{req.notes}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{new Date(req.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider shrink-0 ${
                    req.status === 'COMPLETED' || req.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                    req.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                    req.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {req.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Active Job Postings */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 flex flex-col">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            Active Hiring Pipelines
          </h2>
          <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar">
            {jobs.filter(job => job.status === 'OPEN').length === 0 ? (
              <div className="p-8 text-center text-slate-500">No active hiring pipelines found.</div>
            ) : (
              jobs.filter(job => job.status === 'OPEN').map(job => (
                <div key={job.id} className="p-5 rounded-2xl border border-slate-100 bg-slate-50 hover:border-blue-200 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg">{job.title}</h4>
                      <p className="text-sm text-slate-500 mt-1">{job.department} &bull; {job.location}</p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider">{job.status}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm font-medium text-slate-600 bg-white p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2"><Users className="w-4 h-4 text-blue-500"/> {job._count?.candidates || 0} Sourced</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {showModal && <HrRecruitmentServiceRequestModal onClose={() => { setShowModal(false); fetchData(); }} />}

      {/* AI HR Assistant Modal */}
      {showChat && (
        <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden z-50">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-4 flex justify-between items-center text-white shrink-0">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <h3 className="font-bold">AI HR Assistant</h3>
            </div>
            <button onClick={() => setShowChat(false)} className="text-indigo-100 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="h-80 p-4 overflow-y-auto bg-slate-50 flex flex-col gap-3 custom-scrollbar">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl px-4 py-3 text-sm bg-white border border-slate-200 text-slate-500 rounded-bl-none shadow-sm flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="p-3 border-t border-slate-100 bg-white flex items-center gap-2 shrink-0">
            <input 
              type="text" 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about HR or hiring..." 
              className="flex-1 bg-slate-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 border-none"
            />
            <button 
              onClick={handleSendMessage}
              disabled={!chatInput.trim() || isTyping}
              className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
