import { useEffect, useState, useRef } from 'react';
import { Award, Users, ThumbsUp, UserCheck } from 'lucide-react';

const StatsStrip = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const stats = [
    {
      icon: Award,
      value: 20,
      suffix: '+',
      label: 'Years Experience',
    },
    {
      icon: Users,
      value: 2000,
      suffix: '+',
      label: 'Completed Cases',
    },
    {
      icon: ThumbsUp,
      value: 99.8,
      suffix: '%',
      label: 'Satisfaction Rate',
    },
    {
      icon: UserCheck,
      value: 2,
      suffix: '',
      label: 'Migration Professionals',
    },
  ];

  const AnimatedCounter = ({ value, suffix, isVisible }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!isVisible) return;

      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current * 10) / 10);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }, [isVisible, value]);

    return (
      <span>
        {Number.isInteger(value) ? Math.floor(count) : count.toFixed(1)}
        {suffix}
      </span>
    );
  };

  return (
    <section
      id="stats"
      ref={sectionRef}
      className="bg-visa-navy py-12 lg:py-16"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 bg-visa-gold/20 rounded-full mb-4">
                <stat.icon className="w-7 h-7 text-visa-gold" />
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} isVisible={isVisible} />
              </div>
              <div className="text-white/70 text-sm lg:text-base">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsStrip;
