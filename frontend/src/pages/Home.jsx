import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Users, Brain, FileText, MessageCircle, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/Button';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  // Navigate to pages
  const handleApplyNow = () => navigate("/login");
  const handleLogin = () => navigate("/login");
  const handleRegisterIntern = () => navigate("/register-student");
  const handleRegisterEmployer = () => navigate("/register-employer");

  // Animation variants
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

  const features = [
    {
      icon: Brain,
      title: "AI-Based Skill Verification",
      description: "Showcase your skills with AI-driven testing and assessment."
    },
    {
      icon: FileText,
      title: "Personalized Resume Builder",
      description: "Create a standout resume with professional templates."
    },
    {
      icon: TrendingUp,
      title: "Internship Tracking System",
      description: "Track your applications and progress in one place."
    },
    {
      icon: MessageCircle,
      title: "24/7 Chat Assistance",
      description: "Get real-time support and guidance anytime."
    }
  ];

  const trendingInternships = [
    {
      title: "Software Developer Intern",
      company: "Google",
      location: "Remote",
      salary: "₹15,000/month"
    },
    {
      title: "Marketing Intern",
      company: "Amazon",
      location: "On-Site",
      salary: "₹12,000/month"
    },
    {
      title: "Data Science Intern",
      company: "Microsoft",
      location: "Hybrid",
      salary: "₹18,000/month"
    },
    {
      title: "Product Manager Intern",
      company: "Facebook",
      location: "Hybrid",
      salary: "₹20,000/month"
    },
    {
      title: "Graphic Design Intern",
      company: "Adobe",
      location: "Remote",
      salary: "₹12,000/month"
    },
    {
      title: "Data Analyst Intern",
      company: "Netflix",
      location: "On-Site",
      salary: "₹14,000/month"
    }
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <motion.div
            className="hero-content"
            initial="hidden"
            animate="show"
            variants={staggerContainer}
          >
            <motion.h1
              className="hero-title"
              variants={itemVariants}
            >
              Empowering Internships, Building <span className="hero-accent">Careers</span>
            </motion.h1>
            <motion.p
              className="hero-subtitle"
              variants={itemVariants}
            >
              Find your dream internship or hire skilled interns with ease through our intelligent platform.
            </motion.p>
            <motion.div
              className="hero-buttons"
              variants={itemVariants}
            >
              <Button 
                variant="primary" 
                size="lg" 
                className="hero-btn-primary"
                onClick={() => navigate("/internships")}
              >
                Find Internships
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="hero-btn-outline"
                onClick={() => navigate("/register-employer")}
              >
                Hire Interns
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 🔍 Stylish Search Section */}
<section className="search-section">
  <div className="container">
    <motion.div className="search-container" {...fadeIn}>
      <div className="search-input-wrapper glassmorph">
        <Search className="search-icon" />

        <input
          type="text"
          className="search-input"
          placeholder="Search internships by role, location, or company..."
        />

        <Button variant="primary" className="search-btn glow-on-hover">
          Search
        </Button>
      </div>
    </motion.div>
  </div>
</section>


      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <motion.h2
            className="section-title"
            {...fadeIn}
          >
            Why Choose <span className="section-title-accent">I-Intern</span>
          </motion.h2>
          
          <motion.div
            className="features-grid"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="feature-card"
                variants={itemVariants}
              >
                <div className="feature-icon">
                  <feature.icon size={32} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trending Internships Section */}
      <section className="internships-section">
  <div className="container">
    <motion.h2
      className="section-title section-title-white"
      {...fadeIn}
    >
      Trending <span className="section-title-accent">Internships</span>
    </motion.h2>

    <motion.div
      className="internships-grid"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={staggerContainer}
    >
      {trendingInternships.map((internship, index) => (
        <motion.div
          key={`${internship.company}-${index}`}
          className="internship-card static-card"
          variants={itemVariants}
        >
          <h3 className="internship-title">{internship.title}</h3>
          <div className="internship-details">
            <p className="internship-company">{internship.company}</p>
            <p className="internship-location">{internship.location}</p>
            <p className="internship-salary">{internship.salary}</p>
          </div>
          <Button 
            className="internship-apply-btn filled-btn"
            onClick={handleApplyNow}
          >
            Apply Now
          </Button>
        </motion.div>
      ))}
    </motion.div>
  </div>
</section>


      {/* Call to Action Section */}
      <section className="cta-section">
  <div className="container">
    <motion.div
      className="cta-content"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={staggerContainer}
    >
      <motion.h2 className="cta-title" variants={itemVariants}>
      <span className="cta-accent">Ready to Start Your Journey ?</span>
      </motion.h2>

      <motion.p className="cta-subtitle" variants={itemVariants}>
        Join I-Intern today to explore exciting internships and career opportunities that will shape your future.
      </motion.p>

      <motion.div className="cta-buttons" variants={itemVariants}>
        <button data-variant="primary" onClick={handleLogin}>
          Login
        </button>
        <button data-variant="secondary" onClick={handleRegisterIntern}>
          Register as Intern
        </button>
        <button data-variant="outline" onClick={handleRegisterEmployer}>
          Register as Employer
        </button>
      </motion.div>
    </motion.div>
  </div>
</section>

    </div>
  );
};

export default Home;