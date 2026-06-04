import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from './ui/Button';

const TIERS = [
  {
    name: "Starter",
    price: "$49",
    description: "Perfect for small teams just getting started.",
    features: ["Up to 5 Users", "Basic CRM & Sales", "Standard HR Management", "Community Support"],
    popular: false
  },
  {
    name: "Professional",
    price: "$149",
    description: "Everything you need for a growing business.",
    features: ["Up to 20 Users", "Advanced CRM & Pipelines", "Full HR & Payroll", "Basic AI Automation", "Priority Support"],
    popular: true
  },
  {
    name: "Enterprise",
    price: "$499",
    description: "Advanced features for large-scale operations.",
    features: ["Unlimited Users", "All Modules Unlocked", "Advanced AI Workflows", "Custom Integrations", "Dedicated Account Manager"],
    popular: false
  }
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-slate-50 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-slate-600">
              Stop paying for dozens of disconnected tools. Get everything in one simple subscription.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {TIERS.map((tier, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`bg-white rounded-2xl p-8 border ${tier.popular ? 'border-indigo-500 shadow-xl shadow-indigo-500/10 ring-1 ring-indigo-500' : 'border-slate-200 shadow-sm'} relative flex flex-col`}
            >
              {tier.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-indigo-600 text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-md">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold text-slate-900 mb-2">{tier.name}</h3>
              <p className="text-slate-500 text-sm mb-6 h-10">{tier.description}</p>
              <div className="mb-8">
                <span className="text-4xl font-extrabold text-slate-900">{tier.price}</span>
                <span className="text-slate-500 font-medium">/mo</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {tier.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-indigo-600" />
                    </div>
                    <span className="text-slate-700 font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button variant={tier.popular ? "primary" : "outline"} className="w-full">
                Get Started
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
