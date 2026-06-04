import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    question: "How difficult is it to migrate from our current tools?",
    answer: "Migration is surprisingly simple. We provide dedicated onboarding specialists who will help import your data from Salesforce, HubSpot, Gusto, and other popular platforms at no additional cost."
  },
  {
    question: "Do I have to use all the modules?",
    answer: "Not at all. While BusinessOS is designed to be an all-in-one platform, you can choose to only use the modules you need right now. The others will be there, ready to activate when your business requires them."
  },
  {
    question: "Is my data secure?",
    answer: "Security is our top priority. We use enterprise-grade 256-bit AES encryption, conduct regular third-party security audits, and are fully SOC 2 Type II and GDPR compliant."
  },
  {
    question: "Can I customize the workflows for my specific industry?",
    answer: "Yes, our visual workflow builder and CRM pipelines are completely customizable. You can tailor stages, fields, and automation rules to match your exact business processes."
  }
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Frequently asked questions
            </h2>
            <p className="text-lg text-slate-600">
              Everything you need to know about the product and billing.
            </p>
          </motion.div>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 10 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.3, delay: i * 0.1 }}
               className="border border-slate-200 rounded-2xl overflow-hidden bg-white hover:border-indigo-200 transition-colors"
             >
               <button
                 onClick={() => setOpenIndex(openIndex === i ? null : i)}
                 className="w-full flex items-center justify-between p-6 text-left focus:outline-none cursor-pointer"
               >
                 <span className="text-lg font-semibold text-slate-900">{faq.question}</span>
                 <motion.div
                   animate={{ rotate: openIndex === i ? 180 : 0 }}
                   transition={{ duration: 0.2 }}
                   className="flex-shrink-0 ml-4 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-500"
                 >
                   <ChevronDown className="w-5 h-5" />
                 </motion.div>
               </button>
               <AnimatePresence>
                 {openIndex === i && (
                   <motion.div
                     initial={{ height: 0, opacity: 0 }}
                     animate={{ height: 'auto', opacity: 1 }}
                     exit={{ height: 0, opacity: 0 }}
                     transition={{ duration: 0.2 }}
                   >
                     <div className="px-6 pb-6 text-slate-600 leading-relaxed">
                       {faq.answer}
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>
             </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
