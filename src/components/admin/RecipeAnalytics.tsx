import { useState, useEffect, useRef } from 'react';

interface AnalyticsProps {
  recipes: any[];
}

interface ChartData {
  labels: string[];
  values: number[];
  colors: string[];
}

export default function RecipeAnalytics({ recipes }: AnalyticsProps) {
  const [activeTab, setActiveTab] = useState<'categories' | 'difficulty' | 'time'>('categories');
  const [categoryData, setCategoryData] = useState<ChartData>({ labels: [], values: [], colors: [] });
  const [difficultyData, setDifficultyData] = useState<ChartData>({ labels: [], values: [], colors: [] });
  const [timeData, setTimeData] = useState<ChartData>({ labels: [], values: [], colors: [] });
  const [isVisible, setIsVisible] = useState(false);
  const [animateCharts, setAnimateCharts] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Calculate category stats
    const categoryCount: Record<string, number> = {};
    recipes.forEach(recipe => {
      categoryCount[recipe.category] = (categoryCount[recipe.category] || 0) + 1;
    });
    
    const categoryLabels = Object.keys(categoryCount);
    const categoryValues = Object.values(categoryCount);
    const categoryColors = [
      '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899',
      '#EF4444', '#14B8A6', '#6366F1', '#D946EF', '#F97316'
    ];
    
    setCategoryData({
      labels: categoryLabels,
      values: categoryValues,
      colors: categoryColors.slice(0, categoryLabels.length)
    });
    
    // Calculate difficulty stats
    const difficultyCount: Record<string, number> = {};
    recipes.forEach(recipe => {
      difficultyCount[recipe.difficulty] = (difficultyCount[recipe.difficulty] || 0) + 1;
    });
    
    const difficultyLabels = Object.keys(difficultyCount);
    const difficultyValues = Object.values(difficultyCount);
    const difficultyColors = {
      'Easy': '#10B981',
      'Medium': '#F59E0B',
      'Hard': '#EF4444'
    };
    
    setDifficultyData({
      labels: difficultyLabels,
      values: difficultyValues,
      colors: difficultyLabels.map(label => difficultyColors[label as keyof typeof difficultyColors] || '#94A3B8')
    });
    
    // Calculate time stats (group by time ranges)
    const timeRanges = {
      'Under 15 min': 0,
      '15-30 min': 0,
      '30-60 min': 0,
      'Over 60 min': 0
    };
    
    recipes.forEach(recipe => {
      const time = parseInt(recipe.cookingTime.replace(/[^\d]/g, ''));
      if (time < 15) timeRanges['Under 15 min']++;
      else if (time < 30) timeRanges['15-30 min']++;
      else if (time < 60) timeRanges['30-60 min']++;
      else timeRanges['Over 60 min']++;
    });
    
    const timeLabels = Object.keys(timeRanges);
    const timeValues = Object.values(timeRanges);
    const timeColors = ['#60A5FA', '#34D399', '#FBBF24', '#F87171'];
    
    setTimeData({
      labels: timeLabels,
      values: timeValues,
      colors: timeColors
    });
  }, [recipes]);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    if (isVisible) {
      setAnimateCharts(true);
    }
  }, [isVisible]);
  
  const renderPieChart = (data: ChartData) => {
    const total = data.values.reduce((acc, val) => acc + val, 0);
    let cumulativePercentage = 0;
    
    return (
      <div className="relative w-48 h-48 mx-auto">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {data.values.map((value, i) => {
            const percentage = (value / total) * 100;
            const startAngle = cumulativePercentage * 3.6; // 3.6 = 360 / 100
            cumulativePercentage += percentage;
            const endAngle = cumulativePercentage * 3.6;
            
            // Calculate the SVG path for the pie slice
            const x1 = 50 + 40 * Math.cos((startAngle - 90) * (Math.PI / 180));
            const y1 = 50 + 40 * Math.sin((startAngle - 90) * (Math.PI / 180));
            const x2 = 50 + 40 * Math.cos((endAngle - 90) * (Math.PI / 180));
            const y2 = 50 + 40 * Math.sin((endAngle - 90) * (Math.PI / 180));
            
            const largeArcFlag = percentage > 50 ? 1 : 0;
            
            const pathData = [
              `M 50 50`,
              `L ${x1} ${y1}`,
              `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              `Z`
            ].join(' ');
            
            const delay = i * 0.15;
            
            return (
              <path
                key={i}
                d={pathData}
                fill={data.colors[i]}
                className="transition-opacity duration-200 hover:opacity-90"
                style={{
                  transformOrigin: 'center',
                  transform: 'scale(1)',
                  opacity: animateCharts ? 1 : 0,
                  transition: `transform 0.5s ease ${delay}s, opacity 0.5s ease ${delay}s`
                }}
              >
                <title>{`${data.labels[i]}: ${value} (${percentage.toFixed(1)}%)`}</title>
              </path>
            );
          })}
          <circle cx="50" cy="50" r="25" fill="white" className="dark:fill-gray-800" />
        </svg>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-gray-800 dark:text-white">{total}</span>
        </div>
      </div>
    );
  };
  
  const renderBarChart = (data: ChartData) => {
    const maxValue = Math.max(...data.values);
    
    return (
      <div className="w-full h-48 pt-4 flex items-end space-x-2">
        {data.values.map((value, i) => {
          const height = (value / maxValue) * 100;
          const delay = i * 0.1;
          
          return (
            <div key={i} className="flex flex-col items-center flex-1">
              <div className="w-full flex justify-center mb-1">
                <div 
                  className="mx-auto w-full max-w-[30px] rounded-t-sm"
                  style={{
                    height: animateCharts ? `${height}%` : '0%',
                    backgroundColor: data.colors[i],
                    transition: `height 1s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s`
                  }}
                >
                  <div className="w-full h-full relative overflow-hidden">
                    {/* Shine effect */}
                    <div 
                      className="absolute top-0 left-0 w-full h-8 bg-white opacity-20 transform -skew-x-45 translate-x-full"
                      style={{
                        animation: animateCharts ? `shine 2s ease-in-out ${delay + 0.5}s` : 'none'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              <div 
                className="text-xs text-gray-600 dark:text-gray-300 mt-1 whitespace-nowrap text-center overflow-hidden text-ellipsis max-w-[60px]"
                title={data.labels[i]}
              >
                {data.labels[i]}
              </div>
              <div 
                className="text-xs font-semibold mt-1 opacity-0"
                style={{
                  opacity: animateCharts ? 1 : 0,
                  transition: `opacity 0.5s ease ${delay + 0.3}s`,
                  color: data.colors[i]
                }}
              >
                {value}
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  const renderLegend = (data: ChartData) => {
    return (
      <div className="grid grid-cols-2 gap-2 mt-4">
        {data.labels.map((label, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: data.colors[i] }}
            ></div>
            <span className="text-xs text-gray-700 dark:text-gray-300">
              {label} ({data.values[i]})
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-all duration-300"
      ref={containerRef}
    >
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recipe Analytics</h2>
      
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          className={`px-4 py-2 text-sm font-medium transition-colors relative
                    ${activeTab === 'categories' 
                      ? 'text-amber-600 dark:text-amber-400' 
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
          onClick={() => setActiveTab('categories')}
        >
          Categories
          {activeTab === 'categories' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 dark:bg-amber-400"></div>
          )}
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium transition-colors relative
                    ${activeTab === 'difficulty' 
                      ? 'text-amber-600 dark:text-amber-400' 
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
          onClick={() => setActiveTab('difficulty')}
        >
          Difficulty
          {activeTab === 'difficulty' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 dark:bg-amber-400"></div>
          )}
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium transition-colors relative
                    ${activeTab === 'time' 
                      ? 'text-amber-600 dark:text-amber-400' 
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
          onClick={() => setActiveTab('time')}
        >
          Cook Time
          {activeTab === 'time' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 dark:bg-amber-400"></div>
          )}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="transition-all duration-300">
          {activeTab === 'categories' && renderPieChart(categoryData)}
          {activeTab === 'difficulty' && renderPieChart(difficultyData)}
          {activeTab === 'time' && renderPieChart(timeData)}
        </div>
        
        <div className="transition-all duration-300">
          {activeTab === 'categories' && (
            <>
              {renderBarChart(categoryData)}
              {renderLegend(categoryData)}
            </>
          )}
          {activeTab === 'difficulty' && (
            <>
              {renderBarChart(difficultyData)}
              {renderLegend(difficultyData)}
            </>
          )}
          {activeTab === 'time' && (
            <>
              {renderBarChart(timeData)}
              {renderLegend(timeData)}
            </>
          )}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes shine {
          0% {
            transform: translateX(-100%) skewX(-45deg);
          }
          100% {
            transform: translateX(200%) skewX(-45deg);
          }
        }
      `}</style>
    </div>
  );
}
