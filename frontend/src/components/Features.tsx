import { motion } from 'framer-motion';
import { Users, Briefcase, BarChart3, Calculator, Megaphone, Bot } from 'lucide-react';

const FEATURES = [
  {
    title: "HR Management",
    description: "Manage employee records, attendance, leave, and payroll all in one unified system.",
    icon: Users,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Recruitment ATS",
    description: "Track candidates through custom pipelines, schedule interviews, and send offer letters.",
    icon: Briefcase,
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    title: "CRM Management",
    description: "Visualize your sales pipeline, track leads, and manage customer relationships effortlessly.",
    icon: BarChart3,
    color: "bg-cyan-100 text-cyan-600",
  },
  {
    title: "Finance & Compliance",
    description: "Generate invoices, track expenses, monitor cash flow, and ensure GST compliance.",
    icon: Calculator,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    title: "Digital Marketing",
    description: "Plan campaigns, schedule social media posts, and analyze marketing performance.",
    icon: Megaphone,
    color: "bg-orange-100 text-orange-600",
  },
  {
    title: "AI Automation",
    description: "Build custom workflows, automate emails, and deploy AI chatbots without coding.",
    icon: Bot,
    color: "bg-purple-100 text-purple-600",
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

export function Features() {
  return (
    <section id="features" className="py-24 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Everything you need to scale
            </h2>
            <p className="text-lg text-slate-600">
              BusinessOS replaces dozens of single-purpose apps with a tightly integrated suite of powerful modules.
            </p>
          </motion.div>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {FEATURES.map((feature, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 group cursor-pointer"
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${feature.color} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
