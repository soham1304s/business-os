import { useState } from 'react';
import { Users, FileText, Briefcase, Plus, CheckCircle, Shield, Bot } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { HrServiceRequestModal } from '../../components/client/HrServiceRequestModal';

export function ClientHrCenter() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="h-full flex flex-col p-8 space-y-8 overflow-y-auto custom-scrollbar bg-[#FAFAFA]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
            HR & Recruitment Hub
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">Manage policies, team requests, and hiring pipelines.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="shadow-sm">
            <Bot className="w-4 h-4 mr-2 text-indigo-500" />
            Ask HR Assistant
          </Button>
          <Button onClick={() => setShowModal(true)} variant="primary" className="bg-emerald-600 hover:bg-emerald-700 border-none shadow-lg shadow-emerald-500/20">
            <Plus className="w-4 h-4 mr-2" />
            New HR Request
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <Briefcase className="w-5 h-5 text-emerald-500" />
            <h3 className="font-bold text-slate-800">Open Positions</h3>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-2">3</div>
          <p className="text-sm text-slate-500">12 Candidates in pipeline</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-5 h-5 text-indigo-500" />
            <h3 className="font-bold text-slate-800">Active Policies</h3>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-2">8</div>
          <p className="text-sm text-slate-500">Updated last week</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-orange-500" />
            <h3 className="font-bold text-slate-800">Compliance Status</h3>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-6 h-6 text-emerald-500" />
            <span className="text-xl font-bold text-slate-900">100% Secure</span>
          </div>
          <p className="text-sm text-slate-500">All employee records up to date</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Recent HR Requests</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Draft WFH Policy</h4>
                  <p className="text-sm text-slate-500">Requested 2 days ago</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">Completed</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Hire Sr. Frontend Dev</h4>
                  <p className="text-sm text-slate-500">Requested 1 week ago</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">In Progress</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-3xl shadow-lg p-6 text-white border border-slate-800">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-400" />
            AI HR Insights
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
              <p className="text-sm text-slate-300 leading-relaxed">
                Based on your recent hiring pace, I recommend generating an updated <strong className="text-white">Onboarding Checklist</strong>. Would you like me to draft one for your review?
              </p>
              <div className="mt-4 flex gap-3">
                <Button variant="primary" className="bg-indigo-500 hover:bg-indigo-600 border-none text-xs px-4 py-1.5">Yes, Draft It</Button>
                <Button variant="outline" className="border-slate-600 text-slate-300 hover:text-white text-xs px-4 py-1.5">Dismiss</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showModal && <HrServiceRequestModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
