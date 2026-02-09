import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Dimensions } from 'react-native';
import { ChevronLeft, ChevronRight, Info, ShieldCheck, AlertCircle, CheckCircle2, Phone, Calendar, Search, Video, Clock } from 'lucide-react-native';
import { useRouter, Stack } from 'expo-router';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { Card } from '../../src/components/ui/Card';
import { useScreeningStore } from '../../src/store/screeningStore';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInRight, FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

type ExamView = 'intro' | 'tutorial' | 'abnormal' | 'success';

const STEPS = [
    {
        title: 'Visual Inspection',
        description: 'Look at your breasts in a mirror with your shoulders straight and arms on your hips.',
        points: ['Distortion or swelling', 'Dimpling or puckering (orange peel texture)', 'Nipple inversion or redness'],
        info: "Repeat with arms raised to check for changes in the lower breast area.",
        icon: '👀'
    },
    {
        title: 'Palpation (Lying Down)',
        description: 'Lie down and use your right hand to feel your left breast, then vice versa.',
        points: ['Use flat pads of 3 middle fingers', 'Move in small, circular motions', 'Cover collarbone to bra line, armpit to cleavage'],
        info: 'Firm pressure for deep tissue, light for surface.',
        icon: '🤲'
    },
    {
        title: 'Standing / Shower',
        description: 'Many women find it easier to feel changes when the skin is wet and soapy.',
        points: ['Check the entire breast and armpit area', 'Circular, vertical or wedge patterns are all effective', 'Consistency in pattern is key'],
        info: 'Soapy hands glide more easily over the skin surface.',
        icon: '🚿'
    }
];

