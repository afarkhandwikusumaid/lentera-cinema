'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { FAQS } from './data';

export default function FAQ() {
  const [faq, setFaq] = useState<number | null>(null);

  return (
    <section className="py-32 bg-[#000]">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-white mb-16" style={{ fontSize: 'clamp(2.5rem,6vw,4.5rem)', letterSpacing: '-0.02em', lineHeight: '1' }}>
          Pertanyaan yang sering diajukan
        </h2>
        
        <div className="space-y-0 border-t border-white/20">
          {FAQS.map((f, i) => (
            <div key={i} className="border-b border-white/20">
              <button 
                onClick={() => setFaq(faq === i ? null : i)} 
                className="w-full flex items-center justify-between py-6 text-left group">
                <span className="text-lg md:text-xl font-bold text-white pr-4 group-hover:text-white/80 transition-colors tracking-tight">
                  {f.q}
                </span>
                <ChevronDown size={20} className={`text-white shrink-0 transition-transform duration-300 ${faq === i ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {faq === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }} className="overflow-hidden">
                    <p className="pb-8 text-base md:text-lg text-white/60 leading-relaxed font-medium">
                      {f.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
