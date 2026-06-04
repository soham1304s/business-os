import { ShieldCheck, AlertTriangle, FileCheck, Lock, ShieldAlert, CheckCircle, Search, Filter, Shield, AlertOctagon, Clock } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function ComplianceDashboard() {
  return (
    <div className="h-full flex flex-col space-y-8 overflow-y-auto custom-scrollbar p-2 sm:p-0">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            Compliance & Security Center
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">Monitor regulatory compliance, data privacy, and legal policies across all clients.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="shadow-sm">
            <Filter className="w-4 h-4 mr-2 text-slate-500" />
            Filter Audits
          </Button>
          <Button variant="primary" className="bg-rose-600 hover:bg-rose-700 border-none shadow-lg shadow-rose-500/20">
            <Search className="w-4 h-4 mr-2" />
            Run Global Audit
          </Button>
        </div>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-rose-200 transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
              <Shield className="w-5 h-5" />
            </div>
            <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-md flex items-center">
              Excellent
            </span>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-500 mb-1">Global Health Score</div>
            <div className="text-3xl font-bold text-slate-900">94/100</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-rose-200 transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <span className="px-2 py-1 bg-rose-50 text-rose-600 text-xs font-bold rounded-md flex items-center">
              Requires Action
            </span>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-500 mb-1">Critical Violations</div>
            <div className="text-3xl font-bold text-slate-900">2</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-rose-200 transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-500 mb-1">Pending Audits</div>
            <div className="text-3xl font-bold text-slate-900">14</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-rose-200 transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
              <Lock className="w-5 h-5" />
            </div>
            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-md flex items-center">
              Active
            </span>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-500 mb-1">Managed Policies</div>
            <div className="text-3xl font-bold text-slate-900">128</div>
          </div>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 flex-1">
        
        {/* Compliance Monitoring Grid */}
        <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-rose-500" />
              Client Compliance Matrix
            </h2>
            <Button variant="outline" className="text-xs">Download CSV</Button>
          </div>
          <div className="p-0 flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold border-b border-slate-100">Client Account</th>
                  <th className="p-4 font-semibold border-b border-slate-100">Data Privacy</th>
                  <th className="p-4 font-semibold border-b border-slate-100">Financial KYC</th>
                  <th className="p-4 font-semibold border-b border-slate-100">Contracts</th>
                  <th className="p-4 font-semibold border-b border-slate-100">Overall Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { name: 'Acme Corp', privacy: 'COMPLIANT', kyc: 'COMPLIANT', contracts: 'COMPLIANT', status: 'VERIFIED' },
                  { name: 'Stark Industries', privacy: 'WARNING', kyc: 'COMPLIANT', contracts: 'EXPIRING_SOON', status: 'AT_RISK' },
                  { name: 'Wayne Ent.', privacy: 'COMPLIANT', kyc: 'COMPLIANT', contracts: 'COMPLIANT', status: 'VERIFIED' },
                  { name: 'Globex', privacy: 'NON_COMPLIANT', kyc: 'WARNING', contracts: 'COMPLIANT', status: 'VIOLATION' },
                  { name: 'Initech', privacy: 'COMPLIANT', kyc: 'PENDING_REVIEW', contracts: 'COMPLIANT', status: 'PENDING' },
                  { name: 'Hooli', privacy: 'COMPLIANT', kyc: 'COMPLIANT', contracts: 'COMPLIANT', status: 'VERIFIED' }
                ].map((client, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-4 font-bold text-slate-900">{client.name}</td>
                    
                    {/* Privacy Col */}
                    <td className="p-4">
                      {client.privacy === 'COMPLIANT' ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      ) : client.privacy === 'WARNING' ? (
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                      ) : (
                        <ShieldAlert className="w-5 h-5 text-rose-500" />
                      )}
                    </td>

                    {/* KYC Col */}
                    <td className="p-4">
                      {client.kyc === 'COMPLIANT' ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      ) : client.kyc === 'WARNING' ? (
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                      ) : client.kyc === 'PENDING_REVIEW' ? (
                        <Clock className="w-5 h-5 text-blue-500" />
                      ) : (
                        <ShieldAlert className="w-5 h-5 text-rose-500" />
                      )}
                    </td>

                    {/* Contracts Col */}
                    <td className="p-4">
                      {client.contracts === 'COMPLIANT' ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      ) : client.contracts === 'EXPIRING_SOON' ? (
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                      ) : (
                        <ShieldAlert className="w-5 h-5 text-rose-500" />
                      )}
                    </td>

                    {/* Overall Status Col */}
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                        client.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-700' :
                        client.status === 'AT_RISK' ? 'bg-amber-100 text-amber-700' :
                        client.status === 'VIOLATION' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {client.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Security Logs & Expiry Warnings */}
        <div className="flex flex-col gap-8">
          
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Action Required
              </h2>
            </div>
            <div className="p-6 flex-1 space-y-4">
              
              <div className="p-4 bg-rose-50 rounded-xl border border-rose-100 flex gap-3">
                <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-rose-900">GDPR Violation Detected</h4>
                  <p className="text-xs text-rose-700 mt-1">Globex has unencrypted PII in their recent CRM import. Immediate remediation required.</p>
                  <Button variant="outline" className="mt-3 text-xs border-rose-200 text-rose-700 hover:bg-rose-100">Review Incident</Button>
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
                <FileCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-amber-900">Contract Expiring</h4>
                  <p className="text-xs text-amber-700 mt-1">Stark Industries Master Services Agreement (MSA) expires in 14 days.</p>
                  <Button variant="outline" className="mt-3 text-xs border-amber-200 text-amber-700 hover:bg-amber-100">Send Renewal</Button>
                </div>
              </div>

            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden flex-1">
            <div className="p-6 border-b border-slate-100 bg-slate-50">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-slate-500" />
                Audit Logs
              </h2>
            </div>
            <div className="p-6 flex-1 custom-scrollbar overflow-y-auto space-y-4">
              
              <div className="flex gap-3 items-start">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-slate-800">Quarterly KYC Audit Passed</p>
                  <p className="text-xs text-slate-500">Wayne Ent. cleared financial review.</p>
                  <p className="text-[10px] text-slate-400 mt-1">Today, 09:41 AM</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-slate-800">New Policy Deployed</p>
                  <p className="text-xs text-slate-500">Updated Data Processing Addendum (DPA) rolled out to 12 clients.</p>
                  <p className="text-[10px] text-slate-400 mt-1">Yesterday, 14:22 PM</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-2 h-2 rounded-full bg-slate-300 mt-2 shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-slate-800">Access Revoked</p>
                  <p className="text-xs text-slate-500">Former employee access terminated across all systems.</p>
                  <p className="text-[10px] text-slate-400 mt-1">Mon, 11:05 AM</p>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
