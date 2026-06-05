import { useState, useEffect, useRef } from 'react';
import { Shield, FileText, Download, CheckCircle, Bot, Plus, Clock, X, Send } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import { FinanceServiceRequestModal } from '../../components/client/FinanceServiceRequestModal';
import { API_URL } from '../../config';
import { useLiveUpdate } from '../../hooks/useLiveUpdate';

export function ClientFinanceCenter() {
  const { token } = useAuthStore();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [financeRequests, setFinanceRequests] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showChat, setShowChat] = useState(false);
  
  const [chatMessages, setChatMessages] = useState<{role: string, content: string}[]>([
    { role: 'assistant', content: 'Hello! I am your AI Finance & Compliance Assistant. Ask me about your invoices, tax filings, or company compliance requirements.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchInvoices();
    fetchRequests();
  }, [token]);

  useLiveUpdate(['new-request', 'update-request', 'metrics-updated', 'new-activity'], () => {
    fetchInvoices();
    fetchRequests();
  });

  useEffect(() => {
    if (showChat) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, showChat]);

  const fetchInvoices = async () => {
    try {
      const res = await fetch(`${API_URL}/api/client/invoices`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setInvoices(data);
      }
    } catch (err) { console.error(err); }
  };

  const fetchRequests = async () => {
    try {
      const res = await fetch(`${API_URL}/api/service-requests?type=Finance & Compliance`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setFinanceRequests(await res.json());
    } catch (err) { console.error(err); }
  };

  const handlePay = async (invoiceId: string) => {
    try {
      await fetch(`${API_URL}/api/client/invoices/${invoiceId}/pay`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchInvoices();
    } catch (err) { console.error(err); }
  };

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <Shield className="w-6 h-6" />
            </div>
            Finance & Compliance
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">Manage invoices, tax filings, and company compliance documents.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => setShowChat(true)} variant="outline" className="shadow-sm">
            <Bot className="w-4 h-4 mr-2 text-indigo-500" />
            Ask Finance AI
          </Button>
          <Button onClick={() => setShowModal(true)} variant="primary" className="bg-emerald-600 hover:bg-emerald-700 border-none shadow-lg shadow-emerald-500/20">
            <Plus className="w-4 h-4 mr-2" />
            Request Service
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
        
        {/* Compliance Section */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 flex flex-col min-h-[400px]">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-500" />
            Compliance & Service Requests
          </h2>
          <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-2">
            {financeRequests.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Shield className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p>No compliance or finance requests found.</p>
                <p className="text-sm mt-1">Request a service to get started.</p>
              </div>
            ) : (
              financeRequests.map(req => (
                <div key={req.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-colors gap-4">
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 p-1.5 rounded-full ${
                      req.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {req.status === 'COMPLETED' ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{req.notes ? req.notes.split('\n')[0].substring(0, 40) + (req.notes.length > 40 ? '...' : '') : 'Finance Request'}</h4>
                      <p className="text-xs text-slate-500 mt-1 font-medium">Requested: {new Date(req.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
                      req.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                      req.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                      req.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {req.status.replace('_', ' ')}
                    </span>
                    {req.status === 'COMPLETED' && (
                      <Button variant="outline" className="text-xs px-3 py-1 h-7 border-slate-200">
                        <Download className="w-3 h-3 mr-1"/> Doc
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Invoices Section */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 flex flex-col min-h-[400px]">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            Recent Invoices
          </h2>
          
          <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-2">
            {invoices.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p>No invoices found.</p>
              </div>
            ) : (
              invoices.map(inv => (
                <div key={inv.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors">
                  <div>
                    <h4 className="font-bold text-slate-800">#{inv.invoiceNo}</h4>
                    <p className="text-sm text-slate-500 mt-0.5 font-medium">Due: {new Date(inv.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-bold text-slate-900 text-lg">${inv.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                      <span className={`text-xs font-bold uppercase tracking-wider ${inv.status === 'PAID' ? 'text-emerald-500' : 'text-orange-500'}`}>
                        {inv.status}
                      </span>
                    </div>
                    {inv.status === 'UNPAID' || inv.status === 'PENDING' ? (
                      <Button onClick={() => handlePay(inv.id)} variant="primary" className="text-xs px-4 py-2 bg-indigo-600 hover:bg-indigo-700 border-none shadow-md shadow-indigo-500/20">
                        Pay Now
                      </Button>
                    ) : null}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
      {showModal && <FinanceServiceRequestModal onClose={() => setShowModal(false)} />}

      {/* AI Assistant Chat */}
      {showChat && (
        <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden z-50">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4 flex justify-between items-center text-white shrink-0">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <h3 className="font-bold">AI Finance Assistant</h3>
            </div>
            <button onClick={() => setShowChat(false)} className="text-emerald-100 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="h-80 p-4 overflow-y-auto bg-slate-50 flex flex-col gap-3 custom-scrollbar">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                  msg.role === 'user' ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none'
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
              placeholder="Ask about compliance or invoices..." 
              className="flex-1 bg-slate-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 border-none"
            />
            <button 
              onClick={handleSendMessage}
              disabled={!chatInput.trim() || isTyping}
              className="bg-emerald-600 text-white p-2 rounded-full hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
