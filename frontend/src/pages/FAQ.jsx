import React, { useState } from "react";
import { ScrollReveal } from "../components/ScrollReveal";

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/10 py-6 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center bg-transparent border-none text-slate-200 text-xl font-medium cursor-pointer text-left hover:text-indigo-300 transition-colors duration-200"
      >
        {question}
        <span className="text-2xl font-light">{isOpen ? "−" : "+"}</span>
      </button>

      {isOpen && (
        <p className="mt-4 text-slate-400 leading-relaxed text-lg">
          {answer}
        </p>
      )}
    </div>
  );
};

export const FAQ = () => {
  const faqs = [
    { q: "How do I create a public portfolio?", a: "After logging in, go to the Dashboard, fill out your profile details, education, and experience. Your portfolio is automatically generated at /user/:your_username." },
    { q: "Is this CMS completely free?", a: "Yes, this portfolio CMS is completely free to use." },
    { q: "Can I use my own domain name?", a: "Currently, portfolios are hosted under our domain, but you can redirect your personal domain to your public portfolio URL." },
  ];

  return (
    <div className="flex flex-col items-center w-full min-h-[calc(100vh-100px)] flex-1">
      <div className="w-full px-4 md:px-8 lg:px-16 xl:px-24 mx-auto pt-32 pb-24 flex flex-col items-center">
        <ScrollReveal>
          <div className="text-center mb-16 flex flex-col items-center">
            <br />
            <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl tracking-tight">
              Frequently Asked Questions
            </h1>
            <br />
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Everything you need to know about managing your developer portfolio with Portfolio CMS.
            </p>
          </div>
        </ScrollReveal>
        <hr className="text-transparent w-lg h-20" />


        <div className="space-y-12">
          {faqs.map((faq, index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
              <div className="glass-panel p-12 md:p-16 hover:bg-white/5 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.1)]">
                <h3 className="text-3xl font-bold text-white mb-6 flex items-start leading-snug">
                  <span className="text-indigo-400 mr-4">Q.</span>
                  {faq.q}
                </h3>
                <br />
                <p className="text-xl text-slate-300 leading-relaxed pl-12 border-l-2 border-indigo-500/20 ml-3">
                  {faq.a}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
        <hr className="text-transparent w-lg h-20" />

      </div>
    </div>);
};
