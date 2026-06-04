import { motion } from 'framer-motion';
import { Button } from './ui/Button';
import { ArrowRight, Users, Zap, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-50">
      {/* Background Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] opacity-70 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-400/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-sm text-indigo-600 mb-8 shadow-sm"
          >
            <Zap className="w-4 h-4 fill-indigo-500 text-indigo-500" />
            <span className="font-semibold">Introducing BusinessOS 2.0</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 text-slate-900"
          >
            One Platform To Run Your <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-cyan-500 to-indigo-600">
              Entire Business
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg lg:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Replace your disconnected tools. Manage HR, Recruitment, CRM, Finance, Marketing, and AI Automation from a single, beautifully designed dashboard.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full group">
                Start Free Trial
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white">
              Book a Demo
            </Button>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-6 flex items-center justify-center gap-6 text-sm text-slate-500"
          >
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> No credit card required</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> 14-day free trial</div>
          </motion.div>
        </div>

        {/* Dashboard Preview Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-16 relative mx-auto max-w-5xl"
        >
          <div className="rounded-2xl border border-slate-200/60 bg-white/40 p-2 backdrop-blur-xl shadow-2xl shadow-indigo-500/10">
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-white relative md:aspect-[16/9] shadow-inner">
              {/* Fake UI Header */}
              <div className="h-14 border-b border-slate-100 bg-slate-50 flex items-center justify-between px-6">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="h-6 w-64 bg-white border border-slate-200 rounded-md shadow-sm" />
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-200" />
                  <div className="w-8 h-8 rounded-full bg-indigo-100" />
                </div>
              </div>
              
              {/* Fake UI Content */}
              <div className="p-4 sm:p-8 grid grid-cols-1 md:grid-cols-4 gap-6 h-full bg-slate-50/50">
                
                {/* Sidebar Mock */}
                <div className="hidden md:flex flex-col space-y-4 col-span-1 border-r border-slate-100 pr-6">
                   <div className="h-8 w-3/4 bg-slate-200 rounded-md mb-4" />
                   {[...Array(6)].map((_, i) => (
                     <div key={i} className="flex items-center gap-3">
                       <div className="w-5 h-5 rounded-md bg-slate-200" />
                       <div className={`h-4 rounded-md bg-slate-200 ${i === 0 ? 'w-2/3 bg-indigo-100' : 'w-1/2'}`} />
                     </div>
                   ))}
                </div>

                {/* Main Content Mock */}
                <div className="md:col-span-3 space-y-6">
                  {/* Top Widgets */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                    <div className="h-32 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col p-5">
                      <div className="text-sm font-medium text-slate-500 mb-2">Total Revenue</div>
                      <div className="text-2xl font-bold text-slate-900 mb-auto">$124,500</div>
                      <div className="text-xs text-green-500 flex items-center gap-1">↑ 12.5% from last month</div>
                    </div>
                    <div className="h-32 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col p-5">
                      <div className="text-sm font-medium text-slate-500 mb-2">Active Clients</div>
                      <div className="text-2xl font-bold text-slate-900 mb-auto">1,248</div>
                      <div className="text-xs text-green-500 flex items-center gap-1">↑ 4.2% from last month</div>
                    </div>
                    <div className="h-32 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 border border-indigo-400 shadow-md shadow-indigo-200 flex flex-col p-5">
                      <div className="text-sm font-medium text-indigo-100 mb-2">New Deals</div>
                      <div className="text-2xl font-bold text-white mb-auto">84</div>
                      <div className="h-1.5 w-full bg-indigo-400 rounded-full overflow-hidden mt-2">
                        <div className="h-full w-2/3 bg-white rounded-full" />
                      </div>
                    </div>
                  </div>

                  {/* Chart Mock */}
                  <div className="h-48 sm:h-64 rounded-xl bg-white border border-slate-200 shadow-sm p-4 sm:p-6 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                      <div className="text-lg font-semibold text-slate-900">Revenue Overview</div>
                      <div className="h-8 w-24 bg-slate-100 rounded-lg" />
                    </div>
                    {/* Simulated chart bars */}
                    <div className="absolute bottom-6 left-6 right-6 h-32 flex items-end justify-between gap-2">
                      {[40, 60, 45, 80, 55, 90, 75, 100, 65, 85, 50, 70].map((h, i) => (
                        <div key={i} className="w-full bg-indigo-100 rounded-t-sm" style={{ height: `${h}%` }}>
                          <div className="w-full bg-indigo-500 rounded-t-sm" style={{ height: `${h * 0.7}%` }} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
          
          {/* Floating Widgets */}
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="absolute -right-12 top-20 hidden lg:block z-20"
          >
            <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-xl shadow-slate-200/50 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Invoice Paid</div>
                <div className="font-bold text-lg text-slate-900">+$4,200.00</div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }}
            className="absolute -left-12 bottom-32 hidden lg:block z-20"
          >
            <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-xl shadow-slate-200/50 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">New Candidate</div>
                <div className="font-bold text-lg text-slate-900">Sarah Jenkins</div>
                <div className="text-xs text-slate-500">Applied for Senior Dev</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
