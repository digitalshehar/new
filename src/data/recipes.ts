export type DietaryPreference = 'Vegetarian' | 'Vegan' | 'Gluten-free' | 'None';
export type TimeCategory = 'Under 30 mins' | '30-60 mins' | 'Over 60 mins';
export type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter' | 'All';

export interface Review {
  userId: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Recipe {
  title: string;
  description: string;
  image: string;
  cookingTime: string;
  timeCategory: TimeCategory;
  difficulty: string;
  serves: string;
  category: string;
  slug: string;
  featured?: boolean;
  rating?: number;
  totalRatings?: number;
  ingredients: string[];
  method: string[];
  tips?: string[];
  nutritionInfo?: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
  };
  dietaryPreferences: DietaryPreference[];
  season: Season;
  reviews: Review[];
  prepTime: string;
  totalTime: string;
}

export interface Collection {
  id: string;
  title: string;
  description: string;
  recipes: string[]; // Array of recipe slugs
  type: 'seasonal' | 'dietary' | 'time-based';
}

export const collections: Collection[] = [
  {
    id: 'spring-favorites',
    title: 'Spring Favorites',
    description: 'Fresh and vibrant recipes perfect for spring',
    recipes: ['perfect-pasta', 'chicken-curry'],
    type: 'seasonal'
  },
  {
    id: 'quick-meals',
    title: '30-Minute Meals',
    description: 'Delicious recipes ready in 30 minutes or less',
    recipes: ['perfect-pasta'],
    type: 'time-based'
  },
  {
    id: 'vegetarian',
    title: 'Vegetarian Delights',
    description: 'Meat-free recipes that everyone will love',
    recipes: ['dal-makhani', 'vegetable-biryani'],
    type: 'dietary'
  },
  {
    id: 'indian-favorites',
    title: 'Indian Favorites',
    description: 'Authentic Indian recipes from various regions',
    recipes: ['butter-chicken', 'dal-makhani', 'vegetable-biryani'],
    type: 'dietary'
  },
  {
    id: 'air-fryer-recipes',
    title: 'Air Fryer Favorites',
    description: 'Quick and crispy recipes made in your air fryer',
    recipes: ['perfect-pasta'], 
    type: 'time-based'
  }
];

