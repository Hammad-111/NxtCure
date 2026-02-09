import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Dimensions, Image } from 'react-native';
import { ChevronLeft, ChevronRight, PlayCircle, Info, ShieldCheck, AlertCircle, CheckCircle2, Phone, Calendar, Search, Clock } from 'lucide-react-native';
import { useRouter, Stack } from 'expo-router';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { Card } from '../../src/components/ui/Card';
import { useScreeningStore } from '../../src/store/screeningStore';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInRight, FadeInLeft, FadeInDown, Layout } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

type ExamView = 'intro' | 'tutorial' | 'abnormal' | 'success';

export default function TSEScreen() {
    const [view, setView] = useState<ExamView>('intro');
    const [step, setStep] = useState(0);
    const router = useRouter();
    const { markAsDone } = useScreeningStore();

    const STEPS = [
        {
            title: 'Visual Inspection',
            description: 'Stand in front of a mirror. Look for swelling, asymmetry, or changes in skin texture.',
            points: ['Swelling or asymmetry', 'Changes in skin texture', 'Visible lumps or bumps'],
            info: "It's normal for one testicle to be slightly larger or hang lower.",
            icon: '👀'
        },
        {
            title: 'Palpation (Feeling)',
            description: 'The best time is after a warm shower when the scrotum is relaxed.',
            points: ['Cup scrotum in palm', 'Use thumb and fingers to gently roll each testicle', 'Feel for hard lumps or changes'],
            info: 'Normal testicles are smooth, firm, and egg-shaped.',
            icon: '🤲'
        },
        {
            title: 'Normal Anatomy',
            description: 'Knowing what is supposed to be there prevents false alarms.',
            points: ['Epididymis: Rope-like tube on the back (THIS IS NORMAL)', 'Testicle surface: Smooth and firm', 'Spermatic cord: Above the testicle'],
            info: 'The epididymis is often mistaken for a lump by first-timers.',
            icon: '✅'
        }
    ];

    const handleFinish = (isNormal: boolean) => {
        if (isNormal) {
            markAsDone('testicular');
            setView('success');
        } else {
            setView('abnormal');
        }
    };

    if (view === 'intro') {
        return (
            <>
                <Stack.Screen options={{ headerShown: false }} />
                <ScreenContainer hasWave={false} darkStatus={false} withPadding={false} fullScreen={true} className="bg-black">
                    <LinearGradient colors={['#051525', '#000000']} style={StyleSheet.absoluteFill} />
                    <View className="px-6 pt-12 pb-6 flex-row items-center">
                        <Pressable onPress={() => router.back()} className="bg-white/10 w-12 h-12 rounded-2xl items-center justify-center border border-white/20">
                            <ChevronLeft size={24} color="white" />
                        </Pressable>
                        <Text className="text-white font-black uppercase tracking-[3px] text-xs ml-4">Clinical Protocol</Text>
                    </View>

                    <ScrollView className="flex-1 px-8" showsVerticalScrollIndicator={false}>
                        <Animated.View entering={FadeInDown.duration(800)} className="mt-8 mb-12">
                            <Text className="text-white text-5xl font-black tracking-tighter leading-[50px]">
                                Testicular{'\n'}Self-Exam.
                            </Text>
                            <View className="h-1 w-20 bg-nxtcure-primary mt-6 rounded-full" />
                        </Animated.View>

                        <Animated.View entering={FadeInDown.delay(200)} className="mb-10">
                            <Text className="text-white/40 text-[10px] font-black uppercase tracking-[4px] mb-6">WHY IT MATTERS</Text>
                            <Text className="text-white/80 text-lg leading-7 font-medium">
                                Testicular cancer is the most common malignancy in men aged 15-35. Caught early, the cure rate is <Text className="text-nxtcure-primary font-black">95%+</Text>.
                            </Text>
                        </Animated.View>

                        <Animated.View entering={FadeInDown.delay(400)} className="flex-row gap-4 mb-10">
                            <Card className="flex-1 bg-white/5 border-white/10 p-5 rounded-[28px]">
                                <Clock size={20} color="#1DD1A1" className="mb-2" />
                                <Text className="text-white font-black text-sm">3-5 Mins</Text>
                                <Text className="text-white/30 text-[9px] font-bold uppercase tracking-widest mt-1">Time Required</Text>
                            </Card>
                            <Card className="flex-1 bg-white/5 border-white/10 p-5 rounded-[28px]">
                                <Calendar size={20} color="#45AAF2" className="mb-2" />
                                <Text className="text-white font-black text-sm">Monthly</Text>
                                <Text className="text-white/30 text-[9px] font-bold uppercase tracking-widest mt-1">Frequency</Text>
                            </Card>
                        </Animated.View>

                        <Animated.View entering={FadeInDown.delay(600)} className="bg-white/5 p-6 rounded-[32px] border border-white/10 flex-row items-center mb-12">
                            <Info size={24} color="rgba(255,255,255,0.4)" className="mr-5" />
                            <Text className="flex-1 text-white/60 text-xs leading-5">
                                Best performed during or after a warm shower. Heat relaxes the scrotum, making it easier to detect abnormalities.
                            </Text>
                        </Animated.View>
                    </ScrollView>

                    <View className="p-8">
                        <Pressable
                            onPress={() => setView('tutorial')}
                            className="bg-nxtcure-primary h-18 rounded-[24px] flex-row items-center justify-center shadow-lg shadow-nxtcure-primary/20"
                        >
                            <Text className="text-white font-black uppercase tracking-widest text-lg ml-4">Start Tutorial</Text>
                            <ChevronRight size={24} color="white" className="ml-2" />
                        </Pressable>
                    </View>
                </ScreenContainer>
            </>
        );
    }

    if (view === 'tutorial') {
        const current = STEPS[step];
        return (
            <>
                <Stack.Screen options={{ headerShown: false }} />
                <ScreenContainer hasWave={false} darkStatus={false} withPadding={false} fullScreen={true} className="bg-black">
                    <LinearGradient colors={['#051525', '#000000']} style={StyleSheet.absoluteFill} />
                    <View className="px-6 pt-12 pb-6 flex-row items-center justify-between">
                        <Pressable onPress={() => setStep(prev => Math.max(0, prev - 1))} className="bg-white/10 w-12 h-12 rounded-2xl items-center justify-center border border-white/20">
                            <ChevronLeft size={24} color="white" />
                        </Pressable>
                        <View className="flex-row gap-2">
                            {STEPS.map((_, i) => (
                                <View key={i} className={`h-1.5 rounded-full ${i <= step ? 'bg-nxtcure-primary' : 'bg-white/10'}`} style={{ width: 40 }} />
                            ))}
                        </View>
                        <View className="w-12 h-12" />
                    </View>

                    <ScrollView className="flex-1 px-8" showsVerticalScrollIndicator={false}>
                        <Animated.View key={step} entering={FadeInRight.duration(400)} className="items-center mt-6">
                            <View className="w-48 h-48 bg-nxtcure-primary/10 rounded-full items-center justify-center mb-8 relative">
                                <Text className="text-7xl">{current.icon}</Text>
                                <View className="absolute inset-0 rounded-full border-2 border-dashed border-nxtcure-primary/30" />
                            </View>

                            <Text className="text-white/40 text-[10px] font-black uppercase tracking-[4px] mb-2">STEP {step + 1} OF {STEPS.length}</Text>
                            <Text className="text-white text-3xl font-black tracking-tighter text-center mb-6">{current.title}.</Text>

                            <Card className="bg-white/5 border-white/10 p-6 rounded-[32px] w-full mb-8">
                                <Text className="text-white/80 font-medium leading-6 mb-6">{current.description}</Text>
                                <View className="gap-4">
                                    {current.points.map((p, i) => (
                                        <View key={i} className="flex-row items-center">
                                            <View className="w-1.5 h-1.5 rounded-full bg-nxtcure-primary mr-4" />
                                            <Text className="text-white/60 text-xs font-bold">{p}</Text>
                                        </View>
                                    ))}
                                </View>
                            </Card>

                            <View className="bg-blue-500/10 border border-blue-500/20 p-5 rounded-2xl flex-row items-center w-full">
                                <Info size={16} color="#45AAF2" className="mr-4" />
                                <Text className="flex-1 text-blue-100/60 text-[11px] font-medium leading-4">{current.info}</Text>
                            </View>
                        </Animated.View>
                    </ScrollView>

                    <View className="p-8 gap-4">
                        {step < STEPS.length - 1 ? (
                            <Pressable
                                onPress={() => setStep(step + 1)}
                                className="bg-nxtcure-primary h-18 rounded-[24px] flex-row items-center justify-center shadow-lg shadow-nxtcure-primary/20"
                            >
                                <Text className="text-white font-black uppercase tracking-widest text-lg">Next Step</Text>
                            </Pressable>
                        ) : (
                            <>
                                <Pressable
                                    onPress={() => handleFinish(false)}
                                    className="bg-red-500/20 border border-red-500/40 h-16 rounded-[22px] items-center justify-center"
                                >
                                    <Text className="text-red-400 font-black uppercase tracking-widest text-xs">🚨 I Felt Something Abnormal</Text>
                                </Pressable>
                                <Pressable
                                    onPress={() => handleFinish(true)}
                                    className="bg-nxtcure-primary h-18 rounded-[24px] items-center justify-center shadow-lg shadow-nxtcure-primary/20"
                                >
                                    <Text className="text-white font-black uppercase tracking-widest text-lg">Exam Complete, All Normal ✅</Text>
                                </Pressable>
                            </>
                        )}
                    </View>
                </ScreenContainer>
            </>
        );
    }

    if (view === 'abnormal') {
        return (
            <>
                <Stack.Screen options={{ headerShown: false }} />
                <ScreenContainer hasWave={false} darkStatus={false} withPadding={false} fullScreen={true} className="bg-black">
                    <LinearGradient colors={['#3d0505', '#000000']} style={StyleSheet.absoluteFill} />
                    <View className="px-6 pt-12 pb-6">
                        <Text className="text-red-400 font-black uppercase tracking-[3px] text-xs">Emergency Protocol</Text>
                    </View>

                    <ScrollView className="flex-1 px-8" showsVerticalScrollIndicator={false}>
                        <Animated.View entering={FadeInDown.duration(800)} className="mt-4 mb-8">
                            <Text className="text-white text-4xl font-black tracking-tighter leading-[45px]">
                                ⚠️ Important:{'\n'}Next Steps.
                            </Text>
                            <Text className="text-red-400/60 text-sm font-bold mt-4">You reported a lump or abnormality. Remain calm and follow this clinical path.</Text>
                        </Animated.View>

                        <Card className="bg-white/5 border-white/10 p-8 rounded-[40px] mb-8">
                            <View className="flex-row items-start mb-8">
                                <View className="bg-red-500/20 w-10 h-10 rounded-xl items-center justify-center mr-4">
                                    <Search size={20} color="#FF4757" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-white font-black text-lg">1. Don't Panic</Text>
                                    <Text className="text-white/40 text-xs leading-5 mt-2">Most lumps are benign (cysts, infections, or varicoceles), but they MUST be clinically cleared.</Text>
                                </View>
                            </View>

                            <View className="flex-row items-start mb-8">
                                <View className="bg-blue-500/20 w-10 h-10 rounded-xl items-center justify-center mr-4">
                                    <Calendar size={20} color="#45AAF2" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-white font-black text-lg">2. See a Urologist</Text>
                                    <Text className="text-white/40 text-xs leading-5 mt-2">Schedule a clinical exam within 1-2 weeks. This is non-negotiable for baseline safety.</Text>
                                </View>
                            </View>

                            <View className="flex-row items-start">
                                <View className="bg-nxtcure-primary/20 w-10 h-10 rounded-xl items-center justify-center mr-4">
                                    <Info size={20} color="#1DD1A1" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-white font-black text-lg">3. Clinical Tests</Text>
                                    <Text className="text-white/40 text-xs leading-5 mt-2">Expect a Scrotal Ultrasound and blood tests for tumor markers: AFP, hCG, and LDH.</Text>
                                </View>
                            </View>
                        </Card>

                        <Pressable className="bg-white/5 border border-white/10 p-6 rounded-[28px] flex-row items-center mb-12">
                            <Phone size={24} color="white" opacity={0.6} className="mr-5" />
                            <View className="flex-1">
                                <Text className="text-white font-black">Find Urologist</Text>
                                <Text className="text-white/40 text-[10px] uppercase font-bold tracking-widest mt-1">Search nearby clinics</Text>
                            </View>
                            <ChevronRight size={20} color="white" opacity={0.2} />
                        </Pressable>
                    </ScrollView>

                    <View className="p-8">
                        <Pressable
                            onPress={() => router.push('/(tabs)/reminders')}
                            className="bg-nxtcure-primary h-18 rounded-[24px] items-center justify-center shadow-lg shadow-nxtcure-primary/20"
                        >
                            <Text className="text-white font-black uppercase tracking-widest text-lg">Set Appointment Reminder</Text>
                        </Pressable>
                    </View>
                </ScreenContainer>
            </>
        );
    }

    if (view === 'success') {
        return (
            <>
                <Stack.Screen options={{ headerShown: false }} />
                <ScreenContainer hasWave={false} darkStatus={false} withPadding={false} fullScreen={true} className="bg-black">
                    <LinearGradient colors={['#053d25', '#000000']} style={StyleSheet.absoluteFill} />
                    <View className="flex-1 items-center justify-center px-10">
                        <Animated.View entering={FadeInDown.duration(800)} className="items-center">
                            <View className="w-24 h-24 bg-nxtcure-primary/20 rounded-full items-center justify-center mb-10">
                                <CheckCircle2 size={48} color="#1DD1A1" />
                            </View>
                            <Text className="text-white text-4xl font-black tracking-tighter text-center mb-6">Protocol Clear.</Text>
                            <Text className="text-white/40 text-center leading-6 mb-12">
                                Excellent consistency. You have completed your early detection protocol for this month. We will remind you in 30 days.
                            </Text>

                            <Pressable
                                onPress={() => router.back()}
                                className="bg-nxtcure-primary px-12 h-16 rounded-full items-center justify-center"
                            >
                                <Text className="text-white font-black uppercase tracking-widest">Return to Hub</Text>
                            </Pressable>
                        </Animated.View>
                    </View>
                </ScreenContainer>
            </>
        );
    }

    return null;
}

const styles = StyleSheet.create({});
