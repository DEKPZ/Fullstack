import { useState, useCallback } from 'react';

// We can remove the type imports as they are not used in JavaScript
// import { ResumeData, PersonalInfo, Education, Project, Experience, Certification } from '../types/resume';

const initialPersonalInfo = {
  fullName: '',
  email: '',
  phone: '',
  githubLink: '',
  linkedinProfile: '',
};

const initialEducation = [
  {
    degree: '',
    college: '',
    cgpa: '',
    startDate: '',
    endDate: '',
  }
];

const initialResumeData = {
  personalInfo: initialPersonalInfo,
  objective: '',
  education: initialEducation,
  projects: [],
  experience: [],
  skills: [],
  certifications: [],
};

export const useResumeData = () => {
  const [resumeData, setResumeData] = useState(initialResumeData);
  const [currentStep, setCurrentStep] = useState(0);

  const updatePersonalInfo = useCallback((data) => {
    setResumeData(prev => ({ ...prev, personalInfo: data }));
  }, []);

  const updateObjective = useCallback((objective) => {
    setResumeData(prev => ({ ...prev, objective }));
  }, []);

  const updateEducation = useCallback((education) => {
    setResumeData(prev => ({ ...prev, education }));
  }, []);

  const updateProjects = useCallback((projects) => {
    setResumeData(prev => ({ ...prev, projects }));
  }, []);

  const updateExperience = useCallback((experience) => {
    setResumeData(prev => ({ ...prev, experience }));
  }, []);

  const updateSkills = useCallback((skills) => {
    setResumeData(prev => ({ ...prev, skills }));
  }, []);

  const updateCertifications = useCallback((certifications) => {
    setResumeData(prev => ({ ...prev, certifications }));
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, 6));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, []);

  const goToStep = useCallback((step) => {
    setCurrentStep(Math.max(0, Math.min(step, 6)));
  }, []);

  return {
    resumeData,
    currentStep,
    updatePersonalInfo,
    updateObjective,
    updateEducation,
    updateProjects,
    updateExperience,
    updateSkills,
    updateCertifications,
    nextStep,
    prevStep,
    goToStep,
  };
};