export interface Recipe {
    id: string;
    title: string;
    description: string;
    benefits: string[];
    ingredients: string[];
    steps: string[];
}

export interface NutritionSection {
    category: string;
    foods: string[];
    icon: string;
}

export const CHEMO_FOODS: Record<'help' | 'avoid', NutritionSection[]> = {
    help: [
        {
            category: 'Bland Carbohydrates',
            foods: ['Toast', 'Crackers', 'Rice', 'Noodles', 'Bananas', 'Applesauce', 'Oatmeal', 'Cream of Wheat'],
            icon: '🍞'
        },
        {
            category: 'Soothing Options',
            foods: ['Clear broths', 'Ginger tea', 'Popsicles', 'Smoothies', 'Room-temp foods'],
            icon: '🥣'
        },
        {
            category: 'Nausea Fighters',
            foods: ['Ginger candies', 'Peppermint', 'Lemon water', 'Saltine crackers'],
            icon: '🍋'
        }
    ],
    avoid: [
        {
            category: 'Strong Smells',
            foods: ['Fried fish', 'Eggs', 'Bacon', 'Sausage', 'Garlic-heavy dishes'],
            icon: '🍳'
        },
        {
            category: 'High-Fat / Greasy',
            foods: ['Fast food', 'Pizza', 'Fries', 'Creamy sauces', 'Gravies'],
            icon: '🍕'
        },
        {
            category: 'Spicy / Acidic',
            foods: ['Hot sauce', 'Curry', 'Chili', 'Citrus fruits', 'Tomato sauce'],
            icon: '🌶️'
        }
    ]
};

export const CHEMO_RECIPES: Recipe[] = [
    {
        id: 'ginger-smoothie',
        title: 'Anti-Nausea Ginger Smoothie',
        description: 'A cold, soothing blend that calms the stomach while providing hydration.',
        benefits: ['Fights Nausea', 'Easy to swallow', 'Hydrating'],
        ingredients: ['1/2 inch fresh ginger, peeled', '1 cup frozen mango', '1/2 cup coconut water', '1 small banana'],
        steps: [
            'Place all ingredients into a high-speed blender.',
            'Blend until completely smooth.',
            'Sip slowly through a straw to minimize smells if nausea is high.'
        ]
    },
    {
        id: 'bone-broth-rice',
        title: 'Healing Bone Broth Rice',
        description: 'A gentle, high-protein meal that is extremely easy on the digestive tract.',
        benefits: ['Gentle on stomach', 'High protein', 'Warm & comforting'],
        ingredients: ['1 cup white rice', '2 cups chicken or beef bone broth', 'Pinch of salt'],
        steps: [
            'Rinse the rice under cold water.',
            'Bring the bone broth to a boil in a medium pot.',
            'Add rice and salt, cover, and simmer for 15-18 minutes.',
            'Let it sit for 5 minutes before fluffing with a fork.'
        ]
    }
];

export const ONCOLOGY_TIPS = [
    'Eat small, frequent meals rather than 3 large ones.',
    'Eat before you get too hungry; hunger can make nausea worse.',
    'Rinse your mouth with water and baking soda before eating to refresh taste.',
    'Let someone else cook to avoid food smells if they trigger nausea.',
    'Eat slowly and chew your food well.',
    'Sit upright for at least 30-60 minutes after eating.'
];
