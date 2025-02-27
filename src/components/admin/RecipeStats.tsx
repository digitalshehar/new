import { useState, useEffect, useRef } from 'react';

interface RecipeStats {
  totalRecipes: number;
  totalDrafts: number;
  totalPublished: number;
  byCuisine: Record<string, number>;
  byDifficulty: Record<string, number>;
  averagePrepTime: number;
  averageCookTime: number;
}

// Animated number counter component
function AnimatedCounter({ value, duration = 1000 }: { value: number, duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  const counterRef = useRef<HTMLSpanElement>(null);
  const startTime = useRef<number | null>(null);
  const endValue = useRef(value);

  useEffect(() => {
    endValue.current = value;
    startTime.current = null;
    
    const animateCounter = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = timestamp - startTime.current;
      const percentage = Math.min(progress / duration, 1);
      
      // Easing function: easeOutExpo
      const easePercentage = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);
      const currentValue = Math.floor(easePercentage * endValue.current);
      
      setDisplayValue(currentValue);
      
      if (percentage < 1) {
        requestAnimationFrame(animateCounter);
      }
    };
    
    requestAnimationFrame(animateCounter);
    
    return () => {
      startTime.current = null;
    };
  }, [value, duration]);
  
  return <span ref={counterRef}>{displayValue}</span>;
}

// Bar chart component with animation
function AnimatedBar({ 
  percentage, 
  label, 
  value,
  color = 'bg-amber-500',
  delay = 0
}: { 
  percentage: number, 
  label: string, 
  value: number,
  color?: string,
  delay?: number
}) {
  const [width, setWidth] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setWidth(percentage);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [percentage, delay]);
  
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-gray-500 dark:text-gray-300">{label}</span>
        <span className="text-sm font-medium text-gray-900 dark:text-white">{value}</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full ${color} transition-all duration-1000 ease-out`}
          style={{ width: `${width}%` }}
        ></div>
      </div>
    </div>
  );
}

export default function RecipeStats() {
  const [stats, setStats] = useState<RecipeStats>({
    totalRecipes: 0,
    totalDrafts: 0,
    totalPublished: 0,
    byCuisine: {},
    byDifficulty: {},
    averagePrepTime: 0,
    averageCookTime: 0
  });
  const [isVisible, setIsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // In a real app, this would fetch stats from an API
    // For demo purposes, we'll use mock data
    setTimeout(() => {
      setStats({
        totalRecipes: 15,
        totalDrafts: 3,
        totalPublished: 12,
        byCuisine: {
          Italian: 5,
          Mexican: 3,
          Indian: 4,
          Chinese: 3
        },
        byDifficulty: {
          Easy: 6,
          Medium: 7,
          Hard: 2
        },
        averagePrepTime: 25,
        averageCookTime: 45
      });
    }, 300);
    
    // Setup intersection observer to trigger animations when component is visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (statsRef.current) {
      observer.observe(statsRef.current);
    }
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
  // Calculate percentages for bar charts
  const getMaxValue = (obj: Record<string, number>) => {
    return Math.max(...Object.values(obj));
  };
  
  const calculatePercentage = (value: number, max: number) => {
    return (value / max) * 100;
  };
  
  const maxCuisineValue = getMaxValue(stats.byCuisine);
  const maxDifficultyValue = getMaxValue(stats.byDifficulty);

  return (
    <div 
      ref={statsRef}
      className={`bg-white dark:bg-gray-800 shadow sm:rounded-lg overflow-hidden transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
          Recipe Statistics
        </h3>

        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { 
              title: 'Total Recipes', 
              value: stats.totalRecipes, 
              icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
              delay: 0
            },
            { 
              title: 'Draft Recipes', 
              value: stats.totalDrafts, 
              icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
              delay: 150
            },
            { 
              title: 'Published Recipes', 
              value: stats.totalPublished, 
              icon: 'M5 13l4 4L19 7',
              delay: 300
            }
          ].map((item, index) => (
            <div 
              key={item.title}
              className={`relative bg-white dark:bg-gray-700 pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden
                transition-all duration-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{ transitionDelay: `${item.delay}ms` }}
            >
              <dt>
                <div className="absolute bg-amber-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                  </svg>
                </div>
                <p className="ml-16 text-sm font-medium text-gray-500 dark:text-gray-300 truncate">{item.title}</p>
              </dt>
              <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {isVisible && <AnimatedCounter value={item.value} />}
                </p>
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className={`bg-white dark:bg-gray-700 overflow-hidden shadow rounded-lg
              transition-all duration-500 transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}
              style={{ transitionDelay: '450ms' }}
          >
            <div className="px-4 py-5 sm:p-6">
              <h4 className="text-base font-medium text-gray-900 dark:text-white">By Cuisine</h4>
              <div className="mt-4 space-y-3">
                {Object.entries(stats.byCuisine).map(([cuisine, count], index) => (
                  isVisible && (
                    <AnimatedBar 
                      key={cuisine}
                      label={cuisine}
                      value={count}
                      percentage={calculatePercentage(count, maxCuisineValue)}
                      delay={500 + (index * 100)}
                      color={
                        index % 3 === 0 ? 'bg-amber-500' :
                        index % 3 === 1 ? 'bg-orange-500' : 'bg-red-500'
                      }
                    />
                  )
                ))}
              </div>
            </div>
          </div>

          <div className={`bg-white dark:bg-gray-700 overflow-hidden shadow rounded-lg
              transition-all duration-500 transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}
              style={{ transitionDelay: '600ms' }}
          >
            <div className="px-4 py-5 sm:p-6">
              <h4 className="text-base font-medium text-gray-900 dark:text-white">By Difficulty</h4>
              <div className="mt-4 space-y-3">
                {Object.entries(stats.byDifficulty).map(([difficulty, count], index) => (
                  isVisible && (
                    <AnimatedBar 
                      key={difficulty}
                      label={difficulty}
                      value={count}
                      percentage={calculatePercentage(count, maxDifficultyValue)}
                      delay={700 + (index * 100)}
                      color={
                        difficulty === 'Easy' ? 'bg-green-500' :
                        difficulty === 'Medium' ? 'bg-amber-500' : 'bg-red-500'
                      }
                    />
                  )
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={`mt-8 bg-white dark:bg-gray-700 overflow-hidden shadow rounded-lg
            transition-all duration-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
            style={{ transitionDelay: '750ms' }}
        >
          <div className="px-4 py-5 sm:p-6">
            <h4 className="text-base font-medium text-gray-900 dark:text-white">Average Times</h4>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="relative overflow-hidden">
                <span className="block text-sm text-gray-500 dark:text-gray-300">Prep Time</span>
                <span className="block mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                  {isVisible && (
                    <>
                      <AnimatedCounter value={stats.averagePrepTime} /> mins
                    </>
                  )}
                </span>
                <div className={`absolute h-1 bg-amber-500 bottom-0 left-0 transition-all duration-1000 ease-out ${isVisible ? 'w-full' : 'w-0'}`}></div>
              </div>
              <div className="relative overflow-hidden">
                <span className="block text-sm text-gray-500 dark:text-gray-300">Cook Time</span>
                <span className="block mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                  {isVisible && (
                    <>
                      <AnimatedCounter value={stats.averageCookTime} /> mins
                    </>
                  )}
                </span>
                <div className={`absolute h-1 bg-amber-500 bottom-0 left-0 transition-all duration-1000 ease-out ${isVisible ? 'w-full' : 'w-0'}`}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
