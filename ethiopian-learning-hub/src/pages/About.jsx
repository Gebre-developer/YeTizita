import React from 'react';
// ✅ FIXED: Imported PageWrapper to hook this screen up to your global transition timeline animations
import PageWrapper from '../components/PageWrapper';

function About() {
  return (
    <PageWrapper>
      <div className="mx-auto my-12 max-w-4xl px-4">
        {/* Main Glass Profile Card Container */}
        <div className="glass-card p-6 md:p-10 text-center md:text-left">
          <h1 className="text-3xl font-bold text-[#10b981] mb-4 tracking-wide text-center">
            About Ethiopian Learning Hub
          </h1>
          <p className="text-slate-300 leading-relaxed text-base md:text-lg mb-8 text-center max-w-2xl mx-auto">
            Empowering the next generation of Ethiopian thinkers, innovators, and software engineers through world-class interactive educational tools and mentorship.
          </p>

          {/* Dynamic Multi-Level Mission Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            
            <div className="p-5 rounded-xl bg-slate-900/40 border border-white/5">
              <h3 className="text-lg font-semibold text-emerald-400 mb-2">
                🚀 Comprehensive Education
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Tailored academic roadmaps for all learners. We provide targeted guides spanning Primary School, Middle School, Secondary Core fields, up to advanced College and University levels.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/40 border border-white/5">
              <h3 className="text-lg font-semibold text-amber-500 mb-2">
                ☀️ Interactive Summer Camps
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Accelerate skill retention during break seasons. Our specialized bootcamps emphasize project-based building, practical programming labs, and gamified engineering challenges.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/40 border border-white/5">
              <h3 className="text-lg font-semibold text-teal-400 mb-2">
                🏫 Regular Academic Tracks
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Consistent curriculum reinforcement built to run alongside institutional standard schooling, helping students master complex subjects step-by-step.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/40 border border-white/5">
              <h3 className="text-lg font-semibold text-blue-400 mb-2">
                👨‍🏫 Live Online Classrooms
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Connect directly with verified, expert teachers. Access interactive lectures, ask questions live, and receive personalized code critiques safely from any location.
              </p>
            </div>

          </div>

          {/* Dynamic Platform Core Callout */}
          <div className="mt-8 p-5 text-center rounded-xl bg-emerald-950/20 border border-emerald-500/20">
            <p className="text-sm text-emerald-400 font-medium">
              💡 Need assistance right now? Check out our embedded <strong>AI Assistant tool</strong> to review concepts, get hints, or generate interactive quizzes instantly!
            </p>
          </div>

        </div>
      </div>
    </PageWrapper>
  );
}

export default About;
