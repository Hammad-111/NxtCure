import React, { useMemo } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Dimensions } from 'react-native';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { Card } from '../../src/components/ui/Card';
import { useLifestyleStore } from '../../src/store/lifestyleStore';
import { ChevronLeft, Activity, Trophy, Zap, Clock, ShieldCheck, Heart, Award, ArrowUpRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInRight, Layout } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function PhysicalActivityScreen() {
    const router = useRouter();
    const today = new Date().toISOString().split('T')[0];
    const { logs, setExercise } = useLifestyleStore();

    const currentMins = logs[today]?.exerciseMinutes || 0;

    // Calculate weekly total
    const weeklyTotal = useMemo(() => {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return Object.values(logs)
            .filter(log => new Date(log.date) >= weekAgo)
            .reduce((total, log) => total + (log.exerciseMinutes || 0), 0);
    }, [logs]);

    const goal = 150;
    const progress = Math.min(100, (weeklyTotal / goal) * 100);

    const handleQuickAdd = (mins: number) => {
        setExercise(today, currentMins + mins);
    };

    return (
        <ScreenContainer hasWave={false} darkStatus={false} withPadding={false} fullScreen={true} className="bg-black">
            <LinearGradient
                colors={['#053d2b', '#000000']}
                style={StyleSheet.absoluteFill}
            />

            <View className="px-6 pt-12 pb-6 flex-row items-center justify-between">
                <Pressable onPress={() => router.back()} className="bg-white/10 w-12 h-12 rounded-2xl items-center justify-center border border-white/20 backdrop-blur-xl">
                    <ChevronLeft size={24} color="white" />
                </Pressable>
                <Text className="text-white font-black uppercase tracking-[3px] text-xs">Metabolic Protocol</Text>
                <View className="w-12 h-12" />
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}>
                {/* Hero Section */}
                <Animated.View entering={FadeInDown.duration(800)} className="mb-10 items-center">
                    <Text className="text-4xl font-black text-white text-center tracking-tighter mb-2">
                        Activity Hub.
                    </Text>
                    <Text className="text-white/60 text-center font-medium mb-8">
                        150 min/week of moderate aerobic activity reduces risk of colon and breast cancer.
                    </Text>

                    {/* Progress Circle */}
                    <View className="items-center justify-center relative">
                        <View className="w-56 h-56 rounded-full border-8 border-white/5 items-center justify-center">
                            <Text className="text-white text-6xl font-black">{weeklyTotal}</Text>
                            <Text className="text-white/40 text-[10px] font-black uppercase tracking-widest">Weekly Minutes</Text>
                        </View>
                        {/* Progress Ring Simulation */}
                        <View className="absolute w-56 h-56 rotate-[-90deg]">
                            {/* In a real production app we'd use Svg but for now the text/border works well with the branding */}
                        </View>
                        <View className="absolute -bottom-4 bg-nxtcure-primary px-6 py-2 rounded-full shadow-lg shadow-nxtcure-primary/20">
                            <Text className="text-white text-[10px] font-black uppercase tracking-widest">{progress.toFixed(0)}% of Clinical Goal</Text>
                        </View>
                    </View>
                </Animated.View>

                {/* Log Activity */}
                <Animated.View entering={FadeInDown.delay(200)} className="mb-10">
                    <Text className="text-white/40 text-[10px] font-black uppercase tracking-[4px] mb-4">LOG SESSION</Text>
                    <View className="flex-row gap-3">
                        {[15, 30, 45, 60].map(mins => (
                            <Pressable
                                key={mins}
                                onPress={() => handleQuickAdd(mins)}
                                className="flex-1 bg-white/5 border border-white/10 p-4 rounded-2xl items-center active:bg-white/10"
                            >
                                <Clock size={20} color="#1DD1A1" className="mb-1" />
                                <Text className="text-white font-black text-sm">{mins}m</Text>
                            </Pressable>
                        ))}
                    </View>
                </Animated.View>

                {/* Gamification / Badges */}
                <Animated.View entering={FadeInDown.delay(400)} className="mb-10">
                    <Text className="text-white/40 text-[10px] font-black uppercase tracking-[4px] mb-4">CLINICAL ACHIEVEMENTS</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-6 px-6">
                        <View className="flex-row gap-4">
                            <Card className="w-40 bg-white/5 border-white/10 p-5 rounded-[32px] items-center">
                                <View className="bg-nxtcure-primary/20 w-14 h-14 rounded-full items-center justify-center mb-3">
                                    <Trophy size={28} color="#1DD1A1" />
                                </View>
                                <Text className="text-white font-bold text-center text-xs">Cellular Shield</Text>
                                <Text className="text-white/40 text-[9px] text-center mt-1 uppercase font-black">7 Day Streak</Text>
                            </Card>
                            <Card className="w-40 bg-white/5 border-white/10 p-5 rounded-[32px] items-center">
                                <View className="bg-blue-500/20 w-14 h-14 rounded-full items-center justify-center mb-3">
                                    <Award size={28} color="#45AAF2" />
                                </View>
                                <Text className="text-white font-bold text-center text-xs">Oxygen Maximizer</Text>
                                <Text className="text-white/40 text-[9px] text-center mt-1 uppercase font-black">150m Achieved</Text>
                            </Card>
                            <Card className="w-40 bg-white/5 border-white/10 p-5 rounded-[32px] items-center opacity-40">
                                <View className="bg-purple-500/20 w-14 h-14 rounded-full items-center justify-center mb-3">
                                    <Heart size={28} color="#A55EEA" />
                                </View>
                                <Text className="text-white font-bold text-center text-xs">Cancer Warrior</Text>
                                <Text className="text-white/40 text-[9px] text-center mt-1 uppercase font-black">Weight Target</Text>
                            </Card>
                        </View>
                    </ScrollView>
                </Animated.View>

                {/* Health Integration Simulated */}
                <Animated.View entering={FadeInDown.delay(600)}>
                    <Card className="bg-white/5 border-white/10 p-6 rounded-[32px] flex-row items-center">
                        <View className="bg-red-500/10 w-14 h-14 rounded-2xl items-center justify-center mr-5">
                            <Activity size={28} color="#FF4757" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-white font-black text-lg">Apple Health</Text>
                            <Text className="text-white/40 text-xs mt-1">Synced clinical data from active sensors.</Text>
                        </View>
                        <ArrowUpRight size={20} color="rgba(255,255,255,0.4)" />
                    </Card>
                </Animated.View>
            </ScrollView>
        </ScreenContainer>
    );
}
