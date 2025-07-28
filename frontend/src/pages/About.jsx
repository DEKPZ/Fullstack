import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import {ShieldCheck,Rocket,Brain,Handshake,Target, Globe2,} from 'lucide-react';
import './About.css';

export const AboutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleStudentRegistration = () => {
    navigate("/register-student");
  };

  const handleEmployerRegistration = () => {
    navigate("/register-employer");
  };

  // Animation variants for consistent motion
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const staggerContainer = {
    hidden: { opacity: 1 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="about-page">
      {/* Hero Section: Welcome to I-Intern */}
      <div className="hero-section">
        <div className="container text-center">
          <motion.h1
            className="hero-title"
            {...fadeIn}
          >
            Welcome to <span className="hero-accent">I-Intern</span>
          </motion.h1>
          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Your gateway to meaningful internships and untapped talent.
          </motion.p>
          <motion.div
            className="hero-divider"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />
        </div>
      </div>

      {/* About Section: Bridging the Gap */}
      <section className="section section-white">
        <div className="container">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.h2
              className="section-subtitle"
              variants={itemVariants}
            >
              Bridging the Gap, Empowering Futures
            </motion.h2>
            <motion.p
              className="section-text"
              variants={itemVariants}
            >
              <strong>I-Intern</strong> is a next-generation platform built to connect ambitious students with
              forward-thinking employers. Our mission is to create transformative internship experiences
              that prepare students for the real world, while helping organizations discover and nurture
              untapped talent.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="section section-blue-light">
  <div className="container">
    <div className="mission-vision-grid">
      {/* Mission Card */}
      <motion.div
        className="card"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7 }}
      >
        <h3 className="card-title flex items-center gap-2">
          <Target size={28} strokeWidth={2} className="text-accent" />
          Our Mission
        </h3>
        <p className="card-text">
          To streamline the internship ecosystem by providing <strong>equal opportunity access</strong>,
          <strong> intelligent matchmaking</strong>, and a <strong>secure, user-centric experience</strong>
          {' '}for both students and employers. We strive to dismantle barriers and create pathways
          to meaningful career starts.
        </p>
      </motion.div>

      {/* Vision Card */}
      <motion.div
        className="card"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7 }}
      >
        <h3 className="card-title flex items-center gap-2">
          <Globe2 size={28} strokeWidth={2} className="text-accent" />
          Our Vision
        </h3>
        <p className="card-text">
          To become the <strong>world's most trusted internship platform</strong> — empowering every student to gain
          indispensable hands-on industry experience and enabling every organization to discover,
          engage, and grow with untapped potential.
        </p>
      </motion.div>
    </div>
  </div>
</section>


      {/* Core Values Section */}
      <section className="section section-dark">
  <div className="container text-center">
    <motion.h2
      className="section-title section-title-white mb-12"
      {...fadeIn}
    >
      Our <span className="section-title-accent">Core Values</span>
    </motion.h2>

    <motion.div
      className="values-grid"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={staggerContainer}
    >
      {[
        {
          icon: <ShieldCheck size={40} strokeWidth={2} />,
          title: 'Integrity',
          desc: 'Transparent, fair, and honest interactions always.',
        },
        {
          icon: <Rocket size={40} strokeWidth={2} />,
          title: 'Empowerment',
          desc: 'Enabling students and employers to unlock their full potential.',
        },
        {
          icon: <Brain size={40} strokeWidth={2} />,
          title: 'Innovation',
          desc: 'Pioneering AI-powered tools for smarter hiring.',
        },
        {
          icon: <Handshake size={40} strokeWidth={2} />,
          title: 'Collaboration',
          desc: 'Fostering partnerships that nurture talent and ideas.',
        },
      ].map((value, index) => (
        <motion.div
          key={value.title}
          className="value-card"
          variants={itemVariants}
        >
          <div className="value-icon text-accent">{value.icon}</div>
          <h3 className="value-title">{value.title}</h3>
          <p className="value-desc">{value.desc}</p>
        </motion.div>
      ))}
    </motion.div>
  </div>
