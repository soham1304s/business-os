import { motion } from 'framer-motion';
import { Bot, Mail, MessageSquare, Zap, GitBranch } from 'lucide-react';
import { Button } from './ui/Button';

export function AiAutomation() {
  return (
    <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="order-2 lg:order-1"
          >
            {/* Workflow Builder Mockup */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-xl relative shadow-2xl">
              <div className="flex gap-4 mb-8 text-sm">
                <div className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-md border border-indigo-500/30">Trigger</div>
                <div className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-md">Condition</div>
                <div className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-md">Action</div>
              </div>

              <div className="space-y-4 relative">
                {/* Flow lines */}
                <div className="absolute left-8 top-12 bottom-12 w-0.5 bg-slate-700 z-0" />
                
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="bg-slate-900 border border-slate-600 rounded-xl p-4 flex items-center gap-4 relative z-10 w-3/4 shadow-lg"
                >
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-200">New Lead</div>
                    <div className="text-xs text-slate-400">When email received</div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="bg-slate-900 border border-slate-600 rounded-xl p-4 flex items-center gap-4 relative z-10 ml-12 shadow-lg"
                >
                  <div className="w-10 h-10 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center">
                    <GitBranch className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-200">AI Qualification</div>
                    <div className="text-xs text-slate-400">Extract data & score</div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                  className="bg-slate-900 border border-indigo-500 rounded-xl p-4 flex items-center gap-4 relative z-10 ml-24 shadow-lg ring-1 ring-indigo-500/50"
                >
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-indigo-500 rounded-full animate-ping opacity-50" />
                  <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-indigo-500 rounded-full" />
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-200">Send WhatsApp</div>
                    <div className="text-xs text-slate-400">If score {'>'} 80</div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="order-1 lg:order-2"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-sm text-indigo-300 mb-6">
              <Bot className="w-4 h-4" />
              <span>AI Automation Included</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Automate your work without <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">writing code</span>
            </h2>
            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
              Build powerful visual workflows. Connect your email, CRM, and WhatsApp. Let our AI assistants qualify leads, draft responses, and generate reports while you sleep.
            </p>
            
            <ul className="space-y-4 mb-8">
              {[
                "Visual node-based flow builder",
                "Built-in AI Assistant for HR & Sales",
                "Multi-channel support (Email, WhatsApp, SMS)"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Zap className="w-3 h-3" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>

            <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-indigo-500/20">
              Explore Automation
            </Button>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
