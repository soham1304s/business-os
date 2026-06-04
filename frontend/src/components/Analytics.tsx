import { motion, useInView, animate } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { TrendingUp, Users, Target, Zap } from 'lucide-react';

function Counter({ from, to, suffix = "", prefix = "" }: { from: number; to: number; suffix?: string, prefix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [count, setCount] = useState(from);

  useEffect(() => {
    if (isInView) {
      const controls = animate(from, to, {
        duration: 2,
        ease: "easeOut",
        onUpdate(value) {
          setCount(Math.round(value));
        }
      });
      return () => controls.stop();
    }
  }, [from, to, isInView]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

const STATS = [
  { label: "Active Users", value: 100, suffix: "k+", prefix: "", icon: Users, color: "text-blue-500", bg: "bg-blue-100" },
  { label: "Revenue Processed", value: 50, suffix: "M+", prefix: "$", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-100" },
  { label: "Tasks Automated", value: 25, suffix: "M+", prefix: "", icon: Zap, color: "text-purple-500", bg: "bg-purple-100" },
  { label: "Customer Satisfaction", value: 99, suffix: "%", prefix: "", icon: Target, color: "text-indigo-500", bg: "bg-indigo-100" },
];

export function Analytics() {
  return (
    <section className="py-24 bg-slate-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
              Insights that drive your <span className="text-indigo-600">business forward</span>
            </h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              BusinessOS provides real-time analytics across all your modules. Understand your cash flow, monitor employee performance, and track marketing ROI without ever leaving the platform.
            </p>
            
            <div className="grid grid-cols-2 gap-8">
               {STATS.map((stat, i) => (
                 <div key={i}>
                   <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
                     <stat.icon className="w-6 h-6" />
                   </div>
                   <div className="text-3xl font-bold text-slate-900 mb-1">
                     <Counter from={0} to={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
                   </div>
                   <div className="text-sm font-medium text-slate-500">{stat.label}</div>
                 </div>
               ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-cyan-400/20 blur-[80px] rounded-full" />
            <div className="relative bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-200/50">
               <div className="flex justify-between items-end mb-8">
                 <div>
                   <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Monthly Recurring Revenue</div>
                   <div className="text-4xl font-bold text-slate-900">$<Counter from={50000} to={124500} /></div>
                 </div>
                 <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-sm font-semibold">
                   <span>+24.5%</span>
                 </div>
               </div>
               
               {/* Animated Area Chart Mock */}
               <div className="h-64 relative flex items-end justify-between gap-1 overflow-hidden">
                  <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <motion.path 
                      d="M0,100 L0,80 Q10,70 20,85 T40,60 T60,40 T80,50 T100,20 L100,100 Z" 
                      fill="url(#gradient)" 
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(99, 102, 241, 0.4)" />
                        <stop offset="100%" stopColor="rgba(99, 102, 241, 0)" />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  {/* Points */}
                  {[
                    { x: '0%', y: '80%' }, { x: '20%', y: '85%' }, { x: '40%', y: '60%' },
                    { x: '60%', y: '40%' }, { x: '80%', y: '50%' }, { x: '100%', y: '20%' }
                  ].map((point, i) => (
                    <motion.div 
                      key={i}
                      className="absolute w-3 h-3 bg-white border-2 border-indigo-500 rounded-full shadow-sm z-10"
                      style={{ left: `calc(${point.x} - 6px)`, top: `calc(${point.y} - 6px)` }}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + (i * 0.1), type: 'spring' }}
                    />
                  ))}
               </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
