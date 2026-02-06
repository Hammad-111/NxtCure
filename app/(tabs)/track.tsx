import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Check, Info, AlertCircle, CigaretteOff, WineOff, Sun, Activity as ExerciseIcon, ShieldCheck } from 'lucide-react-native';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { Card } from '../../src/components/ui/Card';
import { useDietStore, DailyLog } from '../../src/store/dietStore';
import { useLifestyleStore } from '../../src/store/lifestyleStore';
import { useRiskStore } from '../../src/store/riskStore';

const DIET_ITEMS: { id: keyof DailyLog; label: string; icon: string; penalty?: boolean }[] = [
    { id: 'oliveOil', label: 'Olive Oil (primary fat)', icon: '🫒' },
    { id: 'vegetables', label: 'Vegetables (>= 2 servings)', icon: '🥗' },
    { id: 'fruit', label: 'Fruit (>= 2 servings)', icon: '🍎' },
    { id: 'nuts', label: 'Nuts (handful)', icon: '🥜' },
    { id: 'wholeGrains', label: 'Whole Grains', icon: '🌾' },
    { id: 'fish', label: 'Fish / Seafood', icon: '🐟' },
    { id: 'legumes', label: 'Legumes / Beans', icon: '🫘' },
    { id: 'redMeat', label: 'Red Meat', icon: '🥩', penalty: true },
    { id: 'processedMeat', label: 'Processed Meat', icon: '🥓', penalty: true },
    { id: 'soda', label: 'Sugary Drinks / Soda', icon: '🥤', penalty: true },
];