export const recipes: Record<string, Recipe> = {
  "perfect-pasta": {
    "title": "Jamie's Perfect Pasta Carbonara",
    "description": "A classic Italian pasta dish made with eggs, cheese, pancetta, and lots of black pepper. Simple yet incredibly satisfying! This authentic recipe brings the taste of Rome to your kitchen.",
    "image": "https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1771&q=80",
    "cookingTime": "25 minutes",
    "prepTime": "10 minutes",
    "totalTime": "35 minutes",
    "timeCategory": "Under 30 mins",
    "difficulty": "Medium",
    "serves": "4",
    "category": "Pasta",
    "slug": "perfect-pasta",
    "featured": true,
    "rating": 4.8,
    "totalRatings": 128,
    "ingredients": [
      "400g spaghetti or linguine",
      "200g pancetta or guanciale, diced",
      "4 large free-range eggs",
      "100g Pecorino Romano, freshly grated",
      "100g Parmigiano Reggiano, freshly grated",
      "2 cloves garlic, finely minced",
      "2 tablespoons extra virgin olive oil",
      "Sea salt and freshly ground black pepper",
      "Fresh parsley, chopped (for garnish)"
    ],
    "method": [
      "Bring a large pot of salted water to boil. Add the pasta and cook according to package instructions until al dente.",
      "While the pasta cooks, heat olive oil in a large pan over medium heat. Add the pancetta and cook until crispy, about 5-7 minutes.",
      "In a bowl, whisk together eggs, grated cheeses, and plenty of black pepper. Set aside.",
      "When pasta is al dente, reserve 1 cup of pasta water, then drain.",
      "Working quickly, add the hot pasta to the pan with pancetta, tossing to combine.",
      "Remove pan from heat and add the egg mixture, stirring quickly to coat the pasta and create a creamy sauce. Add pasta water as needed.",
      "Serve immediately with extra grated cheese, black pepper, and chopped parsley."
    ],
    "tips": [
      "Use room temperature eggs to prevent the sauce from becoming grainy",
      "Never add raw cream - authentic carbonara only uses eggs and cheese",
      "Work quickly when adding the egg mixture to create a silky sauce without scrambling the eggs",
      "Save some pasta water - it's liquid gold for achieving the perfect consistency"
    ],
    "nutritionInfo": {
      "calories": "650kcal",
      "protein": "32g",
      "carbs": "70g",
      "fat": "28g"
    },
    "dietaryPreferences": [
      "None"
    ],
    "season": "All",
    "reviews": []
  },
  "sunday-roast": {
    "title": "Classic Sunday Roast",
    "description": "A traditional British Sunday roast with all the trimmings - perfect for family gatherings.",
    "image": "https://placehold.co/1200x800",
    "cookingTime": "2h 30m",
    "prepTime": "30m",
    "totalTime": "3h",
    "timeCategory": "Over 60 mins",
    "difficulty": "Medium",
    "serves": "6",
    "category": "Roasts",
    "slug": "sunday-roast",
    "featured": false,
    "rating": 4.9,
    "totalRatings": 128,
    "ingredients": [
      "2kg beef roasting joint",
      "1kg potatoes",
      "500g carrots",
      "500g parsnips",
      "Yorkshire pudding batter",
      "Gravy ingredients"
    ],
    "method": [
      "Preheat oven to 200°C/180°C fan",
      "Season the beef and place in roasting tin",
      "Roast for calculated time based on weight",
      "Prepare vegetables while meat cooks",
      "Make Yorkshire puddings",
      "Rest meat and make gravy",
      "Serve with all the trimmings"
    ],
    "tips": [
      "Let meat come to room temperature before cooking",
      "Rest meat for at least 20 minutes",
      "Pre-heat fat for perfect roast potatoes"
    ],
    "nutritionInfo": {
      "calories": "800kcal",
      "protein": "45g",
      "carbs": "60g",
      "fat": "35g"
    },
    "dietaryPreferences": [
      "None"
    ],
    "season": "All",
    "reviews": []
  },
  "perfect-roast-chicken": {
    "title": "Perfect Sunday Roast Chicken",
    "description": "A golden, crispy-skinned roast chicken with all the trimmings. This classic recipe features herb-infused butter, roasted vegetables, and a rich homemade gravy. Perfect for family gatherings and special occasions.",
    "image": "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3276&q=80",
    "cookingTime": "1 hour 30 minutes",
    "prepTime": "30 minutes",
    "totalTime": "2 hours",
    "timeCategory": "Over 60 mins",
    "difficulty": "Medium",
    "serves": "6",
    "category": "Poultry",
    "slug": "perfect-roast-chicken",
    "featured": true,
    "rating": 4.9,
    "totalRatings": 156,
    "ingredients": [
      "1 large free-range chicken (about 2kg)",
      "100g softened butter",
      "4 cloves garlic, minced",
      "2 lemons",
      "1 bunch fresh herbs (thyme, rosemary, sage)",
      "2 onions, quartered",
      "4 carrots, chunked",
      "4 potatoes, quartered",
      "3 parsnips, chunked",
      "Olive oil",
      "Sea salt and freshly ground black pepper"
    ],
    "method": [
      "Preheat your oven to 200°C/180°C fan. Remove chicken from fridge 1 hour before cooking.",
      "Mix softened butter with minced garlic, chopped herbs, lemon zest, salt, and pepper.",
      "Gently loosen the chicken skin and spread the herb butter underneath. Rub remaining butter all over the chicken.",
      "Place quartered onions, carrots, potatoes, and parsnips in a large roasting tray. Drizzle with olive oil and season.",
      "Place chicken on top of vegetables. Cut one lemon in half and place inside the cavity with herb sprigs.",
      "Roast for 1 hour 20 minutes, basting every 20 minutes. The chicken is done when juices run clear.",
      "Rest the chicken for 15-20 minutes before carving. Serve with roasted vegetables and gravy."
    ],
    "tips": [
      "Bringing the chicken to room temperature ensures even cooking",
      "Don't skip the basting - it's crucial for a golden, crispy skin",
      "Use a meat thermometer - chicken is done at 75°C/165°F",
      "Save the pan juices for an incredible homemade gravy"
    ],
    "nutritionInfo": {
      "calories": "450kcal",
      "protein": "38g",
      "carbs": "25g",
      "fat": "22g"
    },
    "dietaryPreferences": [
      "None"
    ],
    "season": "All",
    "reviews": []
  },
  "perfect-roast-chicken-2": {
    "title": "Perfect Roast Chicken",
    "description": "A classic roast chicken with crispy skin, juicy meat, and aromatic herbs. This foolproof recipe delivers restaurant-quality results every time.",
    "image": "/images/recipes/perfect-roast-chicken.jpg",
    "prepTime": "20 mins",
    "cookingTime": "1 hr 30 mins",
    "timeCategory": "Under 2 hours",
    "serves": 4,
    "difficulty": "Medium",
    "ingredients": [
      "1 whole chicken (about 1.8kg)",
      "2 lemons",
      "1 bulb of garlic",
      "4 sprigs of fresh rosemary",
      "4 sprigs of fresh thyme",
      "50g butter, softened",
      "2 tablespoons olive oil",
      "Salt and black pepper"
    ],
    "method": [
      "Preheat oven to 200°C (180°C fan)",
      "Pat chicken dry with paper towels",
      "Mix softened butter with chopped herbs",
      "Gently loosen skin and spread butter mixture underneath",
      "Stuff cavity with lemon halves, garlic, and herb sprigs",
      "Drizzle with olive oil and season generously",
      "Roast for 1 hour 20 minutes, basting occasionally",
      "Rest for 10-15 minutes before carving"
    ],
    "tips": [
      "Bring chicken to room temperature before cooking",
      "Truss the legs for even cooking",
      "Use a meat thermometer to check doneness",
      "Save the carcass for homemade stock"
    ],
    "nutritionInfo": {
      "calories": "420",
      "protein": "38g",
      "carbohydrates": "2g",
      "fat": "28g"
    },
    "dietaryPreferences": [
      "None"
    ],
    "season": "All",
    "reviews": []
  },
  "creamy-mushroom-risotto": {
    "title": "Creamy Mushroom Risotto",
    "description": "A luxurious Italian risotto made with mixed mushrooms, Arborio rice, and Parmesan cheese. Each grain of rice is perfectly cooked and infused with flavor.",
    "image": "/images/recipes/mushroom-risotto.jpg",
    "prepTime": "15 mins",
    "cookingTime": "30 mins",
    "timeCategory": "Under 1 hour",
    "serves": 4,
    "difficulty": "Medium",
    "ingredients": [
      "320g Arborio rice",
      "400g mixed mushrooms",
      "1.2L vegetable stock",
      "1 onion, finely chopped",
      "2 cloves garlic, minced",
      "120ml white wine",
      "60g Parmesan cheese",
      "30g butter",
      "Fresh thyme",
      "Salt and pepper"
    ],
    "method": [
      "Heat stock in a separate pan",
      "Sauté mushrooms until golden",
      "Cook onion and garlic until soft",
      "Add rice and toast for 2 minutes",
      "Add wine and simmer until absorbed",
      "Add stock gradually, stirring constantly",
      "Finish with butter and Parmesan",
      "Rest for 2 minutes before serving"
    ],
    "tips": [
      "Use room temperature stock",
      "Never wash the rice",
      "Stir frequently but gently",
      "Keep the stock simmering"
    ],
    "nutritionInfo": {
      "calories": "380",
      "protein": "12g",
      "carbohydrates": "65g",
      "fat": "18g"
    },
    "dietaryPreferences": [
      "None"
    ],
    "season": "All",
    "reviews": []
  },
  "spicy-thai-green-curry": {
    "title": "Spicy Thai Green Curry",
    "description": "An authentic Thai green curry with the perfect balance of spicy, sweet, and savory flavors. Made with homemade curry paste and coconut milk.",
    "image": "/images/recipes/thai-green-curry.jpg",
    "prepTime": "25 mins",
    "cookingTime": "25 mins",
    "timeCategory": "Under 1 hour",
    "serves": 4,
    "difficulty": "Medium",
    "ingredients": [
      "400ml coconut milk",
      "4 tbsp green curry paste",
      "500g chicken thighs",
      "200g Thai eggplants",
      "100g bamboo shoots",
      "4 kaffir lime leaves",
      "Thai basil leaves",
      "Fish sauce",
      "Palm sugar",
      "Jasmine rice to serve"
    ],
    "method": [
      "Fry curry paste until fragrant",
      "Add coconut milk and simmer",
      "Add chicken and cook until tender",
      "Add vegetables and lime leaves",
      "Season with fish sauce and palm sugar",
      "Simmer until vegetables are cooked",
      "Garnish with Thai basil",
      "Serve with jasmine rice"
    ],
    "tips": [
      "Use full-fat coconut milk",
      "Don't rush the curry paste frying",
      "Adjust seasoning gradually",
      "Use fresh lime leaves when possible"
    ],
    "nutritionInfo": {
      "calories": "450",
      "protein": "28g",
      "carbohydrates": "15g",
      "fat": "32g"
    },
    "dietaryPreferences": [
      "None"
    ],
    "season": "All",
    "reviews": []
  },
  "classic-beef-bourguignon": {
    "title": "Classic Beef Bourguignon",
    "description": "A rich and hearty French stew made with tender beef, red wine, mushrooms, and pearl onions. Perfect for cold winter days.",
    "image": "/images/recipes/beef-bourguignon.jpg",
    "cookingTime": "3 hours",
    "timeCategory": "Over 60 mins",
    "difficulty": "Medium",
    "serves": "6-8",
    "category": "Main Course",
    "slug": "classic-beef-bourguignon",
    "featured": true,
    "rating": 4.9,
    "totalRatings": 324,
    "ingredients": [
      "1.5 kg beef chuck, cut into large chunks",
      "200g bacon lardons",
      "24 pearl onions",
      "500g mushrooms",
      "3 carrots, roughly chopped",
      "2 onions, diced",
      "4 garlic cloves, minced",
      "750ml red wine (Burgundy preferred)",
      "500ml beef stock",
      "2 tbsp tomato paste",
      "1 bouquet garni (thyme, parsley, bay leaf)",
      "Salt and pepper to taste",
      "3 tbsp flour",
      "3 tbsp butter"
    ],
    "method": [
      "Preheat the oven to 160°C (325°F).",
      "Season beef chunks with salt and pepper. Brown in batches in a large Dutch oven. Set aside.",
      "In the same pot, cook bacon lardons until crispy. Remove and set aside.",
      "Cook pearl onions until golden. Remove and set aside.",
      "Sauté mushrooms until browned. Remove and set aside.",
      "In the same pot, cook diced onions and carrots until softened.",
      "Add garlic and tomato paste, cook for 1 minute.",
      "Return beef to pot. Add flour and stir to coat.",
      "Add wine and stock. Bring to a simmer.",
      "Add bouquet garni, cover, and transfer to oven.",
      "Cook for 2.5 hours or until beef is tender.",
      "Add bacon, pearl onions, and mushrooms for the last 30 minutes.",
      "Adjust seasoning and serve hot with crusty bread."
    ],
    "tips": [
      "Choose a good quality red wine - one you'd enjoy drinking",
      "Don't rush the browning process - it builds flavor",
      "Make it a day ahead - the flavors improve overnight"
    ],
    "nutritionInfo": {
      "calories": "520",
      "protein": "42g",
      "carbs": "18g",
      "fat": "28g"
    },
    "dietaryPreferences": [
      "None"
    ],
    "season": "Winter",
    "reviews": [],
    "prepTime": "45 mins",
    "totalTime": "3 hours 45 mins"
  },
  "homemade-pizza-margherita": {
    "title": "Homemade Pizza Margherita",
    "description": "A classic Neapolitan pizza with a perfectly chewy crust, San Marzano tomatoes, fresh mozzarella, and basil. Simple yet sublime.",
    "image": "/images/recipes/pizza-margherita.jpg",
    "prepTime": "2 hrs",
    "cookingTime": "10 mins",
    "timeCategory": "Over 2 hours",
    "serves": 2,
    "difficulty": "Medium",
    "ingredients": [
      "300g '00' flour",
      "7g active dry yeast",
      "200ml warm water",
      "1 tsp salt",
      "1 tbsp olive oil",
      "400g San Marzano tomatoes",
      "250g fresh mozzarella",
      "Fresh basil leaves",
      "Extra virgin olive oil",
      "Sea salt"
    ],
    "method": [
      "Make dough and let rise for 2 hours",
      "Prepare simple tomato sauce",
      "Preheat oven to maximum with stone",
      "Shape dough by hand",
      "Add sauce and bake for 5 minutes",
      "Add cheese and bake 3-4 minutes more",
      "Finish with basil and olive oil",
      "Serve immediately"
    ],
    "tips": [
      "Use a pizza stone if possible",
      "Don't overwork the dough",
      "Less is more with toppings",
      "Get oven as hot as possible"
    ],
    "nutritionInfo": {
      "calories": "880",
      "protein": "34g",
      "carbohydrates": "126g",
      "fat": "28g"
    },
    "dietaryPreferences": [
      "None"
    ],
    "season": "All",
    "reviews": []
  },
  "miso-glazed-salmon": {
    "title": "Miso Glazed Salmon",
    "description": "A Japanese-inspired dish featuring salmon fillets glazed with a sweet and savory miso mixture. Quick to prepare yet incredibly flavorful.",
    "image": "/images/recipes/miso-salmon.jpg",
    "prepTime": "10 mins",
    "cookingTime": "15 mins",
    "timeCategory": "Under 30 mins",
    "serves": 4,
    "difficulty": "Easy",
    "ingredients": [
      "4 salmon fillets",
      "4 tbsp white miso paste",
      "3 tbsp mirin",
      "2 tbsp sake",
      "1 tbsp soy sauce",
      "2 tbsp brown sugar",
      "Sesame seeds",
      "Spring onions",
      "Steamed rice",
      "Baby bok choy"
    ],
    "method": [
      "Mix miso, mirin, sake, and sugar",
      "Marinate salmon for 30 minutes",
      "Preheat broiler",
      "Place salmon on lined baking sheet",
      "Broil for 8-10 minutes",
      "Garnish with sesame and onions",
      "Serve with rice and bok choy",
      "Add extra sauce if desired"
    ],
    "tips": [
      "Use skinless salmon fillets",
      "Don't marinate too long",
      "Watch carefully while broiling",
      "Pat fish dry before cooking"
    ],
    "nutritionInfo": {
      "calories": "380",
      "protein": "34g",
      "carbohydrates": "18g",
      "fat": "22g"
    },
    "dietaryPreferences": [
      "None"
    ],
    "season": "All",
    "reviews": []
  },
  "chocolate-lava-cakes": {
    "title": "Chocolate Lava Cakes",
    "description": "Decadent individual chocolate cakes with a molten center. These impressive desserts are surprisingly easy to make and always wow guests.",
    "image": "/images/recipes/lava-cakes.jpg",
    "prepTime": "15 mins",
    "cookingTime": "12 mins",
    "timeCategory": "Under 30 mins",
    "serves": 4,
    "difficulty": "Medium",
    "ingredients": [
      "200g dark chocolate",
      "120g butter",
      "4 eggs",
      "120g sugar",
      "2 tbsp flour",
      "Cocoa powder",
      "Vanilla ice cream",
      "Fresh berries",
      "Powdered sugar",
      "Pinch of salt"
    ],
    "method": [
      "Preheat oven to 200°C",
      "Melt chocolate and butter",
      "Whisk eggs and sugar until pale",
      "Fold in chocolate mixture",
      "Add flour and salt",
      "Pour into buttered ramekins",
      "Bake for 12 minutes",
      "Serve immediately"
    ],
    "tips": [
      "Use good quality chocolate",
      "Don't overbake",
      "Prepare ramekins well",
      "Serve right away"
    ],
    "nutritionInfo": {
      "calories": "420",
      "protein": "8g",
      "carbohydrates": "42g",
      "fat": "28g"
    },
    "dietaryPreferences": [
      "None"
    ],
    "season": "All",
    "reviews": []
  },
  "butternut-squash-soup": {
    "title": "Butternut Squash Soup",
    "description": "A velvety smooth soup made with roasted butternut squash, warming spices, and a touch of cream. Perfect for autumn days.",
    "image": "/images/recipes/squash-soup.jpg",
    "prepTime": "20 mins",
    "cookingTime": "45 mins",
    "timeCategory": "Under 1.5 hours",
    "serves": 6,
    "difficulty": "Easy",
    "ingredients": [
      "1 large butternut squash",
      "1 onion, chopped",
      "2 carrots, chopped",
      "3 garlic cloves",
      "1L vegetable stock",
      "200ml cream",
      "Olive oil",
      "Nutmeg",
      "Pumpkin seeds",
      "Fresh sage"
    ],
    "method": [
      "Roast squash until tender",
      "Sauté onion and carrots",
      "Add garlic and spices",
      "Add stock and simmer",
      "Blend until smooth",
      "Stir in cream",
      "Adjust seasoning",
      "Garnish and serve"
    ],
    "tips": [
      "Roast squash for more flavor",
      "Use immersion blender",
      "Make it vegan with coconut milk",
      "Freeze portions for later"
    ],
    "nutritionInfo": {
      "calories": "280",
      "protein": "4g",
      "carbohydrates": "32g",
      "fat": "18g"
    },
    "dietaryPreferences": [
      "None"
    ],
    "season": "All",
    "reviews": []
  },
  "beef-tacos": {
    "title": "Authentic Beef Tacos",
    "description": "Street-style Mexican tacos with perfectly seasoned beef, fresh cilantro, onions, and lime. Simple yet authentic and bursting with flavor.",
    "image": "/images/recipes/beef-tacos.jpg",
    "prepTime": "20 mins",
    "cookingTime": "25 mins",
    "timeCategory": "Under 1 hour",
    "serves": 4,
    "difficulty": "Easy",
    "ingredients": [
      "500g ground beef",
      "12 corn tortillas",
      "1 white onion",
      "Fresh cilantro",
      "2 limes",
      "Chili powder",
      "Cumin",
      "Garlic powder",
      "Hot sauce",
      "Salt"
    ],
    "method": [
      "Season beef with spices",
      "Cook beef until browned",
      "Warm tortillas",
      "Chop onion and cilantro",
      "Assemble tacos",
      "Serve with lime wedges",
      "Add hot sauce to taste",
      "Enjoy immediately"
    ],
    "tips": [
      "Use high-fat beef (80/20)",
      "Don't overcook the meat",
      "Warm tortillas properly",
      "Serve immediately"
    ],
    "nutritionInfo": {
      "calories": "320",
      "protein": "24g",
      "carbohydrates": "28g",
      "fat": "16g"
    },
    "dietaryPreferences": [
      "None"
    ],
    "season": "All",
    "reviews": []
  },
  "classic-tiramisu": {
    "title": "Classic Tiramisu",
    "description": "The beloved Italian dessert made with layers of coffee-soaked ladyfingers and rich mascarpone cream. A perfect end to any meal.",
    "image": "/images/recipes/tiramisu.jpg",
    "prepTime": "30 mins",
    "cookingTime": "4 hrs",
    "timeCategory": "Over 4 hours",
    "serves": 8,
    "difficulty": "Medium",
    "ingredients": [
      "500g mascarpone",
      "4 eggs, separated",
      "100g sugar",
      "300ml strong coffee",
      "24 ladyfingers",
      "Marsala wine",
      "Cocoa powder",
      "Coffee beans",
      "Vanilla extract",
      "Pinch of salt"
    ],
    "method": [
      "Make coffee and let cool",
      "Beat egg yolks and sugar",
      "Fold in mascarpone",
      "Whip egg whites",
      "Fold whites into mascarpone",
      "Dip ladyfingers in coffee",
      "Layer and chill",
      "Dust with cocoa"
    ],
    "tips": [
      "Use room temp ingredients",
      "Don't oversoak ladyfingers",
      "Chill for at least 4 hours",
      "Use fresh eggs"
    ],
    "nutritionInfo": {
      "calories": "380",
      "protein": "8g",
      "carbohydrates": "34g",
      "fat": "24g"
    },
    "dietaryPreferences": [
      "None"
    ],
    "season": "All",
    "reviews": []
  },
  "garlic-shrimp-pasta": {
    "title": "Garlic Shrimp Pasta",
    "description": "Quick, easy and absolutely delicious pasta dish with succulent shrimp and a flavorful garlic sauce.",
    "image": "/images/recipes/garlic-shrimp-pasta.jpg",
    "cookingTime": "25 minutes",
    "timeCategory": "Under 30 mins",
    "difficulty": "Easy",
    "serves": "4",
    "category": "Main Course",
    "slug": "garlic-shrimp-pasta",
    "featured": true,
    "rating": 4.8,
    "totalRatings": 128,
    "ingredients": [
      "400g linguine pasta",
      "500g large shrimp, peeled and deveined",
      "6 cloves garlic, minced",
      "1/4 cup olive oil",
      "1/4 cup butter",
      "1/2 cup white wine",
      "1 lemon, juiced",
      "1/4 cup fresh parsley, chopped",
      "Salt and pepper to taste",
      "Red pepper flakes (optional)"
    ],
    "method": [
      "Bring a large pot of salted water to boil for pasta",
      "Cook pasta according to package instructions. Reserve 1 cup pasta water",
      "Meanwhile, heat olive oil and butter in a large skillet over medium heat",
      "Add garlic and cook until fragrant, about 1 minute",
      "Add shrimp and cook until pink, about 3-4 minutes per side",
      "Add white wine and lemon juice, simmer for 2 minutes",
      "Add cooked pasta and toss to combine. Add pasta water if needed",
      "Season with salt, pepper, and red pepper flakes",
      "Garnish with parsley and serve immediately"
    ],
    "tips": [
      "Don't overcook the shrimp - they should be just pink",
      "Save some pasta water - it helps create a silky sauce",
      "Use fresh garlic for the best flavor",
      "Have all ingredients ready before starting - this dish comes together quickly"
    ],
    "nutritionInfo": {
      "calories": "450",
      "protein": "28g",
      "carbs": "52g",
      "fat": "15g"
    },
    "dietaryPreferences": [
      "None"
    ],
    "season": "All",
    "reviews": [],
    "prepTime": "10 mins",
    "totalTime": "25 mins"
  },
  "chocolate-cake": {
    "title": "Chocolate Cake",
    "description": "A rich, moist, and decadent chocolate cake that's perfect for any celebration or when you just need something sweet.",
    "image": "/images/recipes/chocolate-cake.jpg",
    "cookingTime": "45 minutes",
    "timeCategory": "30-60 mins",
    "difficulty": "Medium",
    "serves": "8-10",
    "category": "Desserts",
    "slug": "chocolate-cake",
    "featured": true,
    "rating": 4.9,
    "totalRatings": 256,
    "ingredients": [
      "2 cups all-purpose flour",
      "2 cups sugar",
      "3/4 cup unsweetened cocoa powder",
      "2 teaspoons baking soda",
      "1 teaspoon salt",
      "2 eggs",
      "1 cup milk",
      "1/2 cup vegetable oil",
      "2 teaspoons vanilla extract",
      "1 cup hot coffee",
      "Chocolate frosting ingredients",
      "1 cup butter, softened",
      "4 cups powdered sugar",
      "3/4 cup cocoa powder",
      "1/4 cup milk",
      "1 teaspoon vanilla extract"
    ],
    "method": [
      "Preheat oven to 350°F (175°C). Grease and flour two 9-inch cake pans",
      "In a large bowl, combine flour, sugar, cocoa, baking soda, and salt",
      "Add eggs, milk, oil, and vanilla. Mix well with an electric mixer",
      "Stir in hot coffee until well blended. Batter will be thin",
      "Pour into prepared pans",
      "Bake for 30-35 minutes until a toothpick comes out clean",
      "Cool in pans for 10 minutes, then remove to wire racks",
      "For frosting: Beat butter until creamy",
      "Gradually mix in powdered sugar, cocoa, milk, and vanilla",
      "Beat until smooth and spreadable",
      "Once cakes are completely cool, frost between layers and all over",
      "Decorate as desired"
    ],
    "tips": [
      "Don't skip the hot coffee - it enhances the chocolate flavor",
      "Let the cakes cool completely before frosting",
      "Room temperature ingredients work best",
      "For extra richness, add a layer of ganache between the cake layers"
    ],
    "nutritionInfo": {
      "calories": "380",
      "protein": "5g",
      "carbs": "58g",
      "fat": "16g"
    },
    "dietaryPreferences": [
      "Vegetarian"
    ],
    "season": "All",
    "reviews": [],
    "prepTime": "15 mins",
    "totalTime": "60 mins"
  },
  "butter-chicken": {
    "title": "Authentic Butter Chicken",
    "description": "A rich and creamy North Indian curry made with tender chicken pieces in a tomato-based sauce, finished with butter and cream. This restaurant-style dish is a crowd favorite!",
    "image": "/images/recipes/butter-chicken.jpg",
    "cookingTime": "45 minutes",
    "prepTime": "40 minutes",
    "totalTime": "85 minutes",
    "timeCategory": "30-60 mins",
    "difficulty": "Medium",
    "serves": "4",
    "category": "Indian",
    "slug": "butter-chicken",
    "featured": true,
    "rating": 4.9,
    "totalRatings": 328,
    "ingredients": [
      "800g chicken thighs, boneless and skinless",
      "2 cups tomato puree",
      "1 cup heavy cream",
      "100g butter",
      "2 onions, finely chopped",
      "2 tbsp ginger-garlic paste",
      "2 tbsp tandoori masala",
      "2 tsp garam masala",
      "2 tsp kashmiri red chili powder",
      "1 tsp turmeric powder",
      "Salt to taste",
      "Kasuri methi (dried fenugreek leaves)",
      "Fresh coriander for garnish"
    ],
    "method": [
      "Marinate chicken with yogurt, ginger-garlic paste, and tandoori masala for 30 minutes",
      "Sauté onions until golden, add tomato puree and spices, cook until oil separates",
      "Add marinated chicken to the gravy, cook until tender",
      "Finish with cream, butter, and kasuri methi, garnish with cream and coriander"
    ],
    "tips": [
      "Use Kashmiri red chili powder for the vibrant color without excessive heat",
      "Let the chicken marinate overnight for best results",
      "Don't skip the kasuri methi - it adds authentic flavor",
      "Use good quality butter for the best taste"
    ],
    "nutritionInfo": {
      "calories": "650kcal",
      "protein": "45g",
      "carbs": "12g",
      "fat": "48g"
    },
    "dietaryPreferences": [
      "Gluten-free"
    ],
    "season": "All",
    "reviews": []
  },
  "dal-makhani": {
    "title": "Dal Makhani",
    "description": "A rich and creamy black lentil dish slow-cooked to perfection. This iconic Punjabi dish is known for its luxurious texture and deep, complex flavors.",
    "image": "/images/recipes/dal-makhani.jpg",
    "cookingTime": "6 hours",
    "prepTime": "8 hours",
    "totalTime": "14 hours",
    "timeCategory": "Over 60 mins",
    "difficulty": "Medium",
    "serves": "6",
    "category": "Indian",
    "slug": "dal-makhani",
    "featured": false,
    "rating": 4.8,
    "totalRatings": 5,
    "ingredients": [
      "2 cups whole black lentils (urad dal)",
      "1/2 cup red kidney beans (rajma)",
      "1/2 cup butter",
      "2 onions, finely chopped",
      "4 tomatoes, pureed",
      "2 tbsp ginger-garlic paste",
      "2 tsp cumin seeds",
      "2 tsp garam masala",
      "1 tsp red chili powder",
      "1 cup heavy cream",
      "Salt to taste",
      "Fresh coriander for garnish",
      "2 green chilies, slit"
    ],
    "method": [
      "Soak black lentils and kidney beans overnight or for at least 8 hours",
      "Pressure cook the soaked lentils and beans with salt until soft and mushy",
      "Sauté cumin seeds, onions, and ginger-garlic paste until golden, add tomato puree and spices",
      "Add cooked lentils, simmer on low heat, add cream and butter in the last 30 minutes"
    ],
    "tips": [
      "The longer you cook, the better the taste - traditional recipes cook for 24 hours",
      "Mash some lentils while cooking for a creamier texture",
      "Add cream gradually while stirring to prevent curdling",
      "Finish with a dollop of butter for restaurant-style presentation"
    ],
    "nutritionInfo": {
      "calories": "450kcal",
      "protein": "18g",
      "carbs": "52g",
      "fat": "22g"
    },
    "dietaryPreferences": [
      "Vegetarian"
    ],
    "season": "All",
    "reviews": [
      {
        "userId": "user1",
        "rating": 5,
        "comment": "This dal makhani recipe is a game-changer! The flavors are so rich and deep, and the texture is creamy and smooth. I've made it multiple times and it's always a hit with my family and friends.",
        "date": "2022-01-01"
      },
      {
        "userId": "user2",
        "rating": 4,
        "comment": "I was a bit skeptical about the long cooking time, but trust me, it's worth it! The dal makhani is so flavorful and comforting. I added some extra spices to give it a bit more kick.",
        "date": "2022-02-01"
      },
      {
        "userId": "user3",
        "rating": 5,
        "comment": "This recipe is a staple in our household now! We make it every week and it's always a hit. The best part is that it's so easy to make and the ingredients are readily available.",
        "date": "2022-03-01"
      },
      {
        "userId": "user4",
        "rating": 4,
        "comment": "I'm not a big fan of lentils, but this recipe converted me! The dal makhani is so creamy and delicious, and the flavors are amazing. I added some extra cream to make it even richer.",
        "date": "2022-04-01"
      },
      {
        "userId": "user5",
        "rating": 5,
        "comment": "This recipe is a must-try for anyone who loves Indian food! The dal makhani is so authentic and flavorful, and the instructions are easy to follow. I've made it multiple times and it's always a hit.",
        "date": "2022-05-01"
      }
    ]
  },
  "vegetable-biryani": {
    "title": "Vegetable Biryani",
    "description": "A fragrant and flavorful layered rice dish packed with mixed vegetables, aromatic spices, and fresh herbs. This royal dish is perfect for special occasions!",
    "image": "/images/recipes/veg-biryani.jpg",
    "cookingTime": "60 minutes",
    "prepTime": "30 minutes",
    "totalTime": "90 minutes",
    "timeCategory": "30-60 mins",
    "difficulty": "Medium",
    "serves": "6",
    "category": "Indian",
    "slug": "vegetable-biryani",
    "featured": false,
    "rating": 4.7,
    "totalRatings": 189,
    "ingredients": [
      "3 cups Basmati rice",
      "Mixed vegetables (carrots, peas, potatoes, cauliflower)",
      "2 onions, thinly sliced",
      "3 tomatoes, chopped",
      "1/2 cup yogurt",
      "4 tbsp ghee",
      "2 tbsp ginger-garlic paste",
      "2 tsp biryani masala",
      "1 tsp turmeric powder",
      "2 tsp red chili powder",
      "4-5 green cardamoms",
      "2 black cardamoms",
      "4-5 cloves",
      "2 cinnamon sticks",
      "2 bay leaves",
      "Saffron strands soaked in milk",
      "Fresh mint and coriander leaves",
      "Fried onions for garnish"
    ],
    "method": [
      "Soak Basmati rice for 30 minutes, cook with whole spices until 70% done",
      "Sauté vegetables with spices and yogurt until partially cooked",
      "Layer rice and vegetables alternatively, top with saffron milk and herbs",
      "Seal and cook on low heat (dum) for perfect integration of flavors"
    ],
    "tips": [
      "Always use good quality aged Basmati rice",
      "Don't overcook the rice in the first stage",
      "Let the biryani rest for 10 minutes before opening",
      "Use fresh whole spices for the best aroma"
    ],
    "nutritionInfo": {
      "calories": "380kcal",
      "protein": "8g",
      "carbs": "65g",
      "fat": "12g"
    },
    "dietaryPreferences": [
      "Vegetarian"
    ],
    "season": "All",
    "reviews": []
  },
  "katori-chaat": {
    "title": "Katori Chaat",
    "description": "A delicious Indian street food snack featuring crispy fried dough cups filled with spiced potatoes, chickpeas, yogurt, and chutneys.",
    "image": "https://i0.wp.com/aillycorner.com/wp-content/uploads/2024/04/katori-chaat.png?w=612&ssl=1",
    "cookingTime": "75 minutes",
    "timeCategory": "Over 60 mins",
    "difficulty": "Medium",
    "serves": "2",
    "category": "Salads",
    "slug": "katori-chaat",
    "featured": false,
    "ingredients": [
      "kesjfk sjdh ksdjgh ",
      "ldsig osdigh osugh ",
      "ljd hgksdj ghksdjgh lsdfjg",
      " jsdngksdfj gskdfjgbn sfkdlj",
      "l dhgksdugh ksfjgn ksfjgn"
    ],
    "method": [
      "dkfjsdfjsdlkfja d fkjsdlk sdg ",
      "ldsifj skdljgh dokg jsldkgmjs",
      " slkjg sdkjgskdjgn sdkjgnsd fjkgv",
      "dpko sg skfjgn ksfj"
    ],
    "tips": [
      "kdjfkdg",
      "dgdg",
      "dgdd",
      "g",
      "dg",
      "d"
    ],
    "nutritionInfo": {
      "calories": "25",
      "protein": "2552",
      "carbs": "25",
      "fat": "252"
    },
    "dietaryPreferences": [
      "Vegetarian",
      "Vegan"
    ],
    "season": "All",
    "reviews": [],
    "prepTime": "20 minutes",
    "totalTime": "95 minutes"
  },
  "basket-chaat": {
    "title": "Basket Chaat",
    "description": "A rich and creamy black lentil dish slow-cooked to perfection. This iconic Punjabi dish is known for its luxurious texture and deep, complex flavors.",
    "image": "/images/recipes/dal-makhani.jpg",
    "cookingTime": "6 hours minutes",
    "timeCategory": "Under 30 mins",
    "difficulty": "Easy",
    "serves": "2",
    "category": "Breakfast",
    "slug": "basket-chaat",
    "featured": false,
    "ingredients": [
      "2 cups whole black lentils (urad dal)",
      "1/2 cup red kidney beans (rajma)",
      "1/2 cup butter",
      "2 onions, finely chopped",
      "4 tomatoes, pureed",
      "2 tbsp ginger-garlic paste",
      "2 tsp cumin seeds",
      "2 tsp garam masala",
      "1 tsp red chili powder",
      "1 cup heavy cream",
      "Salt to taste",
      "Fresh coriander for garnish",
      "2 green chilies, slit"
    ],
    "method": [
      "Soak black lentils and kidney beans overnight or for at least 8 hours",
      "Pressure cook the soaked lentils and beans with salt until soft and mushy",
      "Sauté cumin seeds, onions, and ginger-garlic paste until golden, add tomato puree and spices",
      "Add cooked lentils, simmer on low heat, add cream and butter in the last 30 minutes"
    ],
    "tips": [
      "The longer you cook, the better the taste - traditional recipes cook for 24 hours",
      "Mash some lentils while cooking for a creamier texture",
      "Add cream gradually while stirring to prevent curdling",
      "Finish with a dollop of butter for restaurant-style presentation"
    ],
    "nutritionInfo": {
      "calories": "450",
      "protein": "10",
      "carbs": "52",
      "fat": "22"
    },
    "dietaryPreferences": [
      "Vegetarian",
      "Vegan",
      "Gluten-free"
    ],
    "season": "Winter",
    "reviews": [],
    "prepTime": "8 hours minutes",
    "totalTime": "6 hours"
  }
};

// User-related types and data
export interface UserNote {
  recipeSlug: string;
  note: string;
  date: string;
}

export interface UserPreferences {
  userId: string;
  favoriteRecipes: string[];
  dietaryPreferences: DietaryPreference[];
  notes: UserNote[];
}
