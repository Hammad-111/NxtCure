import { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, Image, StyleSheet, Dimensions } from 'react-native';
import { Shield, Search, ChevronRight, Activity, Bell, Info, Fingerprint, Award, Zap, Settings } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { Card } from '../../src/components/ui/Card';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, useAnimatedProps, withTiming, } from 'react-native-reanimated';
import { useDietStore } from '../../src/store/dietStore';
import { useLifestyleStore } from '../../src/store/lifestyleStore';
import { useRiskStore } from '../../src/store/riskStore';
import { useGoalStore } from '../../src/store/goalStore';
import { useProfileStore } from '../../src/store/profileStore';
import { useCarcinogenStore } from '../../src/store/carcinogenStore';
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// Reusable Gauge Component
function HealthGauge({
    score,
    label,
    subLabel,
    size = width * 0.5,
    strokeWidth = 14,
    showStatus = true
}: {
    score: number;
    label: string;
    subLabel?: string;
    size?: number;
    strokeWidth?: number;
    showStatus?: boolean;
}) {
    const center = size / 2;
    const radius = center - strokeWidth;
    const circumference = 2 * Math.PI * radius;
    const percentage = score / 100;

    const animatedProps = useAnimatedProps(() => ({
        strokeDashoffset: withTiming(circumference * (1 - percentage), { duration: 1500 }),
    }));

    const statusLabel = score >= 80 ? 'Optimal Status' : score >= 60 ? 'Stable Status' : score >= 40 ? 'Action Required' : 'Critical Protocol';
    const statusColor = score >= 80 ? 'text-nxtcure-primary' : score >= 60 ? 'text-blue-400' : score >= 40 ? 'text-orange-400' : 'text-red-400';
    const statusBg = score >= 80 ? 'bg-nxtcure-primary/20' : score >= 60 ? 'bg-blue-400/20' : score >= 40 ? 'bg-orange-400/20' : 'bg-red-400/20';
    const statusBorder = score >= 80 ? 'border-nxtcure-primary/30' : score >= 60 ? 'border-blue-400/30' : score >= 40 ? 'border-orange-400/30' : 'border-red-400/30';

    return (
        <View className="items-center justify-center">
            <Svg width={size} height={size}>
                <Defs>
                    <SvgGradient id={`gaugeGrad-${label.replace(/\s+/g, '')}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <Stop offset="0%" stopColor="#1DD1A1" />
                        <Stop offset="100%" stopColor="#45AAF2" />
                    </SvgGradient>
                </Defs>
                {/* Background Ring */}
                <Circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                {/* Progress Ring */}
                <AnimatedCircle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke={`url(#gaugeGrad-${label.replace(/\s+/g, '')})`}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    animatedProps={animatedProps}
                    strokeLinecap="round"
                    fill="none"
                    transform={`rotate(-90 ${center} ${center})`}
                />
            </Svg>

            {/* Inner Content */}
            <View className="absolute items-center justify-center">
                <Text className="text-white/40 text-[10px] font-black uppercase tracking-[2px] mb-0.5 text-center">{label}</Text>
                <Text className="text-white font-black tracking-tighter text-center" style={{ fontSize: size * 0.22 }}>{score}</Text>
                {showStatus && (
                    <View className={`${statusBg} px-2 py-0.5 rounded-full border ${statusBorder} mt-1`}>
                        <Text className={`${statusColor} text-[8px] font-black uppercase tracking-widest`}>{statusLabel}</Text>
                    </View>
                )}
                {subLabel && (
                    <Text className="text-white/60 text-[9px] font-bold mt-1 uppercase tracking-wider">{subLabel}</Text>
                )}
            </View>
        </View>
    );
}

function ProtocolCard({ title, subtitle, icon: Icon, color, onPress }: any) {
    return (
        <Pressable onPress={onPress} className="active:opacity-80">
            <View className="bg-white/5 border border-white/10 p-5 rounded-[32px] flex-row items-center backdrop-blur-3xl overflow-hidden">
                <View className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-3xl" />
                <View style={{ backgroundColor: `${color}20` }} className="w-14 h-14 rounded-2xl items-center justify-center mr-4 border border-white/10">
                    <Icon size={24} color={color} strokeWidth={2} />
                </View>
                <View className="flex-1">
                    <Text className="text-white/40 text-[9px] font-black uppercase tracking-[2px] mb-1">Active Protocol</Text>
                    <Text className="text-white text-lg font-bold leading-tight">{title}</Text>
                    <Text className="text-white/60 text-xs mt-0.5">{subtitle}</Text>
                </View>
                <ChevronRight size={20} color="rgba(255,255,255,0.3)" />
            </View>
        </Pressable>
    );
}

export default function HomeScreen() {
    const today = new Date().toISOString().split('T')[0];
    const { factors, calculateRisk } = useRiskStore();
    const { getScore: getDietScore } = useDietStore();
    const { logs: lifestyleLogs, getConsistencyScore } = useLifestyleStore();
    const { hasGoal } = useGoalStore();
    const { name } = useProfileStore();
    const { getAvoidanceStats, exposures } = useCarcinogenStore();
    const router = useRouter();

    const dietScore = getDietScore(today);
    const lifestyleScore = getConsistencyScore(today);
    const currentLifestyle = lifestyleLogs[today] || { exerciseMinutes: 0 };
    const { level: riskLevel, score: preventionScore } = calculateRisk(dietScore, lifestyleScore);

    const { avoided, total } = getAvoidanceStats();
    const carcinogenScore = Math.round((avoided / total) * 100);
    const carcinogenCount = new Set(exposures.filter(e => e.date === today).map(e => e.carcinogenId)).size;

    const dietPercentage = Math.round((dietScore / 7) * 100) || 0;
    const exercisePercentage = currentLifestyle.exerciseMinutes >= 30 ? 100 : 0;
    const screeningScore = 100; // Placeholder for now

    // Determine cancer status based on goals
    const getCancerStatus = () => {
        if (hasGoal('3')) return 'Active cancer treatment';
        if (hasGoal('4')) return 'Cancer survivor';
        return 'No active cancer';
    };

    return (
        <ScreenContainer darkStatus={false} withPadding={false} className="bg-black">
            {/* Fullscreen Cinematic Background */}
            <View style={styles.heroBg}>
                <Image
                    source={require('../../assets/home_hero_bg.png')}
                    style={styles.heroImage}
                    resizeMode="cover"
                />
                <LinearGradient
                    colors={['rgba(0,0,0,0.85)', 'rgba(5, 53, 61, 0.4)', 'rgba(0, 0, 0, 0.8)', 'black']}
                    style={StyleSheet.absoluteFill}
                    locations={[0, 0.2, 0.5, 0.95]}
                />
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 150 }} showsVerticalScrollIndicator={false}>
                {/* 1. Header with Stats */}
                <Animated.View entering={FadeInDown.duration(1000)} className="px-6 pt-12 pb-6 flex-row items-center justify-between">
                    <View>
                        <Text className="text-white/60 text-xs font-bold mb-1">HELLO, {name.toUpperCase()} 👋</Text>
                        <Text className="text-white text-sm font-bold opacity-60">Age 25 • Male • {getCancerStatus()}</Text>
                    </View>
                    <View className="flex-row gap-4">
                        <Pressable className="bg-white/10 p-2.5 rounded-xl border border-white/20">
                            <Settings size={20} color="white" />
                        </Pressable>
                        <Pressable className="bg-white/10 p-2.5 rounded-xl border border-white/20">
                            <Bell size={20} color="white" />
                        </Pressable>
                    </View>
                </Animated.View>

                <View className="h-[1px] bg-white/10 mx-6 mb-6" />

                {/* 3. Prevention Score Card */}
                <Animated.View entering={FadeInDown.delay(200).duration(800)} className="px-6 mb-8">
                    <Text className="text-white/40 text-[10px] font-black uppercase tracking-[4px] mb-4">Your Prevention Score</Text>
                    <Card className="bg-white/5 border border-white/10 p-6">
                        {/* Main Large Gauge */}
                        <View className="items-center justify-center mb-8">
                            <HealthGauge score={preventionScore} label="Health Core" size={width * 0.5} strokeWidth={14} />
                        </View>

                        {/* Metrics Grid */}
                        <View className="flex-row flex-wrap justify-between gap-y-6 mb-2">
                            <View className="w-[48%] items-center">
                                <HealthGauge
                                    score={dietPercentage}
                                    label="Diet"
                                    subLabel="6/7 Days"
                                    size={width * 0.36}
                                    strokeWidth={8}
                                    showStatus={false}
                                />
                            </View>
                            <View className="w-[48%] items-center">
                                <HealthGauge
                                    score={exercisePercentage}
                                    label="Exercise"
                                    subLabel="180 Min"
                                    size={width * 0.36}
                                    strokeWidth={8}
                                    showStatus={false}
                                />
                            </View>
                            <View className="w-[48%] items-center">
                                <HealthGauge
                                    score={carcinogenScore}
                                    label="Carcinogens"
                                    subLabel={`${carcinogenCount} Today`}
                                    size={width * 0.36}
                                    strokeWidth={8}
                                    showStatus={false}
                                />
                            </View>
                            <View className="w-[48%] items-center">
                                <HealthGauge
                                    score={screeningScore}
                                    label="Screenings"
                                    subLabel="Up to Date"
                                    size={width * 0.36}
                                    strokeWidth={8}
                                    showStatus={false}
                                />
                            </View>
                        </View>

                        <Pressable onPress={() => router.push('/track')} className="self-center mt-6">
                            <Text className="text-blue-400 font-bold text-sm">[Improve score →]</Text>
                        </Pressable>
                    </Card>
                </Animated.View>

                {/* 4. Quick Access Grid */}
                <Animated.View entering={FadeInDown.delay(400).duration(800)} className="px-6 mb-8">
                    <Text className="text-white/40 text-[10px] font-black uppercase tracking-[4px] mb-4">Quick Access</Text>
                    <View className="flex-row gap-3">
                        <Pressable onPress={() => router.push('/learn/self-exam-tse')} className="flex-1 bg-white/5 border border-white/10 p-4 rounded-2xl items-center active:bg-white/10">
                            <Search size={24} color="#1DD1A1" className="mb-2" />
                            <Text className="text-white font-bold text-xs text-center">Self-Exam Guide</Text>
                        </Pressable>
                        <Pressable onPress={() => router.push('/learn/carcinogen-db')} className="flex-1 bg-white/5 border border-white/10 p-4 rounded-2xl items-center active:bg-white/10">
                            <Shield size={24} color="#45AAF2" className="mb-2" />
                            <Text className="text-white font-bold text-xs text-center">Carcinogens Database</Text>
                        </Pressable>
                        <Pressable onPress={() => router.push('/track')} className="flex-1 bg-white/5 border border-white/10 p-4 rounded-2xl items-center active:bg-white/10">
                            <Activity size={24} color="#FF4757" className="mb-2" />
                            <Text className="text-white font-bold text-xs text-center">Symptom Checker</Text>
                        </Pressable>
                    </View>
                </Animated.View>

                <View className="h-[1px] bg-white/10 mx-6 mb-8" />

                {/* 2. Upcoming Section */}
                <Animated.View entering={FadeInDown.delay(600).duration(800)} className="px-6 mb-8">
                    <Text className="text-white/40 text-[10px] font-black uppercase tracking-[4px] mb-4">Upcoming</Text>
                    <View className="gap-3">
                        <View className="flex-row items-center">
                            <View className="w-1.5 h-1.5 rounded-full bg-nxtcure-primary mr-3" />
                            <Text className="text-white font-bold">Testicular self-exam (due today)</Text>
                        </View>
                        <View className="flex-row items-center">
                            <View className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-3" />
                            <Text className="text-white font-bold">Dental cleaning (Feb 15)</Text>
                        </View>
                    </View>
                </Animated.View>

                <View className="h-[1px] bg-white/10 mx-6 mb-8" />

                {/* 5. Learn & Community */}
                <Animated.View entering={FadeInDown.delay(800).duration(800)} className="px-6 mb-8">
                    <Text className="text-white/40 text-[10px] font-black uppercase tracking-[4px] mb-4">Learn</Text>
                    <View className="gap-4 mb-8">
                        <View className="flex-row items-center">
                            <View className="w-1.5 h-1.5 rounded-full bg-white/40 mr-3" />
                            <Text className="text-white font-bold">Understanding testicular cancer</Text>
                        </View>
                        <View className="flex-row">
                            <View className="w-1.5 h-1.5 rounded-full bg-white/40 mr-3 mt-2" />
                            <Text className="text-white font-bold flex-1">New study: Coffee reduces liver cancer risk by 40%</Text>
                        </View>
                    </View>

                    <Text className="text-white/40 text-[10px] font-black uppercase tracking-[4px] mb-4">Community</Text>
                    <View className="gap-4">
                        <View className="flex-row items-center">
                            <View className="w-1.5 h-1.5 rounded-full bg-nxtcure-primary mr-3" />
                            <Text className="text-white font-bold">247 people near you using NxtCure</Text>
                        </View>
                        <View className="flex-row items-center">
                            <View className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-3" />
                            <Text className="text-white font-bold">Join discussion: "Managing scanxiety"</Text>
                        </View>
                    </View>
                </Animated.View>
            </ScrollView>

            {/* Bottom Fade Mask - Professional Content Hiding */}
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)', 'black']}
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 120,
                    pointerEvents: 'none',
                }}
            />
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    heroBg: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: height,
        zIndex: -1,
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    headline: {
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 10,
    }
});
