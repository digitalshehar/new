import React, { useState } from 'react';

interface Instruction {
  step: number;
  text: string;
}

interface RecipeInstructionsProps {
  instructions: Instruction[];
}

export default function RecipeInstructions({ instructions }: RecipeInstructionsProps) {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const toggleStep = (step: number) => {
    setCompletedSteps((prev) =>
      prev.includes(step)
        ? prev.filter((s) => s !== step)
        : [...prev, step]
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Instructions</h2>
      
      <div className="space-y-4">
        {instructions.map(({ step, text }) => (
          <div
            key={step}
            className={`p-4 rounded-lg border ${
              completedSteps.includes(step)
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="flex items-start space-x-4">
              <button
                onClick={() => toggleStep(step)}
                className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  completedSteps.includes(step)
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                aria-label={`Mark step ${step} as ${
                  completedSteps.includes(step) ? 'incomplete' : 'complete'
                }`}
              >
                {completedSteps.includes(step) && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
              
              <div className="flex-grow">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-2">
                    Step {step}
                  </span>
                  <div
                    className={`h-px flex-grow ${
                      completedSteps.includes(step)
                        ? 'bg-green-200 dark:bg-green-700'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                </div>
                <p
                  className={`mt-2 text-gray-700 dark:text-gray-300 ${
                    completedSteps.includes(step) ? 'line-through opacity-75' : ''
                  }`}
                >
                  {text}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {completedSteps.length === instructions.length && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <p className="text-green-700 dark:text-green-300 text-center font-medium">
            🎉 Congratulations! You've completed all the steps. Enjoy your meal!
          </p>
        </div>
      )}
    </div>
  );
}
