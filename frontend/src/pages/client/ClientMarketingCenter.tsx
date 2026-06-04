import { useState, useEffect, useRef } from 'react';
import { Megaphone, Plus, Bot, Send, X, TrendingUp, BarChart3, Target } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { MarketingServiceRequestModal } from '../../components/client/MarketingServiceRequestModal';
import { useAuthStore } from '../../store/authStore';
import { API_URL } from '../../config';

export function ClientMarketingCenter() {
  const [showModal, setShowModal] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const { token } = useAuthStore();
  
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    totalImpressions: 0,
    totalClicks: 0,
    cpc: '0.00'
  });

  const [chatMessages, setChatMessages] = useState<{role: string, content: string}[]>([
    { role: 'assistant', content: 'Hi there! I am your AI Marketing Assistant. Ask me about your ad performance, how to optimize your budget, or ideas for new campaigns.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const campRes = await fetch(`${API_URL}/api/marketing/campaigns`, { headers });
      if (campRes.ok) setCampaigns(await campRes.json());

      const statsRes = await fetch(`${API_URL}/api/marketing/stats`, { headers });
      if (statsRes.ok) setStats(await statsRes.json());

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
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
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
              <Megaphone className="w-6 h-6" />
            </div>
            Digital Marketing Hub
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">Track ad performance, campaigns, and content strategies.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => setShowChat(true)} variant="outline" className="shadow-sm">
            <Bot className="w-4 h-4 mr-2 text-indigo-500" />
            Ask Marketing AI
          </Button>
          <Button onClick={() => setShowModal(true)} variant="primary" className="bg-indigo-600 hover:bg-indigo-700 border-none shadow-lg shadow-indigo-500/20">
            <Plus className="w-4 h-4 mr-2" />
            New Campaign Request
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-2 py-1 rounded-md text-xs font-bold uppercase">
              <BarChart3 className="w-3.5 h-3.5" /> Impressions
            </div>
            <span className="text-emerald-500 text-xs font-bold flex items-center gap-1">+12%</span>
          </div>
          <div>
            <div className="text-3xl font-bold text-slate-900 mb-1">
              {stats.totalImpressions > 1000 ? `${(stats.totalImpressions / 1000).toFixed(1)}K` : stats.totalImpressions}
            </div>
            <p className="text-sm text-slate-500">Total Ad Views</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-2 py-1 rounded-md text-xs font-bold uppercase">
              <Target className="w-3.5 h-3.5" /> Clicks
            </div>
            <span className="text-emerald-500 text-xs font-bold flex items-center gap-1">+8.4%</span>
          </div>
          <div>
            <div className="text-3xl font-bold text-slate-900 mb-1">
              {stats.totalClicks.toLocaleString()}
            </div>
            <p className="text-sm text-slate-500">Total Interactions</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2 text-purple-600 bg-purple-50 px-2 py-1 rounded-md text-xs font-bold uppercase">
              <TrendingUp className="w-3.5 h-3.5" /> Efficiency
            </div>
            <span className="text-emerald-500 text-xs font-bold flex items-center gap-1">-1.2%</span>
          </div>
          <div>
            <div className="text-3xl font-bold text-slate-900 mb-1">
              ${stats.cpc}
            </div>
            <p className="text-sm text-slate-500">Cost Per Click (CPC)</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-500" />
            Active Campaigns
          </h2>
          
          <div className="space-y-4">
            {campaigns.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No active campaigns found. Create a new request!</div>
            ) : (
              campaigns.map(camp => (
                <div key={camp.id} className="p-5 rounded-2xl border border-slate-100 bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-indigo-200 transition-colors">
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg">{camp.name}</h4>
                    <p className="text-sm text-slate-500 mt-1">Platform: {camp.type}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Spend</div>
                      <div className="font-bold text-slate-900">${(camp.budget || 0).toLocaleString()}</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      camp.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' :
                      camp.status === 'PAUSED' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {camp.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2 relative z-10">
            <Bot className="w-5 h-5 text-amber-400" />
            Marketing AI Insights
          </h3>
          <div className="space-y-4 relative z-10 flex-1">
            <div className="bg-white/10 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <h4 className="font-bold text-sm mb-2 text-indigo-200">Budget Optimization</h4>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                Your <strong className="text-white">LinkedIn ads</strong> are currently outperforming Google Ads in conversion rate by <span className="text-emerald-400 font-bold">18%</span>. I recommend shifting $1,000 of the remaining budget to LinkedIn.
              </p>
              <Button onClick={() => setShowChat(true)} className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold border-none">
                Apply Recommendation
              </Button>
            </div>
          </div>
        </div>

      </div>

      {showModal && <MarketingServiceRequestModal onClose={() => { setShowModal(false); fetchData(); }} />}

      {/* AI Marketing Assistant Modal */}
      {showChat && (
        <div className="fixed bottom-6 right-6 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden z-50">
          <div className="bg-indigo-600 p-4 flex justify-between items-center text-white shrink-0">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <h3 className="font-bold">Marketing AI</h3>
            </div>
            <button onClick={() => setShowChat(false)} className="text-indigo-200 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="h-80 p-4 overflow-y-auto bg-slate-50 flex flex-col gap-3">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl px-4 py-2 text-sm bg-white border border-slate-200 text-slate-500 rounded-bl-none shadow-sm flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
              placeholder="Ask about marketing..." 
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
