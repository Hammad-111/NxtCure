import React, { useMemo } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, AlertTriangle, ShieldCheck, BookOpen, Activity, Info, AlertCircle, Share2, ClipboardList, TrendingUp } from 'lucide-react-native';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { Card } from '../../src/components/ui/Card';
import { CARCINOGENS } from '../../src/data/carcinogens';
import { LinearGradient } from 'expo-linear-gradient';
import { useCarcinogenStore } from '../../src/store/carcinogenStore';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function CarcinogenDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const item = CARCINOGENS.find(c => c.id === id);

    const today = new Date().toISOString().split('T')[0];
    const { addExposure, removeExposure, getExposuresForDate, getWeeklyCount } = useCarcinogenStore();

    const exposuresToday = getExposuresForDate(today).filter(e => e.carcinogenId === id);
    const isLoggedToday = exposuresToday.length > 0;
    const weeklyCount = getWeeklyCount(id as string);

    if (!item) return <Text>Not found</Text>;

    const handleToggleExposure = () => {
        if (isLoggedToday) {
            removeExposure(item.id, today);
        } else {
            addExposure(item.id, today);
        }
    };

    return (
        <ScreenContainer hasWave={false} darkStatus={false} withPadding={false} className="bg-black">
            {/* Header / Background Area */}
            <View className="h-48 relative overflow-hidden">
                <LinearGradient
                    colors={['#0F3460', '#000000']}
                    style={StyleSheet.absoluteFill}
                />

                <View className="flex-row items-center justify-between px-6 pt-12">
                    <Pressable onPress={() => router.back()} className="bg-white/10 w-12 h-12 rounded-2xl items-center justify-center border border-white/20 backdrop-blur-xl">
                        <ChevronLeft size={24} color="white" />
                    </Pressable>
                    <Pressable className="bg-white/10 w-12 h-12 rounded-2xl items-center justify-center border border-white/20 backdrop-blur-xl">
                        <Share2 size={20} color="white" />
                    </Pressable>
                </View>

                <Animated.View entering={FadeInUp.delay(200)} className="px-6 mt-6">
                    <View className="flex-row items-center bg-red-500/20 self-start px-3 py-1.5 rounded-full border border-red-500/30">
                        <AlertCircle size={14} color="#f87171" className="mr-2" />
                        <Text className="text-red-400 text-[10px] font-black uppercase tracking-[2px]">IARC GROUP 1: {item.riskLevel}</Text>
                    </View>
                </Animated.View>
            </View>

            <ScrollView className="flex-1 -mt-8 bg-black rounded-t-[40px] px-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                <View className="pt-8">
                    <Animated.Text entering={FadeInDown.delay(300)} className="text-4xl font-black text-white tracking-tighter mb-4">
                        {item.name}.
                    </Animated.Text>
                    <Animated.Text entering={FadeInDown.delay(400)} className="text-white/60 text-base leading-6 font-medium mb-8">
                        {item.summary}
                    </Animated.Text>

                    {/* Tracker Integration Section */}
                    <Animated.View entering={FadeInDown.delay(500)}>
                        <Card className="bg-white/5 border-white/10 p-6 rounded-[32px] mb-8">
                            <View className="flex-row items-center justify-between mb-6">
                                <View className="flex-row items-center">
                                    <View className="bg-nxtcure-primary/20 w-10 h-10 rounded-xl items-center justify-center mr-4 border border-nxtcure-primary/30">
                                        <Activity size={20} color="#1DD1A1" />
                                    </View>
                                    <View>
                                        <Text className="text-white font-black text-lg tracking-tight">Your Exposure</Text>
                                        <Text className="text-white/40 text-[10px] font-bold uppercase tracking-wider">Logging Protocol</Text>
                                    </View>
                                </View>
                                <View className="items-end">
                                    <Text className="text-red-400 font-black text-sm">{weeklyCount} Exposure{weeklyCount !== 1 ? 's' : ''}</Text>
                                    <View className="flex-row items-center">
                                        <TrendingUp size={10} color="rgba(255,255,255,0.4)" strokeWidth={3} className="mr-1" />
                                        <Text className="text-white/40 text-[9px] font-black uppercase tracking-widest">This Week</Text>
                                    </View>
                                </View>
                            </View>

                            <Pressable
                                onPress={handleToggleExposure}
                                className={`h-16 rounded-2xl flex-row items-center justify-center border border-white/10 ${isLoggedToday ? 'bg-white/5' : 'bg-nxtcure-primary'}`}
                            >
                                <ClipboardList size={20} color={isLoggedToday ? 'white' : 'white'} opacity={isLoggedToday ? 0.4 : 1} className="mr-3" />
                                <Text className="text-white font-black tracking-tight text-base">
                                    {isLoggedToday ? "Logged for Today" : "Log Exposure Today"}
                                </Text>
                            </Pressable>

                            <Text className="text-white/30 text-center mt-4 text-[9px] font-bold uppercase tracking-[2px]">
                                {weeklyCount >= 3 ? "⚠️ Clinical Threshold Warning: Limit to <1/week" : "Target: Zero Exposure recommended"}
                            </Text>
                        </Card>
                    </Animated.View>

                    {/* Medical Details */}
                    <View className="gap-8">
                        {/* Cancer Risk */}
                        <View>
                            <View className="flex-row items-center mb-4">
                                <View className="w-1.5 h-6 bg-red-500 rounded-full mr-3" />
                                <Text className="text-white font-black text-xl tracking-tight">Cancer Risk</Text>
                            </View>
                            <Card className="bg-red-500/5 border-red-500/20 p-5 rounded-3xl">
                                <Text className="text-white/80 leading-6 font-medium">{item.cancerRisk}</Text>
                            </Card>
                        </View>

                        {/* Why it's harmful */}
                        <View>
                            <View className="flex-row items-center mb-4">
                                <View className="w-1.5 h-6 bg-nxtcure-primary rounded-full mr-3" />
                                <Text className="text-white font-black text-xl tracking-tight">Physiological Impact</Text>
                            </View>
                            <View className="gap-4">
                                {item.whyHarmful.map((point, i) => (
                                    <View key={i} className="flex-row items-start px-2">
                                        <View className="bg-nxtcure-primary/20 w-8 h-8 rounded-full items-center justify-center mr-4 mt-0.5">
                                            <Info size={14} color="#1DD1A1" strokeWidth={3} />
                                        </View>
                                        <Text className="flex-1 text-white/70 text-sm leading-6 font-medium">{point}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* Examples */}
                        <View>
                            <Text className="text-white font-black text-xl tracking-tight mb-4">Common Sources</Text>
                            <View className="flex-row flex-wrap gap-2">
                                {item.examples.map(ex => (
                                    <View key={ex} className="bg-white/10 px-4 py-2.5 rounded-xl border border-white/10">
                                        <Text className="text-white/90 text-xs font-bold">{ex}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* Safe Alternatives */}
                        <Card className="bg-nxtcure-primary/10 border-nxtcure-primary/30 p-6 rounded-[32px]">
                            <View className="flex-row items-center mb-4">
                                <ShieldCheck size={20} color="#1DD1A1" className="mr-3" />
                                <Text className="text-white font-black text-xl tracking-tight">Clinical Alternatives</Text>
                            </View>
                            <View className="gap-2">
                                {item.safeAlternatives.map((alt, i) => (
                                    <Text key={i} className="text-white/70 font-medium leading-6">• {alt}</Text>
                                ))}
                            </View>
                        </Card>

                        {/* Key Research */}
                        <View className="mb-10">
                            <View className="flex-row items-center mb-5">
                                <BookOpen size={20} color="rgba(255,255,255,0.4)" className="mr-3" />
                                <Text className="text-white/40 font-black text-sm uppercase tracking-widest">Medical Reference</Text>
                            </View>
                            {item.research.map((r, i) => (
                                <View key={i} className="flex-row items-center bg-white/5 p-4 rounded-2xl mb-2 border border-white/10">
                                    <Text className="flex-1 text-white/50 text-xs font-bold">{r}</Text>
                                    <Text className="text-nxtcure-primary font-black text-[10px] uppercase tracking-wider">VIEW STUDY</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </ScreenContainer>
    );
}
