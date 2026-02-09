import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Dimensions, TextInput, FlatList } from 'react-native';
import { ChevronLeft, Info, Search, Utensils, AlertCircle, CheckCircle2, XCircle, Heart, ChefHat, Sparkles, Filter, MoreHorizontal } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { Card } from '../../src/components/ui/Card';
import { CHEMO_FOODS, CHEMO_RECIPES, ONCOLOGY_TIPS, Recipe } from '../../src/data/nutritionData';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInRight, Layout } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function ChemoNutritionScreen() {
    const router = useRouter();
    const [symptom, setSymptom] = useState('');
    const [recommendations, setRecommendations] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<'guide' | 'recipes' | 'planner'>('guide');

    const handlePlan = () => {
        const s = symptom.toLowerCase();
        let recs: string[] = [];
        if (s.includes('nausea') || s.includes('sick')) {
            recs = ['Ginger tea', 'Saltine crackers', 'Applesauce', 'Popsicles'];
        } else if (s.includes('fatigue') || s.includes('tired')) {
            recs = ['Peanut butter toast', 'Greek yogurt', 'Smoothies', 'Oatmeal'];
        } else if (s.includes('sore') || s.includes('mouth')) {
            recs = ['Mashed potatoes', 'Scrambled eggs', 'Puddings', 'Milkshakes (avoid citrus)'];
        } else {
            recs = ['Bland carbohydrates (Rice, Toast)', 'Clear broths', 'Avoid strong smells'];
        }
        setRecommendations(recs);
    };

    return (
        <ScreenContainer hasWave={false} darkStatus={false} withPadding={false} fullScreen={true} className="bg-black">
            <LinearGradient colors={['#0F172A', '#000000']} style={StyleSheet.absoluteFill} />

            <View className="px-6 pt-12 pb-6 flex-row items-center justify-between">
                <Pressable onPress={() => router.back()} className="bg-white/10 w-12 h-12 rounded-2xl items-center justify-center border border-white/20">
                    <ChevronLeft size={24} color="white" />
                </Pressable>
                <Text className="text-white font-black uppercase tracking-[3px] text-xs">Oncology Nutrition</Text>
                <Pressable className="bg-white/5 w-12 h-12 rounded-2xl items-center justify-center border border-white/10">
                    <Heart size={20} color="rgba(255,255,255,0.4)" />
                </Pressable>
            </View>

            {/* Tabs */}
            <View className="flex-row px-8 mb-8 gap-2">
                {['guide', 'planner', 'recipes'].map((tab) => (
                    <Pressable
                        key={tab}
                        onPress={() => setActiveTab(tab as any)}
                        className={`px-5 py-2.5 rounded-full border ${activeTab === tab ? 'bg-nxtcure-primary border-nxtcure-primary' : 'bg-white/5 border-white/10'}`}
                    >
                        <Text className={`text-[10px] font-black uppercase tracking-widest ${activeTab === tab ? 'text-white' : 'text-white/40'}`}>
                            {tab}
                        </Text>
                    </Pressable>
                ))}
            </View>

            <ScrollView className="flex-1 px-8" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                {activeTab === 'guide' && (
                    <Animated.View entering={FadeInDown.duration(800)}>
                        <Text className="text-white/40 text-[10px] font-black uppercase tracking-[5px] mb-4">FOOD PROTOCOL</Text>
                        <Text className="text-white text-4xl font-black tracking-tighter mb-10 leading-[45px]">
                            Nutrition is{'\n'}Treatment.
                        </Text>

                        {/* HELPFUL SECTION */}
                        <View className="flex-row items-center mb-6">
                            <CheckCircle2 size={18} color="#1DD1A1" className="mr-3" />
                            <Text className="text-white font-black text-xl">Helpful (Green Light)</Text>
                        </View>
                        {CHEMO_FOODS.help.map((section, idx) => (
                            <Card key={idx} className="bg-white/5 border-white/10 p-6 rounded-[32px] mb-6">
                                <View className="flex-row items-center mb-4">
                                    <View className="bg-nxtcure-primary/20 w-10 h-10 rounded-xl items-center justify-center mr-4">
                                        <Text className="text-2xl">{section.icon}</Text>
                                    </View>
                                    <Text className="text-white font-bold text-lg">{section.category}</Text>
                                </View>
                                <View className="flex-row flex-wrap gap-2">
                                    {section.foods.map((food, fIdx) => (
                                        <View key={fIdx} className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/5">
                                            <Text className="text-white/60 text-xs font-medium">{food}</Text>
                                        </View>
                                    ))}
                                </View>
                            </Card>
                        ))}

                        {/* AVOID SECTION */}
                        <View className="flex-row items-center mb-6 mt-8">
                            <XCircle size={18} color="#EB3B5A" className="mr-3" />
                            <Text className="text-white font-black text-xl">Avoid (Red Light)</Text>
                        </View>
                        {CHEMO_FOODS.avoid.map((section, idx) => (
                            <Card key={idx} className="bg-white/5 border-white/10 p-6 rounded-[32px] mb-6">
                                <View className="flex-row items-center mb-4">
                                    <View className="bg-red-500/10 w-10 h-10 rounded-xl items-center justify-center mr-4">
                                        <Text className="text-2xl">{section.icon}</Text>
                                    </View>
                                    <Text className="text-white font-bold text-lg">{section.category}</Text>
                                </View>
                                <View className="flex-row flex-wrap gap-2">
                                    {section.foods.map((food, fIdx) => (
                                        <View key={fIdx} className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/5">
                                            <Text className="text-white/40 text-xs font-medium">{food}</Text>
                                        </View>
                                    ))}
                                </View>
                            </Card>
                        ))}

                        {/* TIPS SECTION */}
                        <Text className="text-white/40 text-[10px] font-black uppercase tracking-[5px] mt-12 mb-6">Eating Strategies</Text>
                        {ONCOLOGY_TIPS.map((tip, idx) => (
                            <View key={idx} className="flex-row items-start mb-5">
                                <Sparkles size={16} color="#F7B731" className="mr-4 mt-1" />
                                <Text className="flex-1 text-white/60 text-sm leading-6 font-medium">{tip}</Text>
                            </View>
                        ))}
                    </Animated.View>
                )}

                {activeTab === 'planner' && (
                    <Animated.View entering={FadeInRight.duration(600)}>
                        <Text className="text-white/40 text-[10px] font-black uppercase tracking-[5px] mb-4">SMART PLANNER</Text>
                        <Text className="text-white text-3xl font-black mb-8">How are you feeling?</Text>

                        <Card className="bg-white/5 border-white/10 p-6 rounded-[32px] mb-6">
                            <TextInput
                                placeholder="e.g., 'Feeling nauseous after Cycle 1'"
                                placeholderTextColor="rgba(255,255,255,0.2)"
                                className="text-white text-lg font-medium"
                                value={symptom}
                                onChangeText={setSymptom}
                                onSubmitEditing={handlePlan}
                            />
                        </Card>

                        <Pressable
                            onPress={handlePlan}
                            className="bg-nxtcure-primary h-16 rounded-[24px] items-center justify-center mb-10 shadow-lg shadow-nxtcure-primary/20"
                        >
                            <Text className="text-white font-black uppercase tracking-widest">Generate Recommendations</Text>
                        </Pressable>

                        {recommendations.length > 0 && (
                            <Animated.View entering={FadeInDown.duration(600)}>
                                <Text className="text-white/40 text-[10px] font-black uppercase tracking-[5px] mb-6">OPTIMIZED PROTOCOL</Text>
                                {recommendations.map((rec, i) => (
                                    <Card key={i} className="bg-white/5 border-white/10 p-5 rounded-3xl mb-4 flex-row items-center border-l-4 border-l-nxtcure-primary">
                                        <View className="bg-nxtcure-primary/20 w-8 h-8 rounded-full items-center justify-center mr-4">
                                            <CheckCircle2 size={16} color="#1DD1A1" />
                                        </View>
                                        <Text className="text-white font-bold text-base">{rec}</Text>
                                    </Card>
                                ))}
                                <View className="mt-6 bg-red-500/5 p-5 rounded-3xl border border-red-500/20 flex-row items-start">
                                    <AlertCircle size={18} color="#EB3B5A" className="mr-3 mt-1" />
                                    <View className="flex-1">
                                        <Text className="text-red-400 font-bold text-xs uppercase mb-1">Stay Hydrated</Text>
                                        <Text className="text-white/40 text-[10px] leading-4">If you cannot keep down liquids for more than 24 hours, call your oncology clinic immediately.</Text>
                                    </View>
                                </View>
                            </Animated.View>
                        )}
                    </Animated.View>
                )}

                {activeTab === 'recipes' && (
                    <Animated.View entering={FadeInDown.duration(600)}>
                        <Text className="text-white/40 text-[10px] font-black uppercase tracking-[5px] mb-4">RECIPE DATABASE</Text>
                        <Text className="text-white text-3xl font-black mb-8 leading-[40px]">Easy-to-Digest{'\n'}Meals.</Text>

                        {CHEMO_RECIPES.map((recipe) => (
                            <Card key={recipe.id} className="bg-white/5 border-white/10 p-8 rounded-[40px] mb-8 overflow-hidden">
                                <View className="flex-row justify-between items-start mb-6">
                                    <View className="flex-1 mr-4">
                                        <Text className="text-white font-black text-2xl mb-2">{recipe.title}</Text>
                                        <Text className="text-white/40 text-xs leading-5">{recipe.description}</Text>
                                    </View>
                                    <View className="bg-nxtcure-primary/20 p-4 rounded-3xl">
                                        <ChefHat size={24} color="#1DD1A1" />
                                    </View>
                                </View>

                                <View className="flex-row flex-wrap gap-2 mb-8">
                                    {recipe.benefits.map((benefit, i) => (
                                        <View key={i} className="bg-nxtcure-primary/10 px-3 py-1.5 rounded-xl border border-nxtcure-primary/20">
                                            <Text className="text-nxtcure-primary font-black text-[9px] uppercase tracking-widest">{benefit}</Text>
                                        </View>
                                    ))}
                                </View>

                                <Text className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-4">Ingredients</Text>
                                <View className="mb-8">
                                    {recipe.ingredients.map((ing, i) => (
                                        <View key={i} className="flex-row items-center mb-3">
                                            <View className="w-1.5 h-1.5 rounded-full bg-white/20 mr-3" />
                                            <Text className="text-white/60 text-sm font-medium">{ing}</Text>
                                        </View>
                                    ))}
                                </View>

                                <Pressable className="bg-white/10 h-14 rounded-2xl flex-row items-center justify-center">
                                    <Text className="text-white font-black uppercase tracking-widest text-xs">View Full Steps</Text>
                                    <ArrowRight size={16} color="white" className="ml-3" opacity={0.6} />
                                </Pressable>
                            </Card>
                        ))}
                    </Animated.View>
                )}
            </ScrollView>
        </ScreenContainer>
    );
}

function ArrowRight({ size, color, className, opacity }: any) {
    return <MoreHorizontal size={size} color={color} className={className} style={{ opacity }} />;
}

const styles = StyleSheet.create({});
