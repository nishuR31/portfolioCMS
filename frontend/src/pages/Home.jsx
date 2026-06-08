import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ScrollReveal } from "../components/ScrollReveal";
import { Button } from "../components/ui/Button";
import Ferrofluid from "../components/Ferrofluid";
import DecryptedText from "../components/DecryptedText";
import LogoLoop, { techLogos } from "../components/LogoLoop";


export const Home = () => {
  const { user, loading } = useAuth();

  return (
    <div className="relative flex justify-center flex-col min-h-screen w-full overflow-x-hidden">
      {/* Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Ferrofluid
          colors={['#6366f1', '#000000ff', '#d946ef']}
          speed={0.3}
          scale={1.2}
          turbulence={1.5}
          fluidity={0.2}
          rimWidth={0.3}
          sharpness={2}
          shimmer={1}
          glow={1.5}
          flowDirection="down"
          opacity={0.8}
          mouseInteraction={true}
          mouseStrength={1.5}
          mouseRadius={0.4}
        />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 w-full flex flex-col items-center flex-1">

        {/* Container for all content */}
        <div className="w-full  flex flex-col gap-16 lg:gap-24 items-center px-4 md:px-8 lg:px-16 xl:px-24 mx-auto pt-32 pb-24 flex flex-col items-center">

          {/* Hero Section */}
          <ScrollReveal className="w-full">
            <div className="w-full flex flex-col items-center text-center">
              <h1 className="text-5xl sm:text-6xl md:text-8xl font-black mb-8 tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl">
                <DecryptedText
                  text="Portfolio CMS"
                  animateOn="hover"
                  revealDirection="center"
                  speed={60}
                  maxIterations={12}
                />
              </h1>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1} className="w-full">
            <div className="w-full flex flex-col items-center text-center">
              <p className="text-2xl md:text-4xl font-bold text-white max-w-4xl mb-6 leading-snug">
                Manage your developer portfolio through a centralized dashboard instead of editing and redeploying code.
              </p>
              <p className="text-lg md:text-xl text-slate-300 max-w-3xl mb-12 leading-relaxed">
                A content-driven platform that enables developers to create, update, organize, and showcase projects, skills, and professional experience through a secure admin interface.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            {!loading && (
              <div className="flex flex-col sm:flex-row flex-wrap gap-5 justify-center items-center text-center mb-32 w-full">
                {user ? (
                  <Link to="/dashboard" className="no-underline w-full sm:w-auto">
                    <Button variant="primary" className="text-lg px-12 py-5 shadow-lg shadow-indigo-500/30 hover:scale-105 transition-transform w-full font-semibold rounded-2xl">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/login" className="no-underline w-full sm:w-auto">
                      <Button variant="primary" className="text-lg px-12 py-5 shadow-lg shadow-purple-500/30 hover:scale-105 transition-transform w-full font-semibold rounded-2xl">
                        View Demo
                      </Button>
                    </Link>
                    <Link to="/docs" className="no-underline w-full sm:w-auto mt-4 sm:mt-0">
                      <Button variant="secondary" className="text-lg px-12 py-5 bg-white/5 backdrop-blur-md border border-white/20 hover:bg-white/10 hover:scale-105 transition-all w-full font-semibold rounded-2xl">
                        Explore Features
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            )}
          </ScrollReveal>

          {/* Main Content Sections */}
          <div className="w-full space-y-48 py-16 flex flex-col justify-center self-centeritems-center">

            {/* Problem Statement */}
            <div className="w-full min-w-screen  justify-center text-center items-center flex flex-col">
              <div className="glass-panel p-12 md:p-20 w-full max-w-4xl border-indigo-500/20 shadow-[0_0_40px_rgba(99,102,241,0.1)] mx-auto flex flex-col items-center">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-10 text-center tracking-tight">Stop Editing Source Files</h2>
                <p className="text-xl text-slate-300 leading-relaxed mb-8 text-center">
                  Traditional portfolios often rely on hardcoded content. Updating a project, adding a new skill, or changing professional information requires modifying source code, committing changes, and triggering a deployment.
                </p>
                <div className="h-px w-24 bg-indigo-500/50 mx-auto my-10"></div>
                <p className="text-xl text-indigo-200 leading-relaxed font-medium text-center">
                  Portfolio CMS eliminates that workflow by providing a dedicated management interface where content updates are reflected instantly across your portfolio.
                </p>
              </div>
            </div>

            <hr className="text-transparent py-20 w-lg h-20 justify-center self-center items-center my-20" />

            {/* How It Works */}
            <ScrollReveal delay={0.1} className="w-full">
              <div className="w-full flex flex-col items-center">
                <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-20 tracking-tight py-25">How It Works</h2>
                <br />
                <div className="flex flex-col flex-wrap gap-12 w-full ">
                  <div className="glass-panel p-12 flex flex-col items-center text-center hover:bg-white/5 transition-colors">
                    <span className="flex items-center justify-center w-20 h-20 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-3xl mb-8">1</span>
                    <h3 className="text-3xl font-bold text-white mb-6">Manage Content</h3>
                    <p className="text-slate-300 text-xl max-w-xl leading-relaxed">Create and update Projects, Skills, Experience, and Social Links through a secure dashboard.</p>
                  </div>
                  <div className="glass-panel p-12 flex flex-col items-center text-center hover:bg-white/5 transition-colors">
                    <span className="flex items-center justify-center w-20 h-20 rounded-full bg-purple-500/20 text-purple-400 font-bold text-3xl mb-8">2</span>
                    <h3 className="text-3xl font-bold text-white mb-6">Store Centrally</h3>
                    <p className="text-slate-300 text-xl max-w-xl leading-relaxed">All portfolio information is stored in a structured database instead of scattered across source files.</p>
                  </div>
                  <div className="glass-panel p-12 flex flex-col items-center text-center hover:bg-white/5 transition-colors">
                    <span className="flex items-center justify-center w-20 h-20 rounded-full bg-pink-500/20 text-pink-400 font-bold text-3xl mb-8">3</span>
                    <h3 className="text-3xl font-bold text-white mb-6">Serve Dynamically</h3>
                    <p className="text-slate-300 text-xl max-w-xl leading-relaxed">The portfolio frontend consumes content through APIs, ensuring information remains synchronized.</p>
                  </div>
                  <div className="glass-panel p-12 flex flex-col items-center text-center hover:bg-white/5 transition-colors">
                    <span className="flex items-center justify-center w-20 h-20 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-3xl mb-8">4</span>
                    <h3 className="text-3xl font-bold text-white mb-6">Showcase Instantly</h3>
                    <p className="text-slate-300 text-xl max-w-xl leading-relaxed">New projects and updates become available without manually editing application code.</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
            <hr className="text-transparent py-20 w-lg h-20 justify-center self-center items-center my-20" />

            {/* Key Features */}
            <ScrollReveal delay={0.1} className="w-full">
              <div className="w-full flex flex-col items-center">
                <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-20 tracking-tight">Key Features</h2>
                <br />
                <div className="flex flex-col gap-10 w-full max-w-3xl">
                  {[
                    { title: "Project Management", desc: "Create and manage projects with Title, Description, Technology Stack, GitHub Repository, Live Demo, Status, Featured Flag, and Display Order." },
                    { title: "Skill Management", desc: "Organize technical skills into categories: Frontend, Backend, Database, DevOps, and Tools." },
                    { title: "Experience Management", desc: "Maintain professional experiences, internships, freelance work, and achievements from a centralized interface." },
                    { title: "Secure Administration", desc: "Protected routes ensure only authorized users can modify portfolio content." },
                    { title: "API-Driven Architecture", desc: "Frontend and backend remain decoupled, allowing content to be consumed by Portfolio Websites, Mobile Applications, and Future Integrations." }
                  ].map((feature, idx) => (
                    <div key={idx} className="glass-panel p-10 md:p-12 flex flex-col items-center text-center gap-6 hover:bg-white/5 transition-all">
                      <div className="flex flex-col items-center">
                        <h3 className="text-3xl font-bold text-white mb-4">{feature.title}</h3>
                        <p className="text-slate-300 text-xl leading-relaxed max-w-xl">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
            <hr className="text-transparent py-20 w-lg h-20 justify-center self-center items-center my-20" />


            {/* Benefits & Use Cases */}
            <div className="w-full  flex flex-col gap-16 lg:gap-24 items-center py-16">
              <ScrollReveal delay={0.1} className="w-full">
                <div className="glass-panel p-12 w-full flex flex-col items-center">
                  <h2 className="text-4xl font-bold text-white mb-12 text-center border-b border-white/10 pb-8 w-full max-w-md">Benefits</h2>
                  <ul className="space-y-12 flex flex-col items-center text-center">
                    <br /><li className="flex flex-col items-center">
                      <strong className="text-indigo-400 block text-2xl  mb-10">Faster Updates</strong>
                      <br />
                      <span className="text-slate-300 text-xl max-w-md leading-relaxed">Publish portfolio changes without modifying source code.</span>
                    </li>
                    <br /><li className="flex flex-col items-center">
                      <strong className="text-purple-400 block text-2xl mb-3">Better Organization</strong><br />
                      <span className="text-slate-300 text-xl max-w-md leading-relaxed">Keep all professional information centralized and structured.</span>
                    </li>
                    <br /><li className="flex flex-col items-center">
                      <strong className="text-pink-400 block text-2xl mb-3">Improved Scalability</strong>
                      <span className="text-slate-300 text-xl max-w-md leading-relaxed">Easily expand portfolio content as projects and experiences grow.</span>
                    </li>
                    <br /><li className="flex flex-col items-center">
                      <strong className="text-indigo-400 block text-2xl mb-3">Reduced Maintenance</strong>
                      <span className="text-slate-300 text-xl max-w-md leading-relaxed">Minimize repetitive edits across multiple files and components.</span>
                    </li>
                  </ul>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.2} className="w-full">
                <div className="glass-panel p-12 w-full flex flex-col items-center justify-center">
                  <h2 className="text-4xl font-bold text-white mb-12 text-center border-b border-white/10 pb-8 w-full max-w-md">Use Cases</h2>
                  <br />
                  <p className="text-slate-300 mb-10 text-2xl text-center font-medium py-10 my-10">Portfolio CMS is ideal for:</p>
                  <br />
                  <div className="flex flex-wrap flex-row justify-center gap-10 my-12 max-w-screen">
                    <span className="px-10 py-7 bg-white/5 border border-white/10 rounded-xl text-white font-medium text-xl">Software Developers</span>
                    <span className="px-10 py-7 bg-white/5 border border-white/10 rounded-xl text-white font-medium text-xl">Freelancers</span>
                    <span className="px-10 py-7 bg-white/5 border border-white/10 rounded-xl text-white font-medium text-xl">Students</span>
                    <span className="px-10 py-7 bg-white/5 border border-white/10 rounded-xl text-white font-medium text-xl">Open Source Contributors</span>
                    <span className="px-10 py-7 bg-white/5 border border-white/10 rounded-xl text-white font-medium text-xl">Technical Professionals</span>
                  </div>
                  <p className="text-slate-400 italic text-center text-xl max-w-md leading-relaxed">...who want a maintainable and scalable way to manage their professional presence.</p>
                </div>
              </ScrollReveal>
            </div>
            <hr className="text-transparent py-20 w-lg h-20 justify-center self-center items-center my-20" />

            <div className="w-full flex flex-col items-center py-10" style={{ height: '200px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ height: '200px', position: 'relative', overflow: 'hidden' }}>
                {/* Basic horizontal loop */}
                <LogoLoop
                  logos={techLogos}
                  speed={100}
                  direction="left"
                  logoHeight={60}
                  gap={60}
                  hoverSpeed={0}
                  scaleOnHover
                  fadeOut
                  fadeOutColor="#ffffff"
                  ariaLabel="Technology partners"
                />

                {/* Vertical loop with deceleration on hover */}
                <LogoLoop
                  logos={techLogos}
                  useCustomRender={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
