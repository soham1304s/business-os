import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TABS = [
  { id: 'hr', label: 'HR & Payroll' },
  { id: 'crm', label: 'CRM Sales' },
  { id: 'marketing', label: 'Marketing' },
];

export function ProductShowcase() {
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  return (
    <section id="product" className="py-24 bg-white border-y border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              See BusinessOS in action
            </h2>
            <p className="text-lg text-slate-600">
              Beautifully designed interfaces that your team will actually love to use.
            </p>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12 px-4">
          <div className="inline-flex bg-slate-100 p-1 rounded-xl overflow-x-auto custom-scrollbar max-w-full">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 sm:px-6 py-2.5 text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white rounded-lg shadow-sm"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative mx-auto max-w-5xl h-[600px] md:h-auto md:aspect-[16/9] bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-2xl shadow-slate-200"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 p-6 sm:p-8"
            >
              {/* Mock Content Based on Tab */}
              {activeTab === 'hr' && (
                <div className="h-full flex flex-col gap-6">
                  <div className="flex justify-between items-center">
                    <div className="h-6 w-32 sm:w-48 bg-slate-200 rounded-md shrink-0" />
                    <div className="h-8 px-3 sm:px-4 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-xs font-semibold whitespace-nowrap shrink-0">Run Payroll</div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="h-24 bg-white border border-slate-200 rounded-xl shadow-sm p-4 flex flex-col justify-between">
                        <div className="w-8 h-8 rounded-full bg-slate-100" />
                        <div className="h-2 w-1/2 bg-slate-200 rounded-full" />
                      </div>
                    ))}
                  </div>
                  <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm p-6 overflow-hidden">
                    <div className="h-4 w-1/4 bg-slate-200 rounded-md mb-6" />
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center justify-between border-b border-slate-50 pb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100" />
                            <div>
                              <div className="h-3 w-32 bg-slate-200 rounded-full mb-2" />
                              <div className="h-2 w-20 bg-slate-100 rounded-full" />
                            </div>
                          </div>
                          <div className="h-6 w-20 bg-green-100 rounded-full" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'crm' && (
                <div className="h-full flex gap-4 sm:gap-6 overflow-x-auto pb-2">
                  {[1, 2, 3, 4].map(col => (
                    <div key={col} className="min-w-[250px] flex-1 bg-slate-100/50 rounded-xl p-4 flex flex-col gap-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="h-4 w-20 bg-slate-200 rounded-md" />
                        <div className="h-5 w-5 rounded-full bg-slate-200" />
                      </div>
                      {[1, 2, 3].map(card => (
                        <div key={card} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-grab group">
                          <div className="h-3 w-3/4 bg-slate-200 rounded-full mb-3 group-hover:bg-indigo-100 transition-colors" />
                          <div className="h-2 w-1/2 bg-slate-100 rounded-full mb-4" />
                          <div className="flex justify-between items-center">
                            <div className="w-6 h-6 rounded-full bg-indigo-50" />
                            <div className="h-3 w-12 bg-green-100 rounded-full" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'marketing' && (
                <div className="h-full flex flex-col gap-6">
                  <div className="h-6 w-48 bg-slate-200 rounded-md" />
                  <div className="flex-1 flex flex-col sm:flex-row gap-6">
                    <div className="w-full sm:w-2/3 bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col">
                      <div className="flex justify-between items-center mb-8">
                        <div className="h-4 w-32 bg-slate-200 rounded-md" />
                        <div className="h-8 w-24 bg-slate-100 rounded-lg" />
                      </div>
                      <div className="flex-1 flex items-end justify-between gap-2">
                        {[40, 70, 45, 90, 65, 85, 100, 75, 55, 80].map((h, i) => (
                          <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ duration: 1, delay: i * 0.05 }}
                            className="w-full bg-indigo-500 rounded-t-sm hover:bg-indigo-400 transition-colors cursor-pointer"
                          />
                        ))}
                      </div>
                    </div>
                    <div className="w-full sm:w-1/3 flex flex-col gap-6">
                      <div className="flex-1 bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-center items-center text-center">
                        <div className="w-20 h-20 rounded-full border-4 border-indigo-100 border-t-indigo-500 flex items-center justify-center mb-4 text-indigo-600 font-bold text-xl relative">
                          84%
                        </div>
                        <div className="text-sm font-medium text-slate-500 mb-1">Engagement Rate</div>
                      </div>
                      <div className="flex-1 bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-center items-center text-center">
                        <div className="text-4xl font-bold text-slate-900 mb-2">12.5k</div>
                        <div className="text-sm font-medium text-green-500">↑ 2.4k this week</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
