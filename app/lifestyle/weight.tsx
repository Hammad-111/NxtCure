import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, TextInput, Dimensions } from 'react-native';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { Card } from '../../src/components/ui/Card';
import { useLifestyleStore } from '../../src/store/lifestyleStore';
import { ChevronLeft, Scale, Calculator, Info, AlertCircle, TrendingUp, ShieldAlert, CheckCircle2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function WeightTrackerScreen() {
    const router = useRouter();
    const today = new Date().toISOString().split('T')[0];
    const { logs, height, logWeight, setProfile, sex } = useLifestyleStore();

    const [weightInput, setWeightInput] = useState(logs[today]?.weight?.toString() || '');
    const [heightInput, setHeightInput] = useState(height?.toString() || '');

    const bmi = useMemo(() => {
        const w = parseFloat(weightInput);
        const h = parseFloat(heightInput) / 100;
        if (!w || !h) return null;
        return (w / (h * h)).toFixed(1);
    }, [weightInput, heightInput]);

    const bmiCategory = useMemo(() => {
        if (!bmi) return null;
        const val = parseFloat(bmi);
        if (val < 18.5) return { label: 'Underweight', color: '#45AAF2', risk: 'Low' };
        if (val < 25) return { label: 'Optimal', color: '#1DD1A1', risk: 'Minimal' };
        if (val < 30) return { label: 'Overweight', color: '#F7B731', risk: 'Increased' };
        return { label: 'High Risk', color: '#EB3B5A', risk: 'Significant' };
    }, [bmi]);

    const handleSave = () => {
        if (weightInput) logWeight(today, parseFloat(weightInput));
        if (heightInput && sex) setProfile(parseFloat(heightInput), sex);
    };

    return (
        <ScreenContainer hasWave={false} darkStatus={false} withPadding={false} fullScreen={true} className="bg-black">
            <LinearGradient
                colors={['#1a2a3d', '#000000']}
                style={StyleSheet.absoluteFill}
            />

            <View className="px-6 pt-12 pb-6 flex-row items-center justify-between">
                <Pressable onPress={() => router.back()} className="bg-white/10 w-12 h-12 rounded-2xl items-center justify-center border border-white/20 backdrop-blur-xl">
                    <ChevronLeft size={24} color="white" />
                </Pressable>
                <Text className="text-white font-black uppercase tracking-[3px] text-xs">Body Composition</Text>
                <View className="w-12 h-12" />
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}>
                {/* Hero Section */}
                <Animated.View entering={FadeInDown.duration(800)} className="mb-10 items-center">
                    <Scale size={48} color="white" opacity={0.6} className="mb-4" />
                    <Text className="text-4xl font-black text-white text-center tracking-tighter mb-2">
                        Clinical Weight.
                    </Text>
                    <Text className="text-white/60 text-center font-medium leading-5">
                        Obesity is linked to 13 types of cancer. Managing BMI is a primary prevention protocol.
                    </Text>
                </Animated.View>

                {/* Metrics Entry */}
                <Animated.View entering={FadeInDown.delay(200)} className="mb-10">
                    <View className="flex-row gap-4">
                        <View className="flex-1">
                            <Text className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-2 ml-2">Weight (kg)</Text>
                            <View className="bg-white/5 border border-white/10 rounded-2xl px-4 py-4">
                                <TextInput
                                    value={weightInput}
                                    onChangeText={setWeightInput}
                                    keyboardType="numeric"
                                    placeholder="00.0"
                                    placeholderTextColor="rgba(255,255,255,0.2)"
                                    className="text-white text-xl font-black"
                                    onBlur={handleSave}
                                />
                            </View>
                        </View>
                        <View className="flex-1">
                            <Text className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-2 ml-2">Height (cm)</Text>
                            <View className="bg-white/5 border border-white/10 rounded-2xl px-4 py-4">
                                <TextInput
                                    value={heightInput}
                                    onChangeText={setHeightInput}
                                    keyboardType="numeric"
                                    placeholder="000"
                                    placeholderTextColor="rgba(255,255,255,0.2)"
                                    className="text-white text-xl font-black"
                                    onBlur={handleSave}
                                />
                            </View>
                        </View>
                    </View>
                </Animated.View>

                {/* BMI Results */}
                {bmi && bmiCategory && (
                    <Animated.View entering={FadeInUp.duration(600)} className="mb-10">
                        <Card className="bg-white/5 border-white/10 p-8 rounded-[40px] items-center">
                            <View style={{ borderColor: bmiCategory.color }} className="w-32 h-32 rounded-full border-4 items-center justify-center mb-6">
                                <Text className="text-white text-4xl font-black">{bmi}</Text>
                                <Text className="text-white/40 text-[10px] font-black uppercase tracking-widest">BMI Score</Text>
                            </View>
                            <Text style={{ color: bmiCategory.color }} className="text-2xl font-black mb-1">{bmiCategory.label}</Text>
                            <Text className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-6">Cancer Risk: {bmiCategory.risk}</Text>

                            <View className="w-full h-px bg-white/10 mb-6" />

                            <View className="flex-row items-center bg-white/5 p-4 rounded-2xl border border-white/10">
                                <Info size={16} color="rgba(255,255,255,0.4)" className="mr-3" />
                                <Text className="flex-1 text-white/60 text-[10px] leading-4">
                                    Target BMI for cancer prevention is between 18.5 and 24.9. Adipose tissue promotes systemic inflammation.
                                </Text>
                            </View>
                        </Card>
                    </Animated.View>
                )}

                {/* Cancer Correlation Note */}
                <Animated.View entering={FadeInDown.delay(400)}>
                    <Text className="text-white/40 text-[10px] font-black uppercase tracking-[4px] mb-4">ONCOLOGY CORRELATIONS</Text>
                    <Card className="bg-red-500/10 border-red-500/30 p-6 rounded-[32px]">
                        <View className="flex-row items-center mb-4">
                            <ShieldAlert size={20} color="#EB3B5A" className="mr-3" />
                            <Text className="text-white font-black text-lg">Weight-Linked Cancers</Text>
                        </View>
                        <Text className="text-white/60 text-xs leading-5">
                            High body fat can affect the immune system and promote cell growth. It is specifically linked to:
                        </Text>
                        <View className="flex-row flex-wrap gap-2 mt-4">
                            {['Colorectal', 'Breast', 'Kidney', 'Pancreatic', 'Esophageal', 'Liver'].map(c => (
                                <View key={c} className="bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                                    <Text className="text-white/60 text-[9px] font-bold uppercase">{c}</Text>
                                </View>
                            ))}
                        </View>
                    </Card>
                </Animated.View>
            </ScrollView>
        </ScreenContainer>
    );
}