</section>

      {/* Why Choose I-Intern? */}
      <section className="section section-white">
        <div className="container">
          <motion.h2
            className="section-title mb-12"
            {...fadeIn}
          >
            Why Choose <span className="section-title-accent">I-Intern</span>?
          </motion.h2>

          <motion.div
            className="features-grid"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            {[
              {
                title: 'Diverse Opportunities',
                desc: 'Access a vast array of internships across multiple industries and domains, tailored to your aspirations.',
              },
              {
                title: 'AI-Driven Matchmaking',
                desc: 'Our intelligent algorithms precisely recommend the right opportunities to the right candidates, optimizing fit and potential.',
              },
              {
                title: 'Secure & Modern Platform',
                desc: 'Benefit from a robust, scalable, and contemporary platform designed with digital natives in mind, ensuring your data is safe.',
              },
              {
                title: 'Seamless Experience',
                desc: 'Enjoy real-time notifications, streamlined applications, and an intuitive user experience from start to finish.',
              },
              {
                title: 'Direct Engagement',
                desc: 'Facilitate direct communication between students and employers, removing unnecessary intermediaries and fostering genuine connections.',
              },
              {
                title: 'Outcome-Oriented Support',
                desc: 'From application to onboarding, we focus on driving meaningful career outcomes and long-term growth for every user.',
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="feature-item"
                variants={itemVariants}
              >
                <span className="feature-check">✓</span>
                <div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-desc">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Meet the Founders Section */}
      <section className="section section-blue-light">
        <div className="container text-center">
          <motion.h2
            className="section-title mb-12"
            {...fadeIn}
          >
            Meet the <span className="section-title-accent">Visionaries</span>
          </motion.h2>

          <motion.div
            className="founders-grid"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            {/* Rahul Balaskandan */}
            <motion.div 
              className="founder-card"
              variants={itemVariants}
            >
              <div 
                className="founder-avatar founder-avatar-rb"
              >
                <span className="founder-initials">RB</span>
              </div>
              <h3 className="founder-name">Rahul Balaskandan</h3>
              <p className="founder-title">Founder, CEO & CFO</p>
              <p className="founder-desc">
                Rahul is the visionary driving I-Intern's mission. As a frontend specialist and cybersecurity lead,
                he ensures that the platform is both visually intuitive and structurally secure. Rahul blends deep
                technical expertise with strategic insight to lead I-Intern's design, development, and financial growth.
              </p>
            </motion.div>

            {/* Deepakumar */}
            <motion.div 
              className="founder-card"
              variants={itemVariants}
            >
              <div 
                className="founder-avatar founder-avatar-dk"
              >
                <span className="founder-initials">DK</span>
              </div>
              <h3 className="founder-name">Deepakumar</h3>
              <p className="founder-title">Co-founder & CTO</p>
              <p className="founder-desc">
                Deepakumar is the brilliant architect behind I-Intern's technological backbone. His innovation in AI-powered
                skill verification has redefined candidate evaluation — offering faster, fairer, and smarter hiring processes.
                As CTO, he brings both visionary insight and meticulous execution to I-Intern's technical evolution.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="section section-primary">
        <div className="container text-center">
          <motion.h2
            className="cta-title"
            {...fadeIn}
          >
            Ready to Launch Your <span className="section-title-accent">Journey ?</span>
          </motion.h2>
          <motion.p
            className="cta-text"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Whether you're a student ready to take your first step into the industry, or an organization searching for
            tomorrow's leaders — <strong>I-Intern</strong> is your gateway to meaningful collaboration, practical growth, and mutual success.
            Join us, and transform potential into unparalleled performance.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="cta-buttons">
              <button 
                className="btn-primary"
                onClick={handleStudentRegistration}
              >
                Register as Intern
              </button>
              <button 
                className="btn-outline"
                onClick={handleEmployerRegistration}
              >
                Register as Employer
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;