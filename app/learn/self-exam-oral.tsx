import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Dimensions } from 'react-native';
import { ChevronLeft, Info, ShieldCheck, AlertCircle, CheckCircle2, Search, ArrowRight, UserCheck } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { Card } from '../../src/components/ui/Card';
import { useScreeningStore } from '../../src/store/screeningStore';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const CHECKLIST = [
    { area: 'Lips & Gums', check: 'Look for sores or unusual color changes.' },
    { area: 'Tongue', check: 'Check top, bottom, and sides for white/red patches.' },
    { area: 'Cheeks', check: 'Feel for lumps, bumps, or tender spots.' },
    { area: 'Roof & Floor', check: 'Inspect the floor of the mouth and the palate.' },
];

export default function OralExamScreen() {
    const router = useRouter();
    const { markAsDone } = useScreeningStore();

    const handleComplete = () => {
        markAsDone('dental');
        router.back();
    };

    return (
        <ScreenContainer hasWave={false} darkStatus={false} withPadding={false} fullScreen={true} className="bg-black">
            <LinearGradient colors={['#3D2505', '#000000']} style={StyleSheet.absoluteFill} />

            <View className="px-6 pt-12 pb-6 flex-row items-center justify-between">
                <Pressable onPress={() => router.back()} className="bg-white/10 w-12 h-12 rounded-2xl items-center justify-center border border-white/20">
                    <ChevronLeft size={24} color="white" />
                </Pressable>
                <Text className="text-white font-black uppercase tracking-[3px] text-xs">Oral Screening</Text>
                <View className="w-12 h-12" />
            </View>

            <ScrollView className="flex-1 px-8" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                <Animated.View entering={FadeInDown.duration(800)}>
                    <Text className="text-white/40 text-[10px] font-black uppercase tracking-[5px] mb-4">MOUTH & THROAT CHECK</Text>
                    <Text className="text-white text-4xl font-black tracking-tighter mb-10 leading-[45px]">
                        Spot Oral{'\n'}Changes.
                    </Text>

                    <Card className="bg-white/5 border-white/10 p-8 rounded-[40px] mb-8">
                        <Text className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-6">WHAT TO LOOK FOR</Text>

                        <View className="gap-6">
                            <View className="flex-row items-start">
                                <View className="bg-red-500/20 w-8 h-8 rounded-lg items-center justify-center mr-4 mt-1">
                                    <AlertCircle size={16} color="#FF4757" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-white font-black">Patches</Text>
                                    <Text className="text-white/40 text-xs leading-5 mt-1">Flat white or red patches that don't go away after 2 weeks.</Text>
                                </View>
                            </View>

                            <View className="flex-row items-start">
                                <View className="bg-yellow-500/20 w-8 h-8 rounded-lg items-center justify-center mr-4 mt-1">
                                    <AlertCircle size={16} color="#F7B731" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-white font-black">Sores</Text>
                                    <Text className="text-white/40 text-xs leading-5 mt-1">Sores that bleed easily or do not heal.</Text>
                                </View>
                            </View>

                            <View className="flex-row items-start">
                                <View className="bg-blue-500/20 w-8 h-8 rounded-lg items-center justify-center mr-4 mt-1">
                                    <Search size={16} color="#45AAF2" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-white font-black">Lumps</Text>
                                    <Text className="text-white/40 text-xs leading-5 mt-1">Lumps or thickening of the tissues in the mouth or neck.</Text>
                                </View>
                            </View>
                        </View>
                    </Card>

                    <Text className="text-white/40 text-[10px] font-black uppercase tracking-[4px] ml-2 mb-4">SYSTEMATIC CHECK</Text>
                    {CHECKLIST.map((item, idx) => (
                        <Card key={idx} className="bg-white/5 border-white/10 p-6 rounded-[32px] mb-4 flex-row items-center">
                            <View className="bg-white/5 w-10 h-10 rounded-xl items-center justify-center mr-5 border border-white/5">
                                <Text className="text-white/40 font-black">{idx + 1}</Text>
                            </View>
                            <View className="flex-1">
                                <Text className="text-white font-black">{item.area}</Text>
                                <Text className="text-white/40 text-[10px] font-bold mt-0.5">{item.check}</Text>
                            </View>
                        </Card>
                    ))}

                    <View className="h-[1px] bg-white/10 my-8" />

                    <Card className="bg-nxtcure-primary/10 border border-nxtcure-primary/30 p-8 rounded-[40px] mb-12">
                        <View className="flex-row items-center mb-4">
                            <UserCheck size={24} color="#1DD1A1" className="mr-5" />
                            <Text className="text-white font-black text-xl">Annual Dentist Visit</Text>
                        </View>
                        <Text className="text-white/60 text-xs leading-6">
                            Dentists are trained to perform professional oral cancer screenings. This self-exam does NOT replace your annual professional check-up.
                        </Text>
                    </Card>

                    <Pressable
                        onPress={handleComplete}
                        className="bg-nxtcure-primary h-18 rounded-[24px] items-center justify-center shadow-lg shadow-nxtcure-primary/20 mb-10"
                    >
                        <Text className="text-white font-black uppercase tracking-widest text-lg">Mark as Screened</Text>
                    </Pressable>
                </Animated.View>
            </ScrollView>
        </ScreenContainer>
    );
}
