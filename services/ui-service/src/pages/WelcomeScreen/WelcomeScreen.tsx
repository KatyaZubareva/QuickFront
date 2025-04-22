import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SmartCheckIcon from "./SmartCheckIcon";

// Временная замена Helmet для управления тегами head
const Head = ({ title, description }: { title?: string; description?: string }) => {
  useEffect(() => {
    if (title) {
      document.title = title;
    }
    
    const metaDescription = document.querySelector("meta[name=\"description\"]");
    if (description && metaDescription) {
      metaDescription.setAttribute("content", description);
    }
  }, [title, description]);

  return null;
};

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const techTextRef = useRef<HTMLSpanElement>(null);
  const templateTextRef = useRef<HTMLSpanElement>(null);
  const settingsTextRef = useRef<HTMLSpanElement>(null);
  const fastStartTextRef = useRef<HTMLSpanElement>(null);

  // Конфигурационные переменные
  const FEATURES_LINK = import.meta.env.VITE_FEATURES_LINK || "#";
  const TEMPLATES_LINK = import.meta.env.VITE_TEMPLATES_LINK || "#";
  const DOCS_LINK = import.meta.env.VITE_DOCS_LINK || "#";
  const PRICING_LINK = import.meta.env.VITE_PRICING_LINK || "#";

  useEffect(() => {
    if (import.meta.env.VITE_NODE_ENV === "production") {
      // Инициализация аналитики
      console.log("Initializing analytics for quickfront.ru");
    }
  }, []);

  const handleNext = () => navigate("/setup");

  const handleLogin = () => {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${
      import.meta.env.VITE_GITHUB_CLIENT_ID
    }&redirect_uri=${
      import.meta.env.VITE_GITHUB_REDIRECT_URI || "https://quickfront.ru/github-callback"
    }`;
  };

  const LogoIcon = () => (
    <svg viewBox="0 0 185 173" fill="none" className="w-8 h-8">
      <path 
        d="M184.662 18.7476C184.662 9.13586 175.749 2.0043 166.372 4.113L73.2633 25.05C66.4179 26.5893 61.5541 32.6682 61.5541 39.6845V96.4286C61.5541 103.609 66.643 109.783 73.6916 111.153L166.8 129.254C176.059 131.054 184.662 123.962 184.662 114.529V18.7476Z" 
        fill="url(#paint0_linear)"
      />
      <defs>
        <linearGradient id="paint0_linear" x1="71.1719" y1="-7.69427" x2="152.443" y2="132.726" gradientUnits="userSpaceOnUse">
          <stop stopColor="#D137E2"/>
          <stop offset="1" stopColor="#7E18BD"/>
        </linearGradient>
      </defs>
    </svg>
  );

  const AuthButtons = () => (
    <div className="flex items-center space-x-4">
      <motion.button
        onClick={handleLogin}
        className="px-4 py-2 text-sm font-medium text-purple-300 hover:text-white transition-colors duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Вход
      </motion.button>
      <motion.button
        onClick={handleNext}
        className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-md shadow-sm"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Регистрация
      </motion.button>
    </div>
  );

  const OptimizedBackgroundCircle = ({ index }: { index: number }) => {
    const positions = [
      "top-1/4 left-1/4 w-64 h-64",
      "bottom-1/3 right-1/3 w-80 h-80",
      "top-1/3 right-1/4 w-48 h-48"
    ];
    
    const gradients = [
      "from-purple-500 to-purple-700",
      "from-purple-600 to-indigo-700",
      "from-purple-400 to-indigo-600"
    ];

    return (
      <motion.div 
        className={`absolute ${positions[index]} rounded-full bg-gradient-to-br ${gradients[index]} opacity-15 blur-2xl`}
        animate={{
          scale: [1, index === 1 ? 1.2 : 1.1, 1],
          opacity: [0.1, 0.15, 0.1]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 2
        }}
      />
    );
  };

  const AnimatedLogo = () => (
    <motion.div
      className="mb-8 w-40 h-40 relative"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring",
        stiffness: 100,
        damping: 10,
        delay: 0.2
      }}
    >
      <svg viewBox="0 0 185 173" fill="none" className="w-full h-full">
        <path 
          d="M184.662 18.7476C184.662 9.13586 175.749 2.0043 166.372 4.113L73.2633 25.05C66.4179 26.5893 61.5541 32.6682 61.5541 39.6845V96.4286C61.5541 103.609 66.643 109.783 73.6916 111.153L166.8 129.254C176.059 131.054 184.662 123.962 184.662 114.529V18.7476Z" 
          fill="url(#paint0_linear)"
        />
        <path 
          d="M18.1811 44.0339L111.289 64.9709C117.907 66.4589 122.608 72.3352 122.608 79.1176V135.862C122.608 142.803 117.689 148.771 110.875 150.095L17.767 168.196C8.81629 169.936 0.5 163.081 0.5 153.962V58.1807C0.5 48.8894 9.11617 41.9955 18.1811 44.0339Z" 
          fill="#AFA8BF" 
          fillOpacity="0.2" 
          stroke="url(#paint1_linear)"
        />
        <defs>
          <linearGradient id="paint0_linear" x1="71.1719" y1="-7.69427" x2="152.443" y2="132.726" gradientUnits="userSpaceOnUse">
            <stop stopColor="#D137E2"/>
            <stop offset="1" stopColor="#7E18BD"/>
          </linearGradient>
          <linearGradient id="paint1_linear" x1="79.828" y1="26.9299" x2="61.5541" y2="124.07" gradientUnits="userSpaceOnUse">
            <stop stopColor="#AFA8BF"/>
            <stop offset="1" stopColor="#524E59"/>
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );

  const CTAButton = () => (
    <motion.button 
      className="px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:brightness-110 flex items-center gap-2 group"
      onClick={handleNext}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.8, duration: 0.6, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      Начать
      <motion.svg 
        width="20" height="20" viewBox="0 0 24 24" fill="none" className="mt-0.5"
        initial={{ x: 0 }} animate={{ x: [0, 4, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
      >
        <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </motion.svg>
    </motion.button>
  );

  const FeaturesList = () => (
    <motion.div 
      className="mt-8 text-gray-400 text-sm max-w-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.7 }}
      transition={{ delay: 1.2 }}
    >
      <div className="grid grid-cols-2 gap-4 text-left">
        <div className="flex items-start gap-2">
          <SmartCheckIcon textRef={templateTextRef} />
          <span ref={templateTextRef}>Готовые шаблоны проектов</span>
        </div>
        <div className="flex items-start gap-2">
          <SmartCheckIcon textRef={settingsTextRef} />
          <span ref={settingsTextRef}>Оптимальные настройки</span>
        </div>
        <div className="flex items-start gap-2">
          <SmartCheckIcon textRef={techTextRef} />
          <span ref={techTextRef}>Поддержка современных технологий</span>
        </div>
        <div className="flex items-start gap-2">
          <SmartCheckIcon textRef={fastStartTextRef} />
          <span ref={fastStartTextRef}>Быстрый старт за минуты</span>
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-800">
        <p className="text-xs text-gray-500"> 
          Project Prototyper помогает разработчикам быстро развертывать проекты 
          с предустановленными лучшими практиками и конфигурациями
        </p>
      </div>
    </motion.div>
  );

  return (
    <div className="relative flex flex-col items-center justify-center w-screen min-h-screen p-6 bg-gray-900 overflow-hidden">
      <Head 
        title="QuickFront - Быстрый старт фронтенд-проектов" 
        description="Инструмент для быстрого старта фронтенд-проектов с готовой архитектурой и настройками" 
      />

      <motion.header 
        className="absolute bg-gray-800/80 top-5 left-10 right-10 rounded-xl z-50 flex items-center justify-between px-6 py-4 border border-white/20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-2">
          <LogoIcon />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-indigo-300">
            QuickFront
          </span>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <a href={FEATURES_LINK} className="text-white hover:text-purple-400 transition-colors duration-300">Функции</a>
          <a href={TEMPLATES_LINK} className="text-white hover:text-purple-400 transition-colors duration-300">Шаблоны</a>
          <a href={DOCS_LINK} className="text-white hover:text-purple-400 transition-colors duration-300">Документы</a>
          <a href={PRICING_LINK} className="text-white hover:text-purple-400 transition-colors duration-300">Тарифы</a>
        </nav>

        <AuthButtons />
      </motion.header>

      {[...Array(3)].map((_, i) => (
        <OptimizedBackgroundCircle key={i} index={i} />
      ))}

      <motion.div 
        className="relative z-10 flex flex-col items-center text-center max-w-2xl mt-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <AnimatedLogo />
        
        <motion.h1 
          className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-indigo-300"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          QuickFront
        </motion.h1>
        
        <motion.p 
          className="text-md md:text-xl mb-8 text-gray-300"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Инструмент для быстрого старта фронтенд-проектов <br/> 
          с готовой архитектурой и настройками
        </motion.p>
        
        <CTAButton />
        <FeaturesList />
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;