import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, StyleSheet, Dimensions } from 'react-native';
import { ChevronLeft, Send, AlertTriangle, ShieldCheck, Info, Activity, Search, ArrowRight, Clock, MapPin, History } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { Card } from '../../src/components/ui/Card';
import { useSymptomStore, TriageResult } from '../../src/store/symptomStore';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInRight, Layout } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function SymptomCheckerScreen() {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<TriageResult | null>(null);
    const { analyzeSymptom, addLog } = useSymptomStore();

    const handleCheck = () => {
        if (!query.trim()) return;
        setIsAnalyzing(true);

        // Simulate Clinical Analysis Delay
        setTimeout(() => {
            const analysis = analyzeSymptom(query);
            setResult(analysis);
            addLog(query, analysis);
            setIsAnalyzing(false);
        }, 1500);
    };

    const getUrgencyColor = (urgency: string) => {
        switch (urgency) {
            case 'Emergent': return '#FF4757';
            case 'Urgent': return '#F7B731';
            case 'Monitoring': return '#45AAF2';
            default: return '#1DD1A1';
        }
    };

    return (
        <ScreenContainer hasWave={false} darkStatus={false} withPadding={false} fullScreen={true} className="bg-black">
            <LinearGradient colors={['#051525', '#000000']} style={StyleSheet.absoluteFill} />

            <View className="px-6 pt-12 pb-6 flex-row items-center justify-between">
                <Pressable onPress={() => router.back()} className="bg-white/10 w-12 h-12 rounded-2xl items-center justify-center border border-white/20">
                    <ChevronLeft size={24} color="white" />
                </Pressable>
                <Text className="text-white font-black uppercase tracking-[3px] text-xs">Symptom Triage</Text>
                <Pressable onPress={() => { }} className="bg-white/5 w-12 h-12 rounded-2xl items-center justify-center border border-white/10">
                    <History size={20} color="rgba(255,255,255,0.4)" />
                </Pressable>
            </View>

            <ScrollView className="flex-1 px-8" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {!result && !isAnalyzing ? (
                    <Animated.View entering={FadeInDown.duration(800)}>
                        <Text className="text-white/40 text-[10px] font-black uppercase tracking-[5px] mb-4">CLINICAL ANALYSIS</Text>
                        <Text className="text-white text-4xl font-black tracking-tighter mb-8 leading-[45px]">
                            Describe How{'\n'}You Feel.
                        </Text>
                        <Text className="text-white/60 text-sm leading-6 mb-10 font-medium">
                            Our AI-powered triage engine checks for "Red Flag" clinical indicators. Be specific about duration and changes.
                        </Text>

                        <Card className="bg-white/5 border-white/10 p-6 rounded-[32px] mb-8 border-2 border-nxtcure-primary/20">
                            <TextInput
                                placeholder="e.g., 'Persistent cough for 6 weeks and night sweats'..."
                                placeholderTextColor="rgba(255,255,255,0.2)"
                                multiline
                                numberOfLines={6}
                                className="text-white text-lg font-medium min-h-[180px] textAlignVertical-top"
                                value={query}
                                onChangeText={setQuery}
                            />
                        </Card>

                        <Pressable
                            onPress={handleCheck}
                            className="bg-nxtcure-primary h-18 rounded-[24px] flex-row items-center justify-center shadow-lg shadow-nxtcure-primary/20"
                        >
                            <Activity size={20} color="white" className="mr-3" />
                            <Text className="text-white font-black uppercase tracking-widest text-lg">Start Analysis</Text>
                        </Pressable>

                        <View className="mt-12 bg-blue-500/10 border border-blue-500/20 p-6 rounded-3xl flex-row items-start">
                            <Info size={20} color="#45AAF2" className="mr-4 mt-0.5" />
                            <Text className="flex-1 text-blue-100/60 text-[11px] font-medium leading-5">
                                <Text className="font-black text-blue-400">NON-DIAGNOSTIC NOTICE:</Text> This tool identifies urgency levels based on clinical guidelines. It does not provide a diagnosis. Always consult a physician for any health concerns.
                            </Text>
                        </View>
                    </Animated.View>
                ) : isAnalyzing ? (
                    <View className="flex-1 items-center justify-center pt-20">
                        <Activity size={48} color="#1DD1A1" className="mb-8" />
                        <Text className="text-white text-2xl font-black tracking-tight mb-4">Analyzing Symptoms...</Text>
                        <Text className="text-white/40 font-bold uppercase tracking-widest text-xs">Scanning clinical red flags</Text>
                    </View>
                ) : (
                    <Animated.View entering={FadeInRight.duration(600)} layout={Layout}>
                        <View className="flex-row items-center justify-between mb-8">
                            <View>
                                <Text className="text-white/40 text-[10px] font-black uppercase tracking-[4px] mb-2">ANALYSIS COMPLETE</Text>
                                <Text className="text-white text-3xl font-black tracking-tight">Clinical Report.</Text>
                            </View>
                            <View
                                style={{ backgroundColor: `${getUrgencyColor(result?.urgency || 'Routine')}20`, borderColor: `${getUrgencyColor(result?.urgency || 'Routine')}40` }}
                                className="px-4 py-2 rounded-full border items-center justify-center"
                            >
                                <Text style={{ color: getUrgencyColor(result?.urgency || 'Routine') }} className="font-black text-[10px] uppercase tracking-widest">
                                    {result?.urgency}
                                </Text>
                            </View>
                        </View>

                        <Card className="bg-white/5 border-white/10 p-8 rounded-[40px] mb-8">
                            <Text className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-6">POSSIBLE CAUSES</Text>
                            {result?.possibleCauses.map((cause, idx) => (
                                <View key={idx} className="flex-row items-center mb-6">
                                    <View className={`w-2 h-2 rounded-full mr-4 ${cause.type === 'cancer' ? 'bg-red-500' : 'bg-blue-400'}`} />
                                    <View className="flex-1">
                                        <Text className="text-white font-bold text-lg">{cause.label}</Text>
                                        <Text className="text-white/30 text-[9px] uppercase font-black tracking-widest mt-1">
                                            {cause.type === 'cancer' ? 'Evaluation Needed' : 'Benign Possibility'} • {cause.priority} priority
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </Card>

                        <Card className="bg-white/5 border-white/10 p-8 rounded-[40px] mb-8">
                            <Text className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-6">RECOMMENDED ACTION</Text>
                            {result?.recommendedActions.map((action, idx) => (
                                <View key={idx} className="flex-row items-center mb-5">
                                    <View className="bg-nxtcure-primary/20 w-8 h-8 rounded-lg items-center justify-center mr-4">
                                        <Text className="text-nxtcure-primary font-black text-xs">{idx + 1}</Text>
                                    </View>
                                    <Text className="flex-1 text-white/60 font-medium text-sm leading-5">{action}</Text>
                                </View>
                            ))}
                        </Card>

                        <View className="gap-4 mb-8">
                            <Pressable
                                onPress={() => router.push('/learn/appointments')}
                                className="bg-nxtcure-primary h-18 rounded-[24px] flex-row items-center justify-center shadow-lg shadow-nxtcure-primary/20"
                            >
                                <MapPin size={24} color="white" className="mr-3" />
                                <Text className="text-white font-black uppercase tracking-widest text-lg">Find {result?.specialist || 'Specialist'}</Text>
                            </Pressable>

                            <Pressable
                                onPress={() => setResult(null)}
                                className="bg-white/5 border border-white/10 h-16 rounded-[22px] items-center justify-center"
                            >
                                <Text className="text-white/40 font-black uppercase tracking-widest text-xs">New Analysis</Text>
                            </Pressable>
                        </View>

                        <Text className="text-white/20 text-[10px] text-center leading-4">
                            Data protected by clinical encryption protocols.{'\n'}Not a substitute for professional medical advice.
                        </Text>
                    </Animated.View>
                )}
            </ScrollView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({});
