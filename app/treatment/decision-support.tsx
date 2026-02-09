import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Dimensions, Linking } from 'react-native';
import { ChevronLeft, Info, Search, ShieldCheck, Microscope, Pill, Activity, ExternalLink, GraduationCap, Users, ArrowRight, Layers, Target, Scale, CheckCircle2, AlertCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { Card } from '../../src/components/ui/Card';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInRight, Layout } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface TreatmentOption {
    id: string;
    title: string;
    cureRate: string;
    duration: string;
    sideEffects: string[];
    pros: string[];
    cons: string[];
    type: 'Surgery' | 'Chemo' | 'Radiation' | 'Targeted';
}

const TREATMENT_DATA: Record<string, TreatmentOption[]> = {
    'testicular-early': [
        {
            id: 'orchiectomy',
            title: 'Radical Orchiectomy',
            cureRate: '95%+',
            duration: '1-2 hour surgery',
            sideEffects: ['Surgical pain', 'Scrotal swelling'],
            pros: ['Definitive diagnosis', 'Highest cure rate'],
            cons: ['Loss of one testicle', 'Surgical risk'],
            type: 'Surgery'
        },
        {
            id: 'surveillance',
            title: 'Active Surveillance',
            cureRate: '99% (with rescue)',
            duration: '5-10 years monitoring',
            sideEffects: ['Anxiety', 'Frequent scans'],
            pros: ['No unnecessary treatment', 'Preserves fertility'],
            cons: ['Risk of recurrence', 'Requires strict compliance'],
            type: 'Targeted'
        },
        {
            id: 'chemo-single',
            title: 'Single-Cycle BEP',
            cureRate: '98%+',
            duration: '3 weeks',
            sideEffects: ['Mild nausea', 'Hair thinning', 'Fatigue'],
            pros: ['Reduces recurrence risk', 'Short duration'],
            cons: ['Chemotherapy toxicity', 'Small long-term risk'],
            type: 'Chemo'
        }
    ]
};

