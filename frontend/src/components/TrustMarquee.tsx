import { motion } from 'framer-motion';

const COMPANIES = [
  "Acme Corp", "GlobalTech", "Nexus", "Quantum", "Apex", "Horizon", 
  "Zenith", "Pinnacle", "Summit", "Vertex", "Acme Corp", "GlobalTech"
];

export function TrustMarquee() {
  return (
    <section className="py-12 border-y border-slate-200 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-6 text-center">
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
          Trusted by innovative companies worldwide
        </p>
      </div>
      <div className="relative flex overflow-x-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        
        <motion.div
          animate={{ x: [0, -1035] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
          className="flex whitespace-nowrap"
        >
          {COMPANIES.map((company, index) => (
            <div 
              key={index} 
              className="mx-8 text-2xl font-bold text-slate-300 select-none flex items-center justify-center min-w-[150px]"
            >
              {company}
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {COMPANIES.map((company, index) => (
            <div 
              key={`dup-${index}`} 
              className="mx-8 text-2xl font-bold text-slate-300 select-none flex items-center justify-center min-w-[150px]"
            >
              {company}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
