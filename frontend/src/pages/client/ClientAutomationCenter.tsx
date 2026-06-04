import { useState } from 'react';
import { Bot, Zap, PlayCircle, Settings, Plus, Activity } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { AutomationServiceRequestModal } from '../../components/client/AutomationServiceRequestModal';

export function ClientAutomationCenter() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="h-full flex flex-col p-8 space-y-8 overflow-y-auto custom-scrollbar bg-[#FAFAFA]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
              <Bot className="w-6 h-6" />
            </div>
            AI & Automation Hub
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">Manage custom AI agents, chatbots, and workflow automations.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="shadow-sm">
            <Settings className="w-4 h-4 mr-2 text-slate-500" />
            Settings
          </Button>
          <Button onClick={() => setShowModal(true)} variant="primary" className="bg-purple-600 hover:bg-purple-700 border-none shadow-lg shadow-purple-500/20">
            <Plus className="w-4 h-4 mr-2" />
            Request New Automation
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <Bot className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">All Systems Operational</span>
          </div>
          <div className="text-sm font-semibold text-slate-500 mb-1">Active AI Agents</div>
          <div className="text-2xl font-bold text-slate-900">3</div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="text-sm font-semibold text-slate-500 mb-1">Tasks Automated (This Month)</div>
          <div className="text-2xl font-bold text-slate-900">4,592</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="text-sm font-semibold text-slate-500 mb-1">Time Saved</div>
          <div className="text-2xl font-bold text-slate-900">128 Hours</div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 flex-1">
        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Zap className="w-5 h-5 text-purple-500" />
          Active Workflows
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-3">
                <div className="mt-1">
                  <PlayCircle className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-lg">Customer Support Bot</h4>
                  <p className="text-sm text-slate-500 mt-1">Intercom + GPT-4 Integration</p>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center text-sm">
              <span className="text-slate-500">1,240 queries resolved</span>
              <Button variant="outline" className="text-xs px-3 py-1">View Logs</Button>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-3">
                <div className="mt-1">
                  <PlayCircle className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-lg">Invoice Auto-Reminders</h4>
                  <p className="text-sm text-slate-500 mt-1">Stripe + SendGrid Workflow</p>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center text-sm">
              <span className="text-slate-500">42 emails sent today</span>
              <Button variant="outline" className="text-xs px-3 py-1">View Logs</Button>
            </div>
          </div>
        </div>
      </div>
      {showModal && <AutomationServiceRequestModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
