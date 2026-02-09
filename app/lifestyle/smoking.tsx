import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Share } from 'react-native';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { Card } from '../../src/components/ui/Card';
import { useLifestyleStore } from '../../src/store/lifestyleStore';
import { ChevronLeft, CigaretteOff, Award, Clock, Heart, Zap, ShieldCheck, Share2, RefreshCw } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp, Layout } from 'react-native-reanimated';

const MILESTONES = [
    { id: 1, time: 20 * 60, title: "Blood Pressure", desc: "Pulse and blood pressure drop back to normal.", icon: Heart, color: '#FF4757' },
    { id: 2, time: 12 * 60 * 60, title: "Carbon Monoxide", desc: "CO levels in blood drop to normal; oxygen increases.", icon: Zap, color: '#F7B731' },
    { id: 3, time: 24 * 60 * 60, title: "Heart Attack Risk", desc: "Anxiety and stress levels begin to stabilize.", icon: ShieldCheck, color: '#1DD1A1' },
    { id: 4, time: 48 * 60 * 60, title: "Nerve Endings", desc: "Sense of taste and smell start to improve.", icon: Award, color: '#45AAF2' },
    { id: 5, time: 72 * 60 * 60, title: "Lung Function", desc: "Bronchial tubes relax; breathing becomes easier.", icon: Clock, color: '#A55EEA' },
];

export default function SmokingCessationScreen() {
    const router = useRouter();
    const { quitDate, setQuitDate } = useLifestyleStore();
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const timeDiff = useMemo(() => {
        if (!quitDate) return null;
        const diff = now.getTime() - new Date(quitDate).getTime();
        if (diff < 0) return 0;
        return diff / 1000;
    }, [quitDate, now]);

    const formatTime = (seconds: number) => {
        const d = Math.floor(seconds / (24 * 3600));
        const h = Math.floor((seconds % (24 * 3600)) / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        return { d, h, m, s };
    };

    const handleReset = () => {
        setQuitDate(new Date().toISOString());
    };

    return (
        <ScreenContainer hasWave={false} darkStatus={false} withPadding={false} fullScreen={true} className="bg-black">
            <LinearGradient
                colors={['#1a1a2e', '#000000']}
                style={StyleSheet.absoluteFill}
            />

            <View className="px-6 pt-12 pb-6 flex-row items-center justify-between">
                <Pressable onPress={() => router.back()} className="bg-white/10 w-12 h-12 rounded-2xl items-center justify-center border border-white/20 backdrop-blur-xl">
                    <ChevronLeft size={24} color="white" />
                </Pressable>
                <Text className="text-white font-black uppercase tracking-[3px] text-xs">Cessation Protocol</Text>
                <Pressable className="bg-white/10 w-12 h-12 rounded-2xl items-center justify-center border border-white/20 backdrop-blur-xl">
                    <Share2 size={20} color="white" />
                </Pressable>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}>
                {/* Hero Section */}
                <Animated.View entering={FadeInDown.duration(800)} className="mb-10 items-center">
                    <View className="w-20 h-20 bg-nxtcure-primary/20 rounded-3xl items-center justify-center mb-6 border border-nxtcure-primary/30">
                        <CigaretteOff size={40} color="#1DD1A1" />
                    </View>
                    <Text className="text-4xl font-black text-white text-center tracking-tighter mb-2">
                        Quit Time.
                    </Text>
                    {!quitDate ? (
                        <Pressable onPress={handleReset} className="bg-nxtcure-primary px-10 py-5 rounded-2xl mt-4 shadow-lg shadow-nxtcure-primary/20">
                            <Text className="text-white font-black uppercase tracking-widest">Start Quit Journey</Text>
                        </Pressable>
                    ) : (
                        <View className="flex-row gap-4 mt-6">
                            {Object.entries(formatTime(timeDiff || 0)).map(([unit, val], i) => (
                                <View key={unit} className="items-center">
                                    <View className="bg-white/5 w-16 h-20 rounded-2xl border border-white/10 items-center justify-center mb-2">
                                        <Text className="text-white text-2xl font-black">{val}</Text>
                                    </View>
                                    <Text className="text-white/40 text-[9px] font-black uppercase tracking-widest">{unit === 'd' ? 'Days' : unit === 'h' ? 'Hours' : unit === 'm' ? 'Mins' : 'Secs'}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </Animated.View>

                {quitDate && (
                    <>
                        {/* Clinical Milestones */}
                        <Animated.View entering={FadeInDown.delay(200)}>
                            <Text className="text-white/40 text-[10px] font-black uppercase tracking-[4px] mb-6">PHYSIOLOGICAL RECOVERY</Text>
                            <View className="gap-4 mb-10">
                                {MILESTONES.map((m, idx) => {
                                    const isAchieved = (timeDiff || 0) >= m.time;
                                    const Icon = m.icon;
                                    return (
                                        <Animated.View key={m.id} entering={FadeInDown.delay(300 + idx * 100)}>
                                            <Card className={`p-5 rounded-[28px] border-white/10 ${isAchieved ? 'bg-white/5 opacity-100' : 'bg-white/2 opacity-30'}`}>
                                                <View className="flex-row items-center">
                                                    <View style={{ backgroundColor: isAchieved ? m.color : 'rgba(255,255,255,0.1)' }} className="w-12 h-12 rounded-2xl items-center justify-center mr-5">
                                                        <Icon size={24} color="white" />
                                                    </View>
                                                    <View className="flex-1">
                                                        <Text className="text-white font-black text-base">{m.title}</Text>
                                                        <Text className="text-white/60 text-xs mt-1 leading-5">{m.desc}</Text>
                                                    </View>
                                                    {isAchieved && (
                                                        <View className="bg-nxtcure-primary/20 p-1.5 rounded-full">
                                                            <ShieldCheck size={16} color="#1DD1A1" />
                                                        </View>
                                                    )}
                                                </View>
                                            </Card>
                                        </Animated.View>
                                    );
                                })}
                            </View>
                        </Animated.View>

                        {/* Reset Protocol */}
                        <Animated.View entering={FadeInDown.delay(800)} className="mb-10">
                            <Card className="bg-red-500/10 border-red-500/30 p-6 rounded-[32px] items-center">
                                <Text className="text-white font-black text-lg mb-2">Relapsed?</Text>
                                <Text className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-6">Clinical Reset Protocol</Text>
                                <Pressable onPress={handleReset} className="bg-red-500/10 border border-red-500/30 px-8 py-4 rounded-2xl flex-row items-center">
                                    <RefreshCw size={18} color="#f87171" className="mr-3" />
                                    <Text className="text-red-400 font-black tracking-tight">Restart Tomorrow (Target: Zero Smoke)</Text>
                                </Pressable>
                            </Card>
                        </Animated.View>
                    </>
                )}

                {/* Emergency Resources */}
                <View className="mt-4">
                    <Text className="text-white/40 text-[10px] font-black uppercase tracking-[4px] mb-4">EMERGENCY PROTOCOL</Text>
                    <Pressable className="bg-white/5 border border-white/10 p-6 rounded-[28px] mb-4">
                        <Text className="text-white font-black text-xl mb-1">Quitline Access</Text>
                        <Text className="text-white/60 text-xs leading-5">Immediate clinical counseling for nicotine withdrawal symptoms.</Text>
                        <View className="bg-nxtcure-primary w-12 h-12 rounded-full items-center justify-center self-end -mt-8">
                            <Zap size={20} color="white" />
                        </View>
                    </Pressable>
                </View>
            </ScrollView>
        </ScreenContainer>
    );
}
