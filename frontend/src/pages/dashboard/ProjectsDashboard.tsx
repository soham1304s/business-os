import { Briefcase, CheckCircle, AlertCircle, Clock, Plus, Filter, Users, ArrowUpRight, BarChart } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function ProjectsDashboard() {
  return (
    <div className="h-full flex flex-col space-y-8 overflow-y-auto custom-scrollbar p-2 sm:p-0">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <Briefcase className="w-6 h-6" />
            </div>
            Projects Command Center
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">Manage deliverables, track milestones, and oversee team capacity.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="shadow-sm">
            <Filter className="w-4 h-4 mr-2 text-slate-500" />
            Filter
          </Button>
          <Button variant="primary" className="bg-indigo-600 hover:bg-indigo-700 border-none shadow-lg shadow-indigo-500/20">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-200 transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-500 mb-1">Active Projects</div>
            <div className="text-3xl font-bold text-slate-900">34</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-200 transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
              <CheckCircle className="w-5 h-5" />
            </div>
            <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-md flex items-center">
              Avg. 68%
            </span>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-500 mb-1">Milestones Completed</div>
            <div className="text-3xl font-bold text-slate-900">142</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-200 transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform">
              <AlertCircle className="w-5 h-5" />
            </div>
            <span className="px-2 py-1 bg-rose-50 text-rose-600 text-xs font-bold rounded-md flex items-center">
              Action Needed
            </span>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-500 mb-1">Projects at Risk</div>
            <div className="text-3xl font-bold text-slate-900">3</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-200 transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-500 mb-1">Team Members Deployed</div>
            <div className="text-3xl font-bold text-slate-900">18</div>
          </div>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
        
        {/* Active Project Portfolio */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BarChart className="w-5 h-5 text-indigo-500" />
              Project Portfolio
            </h2>
            <Button variant="outline" className="text-xs">View All (34)</Button>
          </div>
          <div className="p-0 flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold border-b border-slate-100">Project / Client</th>
                  <th className="p-4 font-semibold border-b border-slate-100">Category</th>
                  <th className="p-4 font-semibold border-b border-slate-100">Progress</th>
                  <th className="p-4 font-semibold border-b border-slate-100">Status</th>
                  <th className="p-4 font-semibold border-b border-slate-100"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { name: 'Website Redesign', client: 'Acme Corp', category: 'Design', progress: 85, status: 'ON_TRACK' },
                  { name: 'Q3 Ad Campaign', client: 'Stark Industries', category: 'Marketing', progress: 45, status: 'AT_RISK' },
                  { name: 'CRM Migration', client: 'Wayne Ent.', category: 'Engineering', progress: 15, status: 'ON_TRACK' },
                  { name: 'Employee Handbook', client: 'Globex', category: 'HR', progress: 95, status: 'COMPLETED' },
                  { name: 'Tax Audit Prep', client: 'Initech', category: 'Finance', progress: 60, status: 'BLOCKED' }
                ].map((proj, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{proj.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{proj.client}</div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        {proj.category}
                      </span>
                    </td>
                    <td className="p-4 w-48">
                      <div className="flex items-center gap-3">
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${proj.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`} 
                            style={{ width: `${proj.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-semibold text-slate-700 w-8">{proj.progress}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase whitespace-nowrap ${
                        proj.status === 'ON_TRACK' ? 'bg-emerald-100 text-emerald-700' :
                        proj.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
                        proj.status === 'AT_RISK' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {proj.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="outline" className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-slate-400 hover:text-indigo-600">
                        <ArrowUpRight className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Milestones & Activity */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-500" />
              Recent Milestones
            </h2>
          </div>
          <div className="p-6 flex-1 custom-scrollbar overflow-y-auto">
            
            <div className="relative pl-6 border-l-2 border-indigo-100 space-y-8">
              
              <div className="relative">
                <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white shadow-sm"></div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Wireframes Approved</p>
                  <p className="text-xs text-slate-500 mt-1">Client signed off on Acme Corp redesign.</p>
                  <p className="text-xs text-slate-400 mt-1 font-medium">Today at 10:42 AM</p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-blue-500 border-4 border-white shadow-sm"></div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Sprint Planning Finished</p>
                  <p className="text-xs text-slate-500 mt-1">Engineering team allocated to Wayne Ent. CRM.</p>
                  <p className="text-xs text-slate-400 mt-1 font-medium">Yesterday</p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-rose-500 border-4 border-white shadow-sm"></div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Blocker Raised</p>
                  <p className="text-xs text-slate-500 mt-1">Initech Tax Audit delayed due to missing forms.</p>
                  <p className="text-xs text-slate-400 mt-1 font-medium">2 days ago</p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-purple-500 border-4 border-white shadow-sm"></div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Project Kicked Off</p>
                  <p className="text-xs text-slate-500 mt-1">Initial onboarding call with Globex completed.</p>
                  <p className="text-xs text-slate-400 mt-1 font-medium">3 days ago</p>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
