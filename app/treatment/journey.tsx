import React, { useMemo } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Dimensions } from 'react-native';
import { ChevronLeft, Info, Search, ShieldCheck, CheckCircle2, Circle, Clock, ArrowDown, MapPin, Calendar, FileText, AlertTriangle, Play } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { Card } from '../../src/components/ui/Card';
import { useJourneyStore, JourneyPhase, Milestone } from '../../src/store/journeyStore';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp, Layout } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const PHASES: { id: JourneyPhase; title: string; color: string }[] = [
    { id: 'Diagnosis', title: 'Clinical Discovery', color: '#45AAF2' },
    { id: 'Surgery', title: 'Surgical Intervention', color: '#EB3B5A' },
    { id: 'Chemotherapy', title: 'Systemic Therapy', color: '#A55EEA' },
    { id: 'Surveillance', title: 'Long-term Surveillance', color: '#1DD1A1' }
];

export default function JourneyScreen() {
    const router = useRouter();
    const { currentPhase, milestones, completeMilestone, setPhase } = useJourneyStore();

    const phaseProgress = useMemo(() => {
        const total = PHASES.length;
        const currentIdx = PHASES.findIndex(p => p.id === currentPhase);
        return { index: currentIdx, current: PHASES[currentIdx] };
    }, [currentPhase]);

    return (
        <ScreenContainer hasWave={false} darkStatus={false} withPadding={false} fullScreen={true} className="bg-black">
            <LinearGradient
                colors={[phaseProgress.current.color + '20', '#000000']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 0.5 }}
            />

            <View className="px-6 pt-12 pb-6 flex-row items-center justify-between">
                <Pressable onPress={() => router.back()} className="bg-white/10 w-12 h-12 rounded-2xl items-center justify-center border border-white/20">
                    <ChevronLeft size={24} color="white" />
                </Pressable>
                <Text className="text-white font-black uppercase tracking-[3px] text-xs">Patient Journey</Text>
                <Pressable onPress={() => { }} className="bg-white/5 w-12 h-12 rounded-2xl items-center justify-center border border-white/10">
                    <Calendar size={20} color="rgba(255,255,255,0.4)" />
                </Pressable>
            </View>

            <ScrollView className="flex-1 px-8" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
                <Animated.View entering={FadeInDown.duration(800)}>
                    <View className="flex-row items-center mb-4">
                        <View style={{ backgroundColor: phaseProgress.current.color }} className="w-8 h-1 rounded-full mr-3" />
                        <Text className="text-white/40 text-[10px] font-black uppercase tracking-[4px]">{currentPhase}</Text>
                    </View>
                    <Text className="text-white text-5xl font-black tracking-tighter leading-[55px] mb-10">
                        {phaseProgress.current.title.replace(' ', '\n')}.
                    </Text>

                    {/* Phase Selector (Mini Timeline) */}
                    <View className="flex-row justify-between mb-12 relative">
                        <View className="absolute top-[18px] left-[5%] right-[5%] h-[1px] bg-white/10" />
                        {PHASES.map((p, i) => (
                            <Pressable
                                key={p.id}
                                onPress={() => setPhase(p.id)}
                                className="items-center z-10"
                            >
                                <View
                                    style={{
                                        backgroundColor: i <= phaseProgress.index ? p.color : 'rgba(255,255,255,0.1)',
                                        borderColor: i === phaseProgress.index ? 'white' : 'transparent',
                                        borderWidth: i === phaseProgress.index ? 3 : 0
                                    }}
                                    className="w-9 h-9 rounded-full items-center justify-center mb-2"
                                >
                                    {i < phaseProgress.index ? <CheckCircle2 size={16} color="white" /> : <Circle size={10} color="white" opacity={0.4} />}
                                </View>
                                <Text className={`text-[8px] font-black uppercase tracking-widest ${i === phaseProgress.index ? 'text-white' : 'text-white/20'}`}>{p.id}</Text>
                            </Pressable>
                        ))}
                    </View>

                    {/* Milestones */}
                    <Text className="text-white/40 text-[10px] font-black uppercase tracking-[4px] mb-8 ml-2">Clinical Milestones</Text>

                    <View className="relative">
                        <View className="absolute left-[20px] top-0 bottom-0 w-[1px] bg-white/10" />

                        {milestones.filter(m => m.phase === currentPhase).map((m, idx) => (
                            <Animated.View
                                key={m.id}
                                entering={FadeInUp.delay(idx * 150).duration(600)}
                                className="flex-row mb-10"
                            >
                                <View
                                    style={{ backgroundColor: m.status === 'completed' ? '#1DD1A1' : '#333' }}
                                    className="w-[40px] h-[40px] rounded-full items-center justify-center z-10 border-4 border-black"
                                >
                                    {m.status === 'completed' ? <CheckCircle2 size={18} color="white" /> : <Play size={14} color="white" className="ml-0.5" />}
                                </View>

                                <Card className="flex-1 ml-6 bg-white/5 border-white/10 p-6 rounded-[32px]">
                                    <View className="flex-row items-center justify-between mb-2">
                                        <Text className="text-white font-black text-lg">{m.title}</Text>
                                        {m.status === 'pending' && (
                                            <View className="bg-nxtcure-primary/10 px-2 py-1 rounded-md border border-nxtcure-primary/20">
                                                <Text className="text-nxtcure-primary font-black text-[8px] uppercase tracking-widest">NEXT</Text>
                                            </View>
                                        )}
                                    </View>
                                    <Text className="text-white/40 text-[11px] font-medium leading-5 mb-4">{m.description}</Text>

                                    <View className="bg-white/5 p-4 rounded-2xl mb-4">
                                        <View className="flex-row items-center mb-1">
                                            <ShieldCheck size={12} color="rgba(255,255,255,0.4)" />
                                            <Text className="text-white/40 font-black text-[9px] uppercase tracking-widest ml-2">Clinical Rationale</Text>
                                        </View>
                                        <Text className="text-white/60 text-[10px] leading-4">{m.clinicalRationale}</Text>
                                    </View>

                                    {m.status === 'pending' && (
                                        <Pressable
                                            onPress={() => completeMilestone(m.id)}
                                            className="bg-nxtcure-primary h-12 rounded-2xl flex-row items-center justify-center mt-2"
                                        >
                                            <CheckCircle2 size={16} color="white" className="mr-3" />
                                            <Text className="text-white font-black uppercase tracking-widest text-xs">Mark Completed</Text>
                                        </Pressable>
                                    )}
                                </Card>
                            </Animated.View>
                        ))}
                    </View>

                    {/* Action Buttons */}
                    <View className="gap-4 mt-10">
                        <Pressable className="bg-white/5 border border-white/10 h-18 rounded-[24px] flex-row items-center p-5">
                            <View className="bg-blue-500/10 w-10 h-10 rounded-xl items-center justify-center mr-4">
                                <FileText size={20} color="#45AAF2" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-white font-bold text-sm">Upload Result</Text>
                                <Text className="text-white/30 text-[10px] uppercase font-black tracking-widest mt-0.5">Scans & Markers</Text>
                            </View>
                            <ArrowDown size={20} color="white" opacity={0.3} style={{ transform: [{ rotate: '-90deg' }] }} />
                        </Pressable>

                        <Pressable className="bg-white/5 border border-white/10 h-18 rounded-[24px] flex-row items-center p-5">
                            <View className="bg-yellow-500/10 w-10 h-10 rounded-xl items-center justify-center mr-4">
                                <MapPin size={20} color="#F7B731" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-white font-bold text-sm">Find Provider</Text>
                                <Text className="text-white/30 text-[10px] uppercase font-black tracking-widest mt-0.5">Surgery Center</Text>
                            </View>
                            <ArrowDown size={20} color="white" opacity={0.3} style={{ transform: [{ rotate: '-90deg' }] }} />
                        </Pressable>
                    </View>
                </Animated.View>
            </ScrollView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({});