export default function BSEScreen() {
    const [view, setView] = useState<ExamView>('intro');
    const [step, setStep] = useState(0);
    const router = useRouter();
    const { markAsDone } = useScreeningStore();

    const handleFinish = (isNormal: boolean) => {
        if (isNormal) {
            markAsDone('breast_self');
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
                    <LinearGradient colors={['#250515', '#000000']} style={StyleSheet.absoluteFill} />
                    <View className="px-6 pt-12 pb-6 flex-row items-center">
                        <Pressable onPress={() => router.back()} className="bg-white/10 w-12 h-12 rounded-2xl items-center justify-center border border-white/20">
                            <ChevronLeft size={24} color="white" />
                        </Pressable>
                        <Text className="text-white font-black uppercase tracking-[3px] text-xs ml-4">Clinical Protocol</Text>
                    </View>

                    <ScrollView className="flex-1 px-8" showsVerticalScrollIndicator={false}>
                        <Animated.View entering={FadeInDown.duration(800)} className="mt-8 mb-12">
                            <Text className="text-white text-5xl font-black tracking-tighter leading-[50px]">
                                Breast{'\n'}Self-Exam.
                            </Text>
                            <View className="h-1 w-20 bg-[#A55EEA] mt-6 rounded-full" />
                        </Animated.View>

                        <Animated.View entering={FadeInDown.delay(200)} className="mb-10">
                            <Text className="text-white/40 text-[10px] font-black uppercase tracking-[4px] mb-6">WHY IT MATTERS</Text>
                            <Text className="text-white/80 text-lg leading-7 font-medium">
                                Early detection is the most effective tool against breast cancer. <Text className="text-[#A55EEA] font-black">40%</Text> of diagnosed breast cancers are detected by women who feel a lump.
                            </Text>
                        </Animated.View>

                        <Animated.View entering={FadeInDown.delay(400)} className="flex-row gap-4 mb-10">
                            <Card className="flex-1 bg-white/5 border-white/10 p-5 rounded-[28px]">
                                <Clock size={20} color="#A55EEA" className="mb-2" />
                                <Text className="text-white font-black text-sm">8-10 Mins</Text>
                                <Text className="text-white/30 text-[9px] font-bold uppercase tracking-widest mt-1">Time Required</Text>
                            </Card>
                            <Card className="flex-1 bg-white/5 border-white/10 p-5 rounded-[28px]">
                                <Calendar size={20} color="#45AAF2" className="mb-2" />
                                <Text className="text-white font-black text-sm">Monthly</Text>
                                <Text className="text-white/30 text-[9px] font-bold uppercase tracking-widest mt-1">Frequency</Text>
                            </Card>
                        </Animated.View>

                        <Animated.View entering={FadeInDown.delay(600)} className="bg-white/5 p-6 rounded-[32px] border border-white/10 flex-row items-center mb-12">
                            <Video size={24} color="rgba(255,255,255,0.4)" className="mr-5" />
                            <Text className="flex-1 text-white/60 text-xs leading-5">
                                Best performed 3-5 days after your period ends, when breasts are least likely to be swollen or tender.
                            </Text>
                        </Animated.View>
                    </ScrollView>

                    <View className="p-8">
                        <Pressable
                            onPress={() => setView('tutorial')}
                            className="bg-[#A55EEA] h-18 rounded-[24px] flex-row items-center justify-center shadow-lg shadow-[#A55EEA]/20"
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
                    <LinearGradient colors={['#250515', '#000000']} style={StyleSheet.absoluteFill} />
                    <View className="px-6 pt-12 pb-6 flex-row items-center justify-between">
                        <Pressable onPress={() => setStep(prev => Math.max(0, prev - 1))} className="bg-white/10 w-12 h-12 rounded-2xl items-center justify-center border border-white/20">
                            <ChevronLeft size={24} color="white" />
                        </Pressable>
                        <View className="flex-row gap-2">
                            {STEPS.map((_, i) => (
                                <View key={i} className={`h-1.5 rounded-full ${i <= step ? 'bg-[#A55EEA]' : 'bg-white/10'}`} style={{ width: 40 }} />
                            ))}
                        </View>
                        <View className="w-12 h-12" />
                    </View>

                    <ScrollView className="flex-1 px-8" showsVerticalScrollIndicator={false}>
                        <Animated.View key={step} entering={FadeInRight.duration(400)} className="items-center mt-6">
                            <View className="w-48 h-48 bg-[#A55EEA]/10 rounded-full items-center justify-center mb-8 relative">
                                <Text className="text-7xl">{current.icon}</Text>
                                <View className="absolute inset-0 rounded-full border-2 border-dashed border-[#A55EEA]/30" />
                            </View>

                            <Text className="text-white/40 text-[10px] font-black uppercase tracking-[4px] mb-2">STEP {step + 1} OF {STEPS.length}</Text>
                            <Text className="text-white text-3xl font-black tracking-tighter text-center mb-6">{current.title}.</Text>

                            <Card className="bg-white/5 border-white/10 p-6 rounded-[32px] w-full mb-8">
                                <Text className="text-white/80 font-medium leading-6 mb-6">{current.description}</Text>
                                <View className="gap-4">
                                    {current.points.map((p, i) => (
                                        <View key={i} className="flex-row items-center">
                                            <View className="w-1.5 h-1.5 rounded-full bg-[#A55EEA] mr-4" />
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
                                className="bg-[#A55EEA] h-18 rounded-[24px] items-center justify-center shadow-lg shadow-[#A55EEA]/20"
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
                                    className="bg-[#A55EEA] h-18 rounded-[24px] items-center justify-center shadow-lg shadow-[#A55EEA]/20"
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
                        <Text className="text-red-400 font-black uppercase tracking-[3px] text-xs">Clinical Path</Text>
                    </View>

                    <ScrollView className="flex-1 px-8" showsVerticalScrollIndicator={false}>
                        <Animated.View entering={FadeInDown.duration(800)} className="mt-4 mb-8">
                            <Text className="text-white text-4xl font-black tracking-tighter leading-[45px]">
                                ⚠️ Important:{'\n'}Action Plan.
                            </Text>
                            <Text className="text-red-400/60 text-sm font-bold mt-4">You reported a change. Most findings are not cancer, but professional validation is required.</Text>
                        </Animated.View>

                        <Card className="bg-white/5 border-white/10 p-8 rounded-[40px] mb-8">
                            <View className="flex-row items-start mb-8">
                                <View className="bg-red-500/20 w-10 h-10 rounded-xl items-center justify-center mr-4">
                                    <Search size={20} color="#FF4757" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-white font-black text-lg">1. Medical Exam</Text>
                                    <Text className="text-white/40 text-xs leading-5 mt-2">See your primary care doctor or gynecologist within 1-2 weeks for a clinical breast exam.</Text>
                                </View>
                            </View>

                            <View className="flex-row items-start mb-8">
                                <View className="bg-blue-500/20 w-10 h-10 rounded-xl items-center justify-center mr-4">
                                    <Calendar size={20} color="#45AAF2" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-white font-black text-lg">2. Diagnostic Imaging</Text>
                                    <Text className="text-white/40 text-xs leading-5 mt-2">Expect a diagnostic mammogram or ultrasound. This provides high-resolution data for the physician.</Text>
                                </View>
                            </View>

                            <View className="flex-row items-start">
                                <View className="bg-[#A55EEA]/20 w-10 h-10 rounded-xl items-center justify-center mr-4">
                                    <Info size={20} color="#A55EEA" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-white font-black text-lg">3. Possible Biopsy</Text>
                                    <Text className="text-white/40 text-xs leading-5 mt-2">If imaging is inconclusive, a small tissue sample (biopsy) may be taken to ensure total accuracy.</Text>
                                </View>
                            </View>
                        </Card>

                        <Pressable className="bg-white/5 border border-white/10 p-6 rounded-[28px] flex-row items-center mb-12">
                            <Phone size={24} color="white" opacity={0.6} className="mr-5" />
                            <View className="flex-1">
                                <Text className="text-white font-black">Schedule Visit</Text>
                                <Text className="text-white/40 text-[10px] uppercase font-bold tracking-widest mt-1">Contact your provider</Text>
                            </View>
                            <ChevronRight size={20} color="white" opacity={0.2} />
                        </Pressable>
                    </ScrollView>

                    <View className="p-8">
                        <Pressable
                            onPress={() => router.push('/(tabs)/reminders')}
                            className="bg-[#A55EEA] h-18 rounded-[24px] items-center justify-center shadow-lg shadow-[#A55EEA]/20"
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
                    <LinearGradient colors={['#3d0525', '#000000']} style={StyleSheet.absoluteFill} />
                    <View className="flex-1 items-center justify-center px-10">
                        <Animated.View entering={FadeInDown.duration(800)} className="items-center">
                            <View className="w-24 h-24 bg-[#A55EEA]/20 rounded-full items-center justify-center mb-10">
                                <CheckCircle2 size={48} color="#A55EEA" />
                            </View>
                            <Text className="text-white text-4xl font-black tracking-tighter text-center mb-6">Protocol Clear.</Text>
                            <Text className="text-white/40 text-center leading-6 mb-12">
                                Excellent self-surveillance. You have completed your breast health protocol. We will notify you for the next cycle.
                            </Text>

                            <Pressable
                                onPress={() => router.back()}
                                className="bg-[#A55EEA] px-12 h-16 rounded-full items-center justify-center"
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
