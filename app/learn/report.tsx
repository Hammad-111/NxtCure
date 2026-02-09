import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, Pressable } from 'react-native';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { Card } from '../../src/components/ui/Card';
import { useCarcinogenStore } from '../../src/store/carcinogenStore';
import { CARCINOGENS } from '../../src/data/carcinogens';
import { ChevronLeft, Calendar, ShieldCheck, AlertTriangle, TrendingDown, Info, BarChart3, Target } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInRight, FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function ExposureReportScreen() {
    const router = useRouter();
    const { exposures, getAvoidanceStats, getWeeklyCount } = useCarcinogenStore();
    const { avoided, total } = getAvoidanceStats();

    // Group 1 carcinogens that have been logged this week
    const recentExposures = useMemo(() => {
        const uniqueIds = Array.from(new Set(exposures.map(e => e.carcinogenId)));
        return uniqueIds.map(id => {
            const item = CARCINOGENS.find(c => c.id === id);
            const count = getWeeklyCount(id);
            return { item, count };
        }).filter(e => e.count > 0 && e.item);
    }, [exposures]);

    const preventionPercentage = Math.round((avoided / total) * 100);

    return (
        <ScreenContainer hasWave={false} darkStatus={false} withPadding={false} fullScreen={true} className="bg-black">
            <LinearGradient
                colors={['#0F3460', '#000000']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 0.3 }}
            />

            <View className="px-6 pt-12 pb-6 flex-row items-center justify-between">
                <Pressable onPress={() => router.back()} className="bg-white/10 w-12 h-12 rounded-2xl items-center justify-center border border-white/20 backdrop-blur-xl">
                    <ChevronLeft size={24} color="white" />
                </Pressable>
                <Text className="text-white font-black uppercase tracking-[3px] text-xs">Clinical Report</Text>
                <View className="w-12 h-12" />
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}>
                {/* Score Header */}
                <Animated.View entering={FadeInUp.duration(800)}>
                    <Text className="text-[10px] font-black text-white/40 uppercase tracking-[4px] mb-2">WEEKLY PROTOCOL PERFORMANCE</Text>
                    <Text className="text-4xl font-black text-white tracking-tighter mb-8">
                        Exposure{'\n'}
                        <Text className="text-nxtcure-primary">Analysis.</Text>
                    </Text>
                </Animated.View>

                {/* Main Score Card */}
                <Animated.View entering={FadeInDown.delay(200)}>
                    <Card className="bg-white/5 border-white/10 p-8 rounded-[40px] items-center mb-8">
                        <View className="w-32 h-32 rounded-full border-4 border-nxtcure-primary/20 items-center justify-center mb-6">
                            <View className="w-24 h-24 rounded-full border-4 border-nxtcure-primary items-center justify-center">
                                <Text className="text-white text-3xl font-black">{preventionPercentage}%</Text>
                            </View>
                        </View>
                        <Text className="text-white font-black text-xl mb-2">Avoidance Rate</Text>
                        <Text className="text-white/40 text-center text-xs font-medium leading-5">
                            You avoided clinical-grade carcinogens on <Text className="text-nxtcure-primary">{avoided} out of {total}</Text> days this week.
                        </Text>

                        <View className="w-full h-px bg-white/10 my-6" />

                        <View className="flex-row w-full justify-between">
                            <View className="items-center flex-1">
                                <ShieldCheck size={20} color="#1DD1A1" className="mb-2" />
                                <Text className="text-white font-black text-lg">{avoided}</Text>
                                <Text className="text-white/30 text-[9px] font-black uppercase tracking-wider">Days Clean</Text>
                            </View>
                            <View className="w-px h-10 bg-white/10" />
                            <View className="items-center flex-1">
                                <AlertTriangle size={20} color={total - avoided > 0 ? "#EB3B5A" : "white"} opacity={total - avoided > 0 ? 1 : 0.2} className="mb-2" />
                                <Text className="text-white font-black text-lg">{total - avoided}</Text>
                                <Text className="text-white/30 text-[9px] font-black uppercase tracking-wider">Risk Days</Text>
                            </View>
                        </View>
                    </Card>
                </Animated.View>

                {/* Specific Warnings */}
                {recentExposures.length > 0 && (
                    <Animated.View entering={FadeInDown.delay(400)} className="mb-8">
                        <View className="flex-row items-center mb-4">
                            <AlertTriangle size={18} color="#EB3B5A" className="mr-3" />
                            <Text className="text-white font-black text-xl tracking-tight">Systemic Findings</Text>
                        </View>
                        <View className="gap-4">
                            {recentExposures.map((e, idx) => (
                                <Animated.View key={idx} entering={FadeInRight.delay(500 + idx * 100)}>
                                    <Card className={`p-5 rounded-3xl border ${e.count >= 3 ? 'bg-red-500/10 border-red-500/30' : 'bg-white/5 border-white/10'}`}>
                                        <View className="flex-row items-center justify-between">
                                            <View className="flex-1">
                                                <Text className="text-white font-black text-base">{e.item?.name}</Text>
                                                <Text className="text-white/40 text-[10px] font-bold uppercase tracking-wider mt-1">
                                                    {e.count} Exposure{e.count !== 1 ? 's' : ''} logged this week
                                                </Text>
                                            </View>
                                            {e.count >= 3 && (
                                                <View className="bg-red-500 px-3 py-1 rounded-full">
                                                    <Text className="text-white text-[8px] font-black">HIGH RISK</Text>
                                                </View>
                                            )}
                                        </View>
                                        <Text className="text-white/60 text-xs mt-3 leading-5">
                                            {e.count >= 3
                                                ? `Exposure exceeds clinical threshold. Immediate reduction to <1 serving/week recommended.`
                                                : `Exposure detected. Maintain target of zero for optimal cellular health.`}
                                        </Text>
                                    </Card>
                                </Animated.View>
                            ))}
                        </View>
                    </Animated.View>
                )}

                {/* Improvement Plan */}
                <Animated.View entering={FadeInDown.delay(600)}>
                    <View className="flex-row items-center mb-4">
                        <Target size={18} color="#1DD1A1" className="mr-3" />
                        <Text className="text-white font-black text-xl tracking-tight">Active Protocol</Text>
                    </View>
                    <Card className="bg-nxtcure-primary/10 border-nxtcure-primary/30 p-6 rounded-[32px]">
                        <Text className="text-white font-black text-base mb-4">Next Steps for Improvement</Text>
                        <View className="gap-4">
                            <View className="flex-row items-start">
                                <View className="w-1.5 h-1.5 rounded-full bg-nxtcure-primary mt-2 mr-3" />
                                <Text className="flex-1 text-white/70 text-xs leading-5">Replace processed meats with clinical-grade fresh protein (Chicken/Fish).</Text>
                            </View>
                            <View className="flex-row items-start">
                                <View className="w-1.5 h-1.5 rounded-full bg-nxtcure-primary mt-2 mr-3" />
                                <Text className="flex-1 text-white/70 text-xs leading-5">Utilize the scanner for all supermarket purchases to identify hidden nitrites.</Text>
                            </View>
                            <View className="flex-row items-start">
                                <View className="w-1.5 h-1.5 rounded-full bg-nxtcure-primary mt-2 mr-3" />
                                <Text className="flex-1 text-white/70 text-xs leading-5">Current trend is {preventionPercentage > 80 ? 'Optimal' : 'Elevated'}. Target 7/7 avoidance days next week.</Text>
                            </View>
                        </View>
                    </Card>
                </Animated.View>

                <View className="items-center py-10">
                    <Text className="text-white/20 text-[9px] font-black uppercase tracking-[3px]">IARC TIER 1 MEDICAL AUDIT</Text>
                </View>
            </ScrollView>
        </ScreenContainer>
    );
}

// Add missing useMemo import
import { useMemo } from 'react';
