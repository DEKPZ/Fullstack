import { contactQA } from './contactQA';
import { complaintQA } from './complaintQA';
import { expQA } from './expQA';
import { contactOptions } from './contactOptions';
import { complaintOptions } from './complaintOptions';
import { expOptions } from './expOptions';
import { loginOptions } from './loginOptions';
import { resumeOptions } from './resumeOptions';
import { aiOptions } from './aiOptions';
import { webOptions } from './webOptions';
import { otherOptions } from './otherOptions';
import { tipsOfTheDay } from './tipsOfTheDay';

function getRandomTip() {
  const idx = Math.floor(Math.random() * tipsOfTheDay.length);
  return tipsOfTheDay[idx];
}
import React, { useState, useRef, useEffect } from 'react';
// ...other imports...

// MessageBubble: clean, reusable message renderer
const MessageBubble = ({ message, onOptionClick }: { message: Message, onOptionClick: (opt: string) => void }) => (
  <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
    <div
      className={`rounded-2xl px-5 py-3 max-w-[80%] whitespace-pre-line shadow-lg transition-all duration-200 ${
        message.type === 'user'
          ? 'bg-gradient-to-br from-[#4fd1c5] to-[#319795] text-white self-end border-0'
          : 'bg-gradient-to-br from-[#fff] to-[#e0e7ff] text-gray-900 self-start border border-[#b3edeb]'
      } ${message.isWelcome ? 'border-2 border-[#63D7C7] shadow-xl' : ''}`}
      style={{ fontSize: '1.05rem', letterSpacing: '0.01em' }}
    >
      {message.content}
      {message.options && (
        <div className="flex flex-col gap-2 mt-3">
          {message.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => onOptionClick(opt)}
              className={`option-btn${opt === 'Live Support' ? ' live-support' : ''}`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  </div>
);
import { mainOptions } from './mainOptions';
import { tipsOptions } from './tipsOptions';
import { generalOptions } from './generalOptions';
import { internOptions } from './internOptions';
import { employerOptions } from './employerOptions';
import { techOptions } from './techOptions';
import { accSettingsOptions } from './accSettingsOptions';
import { feedbackOptions } from './feedbackOptions';
import { MessageCircle, X, RefreshCw, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Maximize2, Minimize2 } from 'lucide-react';
import IvyAvatar from './IvyAvatar';
import TypingIndicator from './TypingIndicator';
import './ChatWidgetAnimations.css';

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  options?: string[];
  isWelcome?: boolean;
}

interface ChatIntent {
  id: string;
  title: string;
  response: string;
  followUp?: string[];
}

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const [tipOfTheDay, setTipOfTheDay] = useState<string>("");
  useEffect(() => {
    if (isOpen) {
      setTipOfTheDay(getRandomTip());
    }
  }, [isOpen]);

  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const handleFullscreenToggle = () => setIsFullscreen(f => !f);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [feedback, setFeedback] = useState<{ positive: boolean | null, comment: string }>({ positive: null, comment: '' });
  const [showCommentBox, setShowCommentBox] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showTyping, setShowTyping] = useState(false);
  
  const [avatarExpression, setAvatarExpression] = useState<'smile'|'surprised'|'neutral'>('smile');
  const [avatarListening, setAvatarListening] = useState(false);
  const [avatarMouthMove, setAvatarMouthMove] = useState(false);
  const [avatarEyePos, setAvatarEyePos] = useState({ x: 0, y: 0 });
  const [avatarIdle, setAvatarIdle] = useState(false);
  const idleTimeoutRef = useRef<number | null>(null);




  const chatIntents: ChatIntent[] = [
    
    {
      id: 'what-is-iintern',
      title: 'What is I-Intern?',
      response: 'I-Intern is a platform that connects students with internship opportunities and helps companies find skilled interns quickly and easily.',
      followUp: ['How does I-Intern work?', 'Who can use I-Intern?', 'Is it free to use?', 'How do I contact support?', '← Back to main menu', 'End conversation']
    },
    {
      id: 'how-does-iintern-work',
      title: 'How does I-Intern work?',
      response: 'I-Intern works by matching students and recent graduates with internships based on their skills, interests, and goals. Companies post opportunities, and our platform uses smart algorithms to recommend the best matches. You can apply, track your application, and even take skill tests—all in one place!',
      followUp: ['Who can use I-Intern?', 'Is it free to use?', 'How do I contact support?', '← Back to main menu', 'End conversation']
    },
    {
      id: 'who-can-use-iintern',
      title: 'Who can use I-Intern?',
      response: 'I-Intern is designed for students, recent graduates, and employers looking to offer internships. Anyone seeking internship experience or looking to hire interns can use the platform.',
      followUp: ['Is it free to use?', 'How do I contact support?', '← Back to main menu', 'End conversation']
    },
    {
      id: 'is-it-free-to-use',
      title: 'Is it free to use?',
      response: 'Yes! I-Intern is free for students and job seekers. Employers may have premium options for additional features, but searching and applying for internships is always free for candidates.',
      followUp: ['How do I contact support?', '← Back to main menu', 'End conversation']
    },
    {
      id: 'how-do-i-contact-support',
      title: 'How do I contact support?',
      response: 'You can contact support by clicking the “Talk to Support” button, emailing support@i-intern.com, or calling 1-800-INTERN-1. We’re here to help!',
      followUp: ['← Back to main menu', 'End conversation']
    },
    {
      id: 'what-can-you-do',
      title: 'What can you do?',
      response: 'I can help you apply for internships, build a resume, track your application, or answer any platform-related questions.',
      followUp: ['← Back to main menu', 'End conversation']
    },
    
    {
      id: 'intern-registration-profile',
      title: 'Registration & Profile',
      response: 'Registration & Profile: Get started by creating your account and completing your profile. See the questions below for help.',
      followUp: [
        'How do I sign up?',
        'How do I complete my profile?',
        'What documents do I need to upload?',
        '← Back to main menu',
        'End conversation'
      ]
    },
    {
      id: 'how-do-i-sign-up',
      title: 'How do I sign up?',
      response: 'Click the “Sign Up” button on the homepage, enter your email and create a password. You’ll receive a verification email—just follow the link to activate your account.',
      followUp: ['How do I complete my profile?', 'What documents do I need to upload?', '← Back to main menu', 'End conversation']
    },
    {
      id: 'how-do-i-complete-profile',
      title: 'How do I complete my profile?',
      response: 'Go to your dashboard and click “Edit Profile.” Fill in your education, skills, interests, and upload a profile picture to complete your profile.',
      followUp: ['What documents do I need to upload?', '← Back to main menu', 'End conversation']
    },
    {
      id: 'what-documents-upload',
      title: 'What documents do I need to upload?',
      response: 'You should upload your resume, academic transcripts, and any relevant certificates. Some internships may require additional documents, which will be listed in the application.',
      followUp: ['← Back to main menu', 'End conversation']
    },
    
    {
      id: 'intern-internship-search',
      title: 'Internship Search',
      response: 'Internship Search: Find and apply for internships that match your interests. See the questions below for help.',
      followUp: [
        'How do I find internships?',
        'Can I filter internships by city or domain?',
        'What do I do after I apply?',
        '← Back to main menu',
        'End conversation'
      ]
    },
    {
      id: 'how-find-internships',
      title: 'How do I find internships?',
      response: 'Click “Find Internships” in your dashboard. You can browse all available positions or use filters to narrow your search.',
      followUp: ['Can I filter internships by city or domain?', 'What do I do after I apply?', '← Back to main menu', 'End conversation']
    },
    {
      id: 'filter-internships',
      title: 'Can I filter internships by city or domain?',
      response: 'Yes! Use the filters on the internships page to select your preferred city, domain, duration, and more.',
      followUp: ['What do I do after I apply?', '← Back to main menu', 'End conversation']
    },
    {
      id: 'after-apply',
      title: 'What do I do after I apply?',
      response: 'After you apply, you can track your application status in your dashboard. If shortlisted, you’ll be contacted for the next steps via email or platform notifications.',
      followUp: ['Where can I track my applications?', '← Back to main menu', 'End conversation']
    },
    
    {
      id: 'intern-resume-builder',
      title: 'Resume Builder',
      response: 'Resume Builder: Create and manage your resume with our built-in tools. See the questions below for help.',
      followUp: [
        'Where is the Resume Builder?',
        'How can I add certifications and projects?',
        'Can I download my resume as a PDF?',
        '← Back to main menu',
        'End conversation'
      ]
    },
    {
      id: 'where-resume-builder',
      title: 'Where is the Resume Builder?',
      response: 'The Resume Builder is available in your dashboard. Click “Build Resume” to get started.',
      followUp: ['How can I add certifications and projects?', 'Can I download my resume as a PDF?', '← Back to main menu', 'End conversation']
    },
    {
      id: 'add-certifications-projects',
      title: 'How can I add certifications and projects?',
      response: 'In the Resume Builder, you’ll find sections to add certifications and projects. Click “Add” in each section and fill in the details.',
      followUp: ['Can I download my resume as a PDF?', '← Back to main menu', 'End conversation']
    },
    {
      id: 'download-resume-pdf',
      title: 'Can I download my resume as a PDF?',
      response: 'Yes! Once you finish building your resume, click the “Download PDF” button to save it to your device.',
      followUp: ['← Back to main menu', 'End conversation']
    },
    
    {
      id: 'intern-ai-skill-test',
      title: 'AI Skill Test',
      response: 'AI Skill Test: Assess your skills and boost your chances of getting matched. See the questions below for help.',
      followUp: [
        'Is it mandatory?',
        'How do I prepare for it?',
        'What happens if I fail?',
        '← Back to main menu',
        'End conversation'
      ]
    },
    {
      id: 'is-skill-test-mandatory',
      title: 'Is it mandatory?',
      response: 'The AI skill test is not mandatory for all internships, but taking it can increase your chances of being matched and shortlisted by employers.',
      followUp: ['How do I prepare for it?', 'What happens if I fail?', '← Back to main menu', 'End conversation']
    },
    {
      id: 'prepare-skill-test',
      title: 'How do I prepare for it?',
      response: 'Review the skills and topics relevant to your field, practice sample questions, and get a good night’s sleep before the test. The platform may also provide practice tests.',
      followUp: ['What happens if I fail?', '← Back to main menu', 'End conversation']
    },
    {
      id: 'fail-skill-test',
      title: 'What happens if I fail?',
      response: 'Don’t worry! You can retake the AI skill test after a waiting period. Use the feedback provided to improve your skills before trying again.',
      followUp: ['← Back to main menu', 'End conversation']
    },
    
    {
      id: 'intern-dashboard-help',
      title: 'Dashboard Help',
      response: 'Dashboard Help: Manage your applications, profile, and more from your dashboard. See the questions below for help.',
      followUp: [
        'Where can I track my applications?',
        'How do I update my profile picture?',
        'How do I see feedback from employers?',
        'How do I build my resume?',
        'What is the AI skill test?',
        'How do I apply for an internship?',
        'How do I track my application?',
        'Can I talk to a human?',
        '← Back to main menu',
        'End conversation'
      ]
    },
    {
      id: 'where-track-applications',
      title: 'Where can I track my applications?',
      response: 'Go to your dashboard and click on “My Applications” to see the status of all your internship applications.',
      followUp: ['← Back to main menu', 'End conversation']
    },
    {
      id: 'update-profile-picture',
      title: 'How do I update my profile picture?',
      response: 'In your dashboard, go to “Edit Profile” and click on your profile picture to upload a new one.',
      followUp: ['← Back to main menu', 'End conversation']
    },
    {
      id: 'see-employer-feedback',
      title: 'How do I see feedback from employers?',
      response: 'If an employer leaves feedback, you’ll see it in your “My Applications” section or receive a notification on your dashboard.',
      followUp: ['Back to main menu', 'End conversation']
    },
    {
      id: 'build-resume',
      title: 'How do I build my resume?',
      response: "Click 'Build Resume' from your dashboard, fill in your details, and preview or download it in PDF!",
      followUp: ['Back to main menu', 'End conversation']
    },
    {
      id: 'ai-skill-test',
      title: 'What is the AI skill test?',
      response: "It's a 25-minute adaptive test that checks your tech and soft skills. Based on your role, you’ll take MCQs, coding, and scenario-based challenges.",
      followUp: ['Back to main menu', 'End conversation']
    },
    {
      id: 'apply-internship',
      title: 'How do I apply for an internship?',
      response: "Just go to 'Find Internships', choose one, and click 'Apply'. I’ll keep you updated!",
      followUp: ['Back to main menu', 'End conversation']
    },
    {
      id: 'track-application',
      title: 'How do I track my application?',
      response: "Go to your dashboard > ‘My Applications’ to view the current status.",
      followUp: ['Back to main menu', 'End conversation']
    },
    {
      id: 'talk-to-human',
      title: 'Can I talk to a human?',
      response: "Sure! Type 'talk to support' and I’ll connect you.",
      followUp: ['Talk to Support', 'Back to main menu', 'End conversation']
    },
    
    {
      id: 'employer-register-company',
      title: 'Register as a Company',
      response: 'Register as a Company: Create your employer account to start posting internships and managing applicants. See the questions below for help.',
      followUp: [
        'How do I register as a company?',
        'How do I post an internship?',
        '← Back to main menu',
        'End conversation'
      ]
    },
    {
      id: 'register-company',
      title: 'How do I register as a company?',
      response: 'Click “Sign Up” and select “Employer/Company.” Fill in your company details, verify your email, and your account will be set up for posting internships.',
      followUp: ['How do I post an internship?', 'Back to main menu', 'End conversation']
    },
    {
      id: 'post-internship-employer',
      title: 'How do I post an internship?',
      response: 'Go to your dashboard and click “Post Internship.” Fill in the role details, requirements, and publish your listing. You can manage all postings from your dashboard.',
      followUp: ['Can I shortlist or reject applicants?', 'How do I view applicant resumes?', 'Back to main menu', 'End conversation']
    },
    {
      id: 'shortlist-reject-applicants',
      title: 'Can I shortlist or reject applicants?',
      response: 'Yes! In your dashboard, under each internship posting, you can view all applicants. Use the “Shortlist” or “Reject” buttons to manage candidates.',
      followUp: ['How do I view applicant resumes?', 'Back to main menu', 'End conversation']
    },
    {
      id: 'view-applicant-resumes',
      title: 'How do I view applicant resumes?',
      response: 'Go to your dashboard, select the internship posting, and click on any applicant to view their resume and profile details.',
      followUp: ['Back to main menu', 'End conversation']
    },
    {
      id: 'post-internship',
      title: 'How can I post an internship?',
      response: "Click on ‘Post Internship’ in your dashboard, fill in the role details, and hit publish!",
      followUp: ['Back to main menu', 'End conversation']
    },
    {
      id: 'track-candidates',
      title: 'How do I track applications?',
      response: "Go to your ‘Manage Internships’ section to view candidates and their skill test results.",
      followUp: ['Back to main menu', 'End conversation']
    },
    {
      id: 'ai-test-engine',
      title: 'What is the AI-Test Engine?',
      response: "It’s a smart evaluator that checks applicants' skills using real-time code, MCQs, and behavioral scenarios.",
      followUp: ['Back to main menu', 'End conversation']
    },
    
    {
      id: 'cant-log-in',
      title: 'I can’t log in.',
      response: 'Please check your email and password. If you forgot your password, click “Forgot Password” to reset it. If you still have trouble, contact support for help.',
      followUp: ['Site isn’t loading.', 'Back to main menu', 'End conversation']
    },
    {
      id: 'site-not-loading',
      title: 'Site isn’t loading.',
      response: 'Try refreshing the page or clearing your browser cache. If the problem continues, check your internet connection or try a different browser. Still stuck? Contact support.',
      followUp: ['I can’t log in.', 'Back to main menu', 'End conversation']
    },
    {
      id: 'resume-pdf-not-generating',
      title: 'Resume PDF not generating.',
      response: 'If your resume PDF isn’t generating, make sure all required fields are filled out. Try again after a few minutes. If the issue persists, contact support and we’ll help you resolve it.',
      followUp: ['Back to main menu', 'End conversation']
    },
    {
      id: 'ai-test-not-starting',
      title: 'AI test not starting.',
      response: 'If the AI test isn’t starting, check your internet connection and make sure you’ve completed your profile. Try refreshing the page. If it still doesn’t work, contact support for assistance.',
      followUp: ['Back to main menu', 'End conversation']
    },
    {
      id: 'cant-login',
      title: "I can't log in.",
      response: "Please check your email and password. If you’ve forgotten, click ‘Forgot Password’ to reset.",
      followUp: ['Back to main menu', 'End conversation']
    },
    {
      id: 'website-not-loading',
      title: 'Website is not loading.',
      response: "Try refreshing or clearing your browser cache. If the problem continues, please contact support.",
      followUp: ['Back to main menu', 'End conversation']
    },
    
    {
      id: 'give-feedback',
      title: 'How can I give feedback?',
      response: "You can fill out our feedback form or just type your thoughts here — I’ll pass them to the team.",
      followUp: ['Back to main menu', 'End conversation']
     },
    {
      id: 'report-problem',
      title: 'How do I report a problem?',
      response: 'To report a problem, click the feedback button in the chat or go to the “Contact Support” section. You can also email us at support@i-intern.com with details about the issue. We appreciate your help in making I-Intern better!',
      followUp: ['I found a bug. What do I do?', 'How can I give feedback?', 'Back to main menu', 'End conversation']
    },
    {
      id: 'found-bug',
      title: 'I found a bug. What do I do?',
      response: 'If you find a bug, please let us know by using the feedback form, emailing support@i-intern.com, or describing the issue here in the chat. Include as much detail as possible (what you were doing, error messages, screenshots). Our team will investigate and fix it as soon as possible!',
      followUp: ['How do I report a problem?', 'How can I give feedback?', 'Back to main menu', 'End conversation']
    },
    
    {
      id: 'resume-build',
      title: 'How do I build my resume?',
      response: 'Building a strong resume involves several key steps:\n\n• Choose a clean, professional template.\n• Include your contact information, objective, education, experience, and skills.\n• Use action verbs and quantify your achievements.\n• Tailor your resume to each internship application.\n• Keep it to 1-2 pages maximum.\n\nOur Resume Builder tool can guide you through each section step by step!',
      followUp: ['Resume sections help', 'Resume templates', 'Common resume mistakes', 'Back to main menu', 'End conversation']
    },
    {
      id: 'resume-templates',
      title: 'Resume Templates',
      response: 'Popular Resume Templates:\n\n• Chronological: Lists experience from most recent to oldest.\n• Functional: Focuses on skills and abilities.\n• Combination: Mixes skills and work history.\n• Creative: For design or creative roles.\n\nChoose a clean, professional layout. Use online tools like Canva, Google Docs, or Microsoft Word for free templates.\n\nOur Resume Builder offers customizable templates to help you get started!',
      followUp: ['Back to main menu', 'End conversation']
    },
    {
      id: 'resume-sections-help',
      title: 'Resume Sections Help',
      response: 'Resume Sections Explained:\n\n• Header: Your name, contact information, LinkedIn, and portfolio.\n• Objective: A brief statement of your career goals.\n• Education: School, degree, GPA, and graduation date.\n• Experience: Jobs, internships, and volunteer work with achievements.\n• Skills: Technical and soft skills relevant to the role.\n• Projects: Academic or personal projects showing your abilities.\n• Certifications: Relevant courses or credentials.\n\nEach section should be clear, concise, and tailored to the internship you are applying for!',
      followUp: ['Back to main menu', 'End conversation']
    },
    {
      id: 'find-internships',
      title: 'Where can I apply for internships?',
      response: 'You can find internship opportunities in several places:\n\n• The I-Intern job board (your best starting point!)\n• Company websites directly\n• LinkedIn and Indeed\n• University career centers\n• Industry-specific job boards\n• Professional networking events\n\nStart with our platform—we have pre-screened opportunities perfect for students!',
      followUp: ['How to search effectively', 'Application tips', 'Interview preparation', 'Back to main menu', 'End conversation']
    },
    {
      id: 'application-tips',
      title: 'Application Tips',
      response: 'Internship Application Tips:\n\n• Tailor your resume and cover letter to each position.\n• Highlight relevant skills and experiences.\n• Follow application instructions carefully.\n• Proofread for spelling and grammar errors.\n• Submit all required documents (resume, cover letter, transcripts).\n• Apply early to maximize your chances.\n• Keep track of deadlines and responses.\n\nA well-prepared application stands out to employers!',
      followUp: ['Back to main menu', 'End conversation']
    },
    {
      id: 'search-effectively',
      title: 'How do I search effectively?',
      response: 'Tips for Effective Internship Searching:\n\n• Use specific keywords related to your field or interests.\n• Filter by location, remote options, and company size.\n• Set up job alerts on platforms like LinkedIn and I-Intern.\n• Check application deadlines and requirements.\n• Research companies before applying.\n• Track your applications to avoid duplicates.\n• Network with professionals for referrals.\n\nA strategic search increases your chances of finding the right internship!',
      followUp: ['Back to main menu', 'End conversation']
    },
    {
      id: 'ai-test',
      title: 'What is the AI test?',
      response: 'The AI Assessment is our intelligent screening tool that helps match you with suitable internships:\n\n• Takes 10-15 minutes to complete.\n• Tests relevant skills for your field.\n• Provides personalized recommendations.\n• Helps employers find qualified candidates.\n• Can be retaken after 30 days.\n\nComplete it in your profile section to unlock premium opportunities!',
      followUp: ['Test preparation tips', 'How scoring works', 'Retaking the test', 'Back to main menu', 'End conversation']
    },
    {
      id: 'test-preparation-tips',
      title: 'Test Preparation Tips',
      response: 'AI Test Preparation Tips:\n\n• Review the skills and topics relevant to your field.\n• Practice sample questions or assessments online.\n• Get a good night\'s sleep before the test.\n• Find a quiet, distraction-free environment.\n• Read instructions carefully during the test.\n• Manage your time and don\'t rush.\n• Stay calm and confident.\n\nPreparation helps you perform your best and get matched to the right internships!',
      followUp: ['Back to main menu', 'End conversation']
    },
    {
      id: 'employer-posting',
      title: 'How do employers post internships?',
      response: 'Employers can easily post internships on I-Intern:\n\n• Create a company account.\n• Verify business credentials.\n• Post detailed job descriptions.\n• Set screening requirements.\n• Review AI-matched candidates.\n• Manage applications through our dashboard.\n\nWe ensure quality by vetting all employer accounts before approval.',
      followUp: ['Employer verification process', 'Posting guidelines', 'Contact employer support', 'Back to main menu', 'End conversation']
    },
    {
      id: 'contact-employer-support',
      title: 'Contact employer support',
      response: 'Need help with posting internships or managing your employer account?\n\n• Email our support team: business@i-intern.com\n• Call us: 1-800-INTERN-1 (Mon-Fri, 9am-6pm ET)\n• Visit our Help Center for FAQs and guides\n• Live chat available on the I-Intern dashboard\n\nWe\'re here to assist with any questions or technical issues you may have!',
      followUp: ['Back to main menu', 'End conversation']
    },
    {
      id: 'posting-guidelines',
      title: 'Posting guidelines',
      response: 'Internship Posting Guidelines for Employers:\n\n• Write clear, detailed job descriptions\n• Specify required skills, qualifications, and responsibilities\n• Include application instructions and deadlines\n• State whether the internship is paid or unpaid\n• Provide company background and contact info\n• Avoid discriminatory language\n• Review postings for accuracy before publishing\n\nFollowing these guidelines helps attract qualified candidates and ensures a smooth hiring process.',
      followUp: ['Back to main menu', 'End conversation']
    },
    {
      id: 'track-application',
      title: 'How to track my application?',
      response: 'Track your applications easily in your dashboard:\n\n• Visit "My Applications" section\n• View status: Applied, Under Review, Interview, Offer, or Rejected\n• Get email notifications for status changes\n• See application timestamps\n• Download application history\n\nEmployers typically respond within 5-7 business days.',
      followUp: ['Application status meanings', 'Following up with employers', 'Notification settings', 'Back to main menu', 'End conversation']
    },
    {
      id: 'application-status',
      title: 'Understanding application status',
      response: 'Here\'s what each application status means:\n\n• **Applied**: Successfully submitted\n• **Under Review**: Employer is evaluating\n• **Interview**: You\'ve been selected for interview\n• **Offer**: Congratulations! Job offer extended\n• **On Hold**: Temporarily paused\n• **Rejected**: Not selected this time\n\nDon\'t get discouraged by rejections - they\'re part of the process!',
      followUp: ['Improving applications', 'Interview tips', 'Handling rejection', 'Back to main menu', 'End conversation']
    },
    {
      id: 'employer-dashboard',
      title: 'Employer dashboard help',
      response: 'Employers have access to powerful dashboard features:\n\n• Post and manage job listings\n• Review AI-matched candidates\n• Schedule interviews\n• Send offers and communications\n• Track hiring metrics\n• Access candidate profiles and assessments\n\nNeed help with employer features? Contact our business support team.',
      followUp: ['Posting jobs effectively', 'Candidate matching', 'Contact employer support', 'Back to main menu', 'End conversation']
    },
    {
      id: 'posting-jobs-effectively',
      title: 'Posting jobs effectively',
      response: 'Tips for Posting Jobs Effectively on I-Intern:\n\n• Write clear, detailed job descriptions with required skills and responsibilities.\n• Use relevant keywords to attract the right candidates.\n• Specify application instructions and deadlines.\n• Highlight company culture and benefits.\n• Review postings for accuracy before publishing.\n• Respond promptly to applicants and keep your postings updated.\n\nEffective job postings help you attract and hire the best interns!',
      followUp: ['Candidate matching', 'Contact business support', 'Employer dashboard help', 'Back to main menu', 'End conversation']
    },
    {
      id: 'candidate-matching',
      title: 'Candidate matching',
      response: 'How Candidate Matching Works on I-Intern:\n\n• Our AI analyzes job requirements and candidate profiles to recommend the best fits.\n• You can view a list of AI-matched candidates for each posting in your dashboard.\n• Use filters to further refine candidates by skills, education, or experience.\n• Review candidate profiles, resumes, and skill test results before shortlisting.\n• Reach out to top matches directly through the platform.\n\nSmart matching helps you find the right intern faster and more efficiently!',
      followUp: ['Posting jobs effectively', 'Contact business support', 'Employer dashboard help', 'Back to main menu', 'End conversation']
    },
    {
      id: 'resume-sections',
      title: 'Section-by-section resume tips',
      response: 'Let me break down each resume section:\n\n**Header**: Name, phone, email, LinkedIn, portfolio\n**Objective**: 1-2 lines about your career goals\n**Education**: Degree, school, GPA (if 3.5+), graduation date\n**Experience**: Jobs, internships, volunteer work with achievements\n**Skills**: Technical and soft skills relevant to the role\n**Projects**: Academic or personal projects showing your abilities',
      followUp: ['Header best practices', 'Writing objectives', 'Skills section tips', 'Back to main menu', 'End conversation']
    },
    {
      id: 'writing-objectives',
      title: 'Writing objectives',
      response: 'Resume Objective Writing Tips:\n\n• Keep it concise: 1-2 sentences\n• State your career goals and target position\n• Mention relevant skills or experience\n• Tailor to each internship application\n• Show enthusiasm for the role or company\n\nExample: \'Motivated computer science student seeking a software engineering internship to apply coding skills and contribute to innovative projects at TechCorp.\'\n\nA clear objective helps recruiters quickly understand your goals and fit!',
      followUp: ['Back to main menu', 'End conversation']
    },
    {
      id: 'header-best-practices',
      title: 'Header best practices',
      response: 'Resume Header Best Practices:\n\n• Use your full name, large and bold at the top\n• Include a professional email address (avoid nicknames)\n• Add your phone number with country code\n• Provide your LinkedIn URL and/or portfolio link\n• Double-check for typos and accuracy\n• Keep the header clean and uncluttered\n• No need for home address\n\nA strong header makes it easy for recruiters to contact you and sets a professional tone!',
      followUp: ['Back to main menu', 'End conversation']
    },
    {
      id: 'interview-prep',
      title: 'Interview preparation tips',
      response: 'Ace your internship interviews with these tips:\n\n• Research the company thoroughly\n• Practice common interview questions\n• Prepare STAR method examples\n• Dress professionally\n• Arrive 10-15 minutes early\n• Bring copies of your resume\n• Prepare thoughtful questions to ask\n\nRemember: they already like your application, now show your personality!',
      followUp: ['Common interview questions', 'What to wear', 'Questions to ask', 'Back to main menu', 'End conversation']
    },
    {
      id: 'networking-tips',
      title: 'Professional networking advice',
      response: 'Build your professional network effectively:\n\n• Optimize your LinkedIn profile\n• Attend virtual and in-person events\n• Join industry-specific groups\n• Reach out to alumni in your field\n• Follow up with new connections\n• Offer value, don\'t just ask for help\n• Be genuine and authentic in interactions',
      followUp: ['LinkedIn optimization', 'Networking events', 'Alumni connections', 'Back to main menu', 'End conversation']
    },
    {
      id: 'linkedin-optimization',
      title: 'LinkedIn optimization',
      response: 'Optimize your LinkedIn profile for internship success:\n\n• Use a professional photo and headline\n• Write a compelling summary highlighting your goals and strengths\n• List relevant experience, education, and skills\n• Add projects, certifications, and volunteer work\n• Request recommendations from professors or colleagues\n• Customize your LinkedIn URL\n• Connect with professionals in your field\n• Engage with posts and share your achievements\n\nA strong LinkedIn profile increases your visibility to recruiters and helps you build your network!',
      followUp: ['Profile photo tips', 'Writing a summary', 'Getting recommendations', 'Back to main menu', 'End conversation']
    },
    {
      id: 'profile-photo-tips',
      title: 'Profile photo tips',
      response: 'LinkedIn Profile Photo Tips:\n\n• Use a high-resolution, recent photo\n• Dress professionally and keep background simple\n• Smile naturally to appear approachable\n• Face the camera directly with good lighting\n• Avoid group photos, filters, or distracting elements\n• Crop to show your head and shoulders\n• Make sure your face is clearly visible\n\nA great profile photo helps you make a strong first impression with recruiters and connections!',
      followUp: ['Back to main menu', 'End conversation']
    },
    {
      id: 'cover-letter',
      title: 'Writing effective cover letters',
      response: 'Craft compelling cover letters:\n\n• Address hiring manager by name if possible\n• Open with enthusiasm for the specific role\n• Highlight 2-3 relevant achievements\n• Show knowledge of the company\n• Keep it to one page\n• End with a strong call to action\n• Proofread carefully for errors',
      followUp: ['Cover letter templates', 'Research techniques', 'Common mistakes', 'Back to main menu', 'End conversation']
    },
    {
      id: 'research-techniques',
      title: 'Research techniques',
      response: 'Effective research techniques for internship applications:\n\n• Read the company website and mission statement\n• Review recent news, press releases, and social media\n• Check employee reviews on Glassdoor and LinkedIn\n• Look up the hiring manager or team on LinkedIn\n• Understand the company\'s products, services, and culture\n• Note recent projects, awards, or growth\n• Prepare questions based on your research\n\nThorough research helps you tailor your application and stand out in interviews!',
      followUp: ['Writing effective cover letters', 'Common mistakes', 'Back to main menu', 'End conversation']
    },
    {
      id: 'salary-negotiation',
      title: 'Internship compensation guide',
      response: 'Understanding internship compensation:\n\n• Research market rates for your field/location\n• Consider total package (pay, benefits, learning)\n• Many internships are unpaid but offer valuable experience\n• Don\'t negotiate until you have an offer\n• Be grateful but professional in discussions',
      followUp: ['Research salary data', 'Negotiation tactics', 'Non-monetary benefits', 'Back to main menu', 'End conversation']
    },
    {
      id: 'research-salary-data',
      title: 'Research salary data',
      response: 'How to research internship salary data:\n\n• Use sites like Glassdoor, Payscale, Indeed, and LinkedIn Salary\n• Check university career center reports for average pay\n• Network with peers and alumni for real-world insights\n• Look for salary info in job postings\n• Consider location, industry, and company size\n• Remember: pay varies widely by field and region\n\nGathering salary data helps you set realistic expectations and negotiate effectively!',
      followUp: ['Negotiation tactics', 'Non-monetary benefits', 'Internship compensation guide', 'Back to main menu', 'End conversation']
    },
    {
      id: 'technical-skills',
      title: 'Developing technical skills',
      response: 'Boost your technical abilities:\n\n• Identify skills needed in your target field\n• Take online courses (Coursera, Udemy, edX)\n• Work on personal projects\n• Contribute to open source projects\n• Build a portfolio showcasing your work\n• Get relevant certifications\n• Practice coding challenges if in tech',
      followUp: ['Popular online courses', 'Portfolio building', 'Certification programs', 'Back to main menu', 'End conversation']
    },
    {
      id: 'remote-internships',
      title: 'Remote internship success',
      response: 'Excel in remote internship roles:\n\n• Set up a dedicated workspace\n• Maintain regular communication\n• Be proactive about asking questions\n• Meet all deadlines consistently\n• Participate actively in virtual meetings\n• Use collaboration tools effectively\n• Schedule regular check-ins with supervisor',
      followUp: ['Remote work tools', 'Communication tips', 'Time management', 'Back to main menu', 'End conversation']
    },
    {
      id: 'communication-tips',
      title: 'Communication tips',
      response: 'Remote Internship Communication Tips:\n\n• Check messages and emails regularly\n• Respond promptly and professionally\n• Use clear, concise language\n• Ask questions if you\'re unsure\n• Schedule regular check-ins with your supervisor\n• Participate actively in team meetings\n• Use video calls for important discussions\n• Keep records of key communications\n\nStrong communication helps you stay connected and succeed in a remote role!',
      followUp: ['Back to main menu', 'End conversation']
    },
    {
      id: 'common-resume-mistakes',
      title: 'Common resume mistakes',
      response: 'Avoid these common resume mistakes:\n\n• Typos and grammatical errors\n• Using an unprofessional email address\n• Listing irrelevant or outdated experience\n• Making your resume too long (keep it 1-2 pages)\n• Using generic objectives or summaries\n• Failing to quantify achievements (use numbers!)\n• Poor formatting or cluttered layout\n• Omitting key sections (skills, projects, contact info)\n• Not tailoring your resume to each application\n\nReview your resume carefully to make a strong impression!',
      followUp: ['Resume templates', 'Resume sections help', 'Back to main menu', 'End conversation']
    },
    {
      id: 'remote-work-tools',
      title: 'Remote work tools',
      response: 'Essential Tools for Remote Internships:\n\n• Video conferencing: Zoom, Microsoft Teams, Google Meet\n• Messaging: Slack, Microsoft Teams, Discord\n• Project management: Trello, Asana, Jira\n• File sharing: Google Drive, Dropbox, OneDrive\n• Collaboration: Miro, Notion, Google Docs\n• Time tracking: Toggl, Clockify\n• VPN for secure access if required\n\nUsing these tools helps you stay organized, connected, and productive during your remote internship!',
      followUp: ['Back to main menu', 'End conversation']
    },
    {
      id: 'account-settings',
      title: 'Account and profile settings',
      response: 'Manage your I-Intern account:\n\n• Update profile information regularly\n• Upload a professional photo\n• Complete all profile sections\n• Set notification preferences\n• Update your resume and portfolio\n• Review privacy settings\n• Enable two-factor authentication for security',
      followUp: ['Profile optimization', 'Privacy settings', 'Notification preferences', 'Back to main menu', 'End conversation']
    }
    ,
    {
      id: 'notification-preferences',
      title: 'Notification preferences',
      response: 'Manage your notification preferences on I-Intern:\n\n• Choose which alerts you want to receive (application updates, interview invites, messages)\n• Set your preferred contact method (email, SMS, in-app)\n• Adjust frequency: instant, daily, or weekly summaries\n• Turn off non-essential notifications to reduce clutter\n• Update settings in your account dashboard\n• Make sure your contact info is up to date\n\nCustomizing notifications helps you stay informed without being overwhelmed!',
      followUp: ['Account and profile settings', 'Privacy settings', 'Back to main menu', 'End conversation']
    }
    ,
    
    {
      id: 'reset-password',
      title: 'How do I reset my password?',
      response: 'To reset your password, click “Forgot Password?” on the login page. Enter your registered email, and you’ll receive a link to create a new password. If you don’t see the email, check your spam folder or contact support for help.',
      followUp: ['How do I delete my account?', 'Can I change my email?', 'Back to main menu', 'End conversation']
    },
    {
      id: 'delete-account',
      title: 'How do I delete my account?',
      response: 'To delete your I-Intern account, go to your account settings and look for the “Delete Account” option at the bottom. Follow the prompts to confirm. If you need assistance, contact support and we’ll help you close your account securely.',
      followUp: ['How do I reset my password?', 'Can I change my email?', 'Back to main menu', 'End conversation']
    },
    {
      id: 'change-email',
      title: 'Can I change my email?',
      response: 'Yes! Go to your account settings and select “Change Email.” Enter your new email address and confirm it. You’ll receive a verification link at the new address. If you have trouble, contact support for assistance.',
      followUp: ['How do I reset my password?', 'How do I delete my account?', 'Back to main menu', 'End conversation']
    },
    // Bonus Features
    {
      id: 'tip-of-the-day',
      title: 'Tell me a tip of the day.',
      response: 'Tip of the Day: Set clear, achievable goals for your internship. Break big tasks into smaller steps and celebrate your progress. Consistency beats intensity!',
      followUp: ['How can I improve my resume?', 'Give me interview tips.', 'How do I stand out as an intern?', 'Back to main menu', 'End conversation']
    },
    {
      id: 'improve-resume',
      title: 'How can I improve my resume?',
      response: 'To improve your resume: Use action verbs, quantify achievements, tailor your resume to each role, keep formatting clean, and highlight relevant skills and projects. Proofread for errors and ask for feedback from mentors or peers.',
      followUp: ['Give me interview tips.', 'How do I stand out as an intern?', 'Tell me a tip of the day.', 'Back to main menu', 'End conversation']
    },
    {
      id: 'interview-tips',
      title: 'Give me interview tips.',
      response: 'Interview Tips: Research the company, practice common questions, use the STAR method for answers, dress professionally, and show enthusiasm. Prepare thoughtful questions to ask the interviewer and follow up with a thank-you note.',
      followUp: ['How do I stand out as an intern?', 'How can I improve my resume?', 'Tell me a tip of the day.', 'Back to main menu', 'End conversation']
    },
    {
      id: 'stand-out-intern',
      title: 'How do I stand out as an intern?',
      response: 'To stand out as an intern: Be proactive, communicate clearly, show initiative, ask for feedback, and always be willing to learn. Build relationships with your team and look for ways to add value beyond your assigned tasks.',
      followUp: ['Give me interview tips.', 'How can I improve my resume?', 'Tell me a tip of the day.', 'Back to main menu', 'End conversation']
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Idle animation logic
  useEffect(() => {
    if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    idleTimeoutRef.current = setTimeout(() => setAvatarIdle(true), 10000);
    setAvatarIdle(false);
    return () => {
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    };
  }, [messages, isOpen, showTyping]);

  // Eye tracking
  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      let x = 0, y = 0;
      if ('touches' in e && e.touches.length) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
      } else if ('clientX' in e) {
        x = e.clientX;
        y = e.clientY;
      }
      // Normalize to SVG center (assume avatar at bottom right)
      setAvatarEyePos({ x: (x- window.innerWidth + 80)/40, y: (y- window.innerHeight + 80)/40 });
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
    };
  }, []);

  // ...mainOptions and tipsOptions are now imported from separate files

  // ...existing code...

  const initializeChat = () => {
    const welcomeMessage: Message = {
      id: 'welcome',
      type: 'bot',
      content: 'Hi! I\'m I.V.A 👋\n\nI\'m here to help you navigate your internship journey. What would you like to know about?',
      options: mainOptions,
      isWelcome: true
    };
    setMessages([welcomeMessage]);
    setSessionEnded(false);
    setShowFeedback(false);
  };



  const handleOptionClick = (option: string) => {
    // Reset idle
    setAvatarIdle(false);
    // Facial expressions
    if (option === 'Wow') setAvatarExpression('surprised');
    else if (option === 'welcome' || option === 'Internship Recommendations') setAvatarExpression('smile');
    else setAvatarExpression('neutral');




    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: option
    };

    // Show typing indicator before bot replies
    setMessages(prev => [...prev, userMessage]);
    setShowTyping(true);
    setAvatarListening(true);
    setAvatarMouthMove(false);
    setTimeout(() => {
      setShowTyping(false);
      setAvatarListening(false);
      setAvatarMouthMove(true);
      setTimeout(() => setAvatarMouthMove(false), 600);
      // Bot logic after typing indicator
      if (option === '💡 Tips To Outshine' || option === 'Tips To Outshine') {
        const tipsMessage: Message = {
          id: Date.now().toString() + '_tips',
          type: 'bot',
          content: 'Tips To Outshine: Select a tip below to get started.',
          options: tipsOptions
        };
        setMessages(prev => [...prev, tipsMessage]);
        return;
      }
      // Show General Queries submenu if user clicks 'General Queries'
      if (option === '❓ General Queries' || option === 'General Queries') {
        const generalMenuMessage: Message = {
          id: Date.now().toString() + '_generalmenu',
          type: 'bot',
          content: 'Please choose a general query below:',
          options: generalOptions
        };
        setMessages(prev => [...prev, generalMenuMessage]);
        return;
      }
      // Show Intern-Focused subcategories if user clicks 'Intern-Focused Questions'
      if (option === '🧑‍🎓 Intern-Focused Questions' || option === 'Intern-Focused Questions') {
        const internMenuMessage: Message = {
          id: Date.now().toString() + '_internmenu',
          type: 'bot',
          content: 'Please choose a category below:',
          options: internOptions
        };
        setMessages(prev => [...prev, internMenuMessage]);
        return;
      }
      // Show Employer-Focused subcategories if user clicks 'Employer-Focused Questions'
      if (option === '🏢 Employer-Focused Questions' || option === 'Employer-Focused Questions') {
        const employerMenuMessage: Message = {
          id: Date.now().toString() + '_employermenu',
          type: 'bot',
          content: 'Please choose an employer help topic:',
          options: employerOptions
        };
        setMessages(prev => [...prev, employerMenuMessage]);
        return;
      }
      // Show Technical Help submenu if user clicks 'Technical Help'
      if (option === '🛠️ Technical Help' || option === 'Technical Help') {
        const techMenuMessage: Message = {
          id: Date.now().toString() + '_techmenu',
          type: 'bot',
          content: 'Select a technical help topic:',
          options: techOptions
        };
        setMessages(prev => [...prev, techMenuMessage]);
        return;
      }
      // Show Account & Settings submenu if user clicks 'Account & Settings'
      if (option === '⚙️ Account & Settings' || option === 'Account & Settings') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_accsettings',
          type: 'bot',
          content: 'Manage login, profile, and notification preferences.',
          options: accSettingsOptions
        }]);
        return;
      }
      // Show Feedback & Support submenu if user clicks 'Feedback & Support'
      if (option === '💬 Feedback & Support' || option === 'Feedback & Support') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_feedbackmenu',
          type: 'bot',
          content: 'How can we help? Choose a feedback or support topic:',
          options: feedbackOptions
        }]);
        return;
      }
      // Employer Help Q&A
      // Getting Started
      if (option === 'Getting Started') {
        const gettingStartedOptions = [
          'How do I register as an employer?',
          'What documents are required to register?',
          'Is there a verification process for employers?',
          '← Back to Employer-Focused Questions',
          '← Back to main menu',
          'End conversation'
        ];
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_empstart',
          type: 'bot',
          content: 'Getting Started for Employers:',
          options: gettingStartedOptions
        }]);
        return;
      }
      if (option === 'How do I register as an employer?') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_empstart1',
          type: 'bot',
          content: '👉 Click on the ‘Register’ button and choose the Employer option. Fill in your company details, email, and password to get started.',
          options: ['← Back to Getting Started', '← Back to Employer-Focused Questions', '← Back to main menu', 'End conversation']
        }]);
        return;
      }
      if (option === 'What documents are required to register?') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_empstart2',
          type: 'bot',
          content: '👉 You’ll need your company registration certificate, official email ID, and optionally your GSTIN for verification.',
          options: ['← Back to Getting Started', '← Back to Employer-Focused Questions', '← Back to main menu', 'End conversation']
        }]);
        return;
      }
      if (option === 'Is there a verification process for employers?') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_empstart3',
          type: 'bot',
          content: '👉 Yes, we verify each employer to maintain trust and authenticity. Our team may take up to 24 hours to review your registration.',
          options: ['← Back to Getting Started', '← Back to Employer-Focused Questions', '← Back to main menu', 'End conversation']
        }]);
        return;
      }
      // Posting Internships
      if (option === 'Posting Internships') {
        const postOptions = [
          'How do I post an internship?',
          'Can I post multiple internships at once?',
          'Is there a charge for posting internships?',
          '← Back to Employer-Focused Questions',
          '← Back to main menu',
          'End conversation'
        ];
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_emppost',
          type: 'bot',
          content: 'Posting Internships:',
          options: postOptions
        }]);
        return;
      }
      if (option === 'How do I post an internship?') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_emppost1',
          type: 'bot',
          content: '👉 Go to your employer dashboard and click ‘Post Internship’. Fill in the title, duration, stipend (if any), location, and required skills.',
          options: ['← Back to Posting Internships', '← Back to Employer-Focused Questions', '← Back to main menu', 'End conversation']
        }]);
        return;
      }
      if (option === 'Can I post multiple internships at once?') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_emppost2',
          type: 'bot',
          content: '👉 Yes! You can post as many as you want from your dashboard. Each role should be posted separately for clarity.',
          options: ['← Back to Posting Internships', '← Back to Employer-Focused Questions', '← Back to main menu', 'End conversation']
        }]);
        return;
      }
      if (option === 'Is there a charge for posting internships?') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_emppost3',
          type: 'bot',
          content: '👉 Currently, posting internships is free. If you’re on a premium plan, your postings get featured and reach more candidates.',
          options: ['← Back to Posting Internships', '← Back to Employer-Focused Questions', '← Back to main menu', 'End conversation']
        }]);
        return;
      }
      // Managing Applicants
      if (option === 'Managing Applicants') {
        const manageOptions = [
          'Where can I view applications?',
          'How do I contact selected candidates?',
          'Can I shortlist or reject applicants?',
          '← Back to Employer-Focused Questions',
          '← Back to main menu',
          'End conversation'
        ];
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_empmanage',
          type: 'bot',
          content: 'Managing Applicants:',
          options: manageOptions
        }]);
        return;
      }
      if (option === 'Where can I view applications?') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_empmanage1',
          type: 'bot',
          content: '👉 Go to the ‘Manage Internships’ section in your dashboard. Each posting will have a list of applicants with resume previews.',
          options: ['← Back to Managing Applicants', '← Back to Employer-Focused Questions', '← Back to main menu', 'End conversation']
        }]);
        return;
      }
      if (option === 'How do I contact selected candidates?') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_empmanage2',
          type: 'bot',
          content: '👉 Click ‘View Profile’ on the candidate, then use the provided email or in-platform messaging tool to reach out.',
          options: ['← Back to Managing Applicants', '← Back to Employer-Focused Questions', '← Back to main menu', 'End conversation']
        }]);
        return;
      }
      if (option === 'Can I shortlist or reject applicants?') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_empmanage3',
          type: 'bot',
          content: '👉 Yes, you can. Use the ‘Shortlist’ or ‘Reject’ buttons under each applicant’s card. Shortlisted candidates will be notified automatically.',
          options: ['← Back to Managing Applicants', '← Back to Employer-Focused Questions', '← Back to main menu', 'End conversation']
        }]);
        return;
      }
      // Technical Support
      if (option === 'Technical Support') {
        const techSuppOptions = [
          'I can’t upload a job description.',
          'The dashboard is not loading properly.',
          '← Back to Employer-Focused Questions',
          '← Back to main menu',
          'End conversation'
        ];
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_emptech',
          type: 'bot',
          content: 'Employer Technical Support:',
          options: techSuppOptions
        }]);
        return;
      }
      if (option === 'I can’t upload a job description.') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_emptech1',
          type: 'bot',
          content: '👉 Make sure your file is under 5MB and in PDF or DOCX format. You can also paste the text directly into the description box.',
          options: ['← Back to Technical Support', '← Back to Employer-Focused Questions', '← Back to main menu', 'End conversation']
        }]);
        return;
      }
      if (option === 'The dashboard is not loading properly.') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_emptech2',
          type: 'bot',
          content: '👉 Please refresh the page or try using a different browser. If the issue continues, our tech support team can assist you.',
          options: ['← Back to Technical Support', '← Back to Employer-Focused Questions', '← Back to main menu', 'End conversation']
        }]);
        return;
      }
      // Account & Subscription
      if (option === 'Account & Subscription') {
        const accOptions = [
          'Can I edit my company profile?',
          'Do you offer premium services for employers?',
          'How do I deactivate or delete my employer account?',
          '← Back to Employer-Focused Questions',
          '← Back to main menu',
          'End conversation'
        ];
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_empacc',
          type: 'bot',
          content: 'Employer Account & Subscription:',
          options: accOptions
        }]);
        return;
      }
      if (option === 'Can I edit my company profile?') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_empacc1',
          type: 'bot',
          content: '👉 Yes! Go to the ‘My Profile’ tab in your dashboard to update company details, logo, and contact information.',
          options: ['← Back to Account & Subscription', '← Back to Employer-Focused Questions', '← Back to main menu', 'End conversation']
        }]);
        return;
      }
      if (option === 'Do you offer premium services for employers?') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_empacc2',
          type: 'bot',
          content: '👉 Yes, our premium plans offer priority listing, direct messaging to top candidates, and analytics. Contact us to upgrade.',
          options: ['← Back to Account & Subscription', '← Back to Employer-Focused Questions', '← Back to main menu', 'End conversation']
        }]);
        return;
      }
      if (option === 'How do I deactivate or delete my employer account?') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_empacc3',
          type: 'bot',
          content: '👉 Please reach out via the support form or email us. We’ll help you securely deactivate your account.',
          options: ['← Back to Account & Subscription', '← Back to Employer-Focused Questions', '← Back to main menu', 'End conversation']
        }]);
        return;
      }
      // Show Account & Settings submenu if user clicks 'Account & Settings'
      if (option === 'Account & Settings') {
        const accSettingsOptions = [
          'Reset Password',
          'Update Email or Phone',
          'Delete/Deactivate Account',
          'Change Profile Details',
          'Notification Preferences',
          '← Back to main menu',
          'End conversation'
        ];
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_accsettings',
          type: 'bot',
          content: 'Manage login, profile, and notification preferences.',
          options: accSettingsOptions
        }]);
        return;
      }
      // Account & Settings Q&A
      // Reset Password
      if (option === 'Reset Password') {
        const resetPwOptions = [
          'How do I reset my password?',
          'I didn’t receive the password reset email. What should I do?',
          'Can I reset my password while logged in?',
          '← Back to Account & Settings',
          '← Back to main menu',
          'End conversation'
        ];
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_resetpw',
          type: 'bot',
          content: 'Reset Password FAQs:',
          options: resetPwOptions
        }]);
        return;
      }
      if (option === 'How do I reset my password?') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_resetpw1',
          type: 'bot',
          content: 'Go to the Login page → Click on ‘Forgot Password?’ → Enter your registered email → Follow the link sent to reset your password.',
          options: ['← Back to Reset Password', '← Back to Account & Settings', '← Back to main menu', 'End conversation']
        }]);
        return;
      }
      if (option === 'I didn’t receive the password reset email. What should I do?') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_resetpw2',
          type: 'bot',
          content: 'Please check your spam/junk folder. If it’s still missing, try resending or contact support.',
          options: ['← Back to Reset Password', '← Back to Account & Settings', '← Back to main menu', 'End conversation']
        }]);
        return;
      }
      if (option === 'Can I reset my password while logged in?') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_resetpw3',
          type: 'bot',
          content: 'Yes! Go to ‘Settings’ → ‘Security’ → Click ‘Change Password’.',
          options: ['← Back to Reset Password', '← Back to Account & Settings', '← Back to main menu', 'End conversation']
        }]);
        return;
      }
      // Update Email or Phone
      if (option === 'Update Email or Phone') {
        const updateOptions = [
          'Can I change my registered email?',
          'Will changing my email affect my login?',
          'How do I update my phone number?',
          '← Back to Account & Settings',
          '← Back to main menu',
          'End conversation'
        ];
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_update',
          type: 'bot',
          content: 'Update Email or Phone FAQs:',
          options: updateOptions
        }]);
        return;
      }
      if (option === 'Can I change my registered email?') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_update1',
          type: 'bot',
          content: 'Yes. Go to ‘Settings’ → ‘Account Info’ → Click ‘Edit Email’ → Enter new email → Verify it.',
          options: ['← Back to Update Email or Phone', '← Back to Account & Settings', '← Back to main menu', 'End conversation']
        }]);
        return;
      }
      if (option === 'Will changing my email affect my login?') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_update2',
          type: 'bot',
          content: 'Yes, you will need to use the new email for future logins.',
          options: ['← Back to Update Email or Phone', '← Back to Account & Settings', '← Back to main menu', 'End conversation']
        }]);
        return;
      }
      if (option === 'How do I update my phone number?') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_update3',
          type: 'bot',
          content: 'Go to ‘Settings’ → ‘Contact Info’ → Click ‘Edit Phone’.',
          options: ['← Back to Update Email or Phone', '← Back to Account & Settings', '← Back to main menu', 'End conversation']
        }]);
        return;
      }
      // Delete/Deactivate Account
      if (option === 'Delete/Deactivate Account') {
        const delOptions = [
          'How can I delete my account permanently?',
          'What’s the difference between deactivating and deleting my account?',
          'Can I recover my account after deleting it?',
          '← Back to Account & Settings',
          '← Back to main menu',
          'End conversation'
        ];
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_delacc',
          type: 'bot',
          content: 'Delete/Deactivate Account FAQs:',
          options: delOptions
        }]);
        return;
      }
      if (option === 'How can I delete my account permanently?') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_delacc1',
          type: 'bot',
          content: 'Navigate to ‘Settings’ → ‘Privacy & Security’ → Click ‘Delete My Account’ → Confirm with OTP/email verification.',
          options: ['← Back to Delete/Deactivate Account', '← Back to Account & Settings', '← Back to main menu', 'End conversation']
        }]);
        return;
      }
      if (option === 'What’s the difference between deactivating and deleting my account?') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_delacc2',
          type: 'bot',
          content: 'Deactivating hides your profile and you can return anytime. Deleting removes all data permanently.',
          options: ['← Back to Delete/Deactivate Account', '← Back to Account & Settings', '← Back to main menu', 'End conversation']
        }]);
        return;
      }
      if (option === 'Can I recover my account after deleting it?') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_delacc3',
          type: 'bot',
          content: 'No. Once deleted, your data is permanently erased.',
          options: ['← Back to Delete/Deactivate Account', '← Back to Account & Settings', '← Back to main menu', 'End conversation']
        }]);
        return;
      }
      // Change Profile Details
      if (option === 'Change Profile Details') {
        const profOptions = [
          'Can I update my name, company, or institution?',
          'Can I update my designation or department?',
          'My profile shows the wrong role. How do I fix it?',
          '← Back to Account & Settings',
          '← Back to main menu',
          'End conversation'
        ];
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_prof',
          type: 'bot',
          content: 'Change Profile Details FAQs:',
          options: profOptions
        }]);
        return;
      }
      if (option === 'Can I update my name, company, or institution?') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_prof1',
          type: 'bot',
          content: 'Yes. Go to ‘Settings’ → ‘Profile’ → Click ‘Edit Profile’.',
          options: ['← Back to Change Profile Details', '← Back to Account & Settings', '← Back to main menu', 'End conversation']
        }]);
        return;
      }
      if (option === 'Can I update my designation or department?') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_prof2',
          type: 'bot',
          content: 'Absolutely. In ‘Edit Profile’, you can change your job title, department, or other details.',
          options: ['← Back to Change Profile Details', '← Back to Account & Settings', '← Back to main menu', 'End conversation']
        }]);
        return;
      }
      if (option === 'My profile shows the wrong role. How do I fix it?') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_prof3',
          type: 'bot',
          content: 'Please contact support to update your role or switch account type (Intern ↔ Employer).',
          options: ['← Back to Change Profile Details', '← Back to Account & Settings', '← Back to main menu', 'End conversation']
        }]);
        return;
      }
      // Notification Preferences
      if (option === 'Notification Preferences') {
        const notifOptions = [
          'How can I turn off email notifications?',
          'Can I get app notifications instead of emails?',
          'I’m not receiving internship alerts. What should I do?',
          '← Back to Account & Settings',
          '← Back to main menu',
          'End conversation'
        ];
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_notif',
          type: 'bot',
          content: 'Notification Preferences FAQs:',
          options: notifOptions
        }]);
        return;
      }
      if (option === 'How can I turn off email notifications?') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_notif1',
          type: 'bot',
          content: 'Go to ‘Settings’ → ‘Notifications’ → Toggle off ‘Email Alerts’.',
          options: ['← Back to Notification Preferences', '← Back to Account & Settings', '← Back to main menu', 'End conversation']
        }]);
        return;
      }
      if (option === 'Can I get app notifications instead of emails?') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_notif2',
          type: 'bot',
          content: 'If you’re using our app, enable push notifications in your device settings and in our app\'s notification panel.',
          options: ['← Back to Notification Preferences', '← Back to Account & Settings', '← Back to main menu', 'End conversation']
        }]);
        return;
      }
      if (option === 'I’m not receiving internship alerts. What should I do?') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_notif3',
          type: 'bot',
          content: 'Ensure your preferences are set to ‘Internship Updates’ under ‘Notifications’. Also, check your spam folder or app settings.',
          options: ['← Back to Notification Preferences', '← Back to Account & Settings', '← Back to main menu', 'End conversation']
        }]);
        return;
      }
      // Show Technical Help submenu if user clicks 'Technical Help'
      if (option === 'Technical Help') {
        const techOptions = [
          'Login & Authentication Issues',
          'Resume Builder Issues',
          'AI Skill Test Issues',
          'Website/App Issues',
          'Other Common Issues',
          '← Back to main menu',
          'End conversation'
        ];
        const techMenuMessage: Message = {
          id: Date.now().toString() + '_techmenu',
          type: 'bot',
          content: 'Select a technical help topic:',
          options: techOptions
        };
        setMessages(prev => [...prev, techMenuMessage]);
        return;
      }
      // Show Feedback & Support submenu if user clicks 'Feedback & Support'
      if (option === 'Feedback & Support') {
        const feedbackOptions = [
          'Report a Problem',
          'Suggest a Feature or Improvement',
          'Contact Support Team',
          'Raise a Complaint',
          'Feedback on Experience',
          '← Back to main menu',
          'End conversation'
        ];
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_feedbackmenu',
          type: 'bot',
          content: 'How can we help? Choose a feedback or support topic:',
          options: feedbackOptions
        }]);
        return;
      }
      // Feedback & Support Q&A
      // Report a Problem
      if (option === 'Report a Problem') {
        const reportOptions = [
          'How do I report a bug or error on the platform?',
          'What should I do if something isn’t working?',
          'Can I attach screenshots or files when reporting a problem?',
          '← Back to Feedback & Support',
          '← Back to main menu',
          'End conversation'
        ];
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_report',
          type: 'bot',
          content: 'Report a Problem FAQs:',
          options: reportOptions
        }]);
        return;
      }
      if (option === 'How do I report a bug or error on the platform?') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_report1',
          type: 'bot',
          content: 'Go to Help Center → Select ‘Report an Issue’ → Describe the problem → Submit.',
          options: ['← Back to Report a Problem', '← Back to Feedback & Support', '← Back to main menu', 'End conversation']
        }]);
        return;
      }
      if (option === 'What should I do if something isn’t working?') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_report2',
          type: 'bot',
          content: 'First, try refreshing or logging out and back in. If it persists, report the issue under ‘Report a Problem’.',
          options: ['← Back to Report a Problem', '← Back to Feedback & Support', '← Back to main menu', 'End conversation']
        }]);
        return;
      }
      if (option === 'Can I attach screenshots or files when reporting a problem?') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_report3',
          type: 'bot',
          content: 'Yes. You can upload files or screenshots along with your report to help us diagnose the issue better.',
          options: ['← Back to Report a Problem', '← Back to Feedback & Support', '← Back to main menu', 'End conversation']
        }]);
        return;
      }
      // Suggest a Feature or Improvement
      if (option === 'Suggest a Feature or Improvement') {
        const suggestOptions = [
          'How can I suggest a new feature?',
          'Will my suggestion be considered?',
          'Can I track the status of my suggestion?',
          '← Back to Feedback & Support',
          '← Back to main menu',
          'End conversation'
        ];
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_suggest',
          type: 'bot',
          content: 'Suggest a Feature or Improvement FAQs:',
          options: suggestOptions
        }]);
        return;
      }
      if (option === 'How can I suggest a new feature?') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_suggest1',
          type: 'bot',
          content: 'Navigate to Feedback Portal or Settings → Feedback → Select ‘Suggest a Feature’ → Submit your idea.',
          options: ['← Back to Suggest a Feature or Improvement', '← Back to Feedback & Support', '← Back to main menu', 'End conversation']
        }]);
        return;
      }
      if (option === 'Will my suggestion be considered?') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_suggest2',
          type: 'bot',
          content: 'We review all suggestions regularly and prioritize them based on feasibility and user demand.',
          options: ['← Back to Suggest a Feature or Improvement', '← Back to Feedback & Support', '← Back to main menu', 'End conversation']
        }]);
        return;
      }
      if (option === 'Can I track the status of my suggestion?') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_suggest3',
          type: 'bot',
          content: 'Yes. You’ll receive an email if your idea is shortlisted or approved for implementation.',
          options: ['← Back to Suggest a Feature or Improvement', '← Back to Feedback & Support', '← Back to main menu', 'End conversation']
        }]);
        return;
      }
      // Contact Support Team
      if (option === 'Contact Support Team') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_contact',
          type: 'bot',
          content: 'Contact Support Team FAQs:',
          options: contactOptions
        }]);
        return;
      }
      const contactMatch = contactQA.find(q => q.question === option);
      if (contactMatch) {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_contactqa',
          type: 'bot',
          content: contactMatch.answer,
          options: contactMatch.options
        }]);
        return;
      }
      // Raise a Complaint
      if (option === 'Raise a Complaint') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_complaint',
          type: 'bot',
          content: 'Raise a Complaint FAQs:',
          options: complaintOptions
        }]);
        return;
      }
      const complaintMatch = complaintQA.find(q => q.question === option);
      if (complaintMatch) {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_complaintqa',
          type: 'bot',
          content: complaintMatch.answer,
          options: complaintMatch.options
        }]);
        return;
      }
      // Feedback on Experience
      if (option === 'Feedback on Experience') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_exp',
          type: 'bot',
          content: 'Feedback on Experience FAQs:',
          options: expOptions
        }]);
        return;
      }
      const expMatch = expQA.find(q => q.question === option);
      if (expMatch) {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_expqa',
          type: 'bot',
          content: expMatch.answer,
          options: expMatch.options
        }]);
        return;
      }
      // ...existing code...
      if (option === '← Back to main menu') {
        const mainMenuMessage: Message = {
          id: Date.now().toString() + '_mainmenu',
          type: 'bot',
          content: 'What would you like to know about?',
          options: mainOptions
        };
        setMessages(prev => [...prev, mainMenuMessage]);
        return;
      }
      if (option === 'End conversation') {
        const endMessage: Message = {
          id: Date.now().toString() + '_end',
          type: 'bot',
          content: 'Thank you for using I.V.A! I hope I was helpful. 😊'
        };
        setMessages(prev => [...prev, endMessage]);
        setSessionEnded(true);
        setShowFeedback(true);
        return;
      }
      if (option === 'Talk to Human') {
        const humanMessage: Message = {
          id: Date.now().toString() + '_human',
          type: 'bot',
          content: 'I\'ll connect you with our support team! You can reach us at:\n\n📧 support@i-intern.com\n📞 1-800-INTERN-1\n\nOr click below to send an email directly.',
          options: ['Send Email', 'Back to main menu']
        };
        setMessages(prev => [...prev, humanMessage]);
        return;
      }
      if (option === 'Send Email') {
        window.location.href = 'mailto:support@i-intern.com?subject=I-Intern Support Request';
        return;
      }
      // Find matching intent or handle technical help topics
      const intent = chatIntents.find(i => i.title === option);
      if (intent) {
        const botResponse: Message = {
          id: Date.now().toString() + '_bot',
          type: 'bot',
          content: intent.response,
          options: intent.followUp || [...mainOptions, 'End conversation']
        };
        setMessages(prev => [...prev, botResponse]);
        return;
      }
      // Technical Help Q&A
      // Login & Authentication Issues
      if (option === 'Login & Authentication Issues') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_login',
          type: 'bot',
          content: 'Login & Authentication Issues:',
          options: loginOptions
        }]);
        return;
      }
      if (option === 'I can’t log in.') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_login1',
          type: 'bot',
          content: '👉 Make sure your email and password are correct. If you forgot your password, click on ‘Forgot Password’ to reset it.',
          options: ['← Back to Login & Authentication Issues', '← Back to Technical Help', '← Back to main menu', 'End conversation']
        }]);
        return;
      }
      if (option === 'I forgot my password.') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_login2',
          type: 'bot',
          content: '👉 No worries! Just click the ‘Forgot Password’ link on the login page. You’ll receive a reset link in your registered email.',
          options: ['← Back to Login & Authentication Issues', '← Back to Technical Help', '← Back to main menu', 'End conversation']
        }]);
        return;
      }
      if (option === 'My verification email didn’t arrive.') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_login3',
          type: 'bot',
          content: '👉 Please check your spam folder. If you still don’t see it, type ‘Resend verification’ and I’ll trigger it again.',
          options: ['← Back to Login & Authentication Issues', '← Back to Technical Help', '← Back to main menu', 'End conversation']
        }]);
        return;
      }
      // Resume Builder Issues
      if (option === 'Resume Builder Issues') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_resume',
          type: 'bot',
          content: 'Resume Builder Issues:',
          options: resumeOptions
        }]);
        return;
      }
      if (option === 'My resume PDF is not downloading.') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_resume1',
          type: 'bot',
          content: '👉 Ensure all required fields are filled. If it still fails, try refreshing the page or clear your browser cache. You can also re-download from your dashboard.',
          options: ['← Back to Resume Builder Issues', '← Back to Technical Help', '← Back to main menu', 'End conversation']
        }]);
        return;
      }
      if (option === 'The form is not submitting.') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_resume2',
          type: 'bot',
          content: '👉 Double-check if any required field is left empty. Also make sure no special characters are used in the name or project sections.',
          options: ['← Back to Resume Builder Issues', '← Back to Technical Help', '← Back to main menu', 'End conversation']
        }]);
        return;
      }
      // AI Skill Test Issues
      if (option === 'AI Skill Test Issues') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_ai',
          type: 'bot',
          content: 'AI Skill Test Issues:',
          options: aiOptions
        }]);
        return;
      }
      if (option === 'The AI skill test is not loading.') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_ai1',
          type: 'bot',
          content: '👉 Try refreshing the page or switching to Chrome/Edge. If you’re on mobile, we recommend using a laptop for best performance.',
          options: ['← Back to AI Skill Test Issues', '← Back to Technical Help', '← Back to main menu', 'End conversation']
        }]);
        return;
      }
      if (option === 'My test crashed midway.') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_ai2',
          type: 'bot',
          content: '👉 Sorry about that! Please reload the test. Your answers are auto-saved every 30 seconds. If the issue persists, I can alert the tech team for you.',
          options: ['← Back to AI Skill Test Issues', '← Back to Technical Help', '← Back to main menu', 'End conversation']
        }]);
        return;
      }
      if (option === 'The code editor in the test isn\'t working.') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_ai3',
          type: 'bot',
          content: '👉 Make sure your browser is up to date. For the best experience, use a desktop or laptop. If it still doesn’t work, describe the issue here and I’ll notify support.',
          options: ['← Back to AI Skill Test Issues', '← Back to Technical Help', '← Back to main menu', 'End conversation']
        }]);
        return;
      }
      // Website/App Issues
      if (option === 'Website/App Issues') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_web',
          type: 'bot',
          content: 'Website/App Issues:',
          options: webOptions
        }]);
        return;
      }
      if (option === 'The website isn’t loading.') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_web1',
          type: 'bot',
          content: '👉 Please check your internet connection first. Then try clearing your cache or using a different browser. Still stuck? I can notify our dev team.',
          options: ['← Back to Website/App Issues', '← Back to Technical Help', '← Back to main menu', 'End conversation']
        }]);
        return;
      }
      if (option === 'The dashboard is blank.') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_web2',
          type: 'bot',
          content: '👉 Sometimes this happens due to a temporary glitch. Try refreshing. If that doesn\'t help, please log out and back in again.',
          options: ['← Back to Website/App Issues', '← Back to Technical Help', '← Back to main menu', 'End conversation']
        }]);
        return;
      }
      // Other Common Issues
      if (option === 'Other Common Issues') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_other',
          type: 'bot',
          content: 'Other Common Issues:',
          options: otherOptions
        }]);
        return;
      }
      if (option === 'Images or icons are not showing.') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_other1',
          type: 'bot',
          content: '👉 That could be due to a browser extension or slow connection. Try disabling ad blockers or refreshing the page.',
          options: ['← Back to Other Common Issues', '← Back to Technical Help', '← Back to main menu', 'End conversation']
        }]);
        return;
      }
      if (option === 'Chatbot is not responding.') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_other2',
          type: 'bot',
          content: '👉 Oops! That shouldn’t happen. Please wait a few seconds and type again. If still unresponsive, you can reload the page.',
          options: ['← Back to Other Common Issues', '← Back to Technical Help', '← Back to main menu', 'End conversation']
        }]);
        return;
      }
      if (option === 'I’m getting a 404 or 500 error.') {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '_other3',
          type: 'bot',
          content: '👉 Yikes, a server hiccup! Try again after a minute or two. If it continues, I’ll escalate this to our dev team right away.',
          options: ['← Back to Other Common Issues', '← Back to Technical Help', '← Back to main menu', 'End conversation']
        }]);
        return;
      }
      // Fallback response for context
      // ...option arrays are now imported from separate files
      const lastUserMsg = messages.filter(m => m.type === 'user').slice(-1)[0]?.content;
      const isInternContext = lastUserMsg === 'Intern-Focused Questions' || internOptions.includes(lastUserMsg || '');
      const isGeneralContext = lastUserMsg === 'General Queries' || generalOptions.includes(lastUserMsg || '');
      const isTechContext = lastUserMsg === 'Technical Help' || techOptions.includes(lastUserMsg || '');
      const fallbackMessage: Message = {
        id: Date.now().toString() + '_fallback',
        type: 'bot',
        content: 'I didn\'t get that. Please choose from the options below.',
        options: isTechContext ? techOptions : isGeneralContext ? generalOptions : isInternContext ? internOptions : [...mainOptions, 'End conversation']
      };
      setMessages(prev => [...prev, fallbackMessage]);
    }, 400);
  };

  const handleFeedback = (positive: boolean) => {
    setFeedback({ positive, comment: '' });
    if (positive) {
      const feedbackMessage: Message = {
        id: Date.now().toString() + '_feedback',
        type: 'bot',
        content: 'Thank you for the positive feedback! 🎉 Feel free to start a new conversation anytime.'
      };
      setMessages(prev => [...prev, feedbackMessage]);
      setShowFeedback(false);
    } else {
      setShowCommentBox(true);
    }
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeedback(fb => ({ ...fb, comment: e.target.value }));
  };

  const handleCommentSubmit = () => {
    // Here you could send feedback to a server or log it
    const feedbackMessage: Message = {
      id: Date.now().toString() + '_feedback',
      type: 'bot',
      content: feedback.comment.trim()
        ? 'Thank you for your feedback! We appreciate your input and will work on improving.'
        : 'Thank you for your feedback! We will work on improving.'
    };
    setMessages(prev => [...prev, feedbackMessage]);
    setShowFeedback(false);
    setShowCommentBox(false);
    setFeedback({ positive: null, comment: '' });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) {
      initializeChat();
    }
  };

  const resetChat = () => {
    setMessages([]);
    setShowFeedback(false);
    setSessionEnded(false);
    initializeChat();
  };

  return (
    <>
      {/* Chat Bubble */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleChat}
          className={`chat-bubble-btn ${!isOpen ? 'btn-glow-pulse' : ''}`}
        >
          {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`chat-window fixed z-40 flex flex-col chat-slide-in ${sessionEnded ? 'confetti-burst' : ''} ${isFullscreen ? 'fullscreen' : ''}`}
        >
          {/* Header with animated avatar */}
          <div className="chat-header bg-primary text-white p-4 rounded-t-lg flex flex-col gap-2 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <IvyAvatar
                  expression={avatarExpression}
                  listening={avatarListening}
                  mouthMove={avatarMouthMove}
                  eyePos={avatarEyePos}
                  idle={avatarIdle}
                />
                <div>
                  <h3 className="font-semibold text-lg chat-title">
                    I.V.A – Internship Virtual Assistant
                  </h3>
                  <p className="text-xs opacity-90 chat-desc">
                    Your guide to internships, applications, and more
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleFullscreenToggle} className="hover:bg-teal-500 p-1 rounded" title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}>
                  {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>
                <button onClick={resetChat} className="hover:bg-teal-500 p-1 rounded" title="Refresh">
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Tip of the Day Banner */}
          <div className="tip-banner bg-glass">
            <span role="img" aria-label="lightbulb" style={{fontSize: '1.3em'}}>💡</span>
            <span>{tipOfTheDay}</span>
          </div>

          {/* Messages */}
          <div className="chat-messages flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} onOptionClick={handleOptionClick} />
            ))}
            {showTyping && (
              <div className="flex justify-start">
                <div className="rounded-2xl px-5 py-3 bg-gradient-to-br from-[#fff] to-[#e0e7ff] text-gray-900 max-w-[80%] shadow-lg border border-[#b3edeb]">
                  <TypingIndicator />
                </div>
              </div>
            )}
            {showFeedback && !showCommentBox && (
              <div className="feedback-bar flex justify-center space-x-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2 feedback-label">
                    Was this chat helpful?
                  </p>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleFeedback(true)}
                      className="feedback-btn positive"
                    >
                      <ThumbsUp size={18} />
                    </button>
                    <button
                      onClick={() => handleFeedback(false)}
                      className="feedback-btn negative"
                    >
                      <ThumbsDown size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )}
            {showCommentBox && (
              <div className="feedback-comment flex flex-col items-center pt-4 border-t">
                <p className="text-sm text-gray-600 mb-2 feedback-label">
                  Please tell us what issues you faced:
                </p>
                <textarea
                  value={feedback.comment}
                  onChange={handleCommentChange}
                  rows={3}
                  className="feedback-textarea w-full max-w-md p-2 border rounded mb-2 text-sm"
                  placeholder="Describe your issue..."
                />
                <button
                  onClick={handleCommentSubmit}
                  className="feedback-submit bg-primary text-white px-4 py-1 rounded hover:bg-teal-700 transition-colors text-sm"
                >
                  Submit Feedback
                </button>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}
    </>
  );
};


export default ChatWidget;
