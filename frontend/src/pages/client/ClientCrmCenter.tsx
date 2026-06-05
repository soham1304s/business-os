import { useState, useEffect, useMemo, useRef } from 'react';
import { Target, Users, Filter, BarChart, Plus, Bot, ArrowUpRight, X, Send, Inbox } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { CrmServiceRequestModal } from '../../components/client/CrmServiceRequestModal';
import { useCrmStore } from '../../store/crmStore';
import { useAuthStore } from '../../store/authStore';
import { useLiveUpdate } from '../../hooks/useLiveUpdate';
import { API_URL } from '../../config';

export function ClientCrmCenter() {
  const [showModal, setShowModal] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [crmRequests, setCrmRequests] = useState<any[]>([]);
  
  const [chatMessages, setChatMessages] = useState<{role: string, content: string}[]>([
    { role: 'assistant', content: 'Hi there! I am your AI Sales Assistant. Ask me about your pipeline, active integrations, or how to qualify leads.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const { deals, fetchDeals } = useCrmStore();
  const { token } = useAuthStore();

  const fetchRequests = async () => {
    try {
      const res = await fetch(`${API_URL}/api/service-requests?type=CRM Management`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setCrmRequests(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDeals();
    fetchRequests();
  }, [fetchDeals, token]);

  useLiveUpdate(['new-request', 'update-request'], fetchRequests);
  useLiveUpdate(['metrics-updated', 'new-activity'], () => {
    if (fetchDeals) fetchDeals();
  });

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

  // Compute metrics dynamically
  const metrics = useMemo(() => {
    const totalPipelineValue = deals.reduce((acc, deal) => acc + (deal.value || 0), 0);
    const completedDeals = deals.filter(d => d.stage === 'completed' || d.stage === 'closed');
    const conversionRate = deals.length > 0 ? ((completedDeals.length / deals.length) * 100).toFixed(1) : '0.0';
    const activeDeals = deals.filter(d => d.stage !== 'completed' && d.stage !== 'closed');
    
    return {
      totalPipelineValue,
      activeDealsCount: activeDeals.length,
      conversionRate
    };
  }, [deals]);

  const getStageBadgeColor = (stage: string) => {
    switch(stage) {
      case 'new_lead':
      case 'requirement_review':
        return 'bg-amber-100 text-amber-700';
      case 'proposal_sent':
      case 'in_progress':
      case 'under_review':
        return 'bg-blue-100 text-blue-700';
      case 'completed':
      case 'closed':
        return 'bg-emerald-100 text-emerald-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getStageDisplay = (stage: string) => {
    switch(stage) {
      case 'new_lead': return 'Pending Review';
      case 'requirement_review': return 'Reviewing Requirements';
      case 'proposal_sent': return 'Proposal Sent';
      case 'in_progress': return 'In Progress';
      case 'under_review': return 'Under Review';
      case 'completed': return 'Completed';
      case 'closed': return 'Closed';
      default: return stage.replace('_', ' ');
    }
  };

  return (
    <div className="h-full flex flex-col p-8 space-y-8 overflow-y-auto custom-scrollbar bg-[#FAFAFA] relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
              <Target className="w-6 h-6" />
            </div>
            CRM & Sales Hub
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">Monitor your sales pipelines, lead generation, and CRM integrations.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => setShowChat(true)} variant="outline" className="shadow-sm">
            <Bot className="w-4 h-4 mr-2 text-indigo-500" />
            Ask Sales AI
          </Button>
          <Button onClick={() => setShowModal(true)} variant="primary" className="bg-rose-600 hover:bg-rose-700 border-none shadow-lg shadow-rose-500/20">
            <Plus className="w-4 h-4 mr-2" />
            Request CRM Setup
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-rose-200 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
              <Filter className="w-5 h-5" />
            </div>
          </div>
          <div className="text-sm font-semibold text-slate-500 mb-1">Active Deals & Leads</div>
          <div className="text-3xl font-bold text-slate-900">{metrics.activeDealsCount}</div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-rose-200 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Users className="w-5 h-5" />
            </div>
            {deals.length > 0 && <span className="text-xs font-bold text-emerald-600 flex items-center"><ArrowUpRight className="w-3 h-3 mr-1"/> Valid</span>}
          </div>
          <div className="text-sm font-semibold text-slate-500 mb-1">Conversion Rate</div>
          <div className="text-3xl font-bold text-slate-900">{metrics.conversionRate}%</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-rose-200 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <BarChart className="w-5 h-5" />
            </div>
          </div>
          <div className="text-sm font-semibold text-slate-500 mb-1">Total Pipeline Value</div>
          <div className="text-3xl font-bold text-slate-900">${metrics.totalPipelineValue.toLocaleString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-0 flex-1">
        {/* Active CRM Integrations & Setup */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 flex flex-col min-h-[400px]">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-rose-500" />
            Active CRM Integrations & Setup
          </h2>
          
          <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-2">
            {deals.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Target className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p>No active deals or integrations.</p>
                <p className="text-sm mt-1">Request a CRM setup to get started.</p>
              </div>
            ) : (
              deals.map(deal => (
                <div key={deal.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-slate-50 hover:bg-white rounded-2xl border border-slate-100 hover:border-rose-200 transition-colors gap-4">
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg">{deal.title}</h4>
                    <p className="text-sm text-slate-500 mt-1 font-medium">Value: ${deal.value.toLocaleString()}</p>
                  </div>
                  <div className="flex flex-col sm:items-end">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full mb-2 uppercase tracking-wider ${getStageBadgeColor(deal.stage)}`}>
                      {getStageDisplay(deal.stage)}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Probability: {deal.probability}%</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* CRM Setup Requests */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 flex flex-col min-h-[400px]">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Inbox className="w-5 h-5 text-indigo-500" />
            Recent CRM Requests
          </h2>
          
          <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-2">
            {crmRequests.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p>No recent CRM requests.</p>
              </div>
            ) : (
              crmRequests.map(req => (
                <div key={req.id} className="p-5 bg-slate-50 hover:bg-white rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md uppercase tracking-wider">
                        #{req.id.slice(-6)}
                      </span>
                    </div>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider shrink-0 ${
                      (req.status === 'PENDING' || req.status === 'REVIEWING') ? 'bg-amber-100 text-amber-700' :
                      (req.status === 'APPROVED' || req.status === 'COMPLETED') ? 'bg-emerald-100 text-emerald-700' :
                      req.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' :
                      'bg-indigo-100 text-indigo-700'
                    }`}>
                      {req.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="bg-white border border-slate-100 p-4 rounded-xl">
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{req.notes || 'No notes provided.'}</p>
                  </div>
                  <div className="flex items-center justify-between mt-3 px-1">
                    <span className="text-xs text-slate-400 font-medium">Requested: {new Date(req.createdAt).toLocaleDateString()}</span>
                    <span className="text-xs font-bold text-slate-500">Priority: <span className={req.priority === 'HIGH' ? 'text-rose-600' : 'text-slate-700'}>{req.priority}</span></span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {showModal && <CrmServiceRequestModal onClose={() => setShowModal(false)} />}

      {/* AI Assistant Chat */}
      {showChat && (
        <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden z-50">
          <div className="bg-gradient-to-r from-rose-500 to-orange-500 p-4 flex justify-between items-center text-white shrink-0">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <h3 className="font-bold">AI Sales Assistant</h3>
            </div>
            <button onClick={() => setShowChat(false)} className="text-rose-100 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="h-80 p-4 overflow-y-auto bg-slate-50 flex flex-col gap-3 custom-scrollbar">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                  msg.role === 'user' ? 'bg-rose-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none'
                }`}>
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
              placeholder="Ask about deals or CRM..." 
              className="flex-1 bg-slate-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 border-none"
            />
            <button 
              onClick={handleSendMessage}
              disabled={!chatInput.trim() || isTyping}
              className="bg-rose-600 text-white p-2 rounded-full hover:bg-rose-700 disabled:opacity-50 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
