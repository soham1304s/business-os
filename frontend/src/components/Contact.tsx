import { motion } from 'framer-motion';
import { Mail, MessageSquare, MapPin } from 'lucide-react';
import { Button } from './ui/Button';

export function Contact() {
  return (
    <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to streamline your business?
            </h2>
            <p className="text-lg text-slate-400 mb-12">
              Our team is ready to show you how BusinessOS can be tailored to your specific needs. Get in touch today.
            </p>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-white">Chat to sales</h3>
                  <p className="text-slate-400 mb-1">Speak to our friendly team.</p>
                  <a href="mailto:sales@businessos.com" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">sales@businessos.com</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-white">Support</h3>
                  <p className="text-slate-400 mb-1">We're here to help.</p>
                  <a href="mailto:support@businessos.com" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">support@businessos.com</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-white">Visit us</h3>
                  <p className="text-slate-400">100 Innovation Drive<br/>San Francisco, CA 94103</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 backdrop-blur-xl shadow-2xl"
          >
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">First name</label>
                  <input type="text" className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow" placeholder="First name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Last name</label>
                  <input type="text" className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow" placeholder="Last name" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Email</label>
                <input type="email" className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow" placeholder="you@company.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Message</label>
                <textarea rows={4} className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow resize-none" placeholder="How can we help?" />
              </div>
              <Button variant="primary" className="w-full justify-center">
                Send message
              </Button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