export default function DecisionSupportScreen() {
    const router = useRouter();
    const [selectedDiagnosis, setSelectedDiagnosis] = useState('testicular-early');
    const options = TREATMENT_DATA[selectedDiagnosis] || [];
    const [viewMode, setViewMode] = useState<'list' | 'compare'>('list');

    return (
        <ScreenContainer hasWave={false} darkStatus={false} withPadding={false} fullScreen={true} className="bg-black">
            <LinearGradient colors={['#052E16', '#000000']} style={StyleSheet.absoluteFill} />

            <View className="px-6 pt-12 pb-6 flex-row items-center justify-between">
                <Pressable onPress={() => router.back()} className="bg-white/10 w-12 h-12 rounded-2xl items-center justify-center border border-white/20">
                    <ChevronLeft size={24} color="white" />
                </Pressable>
                <Text className="text-white font-black uppercase tracking-[3px] text-xs">Decision Support</Text>
                <Pressable className="bg-white/5 w-12 h-12 rounded-2xl items-center justify-center border border-white/10">
                    <Microscope size={20} color="rgba(255,255,255,0.4)" />
                </Pressable>
            </View>

            <ScrollView className="flex-1 px-8" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                <Animated.View entering={FadeInDown.duration(800)}>
                    <Text className="text-white/40 text-[10px] font-black uppercase tracking-[5px] mb-4">ONCOLOGY COMPARISON</Text>
                    <Text className="text-white text-4xl font-black tracking-tighter mb-8 leading-[45px]">
                        Compare Your{'\n'}Options.
                    </Text>

                    <Card className="bg-white/5 border-white/10 p-6 rounded-[32px] mb-10">
                        <View className="flex-row items-center justify-between">
                            <View>
                                <Text className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-1">Current Profile</Text>
                                <Text className="text-white font-bold text-lg">Stage I Testicular Cancer</Text>
                            </View>
                            <Target size={24} color="#1DD1A1" opacity={0.6} />
                        </View>
                    </Card>

                    <View className="flex-row gap-4 mb-10">
                        <Pressable
                            onPress={() => setViewMode('list')}
                            className={`flex-1 py-4 rounded-3xl border items-center ${viewMode === 'list' ? 'bg-nxtcure-primary border-nxtcure-primary' : 'bg-white/5 border-white/10'}`}
                        >
                            <Text className={`font-black text-[10px] uppercase tracking-widest ${viewMode === 'list' ? 'text-white' : 'text-white/40'}`}>Detailed List</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => setViewMode('compare')}
                            className={`flex-1 py-4 rounded-3xl border items-center ${viewMode === 'compare' ? 'bg-nxtcure-primary border-nxtcure-primary' : 'bg-white/5 border-white/10'}`}
                        >
                            <Text className={`font-black text-[10px] uppercase tracking-widest ${viewMode === 'compare' ? 'text-white' : 'text-white/40'}`}>Side-by-Side</Text>
                        </Pressable>
                    </View>

                    {viewMode === 'list' ? (
                        <View className="gap-8">
                            {options.map((option) => (
                                <Animated.View key={option.id} entering={FadeInDown.delay(200).duration(600)}>
                                    <Card className="bg-white/5 border-white/10 p-8 rounded-[40px]">
                                        <View className="flex-row justify-between items-start mb-6">
                                            <View className="flex-1 mr-4">
                                                <View className="flex-row items-center mb-2">
                                                    <View className={`w-1.5 h-1.5 rounded-full mr-2 ${option.type === 'Surgery' ? 'bg-red-500' : 'bg-blue-400'}`} />
                                                    <Text className="text-white/40 text-[9px] font-black uppercase tracking-widest">{option.type}</Text>
                                                </View>
                                                <Text className="text-white font-black text-2xl">{option.title}</Text>
                                            </View>
                                            <View className="bg-white/10 px-3 py-1.5 rounded-xl">
                                                <Text className="text-nxtcure-primary font-black text-xs">{option.cureRate}</Text>
                                            </View>
                                        </View>

                                        <View className="flex-row gap-4 mb-8">
                                            <View>
                                                <Text className="text-white/30 text-[9px] font-black uppercase mb-1">Duration</Text>
                                                <Text className="text-white/80 font-bold text-sm">{option.duration}</Text>
                                            </View>
                                        </View>

                                        <Text className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-4">Pros & Cons</Text>
                                        <View className="flex-row gap-4 mb-8">
                                            <View className="flex-1">
                                                {option.pros.map((p, i) => (
                                                    <View key={i} className="flex-row items-center mb-2">
                                                        <CheckCircle2 size={12} color="#1DD1A1" className="mr-2" />
                                                        <Text className="text-white/60 text-xs font-medium">{p}</Text>
                                                    </View>
                                                ))}
                                            </View>
                                            <View className="flex-1">
                                                {option.cons.map((c, i) => (
                                                    <View key={i} className="flex-row items-center mb-2">
                                                        <AlertCircle size={12} color="#EB3B5A" className="mr-2" />
                                                        <Text className="text-white/60 text-xs font-medium">{c}</Text>
                                                    </View>
                                                ))}
                                            </View>
                                        </View>

                                        <Pressable
                                            onPress={() => Linking.openURL(`https://clinicaltrials.gov/search?term=${encodeURIComponent(option.title)}`)}
                                            className="bg-white/10 h-14 rounded-2xl flex-row items-center justify-center border border-white/10"
                                        >
                                            <ExternalLink size={16} color="white" opacity={0.6} className="mr-3" />
                                            <Text className="text-white font-black uppercase tracking-widest text-[10px]">Clinical Trials</Text>
                                        </Pressable>
                                    </Card>
                                </Animated.View>
                            ))}
                        </View>
                    ) : (
                        <Card className="bg-white/5 border-white/10 p-4 rounded-[32px] overflow-hidden">
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <View className="flex-row">
                                    {options.map((option) => (
                                        <View key={option.id} className="w-56 p-4 border-r border-white/5">
                                            <Text className="text-white font-black text-lg mb-4 h-12">{option.title}</Text>

                                            <View className="bg-nxtcure-primary/10 p-4 rounded-2xl mb-6 items-center">
                                                <Text className="text-nxtcure-primary font-black text-xl">{option.cureRate}</Text>
                                                <Text className="text-white/30 text-[8px] font-black uppercase tracking-widest mt-1">Cure Rate</Text>
                                            </View>

                                            <Text className="text-white/40 text-[9px] font-black uppercase mb-3">Toxicity/Impact</Text>
                                            <View className="gap-2">
                                                {option.sideEffects.map((se, i) => (
                                                    <View key={i} className="bg-white/5 px-3 py-1.5 rounded-xl">
                                                        <Text className="text-white/60 text-[10px] font-bold">{se}</Text>
                                                    </View>
                                                ))}
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </ScrollView>
                        </Card>
                    )}

                    <View className="mt-12 bg-blue-500/10 border border-blue-500/20 p-6 rounded-3xl flex-row items-start">
                        <Scale size={20} color="#45AAF2" className="mr-4 mt-1" />
                        <Text className="flex-1 text-blue-100/60 text-[11px] font-medium leading-5">
                            <Text className="font-black text-blue-400">MEDICAL NOTICE:</Text> Decisions must be made in consultation with a multidisciplinary oncology committee. Statistics represent broad clinical cohorts and individual results may vary.
                        </Text>
                    </View>
                </Animated.View>
            </ScrollView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({});
