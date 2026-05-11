import { FaHeartbeat, FaBrain, FaShieldAlt, FaUsers, FaAward, FaGlobeAsia } from 'react-icons/fa';

const About = () => {
  const team = [
    { name: 'Dr. Sarah Johnson', role: 'Chief Medical Officer', initials: 'SJ' },
    { name: 'Arjun Patel', role: 'AI/ML Lead Engineer', initials: 'AP' },
    { name: 'Priya Mehta', role: 'Full Stack Developer', initials: 'PM' },
    { name: 'Vikram Singh', role: 'Data Scientist', initials: 'VS' },
  ];

  return (
    <div className="page-container max-w-7xl mx-auto py-20">
      {/* Hero */}
      <div className="text-center mb-16 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 text-sm font-medium mb-4">
          About MediAI
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-6">
          Revolutionizing Healthcare with{' '}
          <span className="bg-gradient-to-r from-primary-600 to-medical bg-clip-text text-transparent">Artificial Intelligence</span>
        </h1>
        <p className="text-lg text-surface-500 max-w-3xl mx-auto">
          MediAI combines advanced machine learning algorithms with modern healthcare practices to deliver accurate disease predictions, instant symptom analysis, and comprehensive health management.
        </p>
      </div>

      {/* Mission Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-20">
        {[
          { icon: FaBrain, title: 'Our Mission', desc: 'Democratize healthcare using AI technology to make early disease detection accessible to everyone.', color: 'from-blue-500 to-cyan-500' },
          { icon: FaShieldAlt, title: 'Our Vision', desc: 'A world where AI-powered health insights prevent diseases before they become critical.', color: 'from-purple-500 to-pink-500' },
          { icon: FaGlobeAsia, title: 'Our Impact', desc: 'Serving 10,000+ patients with 98% prediction accuracy across 50+ disease categories.', color: 'from-green-500 to-emerald-500' },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="glass-card p-8 text-center hover:shadow-card-hover transform hover:-translate-y-1 transition-all duration-300 animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                <Icon className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-surface-500">{item.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Tech Stack */}
      <div className="glass-card p-8 md:p-12 mb-20 animate-fade-in">
        <h2 className="text-2xl font-bold text-center mb-8">Powered By Modern Technology</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {['React.js', 'Node.js', 'Python Flask', 'MongoDB', 'TensorFlow', 'Scikit-learn', 'Tailwind CSS', 'Chart.js'].map((tech, i) => (
            <div key={i} className="p-4 rounded-xl bg-surface-50 dark:bg-surface-700/50 text-center font-medium text-sm hover:shadow-card transition-all">
              {tech}
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold">Meet Our Team</h2>
        <p className="text-surface-500 mt-2">The minds behind MediAI's innovation</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {team.map((member, i) => (
          <div key={i} className="glass-card p-6 text-center hover:shadow-card-hover transform hover:-translate-y-1 transition-all duration-300 animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg">
              {member.initials}
            </div>
            <h3 className="font-bold text-lg">{member.name}</h3>
            <p className="text-primary-600 text-sm">{member.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
