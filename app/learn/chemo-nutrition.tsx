import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { ChevronLeft, Info, Apple, Soup, Coffee, AlertCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { Card } from '../../src/components/ui/Card';

const GUIDE_SECTIONS = [
    {
        title: 'Neutropenic Protocol',
        items: ['Fully cooked meats & eggs', 'Pasteurized dairy', 'Thick-skinned fruit (bananas, oranges)', 'Bottled or filtered water'],
        avoid: ['Raw fish (Sushi)', 'Soft cheeses (Brie/Blue)', 'Unwashed raw produce', 'Tap water in unknown areas'],
        icon: '🛡️'
    },
    {
        title: 'Muscle Synthesis',
        items: ['Whey or Soy protein shakes', 'Greek yogurt', 'Chicken or Tofu', 'Lean beans/lentils'],
        avoid: ['Sugar-only snacks', 'Long fasts', 'Alcohol-based tonics'],
        icon: '💪'
    },
    {
        title: 'For Nausea',
        items: ['Ginger tea', 'Dry toast or crackers', 'Bland carbs (rice, pasta)', 'Cold foods (less aroma)'],
        avoid: ['Spicy foods', 'Greasy/Fried foods', 'Strong smelling foods'],
        icon: '🤢'
    },
    {
        title: 'For Fatigue',
        items: ['Small, frequent meals', 'High protein snacks', 'Hydration (water/broth)', 'Nut-rich foods'],
        avoid: ['Caffeine (late day)', 'Sugary crashes', 'Large heavy meals'],
        icon: '🥱'
    },
    {
        title: 'For Mouth Sores',
        items: ['Soft foods (mashed potatoes)', 'Puréed soups', 'Yogurt', 'Custard'],
        avoid: ['Acidic fruits (lemon/orange)', 'Spicy seasoning', 'Crunchy/Sharp foods'],
        icon: '👄'
    }
];

export default function ChemoNutritionScreen() {
    const router = useRouter();

    return (
        <ScreenContainer className="bg-white" withPadding={false}>
            <View className="px-6 py-4 flex-row items-center border-b border-slate-50">
                <Pressable onPress={() => router.back()} className="p-2 -ml-2">
                    <ChevronLeft size={24} color="#2d3436" />
                </Pressable>
                <Text className="text-xl font-bold text-nxtcure-text ml-2">Chemo Nutrition Guide</Text>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="p-6">
                    <View className="bg-red-50 p-6 rounded-3xl mb-8 border border-red-100 items-center">
                        <Soup size={40} color="#ef4444" className="mb-4" />
                        <Text className="text-xl font-bold text-red-700 text-center mb-2">Eating during Treatment</Text>
                        <Text className="text-red-900/60 text-center text-sm leading-5">
                            Focus on getting enough calories and protein to help your body heal. Don't worry about "perfect" nutrition; focus on what stays down.
                        </Text>
                    </View>

                    {GUIDE_SECTIONS.map((section, i) => (
                        <View key={i} className="mb-8">
                            <View className="flex-row items-center mb-4">
                                <Text className="text-2xl mr-3">{section.icon}</Text>
                                <Text className="text-xl font-bold text-nxtcure-text">{section.title}</Text>
                            </View>

                            <Card className="mb-4 border-l-4 border-l-nxtcure-primary bg-nxtcure-primary/5">
                                <Text className="font-bold text-nxtcure-text mb-3">✅ Recommended:</Text>
                                {section.items.map((item, j) => (
                                    <Text key={j} className="text-nxtcure-text/80 mb-2 leading-5 tracking-tight">• {item}</Text>
                                ))}
                            </Card>

                            <Card className="border-l-4 border-l-red-400 bg-red-50/50">
                                <Text className="font-bold text-red-700 mb-3">❌ Avoid:</Text>
                                {section.avoid.map((item, j) => (
                                    <Text key={j} className="text-red-900/60 mb-1 leading-5">• {item}</Text>
                                ))}
                            </Card>
                        </View>
                    ))}

                    <View className="bg-blue-50 p-6 rounded-3xl flex-row items-start mb-10">
                        <Info size={20} color="#45aaf2" className="mt-1" />
                        <View className="ml-4 flex-1">
                            <Text className="font-bold text-blue-800 mb-1">Medical Disclaimer</Text>
                            <Text className="text-blue-900/60 text-xs leading-4">
                                This guide provides general nutritional advice. Always follow the specific diet plan provided by your oncologist or clinical dietitian.
                            </Text>
                        </View>
                    </View>
                </View>
                <View className="h-20" />
            </ScrollView>
        </ScreenContainer>
    );
}
