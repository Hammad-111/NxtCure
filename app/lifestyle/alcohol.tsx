import React, { useMemo } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Dimensions } from 'react-native';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { Card } from '../../src/components/ui/Card';
import { useLifestyleStore } from '../../src/store/lifestyleStore';
import { ChevronLeft, Wine, Plus, Minus, AlertTriangle, TrendingDown, Info, ShieldCheck, GlassWater } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInRight, Layout } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function AlcoholReductionScreen() {
    const router = useRouter();
    const today = new Date().toISOString().split('T')[0];
    const { logs, logAlcohol, getWeeklyAlcoholTotal, sex } = useLifestyleStore();

    const currentUnits = logs[today]?.alcoholUnits || 0;
    const weeklyTotal = getWeeklyAlcoholTotal();

    // Clinical limits for cancer prevention (WCRF/AICR guidelines)
    const limit = sex === 'female' ? 7 : 14;
    const isOverLimit = weeklyTotal > limit;

    const handleUpdateUnits = (delta: number) => {
        const newUnits = Math.max(0, currentUnits + delta);
        logAlcohol(today, newUnits);
    };

    return (
        <ScreenContainer hasWave={false} darkStatus={false} withPadding={false} fullScreen={true} className="bg-black">
            <LinearGradient
                colors={['#2c1a32', '#000000']}
                style={StyleSheet.absoluteFill}
            />

            <View className="px-6 pt-12 pb-6 flex-row items-center justify-between">
                <Pressable onPress={() => router.back()} className="bg-white/10 w-12 h-12 rounded-2xl items-center justify-center border border-white/20 backdrop-blur-xl">
                    <ChevronLeft size={24} color="white" />
                </Pressable>
                <Text className="text-white font-black uppercase tracking-[3px] text-xs">Alcohol Protocol</Text>
                <View className="w-12 h-12" />
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}>
                {/* Hero Section */}
                <Animated.View entering={FadeInDown.duration(800)} className="mb-10 items-center">
                    <Text className="text-4xl font-black text-white text-center tracking-tighter mb-2">
                        Liquid Risk.
                    </Text>
                    <Text className="text-white/60 text-center font-medium mb-8">
                        Tracking standard drinks to minimize systemic inflammation and cancer risk.
                    </Text>

                    {/* Circular Units Control */}
                    <View className="items-center justify-center relative">
                        <View className="w-48 h-48 rounded-full border-4 border-white/10 items-center justify-center">
                            <Text className="text-white text-6xl font-black">{currentUnits}</Text>
                            <Text className="text-white/40 text-[10px] font-black uppercase tracking-widest">Units Today</Text>
                        </View>
                        <View className="absolute -bottom-4 flex-row gap-6">
                            <Pressable
                                onPress={() => handleUpdateUnits(-1)}
                                className="w-16 h-16 bg-white/10 rounded-2xl border border-white/20 items-center justify-center active:bg-white/20"
                            >
                                <Minus size={24} color="white" />
                            </Pressable>
                            <Pressable
                                onPress={() => handleUpdateUnits(1)}
                                className="w-16 h-16 bg-nxtcure-primary rounded-2xl items-center justify-center shadow-lg shadow-nxtcure-primary/20"
                            >
                                <Plus size={24} color="white" />
                            </Pressable>
                        </View>
                    </View>
                </Animated.View>

                {/* Weekly Synthesis */}
                <Animated.View entering={FadeInDown.delay(200)} className="mb-10">
                    <Text className="text-white/40 text-[10px] font-black uppercase tracking-[4px] mb-4">WEEKLY SYNTHESIS</Text>
                    <Card className="bg-white/5 border-white/10 p-6 rounded-[32px]">
                        <View className="flex-row items-center justify-between mb-6">
                            <View>
                                <Text className="text-white font-black text-2xl">{weeklyTotal}</Text>
                                <Text className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Logged Units</Text>
                            </View>
                            <View className="items-end">
                                <Text className={`${isOverLimit ? 'text-red-400' : 'text-nxtcure-primary'} font-black text-lg`}>{limit}</Text>
                                <Text className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Safe Threshold</Text>
                            </View>
                        </View>

                        {/* Progress Bar */}
                        <View className="h-2 bg-white/10 rounded-full overflow-hidden mb-6">
                            <View
                                style={{ width: `${Math.min(100, (weeklyTotal / limit) * 100)}%` }}
                                className={`h-full ${isOverLimit ? 'bg-red-500' : 'bg-nxtcure-primary'}`}
                            />
                        </View>

                        {isOverLimit ? (
                            <View className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl flex-row items-start">
                                <AlertTriangle size={18} color="#f87171" className="mr-3" />
                                <Text className="flex-1 text-red-400 text-xs font-medium leading-5">
                                    Clinical Warning: You have exceeded the safe weekly units for cancer prevention. Excessive ethanol metabolism elevates acetaldehyde levels.
                                </Text>
                            </View>
                        ) : (
                            <View className="bg-nxtcure-primary/10 border border-nxtcure-primary/30 p-4 rounded-2xl flex-row items-start">
                                <ShieldCheck size={18} color="#1DD1A1" className="mr-3" />
                                <Text className="flex-1 text-nxtcure-primary text-xs font-medium leading-5">
                                    Within safe clinical limits. Remember: for cancer prevention, lower is always better. Zero is the target.
                                </Text>
                            </View>
                        )}
                    </Card>
                </Animated.View>

                {/* Safe Alternatives */}
                <Animated.View entering={FadeInDown.delay(400)} className="mb-10">
                    <Text className="text-white/40 text-[10px] font-black uppercase tracking-[4px] mb-4">OPTIMAL ALTERNATIVES</Text>
                    <View className="gap-3">
                        <Card className="bg-white/5 border-white/10 p-5 rounded-[28px] flex-row items-center">
                            <View className="bg-blue-500/20 w-12 h-12 rounded-2xl items-center justify-center mr-4">
                                <GlassWater size={24} color="#45AAF2" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-white font-black text-base">Infused Electrolytes</Text>
                                <Text className="text-white/40 text-xs mt-0.5">Hydration without metabolic strain.</Text>
                            </View>
                        </Card>
                        <Card className="bg-white/5 border-white/10 p-5 rounded-[28px] flex-row items-center">
                            <View className="bg-nxtcure-primary/20 w-12 h-12 rounded-2xl items-center justify-center mr-4">
                                <TrendingDown size={24} color="#1DD1A1" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-white font-black text-base">Non-Alcoholic Adaptogens</Text>
                                <Text className="text-white/40 text-xs mt-0.5">Stress reduction without ethanol toxins.</Text>
                            </View>
                        </Card>
                    </View>
                </Animated.View>

                {/* Research Note */}
                <View className="bg-white/5 p-6 rounded-[32px] border border-white/10 mt-4">
                    <View className="flex-row items-center mb-4">
                        <Info size={16} color="rgba(255,255,255,0.4)" className="mr-3" />
                        <Text className="text-white/40 font-black text-[10px] uppercase tracking-widest">Medical Fact</Text>
                    </View>
                    <Text className="text-white/60 text-xs leading-5">
                        Alcohol is a Group 1 Carcinogen according to IARC. It increases the risk of at least 7 types of cancer, including breast and colorectal, by altering hormone levels and damaging DNA.
                    </Text>
                </View>
            </ScrollView>
        </ScreenContainer>
    );
}