export default function TrackScreen() {
    const today = new Date().toISOString().split('T')[0];
    const { logs: dietLogs, toggleItem, getScore: getDietScore } = useDietStore();
    const { logs: lifestyleLogs, toggleHabit, setExercise, getConsistencyScore } = useLifestyleStore();

    const currentLog = dietLogs[today] || {};
    const currentLifestyle = lifestyleLogs[today] || {
        smokingFree: true,
        alcoholFree: true,
        sunScreenApplied: false,
        carcinogenAwareness: false,
        exerciseMinutes: 0
    };

    const { calculateRisk } = useRiskStore();
    const dietScore = getDietScore(today);
    const lifestyleScore = getConsistencyScore(today);
    const { score: totalPreventionScore } = calculateRisk(dietScore, lifestyleScore);

    return (
        <ScreenContainer hasWave={true} waveVariant="compact" darkStatus={false} withPadding={false} className="bg-white">
            <View className="px-6 py-4 flex-row justify-between items-center">
                <View>
                    <Text className="text-2xl font-bold text-white">Prevention Hub</Text>
                    <Text className="text-white/80 text-xs font-medium uppercase tracking-wider">{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</Text>
                </View>
                <View className="w-16 h-16 bg-white/20 rounded-2xl items-center justify-center border border-white/30 backdrop-blur-md">
                    <Text className="text-white font-black text-2xl">{totalPreventionScore}</Text>
                    <Text className="text-[7px] text-white font-bold uppercase tracking-tighter">Daily Index</Text>
                </View>
            </View>

            <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 20 }}>
                {/* Lifestyle Vitals Section */}
                <View className="mb-8 px-2">
                    <View className="flex-row items-center mb-6">
                        <View className="w-1 h-6 bg-nxtcure-secondary rounded-full mr-3" />
                        <Text className="text-lg font-bold text-nxtcure-info flex-1">Lifestyle Vitals</Text>
                        <View className="bg-nxtcure-secondary/10 px-3 py-1 rounded-full">
                            <Text className="text-[10px] font-bold text-nxtcure-secondary uppercase">{lifestyleScore}% Complete</Text>
                        </View>
                    </View>

                    <View className="flex-row gap-3">
                        <Pressable
                            onPress={() => toggleHabit(today, 'smokingFree')}
                            className={`flex-1 p-4 rounded-3xl border ${currentLifestyle.smokingFree ? 'bg-nxtcure-primary/5 border-nxtcure-primary/20' : 'bg-red-50 border-red-200'} items-center`}
                        >
                            <CigaretteOff size={24} color={currentLifestyle.smokingFree ? '#0FB9B1' : '#FF4757'} />
                            <Text className={`text-[10px] font-bold mt-2 uppercase ${currentLifestyle.smokingFree ? 'text-nxtcure-primary' : 'text-red-500'}`}>
                                {currentLifestyle.smokingFree ? 'Smoke Free' : 'Did Smoke'}
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={() => toggleHabit(today, 'alcoholFree')}
                            className={`flex-1 p-4 rounded-3xl border ${currentLifestyle.alcoholFree ? 'bg-nxtcure-primary/5 border-nxtcure-primary/20' : 'bg-red-50 border-red-200'} items-center`}
                        >
                            <WineOff size={24} color={currentLifestyle.alcoholFree ? '#0FB9B1' : '#FF4757'} />
                            <Text className={`text-[10px] font-bold mt-2 uppercase ${currentLifestyle.alcoholFree ? 'text-nxtcure-primary' : 'text-red-500'}`}>
                                {currentLifestyle.alcoholFree ? 'Alcohol Free' : 'Consumed'}
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={() => toggleHabit(today, 'sunScreenApplied')}
                            className={`flex-1 p-4 rounded-3xl border ${currentLifestyle.sunScreenApplied ? 'bg-nxtcure-primary/5 border-nxtcure-primary/20' : 'bg-slate-50 border-transparent'} items-center`}
                        >
                            <Sun size={24} color={currentLifestyle.sunScreenApplied ? '#0FB9B1' : '#636E72'} />
                            <Text className={`text-[10px] font-bold mt-2 uppercase ${currentLifestyle.sunScreenApplied ? 'text-nxtcure-primary' : 'text-slate-400'}`}>
                                {currentLifestyle.sunScreenApplied ? 'Protected' : 'No SPF'}
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={() => toggleHabit(today, 'carcinogenAwareness')}
                            className={`flex-1 p-4 rounded-3xl border ${currentLifestyle.carcinogenAwareness ? 'bg-nxtcure-primary/5 border-nxtcure-primary/20' : 'bg-slate-50 border-transparent'} items-center`}
                        >
                            <ShieldCheck size={24} color={currentLifestyle.carcinogenAwareness ? '#0FB9B1' : '#636E72'} />
                            <Text className={`text-[10px] font-bold mt-2 uppercase ${currentLifestyle.carcinogenAwareness ? 'text-nxtcure-primary' : 'text-slate-400'}`}>
                                {currentLifestyle.carcinogenAwareness ? 'Aware' : 'Check IARC'}
                            </Text>
                        </Pressable>
                    </View>

                    <View className="flex-row gap-3 mt-3">
                        <Pressable
                            onPress={() => setExercise(today, currentLifestyle.exerciseMinutes >= 30 ? 0 : 30)}
                            className={`flex-1 p-4 rounded-3xl border ${currentLifestyle.exerciseMinutes >= 30 ? 'bg-nxtcure-primary/5 border-nxtcure-primary/20' : 'bg-slate-50 border-transparent'} items-center`}
                        >
                            <ExerciseIcon size={24} color={currentLifestyle.exerciseMinutes >= 30 ? '#0FB9B1' : '#636E72'} />
                            <Text className={`text-[10px] font-bold mt-2 uppercase ${currentLifestyle.exerciseMinutes >= 30 ? 'text-nxtcure-primary' : 'text-slate-400'}`}>
                                {currentLifestyle.exerciseMinutes >= 30 ? 'Active (30m+)' : 'Inactive'}
                            </Text>
                        </Pressable>
                        <View className="flex-1 opacity-0" />
                    </View>
                </View>

                <View className="mb-6 px-2">
                    <View className="flex-row items-center mb-6">
                        <View className="w-1 h-6 bg-nxtcure-primary rounded-full mr-3" />
                        <Text className="text-lg font-bold text-nxtcure-info flex-1">Mediterranean Log</Text>
                        <View className="bg-nxtcure-primary/10 px-3 py-1 rounded-full">
                            <Text className="text-[10px] font-bold text-nxtcure-primary uppercase">Score: {dietScore}</Text>
                        </View>
                    </View>

                    <View className="flex-row flex-wrap gap-3">
                        {DIET_ITEMS.map((item) => {
                            const isSelected = !!currentLog[item.id as keyof DailyLog];
                            const itemColor = item.penalty ? '#FF4757' : '#0FB9B1';

                            return (
                                <Pressable
                                    key={item.id}
                                    onPress={() => toggleItem(today, item.id)}
                                    style={{ width: '48%' }}
                                >
                                    <View className={`p-4 rounded-[24px] border border-slate-100 shadow-sm transition-all ${isSelected ? (item.penalty ? 'bg-red-50/50 border-red-100' : 'bg-nxtcure-primary/5 border-nxtcure-primary/20') : 'bg-white'}`}>
                                        <View className="flex-row justify-between items-start mb-3">
                                            <View className={`w-12 h-12 rounded-2xl items-center justify-center ${isSelected ? (item.penalty ? 'bg-red-100' : 'bg-nxtcure-primary/10') : 'bg-slate-50'}`}>
                                                <Text className="text-2xl">{item.icon}</Text>
                                            </View>
                                            <View className={`w-6 h-6 rounded-full border items-center justify-center ${isSelected ? (item.penalty ? 'bg-red-500 border-red-500' : 'bg-nxtcure-primary border-nxtcure-primary') : 'border-slate-200 bg-white'}`}>
                                                {isSelected && <Check size={12} color="white" strokeWidth={4} />}
                                            </View>
                                        </View>

                                        <Text className={`text-xs font-bold leading-4 h-8 ${isSelected ? 'text-nxtcure-info' : 'text-slate-500'}`} numberOfLines={2}>
                                            {item.label}
                                        </Text>

                                        {isSelected && (
                                            <View className="mt-2 flex-row items-center">
                                                <View className={`w-1.5 h-1.5 rounded-full mr-1 ${item.penalty ? 'bg-red-400' : 'bg-nxtcure-primary'}`} />
                                                <Text className={`text-[9px] font-bold uppercase ${item.penalty ? 'text-red-400' : 'text-nxtcure-primary'}`}>
                                                    {item.penalty ? 'Avoided' : 'Logged'}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                </Pressable>
                            );
                        })}
                    </View>
                </View>

                {/* Insight Card */}
                <View className="mx-2 mb-12">
                    <View className="bg-nxtcure-info p-6 rounded-[32px] overflow-hidden relative shadow-xl shadow-nxtcure-info/30">
                        {/* Decorative background element */}
                        <View className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />

                        <View className="flex-row items-center mb-4">
                            <View className="w-10 h-10 bg-white/10 rounded-xl items-center justify-center backdrop-blur-md">
                                <AlertCircle size={20} color="white" />
                            </View>
                            <Text className="ml-3 font-bold text-white text-base">Impact Strategy</Text>
                        </View>
                        <Text className="text-white/80 text-sm leading-6 font-medium">
                            The Mediterranean diet is high in antioxidants and anti-inflammatory compounds. Maintaining a <Text className="text-nxtcure-primary font-bold">score of 7+</Text> consistently reduces long-term cancer risk by up to 15%.
                        </Text>
                    </View>
                </View>

                <View className="h-20" />
            </ScrollView>
        </ScreenContainer>
    );
}

