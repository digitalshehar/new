import { motion } from 'framer-motion';
import { useRef } from 'react';
import type { Recipe } from '../types/recipe';

interface RecipePrinterProps {
  recipe: Recipe;
  servings?: number;
}

export default function RecipePrinter({ recipe, servings }: RecipePrinterProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const scaleIngredient = (ingredient: string, scale: number): string => {
    const match = ingredient.match(/^([\d./]+)?\s*([\w.]+)?\s+(.+)$/);
    if (!match) return ingredient;

    const [, amount, unit, item] = match;
    if (!amount) return ingredient;

    // Convert fractions to decimals
    const numericAmount = amount.includes('/')
      ? amount.split('/').reduce((a, b) => parseFloat(a) / parseFloat(b))
      : parseFloat(amount);

    // Scale the amount
    let scaledAmount = numericAmount * scale;

    // Round to 2 decimal places
    scaledAmount = Math.round(scaledAmount * 100) / 100;

    // Convert back to fraction if it's a common fraction
    const fraction = toFraction(scaledAmount);
    const formattedAmount = fraction || scaledAmount.toString();

    return `${formattedAmount}${unit ? ` ${unit}` : ''} ${item}`;
  };

  const toFraction = (decimal: number): string | null => {
    const tolerance = 0.01;
    const fractions: [number, string][] = [
      [1/4, '¼'], [1/3, '⅓'], [1/2, '½'],
      [2/3, '⅔'], [3/4, '¾'], [1/8, '⅛'],
      [3/8, '⅜'], [5/8, '⅝'], [7/8, '⅞']
    ];

    // Check for whole numbers first
    if (Math.abs(Math.round(decimal) - decimal) < tolerance) {
      return decimal === 1 ? '1' : decimal.toString();
    }

    // Find the closest fraction
    for (const [value, symbol] of fractions) {
      if (Math.abs(value - (decimal % 1)) < tolerance) {
        const whole = Math.floor(decimal);
        return whole > 0 ? `${whole}${symbol}` : symbol;
      }
    }

    return null;
  };

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const scale = servings ? servings / recipe.serves : 1;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${recipe.title} Recipe</title>
          <style>
            @media print {
              @page {
                size: A4;
                margin: 2cm;
              }
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              line-height: 1.5;
              max-width: 800px;
              margin: 0 auto;
              padding: 2rem;
              color: #333;
            }
            h1 {
              font-size: 2rem;
              margin-bottom: 1rem;
              color: #1a202c;
              border-bottom: 2px solid #e2e8f0;
              padding-bottom: 0.5rem;
            }
            h2 {
              font-size: 1.5rem;
              margin: 1.5rem 0 1rem;
              color: #2d3748;
            }
            .meta {
              color: #4a5568;
              margin-bottom: 2rem;
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 1rem;
              background: #f7fafc;
              padding: 1rem;
              border-radius: 0.5rem;
            }
            .ingredients {
              margin-bottom: 2rem;
              background: #fff;
              padding: 1.5rem;
              border: 1px solid #e2e8f0;
              border-radius: 0.5rem;
            }
            .ingredients li {
              margin-bottom: 0.5rem;
              list-style-type: none;
              position: relative;
              padding-left: 1.5rem;
            }
            .ingredients li:before {
              content: "•";
              position: absolute;
              left: 0;
              color: #ed8936;
            }
            .method {
              margin-bottom: 2rem;
            }
            .method li {
              margin-bottom: 1rem;
              padding-left: 2rem;
              position: relative;
            }
            .method li:before {
              content: counter(step-counter);
              counter-increment: step-counter;
              position: absolute;
              left: 0;
              font-weight: bold;
              color: #ed8936;
            }
            .tips {
              background: #fffaf0;
              padding: 1.5rem;
              border-radius: 0.5rem;
              margin-bottom: 2rem;
            }
            .tips li {
              margin-bottom: 0.5rem;
              list-style-type: none;
              position: relative;
              padding-left: 1.5rem;
            }
            .tips li:before {
              content: "💡";
              position: absolute;
              left: 0;
            }
            .nutrition {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
              gap: 1rem;
              background: #f0fff4;
              padding: 1.5rem;
              border-radius: 0.5rem;
            }
            .nutrition div {
              text-align: center;
            }
            .nutrition strong {
              display: block;
              color: #2f855a;
              margin-bottom: 0.25rem;
            }
            @media print {
              .no-print { display: none; }
              .page-break { page-break-after: always; }
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="recipe-card">
            <h1>${recipe.title}</h1>
            
            <div class="meta">
              <div>
                <strong>Prep Time:</strong> ${recipe.prepTime}
              </div>
              <div>
                <strong>Cooking Time:</strong> ${recipe.cookingTime}
              </div>
              <div>
                <strong>Difficulty:</strong> ${recipe.difficulty}
              </div>
              <div>
                <strong>Serves:</strong> ${servings || recipe.serves}
              </div>
            </div>

            <div class="ingredients">
              <h2>Ingredients</h2>
              <ul>
                ${recipe.ingredients
                  .map(ingredient => `<li>${scaleIngredient(ingredient, scale)}</li>`)
                  .join('')}
              </ul>
            </div>

            <div class="method">
              <h2>Method</h2>
              <ol>
                ${recipe.method.map(step => `<li>${step}</li>`).join('')}
              </ol>
            </div>

            <div class="tips">
              <h2>Tips</h2>
              <ul>
                ${recipe.tips.map(tip => `<li>${tip}</li>`).join('')}
              </ul>
            </div>

            <div class="nutrition">
              <h2>Nutrition (per serving)</h2>
              <div>
                <strong>Calories</strong>
                <span>${recipe.nutritionInfo.calories}</span>
              </div>
              <div>
                <strong>Protein</strong>
                <span>${recipe.nutritionInfo.protein}</span>
              </div>
              <div>
                <strong>Carbohydrates</strong>
                <span>${recipe.nutritionInfo.carbohydrates}</span>
              </div>
              <div>
                <strong>Fat</strong>
                <span>${recipe.nutritionInfo.fat}</span>
              </div>
            </div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="print-button"
    >
      <button
        onClick={handlePrint}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        Print Recipe
      </button>

      {/* Hidden content for printing */}
      <div ref={printRef} className="hidden">
        <div className="recipe-card">
          <h1>{recipe.title}</h1>
          <div className="meta">
            <p>
              Prep Time: {recipe.prepTime} | Cooking Time: {recipe.cookingTime}
            </p>
            <p>
              Difficulty: {recipe.difficulty} | Serves: {servings || recipe.serves}
            </p>
          </div>
          {/* Rest of the recipe content */}
        </div>
      </div>
    </motion.div>
  );
}
