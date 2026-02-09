import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Dimensions } from 'react-native';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { Card } from '../../src/components/ui/Card';
import { useLifestyleStore } from '../../src/store/lifestyleStore';
import { ChevronLeft, Sun, ShieldAlert, Timer, Calendar, Info, AlertTriangle, CloudSun } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function SunProtectionScreen() {
    const router = useRouter();
    const today = new Date().toISOString().split('T')[0];
    const { logs, toggleHabit } = useLifestyleStore();
    const [uvIndex, setUvIndex] = useState(7); // Simulated UV index
    const [timerActive, setTimerActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(120 * 60); // 2 hours in seconds

    const isApplied = logs[today]?.sunScreenApplied || false;

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timerActive && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [timerActive, timeLeft]);

    const formatTimer = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${h}h ${m}m`;
    };

    const startTimer = () => {
        setTimeLeft(120 * 60);
        setTimerActive(true);
        if (!isApplied) toggleHabit(today, 'sunScreenApplied');
    };

    const uvStatus = uvIndex >= 8 ? 'Very High' : uvIndex >= 6 ? 'High' : uvIndex >= 3 ? 'Moderate' : 'Low';
    const uvColor = uvIndex >= 8 ? '#EB3B5A' : uvIndex >= 6 ? '#F7B731' : uvIndex >= 3 ? '#1DD1A1' : '#45AAF2';

    return (
        <ScreenContainer hasWave={false} darkStatus={false} withPadding={false} fullScreen={true} className="bg-black">
            <LinearGradient
                colors={['#3d2b05', '#000000']}
                style={StyleSheet.absoluteFill}
            />

            <View className="px-6 pt-12 pb-6 flex-row items-center justify-between">
                <Pressable onPress={() => router.back()} className="bg-white/10 w-12 h-12 rounded-2xl items-center justify-center border border-white/20 backdrop-blur-xl">
                    <ChevronLeft size={24} color="white" />
                </Pressable>
                <Text className="text-white font-black uppercase tracking-[3px] text-xs">Radiation Shield</Text>
                <View className="w-12 h-12" />
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}>
                {/* UV Index Hero */}
                <Animated.View entering={FadeInDown.duration(800)} className="mb-10 items-center">
                    <View className="items-center mb-8">
                        <View style={{ borderColor: uvColor }} className="w-40 h-40 rounded-full border-4 items-center justify-center">
                            <Text style={{ color: uvColor }} className="text-6xl font-black">{uvIndex}</Text>
                            <Text className="text-white/40 text-[10px] font-black uppercase tracking-widest">UV Index</Text>
                        </View>
                        <View style={{ backgroundColor: uvColor }} className="px-4 py-1.5 rounded-full mt-4">
                            <Text className="text-white text-[10px] font-black uppercase tracking-widest">{uvStatus} Risk</Text>
                        </View>
                    </View>

                    <Text className="text-white/60 text-center font-medium leading-5">
                        UV radiation is a Group 1 carcinogen. Solar energy directly damages DNA, leading to melanoma and skin carcinomas.
                    </Text>
                </Animated.View>

                {/* Sunscreen Protocol */}
                <Animated.View entering={FadeInDown.delay(200)} className="mb-10">
                    <Text className="text-white/40 text-[10px] font-black uppercase tracking-[4px] mb-4">RE-APPLICATION PROTOCOL</Text>
                    <Card className="bg-white/5 border-white/10 p-6 rounded-[32px]">
                        <View className="flex-row items-center justify-between mb-6">
                            <View className="flex-row items-center">
                                <View className="bg-nxtcure-primary/20 w-12 h-12 rounded-2xl items-center justify-center mr-4">
                                    <Timer size={24} color="#1DD1A1" />
                                </View>
                                <View>
                                    <Text className="text-white font-black text-xl">{timerActive ? formatTimer(timeLeft) : 'Protocol Inactive'}</Text>
                                    <Text className="text-white/40 text-[9px] font-bold uppercase tracking-widest">Next re-application due</Text>
                                </View>
                            </View>
                            <Pressable
                                onPress={startTimer}
                                className="bg-nxtcure-primary p-4 rounded-2xl shadow-lg shadow-nxtcure-primary/20"
                            >
                                <Text className="text-white font-black text-xs">START TIMER</Text>
                            </Pressable>
                        </View>

                        <View className="bg-white/5 p-4 rounded-2xl">
                            <Text className="text-white/60 text-xs leading-5">
                                • SPF 30+ Broad Spectrum required.{'\n'}
                                • Apply 2 finger-lengths for face/neck.{'\n'}
                                • Re-apply every 2 hours or after swimming.
                            </Text>
                        </View>
                    </Card>
                </Animated.View>

                {/* Skin Check Reminder */}
                <Animated.View entering={FadeInDown.delay(400)} className="mb-10">
                    <Card className="bg-blue-500/10 border-blue-500/30 p-6 rounded-[32px] flex-row items-center">
                        <View className="bg-blue-500/20 w-14 h-14 rounded-2xl items-center justify-center mr-5">
                            <Calendar size={28} color="#45AAF2" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-white font-black text-lg">Self-Skin Exam</Text>
                            <Text className="text-white/60 text-xs mt-1">Check moles for ABCDE changes. Due every 30 days.</Text>
                            <Pressable className="mt-3">
                                <Text className="text-blue-400 font-bold text-xs">[Start Mole Map →]</Text>
                            </Pressable>
                        </View>
                    </Card>
                </Animated.View>

                {/* Tanning Warning */}
                <Animated.View entering={FadeInDown.delay(600)}>
                    <Card className="bg-red-500/10 border-red-500/30 p-6 rounded-[32px] flex-row items-center">
                        <ShieldAlert size={24} color="#EB3B5A" className="mr-5" />
                        <View className="flex-1">
                            <Text className="text-red-400 font-black tracking-tight text-xs uppercase mb-1">IARC Group 1 Indicator</Text>
                            <Text className="text-white font-black text-base">Tanning Bed Prohibition</Text>
                            <Text className="text-white/40 text-[10px] mt-1 leading-4">
                                Artificial tanning devices increase melanoma risk by 75% if used before age 35. Total avoidance is standard medical protocol.
                            </Text>
                        </View>
                    </Card>
                </Animated.View>
            </ScrollView>
        </ScreenContainer>
    );
}
