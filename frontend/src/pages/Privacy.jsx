import React from "react";
import { ScrollReveal } from "../components/ScrollReveal";

export const Privacy = () => {
  return (
    <div className="flex flex-col items-center w-full min-h-[calc(100vh-100px)] flex-1 text-slate-300 leading-relaxed">
      <div className="w-full px-4 md:px-8 lg:px-16 xl:px-24 mx-auto pt-32 pb-24 flex flex-col items-center">
        <ScrollReveal>
          <div className="text-center mb-16 flex flex-col items-center">
            <br />
            <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl tracking-tight">
              Privacy Policy
            </h1>
            <br />
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              How we collect, use, and protect your information.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="glass-panel p-12 md:p-16 gap-20 flex flex-col flex-wrap space-y-16">
            <section>
              <h2 className="text-4xl font-bold text-white mb-8 border-b border-indigo-500/30 pb-6">Introduction</h2>
              <p className="text-xl leading-relaxed">
                This Privacy Policy describes how your personal information is collected, used, and shared when you visit or use our services.
              </p>
            </section>

            <section>
              <h2 className="text-4xl font-bold text-white mb-8 border-b border-purple-500/30 pb-6">Information We Collect</h2>
              <p className="text-xl leading-relaxed">
                We collect basic profile information (such as your name, email, and portfolio details) to provide the CMS functionality. We do not sell your personal data.
              </p>
            </section>

            <section>
              <h2 className="text-4xl font-bold text-white mb-8 border-b border-pink-500/30 pb-6">How We Use Your Information</h2>
              <p className="text-xl leading-relaxed">
                Your information is used solely to generate your public portfolio and allow you to manage it securely.
              </p>
            </section>

            <section>
              <h2 className="text-4xl font-bold text-white mb-8 border-b border-indigo-500/30 pb-6">Security</h2>
              <p className="text-xl leading-relaxed">
                We implement standard security measures to protect your data, but remember that no method of transmission over the Internet is 100% secure.
              </p>
            </section>
          </div>
        </ScrollReveal>
        <hr className="text-transparent w-lg h-20" />

      </div>
    </div>
  );
};
