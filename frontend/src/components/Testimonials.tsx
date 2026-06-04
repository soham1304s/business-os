import { motion } from 'framer-motion';

const TESTIMONIALS = [
  {
    quote: "BusinessOS completely transformed how we operate. We replaced 6 different SaaS subscriptions with this one platform.",
    author: "Sarah Jenkins",
    role: "CEO, TechNova",
    avatar: "bg-indigo-100 text-indigo-600"
  },
  {
    quote: "The AI automation features alone are worth the price. Our sales team closes 30% more deals using the automated workflows.",
    author: "Marcus Chen",
    role: "VP of Sales, GlobalTech",
    avatar: "bg-cyan-100 text-cyan-600"
  },
  {
    quote: "Finally, an HR and payroll system that feels modern and doesn't require a degree to understand. My team loves it.",
    author: "Elena Rodriguez",
    role: "HR Director, Apex",
    avatar: "bg-emerald-100 text-emerald-600"
  }
];

export function Testimonials() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
         <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Loved by fast-growing companies
            </h2>
            <p className="text-lg text-slate-600">
              Don't just take our word for it. See what our customers have to say.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {TESTIMONIALS.map((t, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.5, delay: i * 0.1 }}
               className="bg-slate-50 border border-slate-200 p-8 rounded-2xl shadow-sm relative flex flex-col hover:shadow-md transition-shadow"
             >
                <div className="text-indigo-200 mb-4 text-6xl leading-none font-serif absolute top-4 right-6 opacity-50">"</div>
                <p className="text-slate-700 font-medium mb-8 flex-1 relative z-10 leading-relaxed">{t.quote}</p>
                <div className="flex items-center gap-4 mt-auto">
                   <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${t.avatar}`}>
                     {t.author.charAt(0)}
                   </div>
                   <div>
                     <div className="font-semibold text-slate-900">{t.author}</div>
                     <div className="text-sm text-slate-500">{t.role}</div>
                   </div>
                </div>
             </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
}
