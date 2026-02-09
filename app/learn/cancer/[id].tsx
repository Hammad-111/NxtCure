import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Dimensions, Linking } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ChevronLeft, BarChart2, ShieldAlert, AlertTriangle, Microscope, Pill, ShieldCheck, ExternalLink, GraduationCap, Users, Clock } from 'lucide-react-native';
import { ScreenContainer } from '../../../src/components/ui/ScreenContainer';
import { Card } from '../../../src/components/ui/Card';
import { CANCER_DATABASE } from '../../../src/data/cancerDatabase';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function CancerDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const cancer = CANCER_DATABASE[id as string];

    if (!cancer) return null;

    const openPubMed = () => {
        const query = encodeURIComponent(cancer.title);
        Linking.openURL(`https://pubmed.ncbi.nlm.nih.gov/?term=${query}`);
    };

    const openClinicalTrials = () => {
        const query = encodeURIComponent(cancer.title);
        Linking.openURL(`https://clinicaltrials.gov/search?term=${query}`);
    };

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <ScreenContainer hasWave={false} darkStatus={false} withPadding={false} fullScreen={true} className="bg-black">
                <LinearGradient colors={['#0A0A0A', '#000000']} style={StyleSheet.absoluteFill} />

                <View className="px-6 pt-12 pb-6 flex-row items-center justify-between">
                    <Pressable onPress={() => router.back()} className="bg-white/10 w-12 h-12 rounded-2xl items-center justify-center border border-white/20">
                        <ChevronLeft size={24} color="white" />
                    </Pressable>
                    <Text className="text-white font-black uppercase tracking-[3px] text-xs">Clinical Encyclopedia</Text>
                    <View className="w-12 h-12" />
                </View>

                <ScrollView className="flex-1 px-8" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                    <Animated.View entering={FadeInDown.duration(800)}>
                        <Text className="text-nxtcure-primary font-black uppercase tracking-[5px] text-[10px] mb-4">DISEASE PROFILE</Text>
                        <Text className="text-white text-5xl font-black tracking-tighter leading-[55px] mb-8">
                            {cancer.title.replace(' ', '\n')}.
                        </Text>

                        {/* Stats Section */}
                        <View className="flex-row gap-4 mb-10">
                            <Card className="flex-1 bg-white/5 border-white/10 p-5 rounded-[28px] items-center">
                                <Users size={20} color="#1DD1A1" className="mb-2" />
                                <Text className="text-white font-black text-xs text-center">{cancer.stats.cases}</Text>
                                <Text className="text-white/30 text-[8px] font-bold uppercase tracking-widest mt-1">Annual Cases</Text>
                            </Card>
                            <Card className="flex-1 bg-white/5 border-white/10 p-5 rounded-[28px] items-center">
                                <Clock size={20} color="#45AAF2" className="mb-2" />
                                <Text className="text-white font-black text-xs text-center">{cancer.stats.ageGroup}</Text>
                                <Text className="text-white/30 text-[8px] font-bold uppercase tracking-widest mt-1">Primary Age</Text>
                            </Card>
                            <Card className="flex-1 bg-white/5 border-white/10 p-5 rounded-[28px] items-center">
                                <ShieldCheck size={20} color="#A55EEA" className="mb-2" />
                                <Text className="text-white font-black text-xs text-center">{cancer.stats.survival}</Text>
                                <Text className="text-white/30 text-[8px] font-bold uppercase tracking-widest mt-1">5y Survival</Text>
                            </Card>
                        </View>

                        {/* Risk Factors */}
                        <Text className="text-white/40 text-[10px] font-black uppercase tracking-[4px] ml-2 mb-4">Risk Factors</Text>
                        <Card className="bg-white/5 border-white/10 p-8 rounded-[40px] mb-10">
                            {cancer.riskFactors.map((f, i) => (
                                <View key={i} className="flex-row items-center mb-4">
                                    <View className="w-1.5 h-1.5 rounded-full bg-nxtcure-primary mr-4" />
                                    <Text className="text-white/70 font-medium text-sm leading-5">{f}</Text>
                                </View>
                            ))}
                        </Card>

                        {/* Warning Signs */}
                        <Text className="text-white/40 text-[10px] font-black uppercase tracking-[4px] ml-2 mb-4">Clinical Warning Signs</Text>
                        <Card className="bg-red-500/5 border border-red-500/20 p-8 rounded-[40px] mb-10">
                            {cancer.warningSigns.map((s, i) => (
                                <View key={i} className="flex-row items-center mb-4">
                                    <AlertTriangle size={14} color="#FF4757" className="mr-4" />
                                    <Text className="text-white/80 font-bold text-sm leading-5">{s}</Text>
                                </View>
                            ))}
                        </Card>

                        {/* Diagnosis & Treatment */}
                        <View className="gap-10 mb-12">
                            <View>
                                <View className="flex-row items-center mb-6 ml-2">
                                    <Microscope size={20} color="#45AAF2" className="mr-4" />
                                    <Text className="text-white font-black text-xl">Diagnosis</Text>
                                </View>
                                {cancer.diagnosis.map((d, i) => (
                                    <View key={i} className="bg-white/5 border border-white/10 p-5 rounded-3xl mb-3">
                                        <Text className="text-white/60 font-medium text-sm">{d}</Text>
                                    </View>
                                ))}
                            </View>

                            <View>
                                <View className="flex-row items-center mb-6 ml-2">
                                    <Pill size={20} color="#A55EEA" className="mr-4" />
                                    <Text className="text-white font-black text-xl">Treatment</Text>
                                </View>
                                {cancer.treatment.map((t, i) => (
                                    <View key={i} className="bg-white/5 border border-white/10 p-5 rounded-3xl mb-3">
                                        <Text className="text-white/60 font-medium text-sm">{t}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* Research & Trials */}
                        <Text className="text-white/40 text-[10px] font-black uppercase tracking-[4px] ml-2 mb-4">Research Aggregation</Text>
                        <View className="flex-row gap-4 mb-10">
                            <Pressable
                                onPress={openPubMed}
                                className="flex-1 bg-white/5 border border-white/10 p-6 rounded-[32px] items-center"
                            >
                                <GraduationCap size={24} color="white" opacity={0.6} className="mb-3" />
                                <Text className="text-white font-black text-xs">PubMed</Text>
                                <Text className="text-white/30 text-[8px] font-bold uppercase mt-1">Latest Studies</Text>
                            </Pressable>
                            <Pressable
                                onPress={openClinicalTrials}
                                className="flex-1 bg-white/5 border border-white/10 p-6 rounded-[32px] items-center"
                            >
                                <ExternalLink size={24} color="white" opacity={0.6} className="mb-3" />
                                <Text className="text-white font-black text-xs">ClinicalTrials</Text>
                                <Text className="text-white/30 text-[8px] font-bold uppercase mt-1">Active Trials</Text>
                            </Pressable>
                        </View>

                        {/* Specialized CTA */}
                        {id === 'testicular' && (
                            <Pressable
                                onPress={() => router.push('/learn/self-exam-tse')}
                                className="bg-nxtcure-primary h-18 rounded-[24px] flex-row items-center justify-center shadow-lg shadow-nxtcure-primary/20"
                            >
                                <Text className="text-white font-black uppercase tracking-widest text-lg">Self-Exam Tutorial</Text>
                            </Pressable>
                        )}
                        {id === 'breast' && (
                            <Pressable
                                onPress={() => router.push('/learn/self-exam-breast')}
                                className="bg-[#A55EEA] h-18 rounded-[24px] flex-row items-center justify-center shadow-lg shadow-[#A55EEA]/20"
                            >
                                <Text className="text-white font-black uppercase tracking-widest text-lg">Self-Exam Tutorial</Text>
                            </Pressable>
                        )}
                    </Animated.View>
                </ScrollView>
            </ScreenContainer>
        </>
    );
}

const styles = StyleSheet.create({});
