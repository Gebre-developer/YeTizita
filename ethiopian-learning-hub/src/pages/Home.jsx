import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import hubHeroBg from '../assets/img/img.png'; 
import PageWrapper from '../components/PageWrapper';
import AiAssistant from '../components/AiAssistant'; // 🌟 Clean reusable import

const Home = () => {
  const { language } = useContext(AuthContext);

  const categories = [
    'Web Development', 'Programming', 'Computer Basics', 
    'English', 'Digital Marketing', 'Entrepreneurship', 'AI and Technology'
  ];

  const content = {
    en: { title: "Empowering Ethiopian Students", subtitle: "The Ethiopian Learning Hub bridges structural gaps.", cta: "Explore Courses" },
    am: { title: "የኢትዮጵያ ተማሪዎችን ማሳደግ", subtitle: "የኢትዮጵያ ለርኒንግ ሀብ መዋቅራዊ ክፍተቶችን ይደፍናል።", cta: "ኮርሶችን ያስሱ" }
  }[language] || { en: {}, am: {} };

  return (
    <PageWrapper>
      <div className="space-y-16 pb-16">
        <section 
          className="relative min-h-screen flex items-center justify-center text-white px-4 py-20 overflow-hidden bg-cover bg-center bg-fixed bg-no-repeat"
          style={{ backgroundImage: `url(${hubHeroBg})` }}
        >
          <div className="absolute inset-0 bg-slate-900/75 backdrop-blur-[2px]"></div>

          <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
            <div className="text-left space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                {content.title}
              </h1>
              <p className="text-lg text-slate-300">
                {content.subtitle}
              </p>
              <div className="pt-4">
                <Link to="/courses" className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-8 py-3 rounded-lg transition">
                  {content.cta}
                </Link>
              </div>
            </div>

            <div className="w-full flex justify-center">
              <AiAssistant placeholder="Ask your homepage guide..." />
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, idx) => (
              <div key={idx} className="glass-card p-8 rounded-2xl">
                <h3 className="text-xl font-semibold mb-2">{category}</h3>
                <p className="text-sm text-slate-400">Explore learning resources tailored for building modern local developer skills.</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PageWrapper>
  );
};

export default Home;
