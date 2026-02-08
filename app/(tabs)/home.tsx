import { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, Image, StyleSheet, Dimensions } from 'react-native';
import { Shield, Search, Heart, ChevronRight, Check, Activity, BookOpen, Bell, Info, Fingerprint, Award, Zap } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp, useAnimatedStyle, useAnimatedProps, withTiming, withRepeat, withSequence } from 'react-native-reanimated';
import { useDietStore } from '../../src/store/dietStore';
import { useLifestyleStore } from '../../src/store/lifestyleStore';
import { useRiskStore } from '../../src/store/riskStore';
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { Logo } from '../../src/components/ui/Logo';

const { width, height } = Dimensions.get('window');
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

function PreventionGauge({ score }: { score: number }) {
    const size = width * 0.5;
    const strokeWidth = 14;
    const center = size / 2;
    const radius = center - strokeWidth;
    const circumference = 2 * Math.PI * radius;
    const percentage = score / 100;

    const animatedProps = useAnimatedProps(() => ({
        strokeDashoffset: withTiming(circumference * (1 - percentage), { duration: 1500 }),
    }));

    const statusLabel = score > 80 ? 'Optimal Status' : score > 60 ? 'Stable Status' : score > 40 ? 'Action Required' : 'Critical Protocol';
    const statusColor = score > 80 ? 'text-nxtcure-primary' : score > 60 ? 'text-blue-400' : score > 40 ? 'text-orange-400' : 'text-red-400';
    const statusBg = score > 80 ? 'bg-nxtcure-primary/20' : score > 60 ? 'bg-blue-400/20' : score > 40 ? 'bg-orange-400/20' : 'bg-red-400/20';
    const statusBorder = score > 80 ? 'border-nxtcure-primary/30' : score > 60 ? 'border-blue-400/30' : score > 40 ? 'border-orange-400/30' : 'border-red-400/30';

    return (
        <View className="items-center justify-center elevation-xl">
            <Svg width={size} height={size}>
                <Defs>
                    <SvgGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
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
                    stroke="url(#gaugeGrad)"
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
                <Text className="text-white/40 text-[10px] font-black uppercase tracking-[3px] mb-0.5">Health Core</Text>
                <Text className="text-white text-5xl font-black tracking-tighter">{score}</Text>
                <View className={`${statusBg} px-3 py-1 rounded-full border ${statusBorder} mt-1.5`}>
                    <Text className={`${statusColor} text-[9px] font-black uppercase tracking-widest`}>{statusLabel}</Text>
                </View>
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
    const { getConsistencyScore } = useLifestyleStore();
    const router = useRouter();

    const dietScore = getDietScore(today);
    const lifestyleScore = getConsistencyScore(today);
    const { level: riskLevel, score: preventionScore } = calculateRisk(dietScore, lifestyleScore);

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
                {/* Premium Header - More Compact */}
                <Animated.View entering={FadeInDown.duration(1000)} className="px-8 pt-8 pb-6 flex-row items-center justify-between">
                    <View>
                        <View className="flex-row items-center mb-1">
                            <Logo size={24} style={{ marginRight: 8 }} />
                            <View>
                                <Text className="text-white/40 text-[8px] font-black uppercase tracking-[2px]">Oncological Core</Text>
                                <Text className="text-white text-3xl font-black tracking-tighter">Alessandro</Text>
                            </View>
                        </View>
                        <Text className="text-white/60 text-[10px] font-bold">NXT-ID: 7492-BX-09</Text>
                    </View>
                    <Pressable onPress={() => router.push('/profile')} className="w-12 h-12 bg-white/10 rounded-2xl border border-white/20 items-center justify-center backdrop-blur-2xl">
                        <Award size={24} color="white" strokeWidth={1.5} />
                    </Pressable>
                </Animated.View>

                {/* Main Gauge Section - More Compact */}
                <View className="items-center pt-1 pb-3">
                    <PreventionGauge score={preventionScore} />
                </View>

                {/* Quick Insight Strip - Compact */}
                <View className="px-8 py-2 flex-row justify-between">
                    {[
                        { label: 'Diet Performance', val: `${(dietScore / 7 * 10).toFixed(1)}/10`, icon: Zap, color: '#1DD1A1' },
                        { label: 'Bio-Consistency', val: `${lifestyleScore}%`, icon: Activity, color: '#45AAF2' }
                    ].map((idx, i) => (
                        <View key={i} className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl items-center flex-1 mx-1.5">
                            <idx.icon size={14} color={idx.color} />
                            <Text className="text-white text-base font-black mt-1.5">{idx.val}</Text>
                            <Text className="text-white/40 text-[7px] font-black uppercase tracking-widest mt-0.5">{idx.label}</Text>
                        </View>
                    ))}
                </View>

                {/* Protocol Selection */}
                <View className="px-8 gap-4">
                    <Text className="text-white/40 text-[10px] font-black uppercase tracking-[4px] ml-2 mb-2">Protocol Command</Text>

                    <ProtocolCard
                        title="Mediterranean Synthesis"
                        subtitle="Diet adherence tracker"
                        icon={Shield}
                        color="#1DD1A1"
                        onPress={() => router.push('/track')}
                    />

                    <ProtocolCard
                        title="Symptom Analytics"
                        subtitle="AI-Powered triage system"
                        icon={Search}
                        color="#45AAF2"
                        onPress={() => router.push('/learn')}
                    />

                    <ProtocolCard
                        title="Clinical Education"
                        subtitle="Next-gen oncology academy"
                        icon={BookOpen}
                        color="#7158E2"
                        onPress={() => router.push('/learn')}
                    />

                    <ProtocolCard
                        title="Alert System"
                        subtitle="Screening & protocol reminders"
                        icon={Bell}
                        color="#FF4757"
                        onPress={() => router.push('/reminders')}
                    />
                </View>
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
