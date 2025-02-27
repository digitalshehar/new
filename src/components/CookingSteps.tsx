import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Step {
  step: string;
  time: number;
  description: string;
}

interface CookingStepsProps {
  steps: Step[];
}

export default function CookingSteps({ steps }: CookingStepsProps) {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const toggleStep = (index: number) => {
    setCompletedSteps(prev => 
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="space-y-6">
      {steps.map((step, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`relative p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-all duration-300 ${
            completedSteps.includes(index)
              ? 'border-l-4 border-green-500'
              : 'border-l-4 border-amber-500'
          }`}
        >
          <div className="flex items-start gap-4">
            <button
              onClick={() => toggleStep(index)}
              className={`flex-shrink-0 w-6 h-6 mt-1 rounded-full border-2 transition-colors duration-300 ${
                completedSteps.includes(index)
                  ? 'bg-green-500 border-green-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <AnimatePresence>
                {completedSteps.includes(index) && (
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="w-full h-full text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    />
                  </motion.svg>
                )}
              </AnimatePresence>
            </button>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className={`text-xl font-semibold ${
                  completedSteps.includes(index)
                    ? 'text-gray-500 dark:text-gray-400 line-through'
                    : 'text-gray-900 dark:text-gray-100'
                }`}>
                  {step.step}
                </h3>
                {step.time > 0 && (
                  <span className="px-3 py-1 text-sm bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-100 rounded-full">
                    {step.time} mins
                  </span>
                )}
              </div>
              <p className={`text-gray-600 dark:text-gray-300 ${
                completedSteps.includes(index) ? 'text-gray-400 dark:text-gray-500' : ''
              }`}>
                {step.description}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
