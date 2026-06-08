import React from "react";
import { useAuth } from "../context/AuthContext";
import { apiDomain } from "../services/api";
import { ScrollReveal } from "../components/ScrollReveal";

export const Docs = () => {
  const { user } = useAuth();
  return (
    <div className="flex flex-col items-center w-full min-h-[calc(100vh-100px)] flex-1 text-slate-300 leading-relaxed">
      <div className="w-full px-4 md:px-8 lg:px-16 xl:px-24 mx-auto py-32 pb-24 flex flex-col items-center">
        <ScrollReveal>
          <div className="text-center mb-16 flex flex-col items-center">
            <br />
            <h1 className="text-5xl md:text-6xl font-black my-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl tracking-tight">
              Usage & API Documentation
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Integrate your Portfolio CMS data into any frontend application using our RESTful APIs.
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-20">
          {/* Section 1 */}
          <ScrollReveal delay={0.1}>
            <div className="glass-panel p-12 md:p-16 hover:bg-white/5 transition-all duration-300">
              <h2 className="text-4xl py-15 font-bold text-white mb-8 border-b border-indigo-500/30 pb-6">
                <code>Base URL</code>
              </h2>
              <p className="text-xl text-slate-300 mb-6 leading-relaxed">All API requests should be made to the base URL:</p><br />
              <div >
                <code className="bg-black/50 rounded-md font-mono text-indigo-300 overflow-x-auto text-xl p-20 shadow-inner"> GET {apiDomain}/api/v1/portfolio/user/{user?.username ?? ":username"}</code>
              </div>
            </div>
          </ScrollReveal>

          <hr className="text-transparent w-lg h-20" />

          {/* Section 2 */}
          <ScrollReveal delay={0.2}>
            <div className="glass-panel p-12 md:p-16 hover:bg-white/5 transition-all duration-300">
              <h2 className="text-4xl font-bold text-white mb-8 border-b border-purple-500/30 pb-6">
                <code>Fetching Portfolio Data</code>
              </h2>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">To fetch specific portfolio data for a user, use the following endpoints:</p>
              <br />
              <ul className="space-y-10 py-12 my-12">
                <li className="flex flex-col lg:flex-row lg:items-center gap-4 p-6 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors">
                  <strong className="text-white text-xl w-40 shrink-0">Profile:</strong>
                  <code className="bg-black/40 px-6 py-3 rounded-xl text-purple-300 font-mono text-lg flex-1 break-all shadow-inner">GET {apiDomain}/api/v1/portfolio/user/{user?.username ?? ":username"}/profile</code>
                </li>
                <br />
                <li className="flex flex-col lg:flex-row lg:items-center gap-4 p-6 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors">
                  <strong className="text-white text-xl w-40 shrink-0">Education:</strong>
                  <code className="bg-black/40 px-6 py-3 rounded-xl text-purple-300 font-mono text-lg flex-1 break-all shadow-inner">GET {apiDomain}/api/v1/portfolio/user/{user?.username ?? ":username"}/education</code>
                </li>
                <br />
                <li className="flex flex-col lg:flex-row lg:items-center gap-4 p-6 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors">
                  <strong className="text-white text-xl w-40 shrink-0">Experience:</strong>
                  <code className="bg-black/40 px-6 py-3 rounded-xl text-purple-300 font-mono text-lg flex-1 break-all shadow-inner">GET {apiDomain}/api/v1/portfolio/user/{user?.username ?? ":username"}/experience</code>
                </li>
                <br />
                <li className="flex flex-col lg:flex-row lg:items-center gap-4 p-6 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors">
                  <strong className="text-white text-xl w-40 shrink-0">Projects:</strong>
                  <code className="bg-black/40 px-6 py-3 rounded-xl text-purple-300 font-mono text-lg flex-1 break-all shadow-inner">GET {apiDomain}/api/v1/portfolio/user/{user?.username ?? ":username"}/projects</code>
                </li>
                <br />
              </ul>
              <br />

              <h3 className="text-3xl font-bold text-white mb-6">Example Request</h3><br />

              <div className="bg-black/50 p-20 rounded-2xl font-mono text-lg text-slate-300 overflow-x-auto shadow-inner">
                <pre>{`fetch('https://${apiDomain}/api/v1/portfolio/user/${user?.username ?? "johndoe"}/projects')
  .then(response => response.json())
  .then(data => console.log(data));`}</pre>
                <br />
                <pre>{`const res=await fetch('https://${apiDomain}/api/v1/portfolio/user/${user?.username ?? "johndoe"}/projects');
  const portfolio= await response.json();
  console.log(portfolio);`}</pre>
              </div>
            </div>
          </ScrollReveal>
          <hr className="text-transparent w-lg h-20" />

          {/* Section 3 */}
          <ScrollReveal delay={0.3}>
            <div className="glass-panel p-12 md:p-16 hover:bg-white/5 transition-all duration-300">
              <h2 className="text-4xl font-bold text-white mb-8 border-b border-pink-500/30 pb-6">
                <code>Response Format</code>
              </h2><br />
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">The API returns a JSON object containing the requested public portfolio information:</p>
              <div className="bg-black/50 p-20 rounded-2xl font-mono text-lg text-slate-300 overflow-x-auto shadow-inner">
                <pre>{`{
  "success": true,
  "count": 5,
  "data": [
    {
      "title": "Project Alpha",
      "description": "A full stack application",
      "techStack": ["React", "Node", "MongoDB"],
      "liveDemo": "https://alpha.example.com",
      "github": "https://github.com/johndoe/alpha"
    },
    ...
  ]
}`}</pre>
              </div>
            </div>
          </ScrollReveal>
          <hr className="text-transparent w-lg h-20" />

        </div>
      </div>

    </div>
  );
};
