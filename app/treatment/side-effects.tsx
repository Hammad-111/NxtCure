import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Dimensions } from 'react-native';
import { ChevronLeft, AlertCircle, CheckCircle2, Pill, Activity, Thermometer, Wind, Droplets, ArrowRight, History, ShieldAlert, BookOpen } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { Card } from '../../src/components/ui/Card';
import { useSideEffectStore } from '../../src/store/sideEffectStore';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInRight, Layout } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const SIDE_EFFECTS = [
    { title: 'Nausea', icon: '🤢', meds: ['Ondansetron (Zofran)', 'Promethazine'], strategies: ['Ginger tea', 'Acupressure wristbands', 'Small meals'] },
    { title: 'Fatigue', icon: '😴', meds: ['Discuss with doctor'], strategies: ['Short naps (20 min)', 'Light walking', 'Hydration'] },
    { title: 'Mouth Sores', icon: '👄', meds: ['Magic Mouthwash', 'Lidocaine gel'], strategies: ['Soft toothbrush', 'Baking soda rinse', 'Cold foods'] },
    { title: 'Pain', icon: '🤕', meds: ['Ibuprofen', 'Prescribed analgesics'], strategies: ['Heat/Ice packs', 'Meditation', 'Deep breathing'] }
];

export default function SideEffectTrackerScreen() {
    const router = useRouter();
    const { addLog, logs } = useSideEffectStore();
    const [selectedEffect, setSelectedEffect] = useState(SIDE_EFFECTS[0]);
    const [severity, setSeverity] = useState(5);
    const [medsTaken, setMedsTaken] = useState<string[]>([]);
    const [isLogging, setIsLogging] = useState(false);

    const history = useMemo(() => {
        return logs.filter(l => l.type === selectedEffect.title).slice(0, 5);
    }, [logs, selectedEffect]);

    const handleSaveLog = () => {
        addLog({
            type: selectedEffect.title,
            severity,
            medications: medsTaken,
            notes: ''
        });
        setIsLogging(false);
        setMedsTaken([]);
    };

    const toggleMed = (med: string) => {
        setMedsTaken(prev => prev.includes(med) ? prev.filter(m => m !== med) : [...prev, med]);
    };

    return (
        <ScreenContainer hasWave={false} darkStatus={false} withPadding={false} fullScreen={true} className="bg-black">
            <LinearGradient colors={['#1E1B4B', '#000000']} style={StyleSheet.absoluteFill} />

            <View className="px-6 pt-12 pb-6 flex-row items-center justify-between">
                <Pressable onPress={() => router.back()} className="bg-white/10 w-12 h-12 rounded-2xl items-center justify-center border border-white/20">
                    <ChevronLeft size={24} color="white" />
                </Pressable>
                <Text className="text-white font-black uppercase tracking-[3px] text-xs">Side Effect Management</Text>
                <Pressable onPress={() => { }} className="bg-white/5 w-12 h-12 rounded-2xl items-center justify-center border border-white/10">
                    <History size={20} color="rgba(255,255,255,0.4)" />
                </Pressable>
            </View>

            <ScrollView className="flex-1 px-8" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {!isLogging ? (
                    <Animated.View entering={FadeInDown.duration(800)}>
                        <Text className="text-white/40 text-[10px] font-black uppercase tracking-[5px] mb-4">CLINICAL TRACKER</Text>
                        <Text className="text-white text-4xl font-black tracking-tighter mb-10 leading-[45px]">
                            Track &{'\n'}Manage.
                        </Text>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-10 -mx-8 px-8">
                            {SIDE_EFFECTS.map((effect) => (
                                <Pressable
                                    key={effect.title}
                                    onPress={() => setSelectedEffect(effect)}
                                    className={`mr-4 px-6 py-4 rounded-[28px] border transition-all ${selectedEffect.title === effect.title ? 'bg-nxtcure-primary border-nxtcure-primary' : 'bg-white/5 border-white/10'}`}
                                >
                                    <Text className="text-2xl mb-2 text-center">{effect.icon}</Text>
                                    <Text className={`font-black text-[10px] uppercase tracking-widest ${selectedEffect.title === effect.title ? 'text-white' : 'text-white/40'}`}>
                                        {effect.title}
                                    </Text>
                                </Pressable>
                            ))}
                        </ScrollView>

                        {/* Analysis Card */}
                        <Card className="bg-white/5 border-white/10 p-8 rounded-[40px] mb-8">
                            <View className="flex-row items-center justify-between mb-6">
                                <View>
                                    <Text className="text-white font-black text-2xl">{selectedEffect.title}</Text>
                                    <Text className="text-white/30 text-[10px] font-black uppercase tracking-widest mt-1">Current Protocol</Text>
                                </View>
                                <View className="bg-nxtcure-primary/20 w-12 h-12 rounded-2xl items-center justify-center">
                                    <Activity size={24} color="#1DD1A1" />
                                </View>
                            </View>

                            {/* Meds */}
                            <Text className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-4">Prescribed Management</Text>
                            <View className="gap-3 mb-8">
                                {selectedEffect.meds.map((med, i) => (
                                    <View key={i} className="flex-row items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <Pill size={16} color="#A55EEA" className="mr-4" />
                                        <Text className="text-white/80 font-bold text-sm">{med}</Text>
                                    </View>
                                ))}
                            </View>

                            {/* Strategies */}
                            <Text className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-4">Non-Drug Strategies</Text>
                            <View className="flex-row flex-wrap gap-2 mb-4">
                                {selectedEffect.strategies.map((s, i) => (
                                    <View key={i} className="bg-nxtcure-primary/10 px-4 py-2 rounded-xl border border-nxtcure-primary/20">
                                        <Text className="text-nxtcure-primary font-black text-[10px] uppercase tracking-widest">{s}</Text>
                                    </View>
                                ))}
                            </View>
                        </Card>

                        {/* Red Flag Warning */}
                        <View className="bg-red-500/10 border-red-500/20 p-6 rounded-[32px] border mb-8 flex-row items-start">
                            <ShieldAlert size={20} color="#EB3B5A" className="mr-4 mt-0.5" />
                            <View className="flex-1">
                                <Text className="text-red-500 font-black text-xs uppercase mb-2">Clinical Red Flag</Text>
                                <Text className="text-white/40 text-[11px] leading-5">
                                    {selectedEffect.title === 'Nausea' ? 'If you cannot keep down liquids for 24 hours, call your oncologist immediately to manage dehydration risk.' :
                                        selectedEffect.title === 'Fatigue' ? 'Severe fatigue accompanied by shortness of breath or dizziness requires immediate medical review.' :
                                            'Persistent or worsening side effects should always be reported to your oncology care team.'}
                                </Text>
                            </View>
                        </View>

                        <Pressable
                            onPress={() => setIsLogging(true)}
                            className="bg-nxtcure-primary h-18 rounded-[24px] flex-row items-center justify-center shadow-lg shadow-nxtcure-primary/20 mb-10"
                        >
                            <Activity size={20} color="white" className="mr-3" />
                            <Text className="text-white font-black uppercase tracking-widest text-lg">Log Severity</Text>
                        </Pressable>

                        {/* Trends */}
                        {history.length > 0 && (
                            <View>
                                <Text className="text-white/40 text-[10px] font-black uppercase tracking-[5px] mb-6">Historical Trends</Text>
                                {history.map((h, i) => (
                                    <View key={i} className="flex-row items-center mb-4 bg-white/5 p-4 rounded-2xl">
                                        <View className="bg-white/10 w-10 h-10 rounded-xl items-center justify-center mr-4">
                                            <Text className="text-white font-black">{h.severity}</Text>
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-white font-bold text-sm">{new Date(h.timestamp).toLocaleDateString()}</Text>
                                            <Text className="text-white/30 text-[9px] uppercase font-black">{h.medications.length} meds taken</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}

                    </Animated.View>
                ) : (
                    <Animated.View entering={FadeInRight.duration(600)}>
                        <Text className="text-white/40 text-[10px] font-black uppercase tracking-[5px] mb-4">LOGGING ENTRY</Text>
                        <Text className="text-white text-3xl font-black mb-8">How severe is the {selectedEffect.title}?</Text>

                        <Card className="bg-white/5 border-white/10 p-8 rounded-[40px] mb-8">
                            <View className="items-center mb-8">
                                <Text style={{ color: severity > 7 ? '#EB3B5A' : severity > 4 ? '#F7B731' : '#1DD1A1' }} className="text-6xl font-black mb-2">{severity}</Text>
                                <Text className="text-white/40 font-black uppercase tracking-widest text-[10px]">Severity Level (1-10)</Text>
                            </View>

                            {/* Simple Logic for Slider simulation as we can't easily use a real slider in this environment without specific setup, using buttons for now */}
                            <View className="flex-row justify-between mb-8">
                                {[1, 3, 5, 7, 10].map((val) => (
                                    <Pressable
                                        key={val}
                                        onPress={() => setSeverity(val)}
                                        className={`w-12 h-12 rounded-xl items-center justify-center border ${severity === val ? 'bg-nxtcure-primary border-nxtcure-primary' : 'bg-white/10 border-white/10'}`}
                                    >
                                        <Text className="text-white font-black">{val}</Text>
                                    </Pressable>
                                ))}
                            </View>
                        </Card>

                        <Text className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-4 ml-2">Medications Taken Today</Text>
                        <View className="gap-3 mb-10">
                            {selectedEffect.meds.map((med, i) => (
                                <Pressable
                                    key={i}
                                    onPress={() => toggleMed(med)}
                                    className={`flex-row items-center p-5 rounded-3xl border ${medsTaken.includes(med) ? 'bg-nxtcure-primary/20 border-nxtcure-primary' : 'bg-white/5 border-white/10'}`}
                                >
                                    <View className={`w-6 h-6 rounded-full border items-center justify-center mr-4 ${medsTaken.includes(med) ? 'bg-nxtcure-primary border-nxtcure-primary' : 'border-white/20'}`}>
                                        {medsTaken.includes(med) && <CheckCircle2 size={14} color="white" />}
                                    </View>
                                    <Text className="text-white font-bold">{med}</Text>
                                </Pressable>
                            ))}
                        </View>

                        <Pressable
                            onPress={handleSaveLog}
                            className="bg-nxtcure-primary h-18 rounded-[24px] items-center justify-center shadow-lg shadow-nxtcure-primary/20"
                        >
                            <Text className="text-white font-black uppercase tracking-widest text-lg">Save Clinical Entry</Text>
                        </Pressable>

                        <Pressable
                            onPress={() => setIsLogging(false)}
                            className="h-14 items-center justify-center mt-4"
                        >
                            <Text className="text-white/40 font-black uppercase tracking-widest text-[10px]">Back without saving</Text>
                        </Pressable>
                    </Animated.View>
                )}
            </ScrollView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({});
