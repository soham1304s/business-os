import { BarChart3, TrendingUp, DollarSign, Users, Activity, Target, PieChart, ArrowUpRight, ArrowDownRight, Calendar, Filter } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function AnalyticsDashboard() {
  return (
    <div className="h-full flex flex-col space-y-8 overflow-y-auto custom-scrollbar p-2 sm:p-0">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <BarChart3 className="w-6 h-6" />
            </div>
            Analytics & BI
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">Business intelligence, revenue growth, and agency performance metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="shadow-sm bg-white">
            <Calendar className="w-4 h-4 mr-2 text-slate-500" />
            Last 30 Days
          </Button>
          <Button variant="outline" className="shadow-sm bg-white">
            <Filter className="w-4 h-4 mr-2 text-slate-500" />
            Filter
          </Button>
          <Button variant="primary" className="bg-emerald-600 hover:bg-emerald-700 border-none shadow-lg shadow-emerald-500/20">
            Export Report
          </Button>
        </div>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-emerald-200 transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-md flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-1"/> 12.5%
            </span>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-500 mb-1">Monthly Recurring Revenue</div>
            <div className="text-3xl font-bold text-slate-900">$245,500</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-emerald-200 transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
              <Target className="w-5 h-5" />
            </div>
            <span className="px-2 py-1 bg-rose-50 text-rose-600 text-xs font-bold rounded-md flex items-center">
              <ArrowDownRight className="w-3 h-3 mr-1"/> 4.2%
            </span>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-500 mb-1">Customer Acquisition Cost</div>
            <div className="text-3xl font-bold text-slate-900">$4,250</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-emerald-200 transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-md flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-1"/> 8.1%
            </span>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-500 mb-1">Lifetime Value (LTV)</div>
            <div className="text-3xl font-bold text-slate-900">$84,000</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-emerald-200 transition-colors group">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-md flex items-center">
              <ArrowDownRight className="w-3 h-3 mr-1"/> -1.2%
            </span>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-500 mb-1">Net Revenue Churn</div>
            <div className="text-3xl font-bold text-slate-900">0.8%</div>
          </div>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
        
        {/* Revenue Growth Chart Area (Mocked) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-500" />
              MRR Growth (Trailing 12 Months)
            </h2>
          </div>
          <div className="p-6 flex-1 flex flex-col">
            
            {/* Mocked Chart Visualization */}
            <div className="flex-1 flex items-end justify-between gap-2 h-64 mt-4 relative">
              
              {/* Y-axis Labels */}
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-slate-400 font-medium pb-8 w-10">
                <span>$250k</span>
                <span>$150k</span>
                <span>$50k</span>
              </div>
              
              {/* Grid Lines */}
              <div className="absolute left-10 right-0 top-2 border-b border-slate-100"></div>
              <div className="absolute left-10 right-0 top-1/2 border-b border-slate-100"></div>
              <div className="absolute left-10 right-0 bottom-8 border-b border-slate-200"></div>

              {/* Bars */}
              <div className="ml-10 flex-1 flex items-end justify-between gap-1 sm:gap-2 h-full pb-8 z-10">
                {[45, 52, 58, 65, 62, 70, 78, 85, 92, 88, 95, 100].map((height, i) => (
                  <div key={i} className="relative flex flex-col justify-end w-full group">
                    <div 
                      className="w-full bg-emerald-100 rounded-t-md border-t-2 border-emerald-400 group-hover:bg-emerald-200 transition-colors cursor-pointer relative"
                      style={{ height: `${height}%` }}
                    >
                      {/* Tooltip on hover */}
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold py-1 px-2 rounded pointer-events-none transition-opacity whitespace-nowrap z-20">
                        ${Math.round(height * 2.45)}k
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* X-axis Labels */}
              <div className="absolute left-10 right-0 bottom-0 flex justify-between text-[10px] sm:text-xs text-slate-400 font-semibold px-2">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
                <span>Sep</span>
                <span>Oct</span>
                <span>Nov</span>
                <span>Dec</span>
              </div>
            </div>

          </div>
        </div>

        {/* Breakdown Panel */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-emerald-500" />
              Revenue by Service
            </h2>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-center space-y-8">
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm font-semibold mb-1">
                  <span className="text-slate-700">Digital Marketing</span>
                  <span className="text-slate-900">42%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div className="bg-indigo-500 h-2.5 rounded-full" style={{ width: '42%' }}></div>
                </div>
                <p className="text-xs text-slate-500 mt-1.5 text-right">$103,110 MRR</p>
              </div>

              <div>
                <div className="flex justify-between text-sm font-semibold mb-1">
                  <span className="text-slate-700">AI Automation</span>
                  <span className="text-slate-900">28%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: '28%' }}></div>
                </div>
                <p className="text-xs text-slate-500 mt-1.5 text-right">$68,740 MRR</p>
              </div>

              <div>
                <div className="flex justify-between text-sm font-semibold mb-1">
                  <span className="text-slate-700">Recruitment & HR</span>
                  <span className="text-slate-900">18%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '18%' }}></div>
                </div>
                <p className="text-xs text-slate-500 mt-1.5 text-right">$44,190 MRR</p>
              </div>

              <div>
                <div className="flex justify-between text-sm font-semibold mb-1">
                  <span className="text-slate-700">Finance & Legal</span>
                  <span className="text-slate-900">12%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '12%' }}></div>
                </div>
                <p className="text-xs text-slate-500 mt-1.5 text-right">$29,460 MRR</p>
              </div>
            </div>
            
            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
              <p className="text-sm text-emerald-800 font-medium leading-relaxed">
                <strong className="block mb-1">BI Insight</strong>
                AI Automation is your fastest growing segment (up 45% YoY). Consider upselling AI bots to existing Digital Marketing clients to increase LTV.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
