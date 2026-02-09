import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, TextInput, Dimensions } from 'react-native';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { Card } from '../../src/components/ui/Card';
import { useRiskStore, FamilyHistoryItem } from '../../src/store/riskStore';
import { ChevronLeft, ChevronRight, Check, History, User, Heart, ShieldCheck, Info, Plus, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInRight, FadeInLeft, Layout } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const STEPS = [
    { id: 1, title: 'Identity', icon: User },
    { id: 2, title: 'Genetics', icon: History },
    { id: 3, title: 'Clinical', icon: ShieldCheck },
    { id: 4, title: 'Lifestyle', icon: Heart },
];

export default function RiskQuestionnaireScreen() {
    const router = useRouter();
    const { factors, setFactors } = useRiskStore();
    const [step, setStep] = useState(1);

    // Step Local States
    const [age, setAge] = useState(factors.age.toString());
    const [sex, setSex] = useState(factors.sex);
    const [race, setRace] = useState(factors.race);
    const [familyItems, setFamilyItems] = useState<FamilyHistoryItem[]>(factors.familyHistory);
    const [isSmoker, setIsSmoker] = useState(factors.isSmoker);
    const [packYears, setPackYears] = useState(factors.packYears?.toString() || '');
    const [hpvVaccine, setHpvVaccine] = useState(factors.vaccinationStatus.hpv);

    const handleNext = () => {
        if (step < STEPS.length) {
            setStep(step + 1);
        } else {
            // Save final factors and navigate to profile
            setFactors({
                age: parseInt(age) || 25,
                sex: sex as any,
                race,
                familyHistory: familyItems,
                isSmoker,
                packYears: parseFloat(packYears) || 0,
                vaccinationStatus: { ...factors.vaccinationStatus, hpv: hpvVaccine }
            });
            router.push('/risk/profile');
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
        else router.back();
    };

    const addFamilyHistory = () => {
        setFamilyItems([...familyItems, { relation: 'parent', cancerType: '', ageAtDiagnosis: 50 }]);
    };

    const updateFamilyItem = (idx: number, updates: Partial<FamilyHistoryItem>) => {
        const newItems = [...familyItems];
        newItems[idx] = { ...newItems[idx], ...updates };
        setFamilyItems(newItems);
    };

    const removeFamilyItem = (idx: number) => {
        setFamilyItems(familyItems.filter((_, i) => i !== idx));
    };

    return (
        <ScreenContainer hasWave={false} darkStatus={false} withPadding={false} fullScreen={true} className="bg-black">
            <LinearGradient colors={['#0F3460', '#000000']} style={StyleSheet.absoluteFill} />

            {/* Header / Progress bar */}
            <View className="px-6 pt-12 pb-6">
                <View className="flex-row items-center justify-between mb-8">
                    <Pressable onPress={handleBack} className="bg-white/10 w-12 h-12 rounded-2xl items-center justify-center border border-white/20">
                        <ChevronLeft size={24} color="white" />
                    </Pressable>
                    <View className="flex-row gap-2">
                        {STEPS.map((s) => (
                            <View
                                key={s.id}
                                className={`h-1.5 rounded-full ${step >= s.id ? 'bg-nxtcure-primary' : 'bg-white/10'}`}
                                style={{ width: (width - 120) / STEPS.length }}
                            />
                        ))}
                    </View>
                    <View className="w-12 h-12" />
                </View>
                <Text className="text-white/40 text-[10px] font-black uppercase tracking-[4px]">STEP {step} OF {STEPS.length}</Text>
                <Text className="text-white text-3xl font-black tracking-tighter mt-1">{STEPS[step - 1].title}.</Text>
            </View>

            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                {step === 1 && (
                    <Animated.View entering={FadeInRight.duration(400)} className="gap-6">
                        <View>
                            <Text className="text-white/60 text-xs font-bold mb-3 uppercase tracking-widest ml-1">Current Age</Text>
                            <TextInput
                                value={age}
                                onChangeText={setAge}
                                keyboardType="numeric"
                                placeholder="Age"
                                placeholderTextColor="rgba(255,255,255,0.2)"
                                className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white text-xl font-bold"
                            />
                        </View>

                        <View>
                            <Text className="text-white/60 text-xs font-bold mb-3 uppercase tracking-widest ml-1">Biological Sex</Text>
                            <View className="flex-row gap-3">
                                {['male', 'female', 'other'].map((s) => (
                                    <Pressable
                                        key={s}
                                        onPress={() => setSex(s as any)}
                                        className={`flex-1 py-4 rounded-2xl border items-center ${sex === s ? 'bg-nxtcure-primary border-nxtcure-primary' : 'bg-white/5 border-white/10'}`}
                                    >
                                        <Text className={`font-black uppercase text-[10px] tracking-widest ${sex === s ? 'text-white' : 'text-white/40'}`}>{s}</Text>
                                    </Pressable>
                                ))}
                            </View>
                        </View>

                        <View>
                            <Text className="text-white/60 text-xs font-bold mb-3 uppercase tracking-widest ml-1">Ancestry / Phenotype</Text>
                            <View className="flex-row flex-wrap gap-2">
                                {['White', 'Black', 'Asian', 'Hispanic', 'Fair Skin', 'Other'].map((r) => (
                                    <Pressable
                                        key={r}
                                        onPress={() => setRace(r.toLowerCase())}
                                        className={`px-5 py-3 rounded-xl border ${race === r.toLowerCase() ? 'bg-white/20 border-white/40' : 'bg-white/5 border-white/10'}`}
                                    >
                                        <Text className={`font-bold text-xs ${race === r.toLowerCase() ? 'text-white' : 'text-white/40'}`}>{r}</Text>
                                    </Pressable>
                                ))}
                            </View>
                        </View>
                    </Animated.View>
                )}

                {step === 2 && (
                    <Animated.View entering={FadeInRight.duration(400)}>
                        <Text className="text-white/60 text-xs font-medium leading-5 mb-6 mr-10">
                            First-degree relative history significantly alters clinical screening schedules.
                        </Text>

                        <View className="gap-4">
                            {familyItems.map((item, idx) => (
                                <Card key={idx} className="bg-white/5 border-white/10 p-5 rounded-[28px]">
                                    <View className="flex-row justify-between items-center mb-4">
                                        <View className="flex-row items-center">
                                            <History size={16} color="#1DD1A1" className="mr-2" />
                                            <Text className="text-white/40 font-black text-[10px] uppercase tracking-widest">Entry #{idx + 1}</Text>
                                        </View>
                                        <Pressable onPress={() => removeFamilyItem(idx)}>
                                            <X size={18} color="rgba(255,255,255,0.3)" />
                                        </Pressable>
                                    </View>

                                    <TextInput
                                        value={item.cancerType}
                                        onChangeText={(val) => updateFamilyItem(idx, { cancerType: val })}
                                        placeholder="Cancer Type (e.g. Breast, Colon)"
                                        placeholderTextColor="rgba(255,255,255,0.2)"
                                        className="text-white text-lg font-bold mb-4"
                                    />

                                    <View className="flex-row gap-4">
                                        <View className="flex-1">
                                            <Text className="text-white/30 text-[9px] font-black uppercase mb-1">Relation</Text>
                                            <View className="bg-white/5 rounded-xl border border-white/10 px-3 py-2">
                                                <Text className="text-white text-xs">{item.relation}</Text>
                                            </View>
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-white/30 text-[9px] font-black uppercase mb-1">Age at DX</Text>
                                            <TextInput
                                                value={item.ageAtDiagnosis.toString()}
                                                onChangeText={(val) => updateFamilyItem(idx, { ageAtDiagnosis: parseInt(val) || 0 })}
                                                keyboardType="numeric"
                                                className="text-white text-xs"
                                            />
                                        </View>
                                    </View>
                                </Card>
                            ))}

                            <Pressable
                                onPress={addFamilyHistory}
                                className="border border-dashed border-white/20 p-6 rounded-[28px] items-center flex-row justify-center"
                            >
                                <Plus size={18} color="rgba(255,255,255,0.4)" className="mr-3" />
                                <Text className="text-white/40 font-bold uppercase tracking-widest text-xs">Add Relative History</Text>
                            </Pressable>
                        </View>
                    </Animated.View>
                )}

                {step === 3 && (
                    <Animated.View entering={FadeInRight.duration(400)} className="gap-6">
                        <Pressable
                            onPress={() => setHpvVaccine(!hpvVaccine)}
                            className={`p-6 rounded-[32px] border ${hpvVaccine ? 'bg-nxtcure-primary/10 border-nxtcure-primary/30' : 'bg-white/5 border-white/10'}`}
                        >
                            <View className="flex-row items-center mb-2">
                                <ShieldCheck size={20} color={hpvVaccine ? '#1DD1A1' : 'rgba(255,255,255,0.4)'} className="mr-3" />
                                <Text className="text-white font-black text-lg">HPV Vaccinated</Text>
                            </View>
                            <Text className="text-white/40 text-xs leading-5">Gardasil/Cervarix prevents 90% of HPV-linked cancers (Cervical, Anal, Throat).</Text>
                        </Pressable>

                        <Card className="bg-white/5 border-white/10 p-6 rounded-[32px]">
                            <Text className="text-white font-black text-lg mb-4">Medical History</Text>
                            <View className="gap-3">
                                {['Colon Polyps', 'Gastro Reflux (GERD)', 'History of Radiation', 'Hepatitis B/C'].map(h => (
                                    <View key={h} className="flex-row items-center justify-between">
                                        <Text className="text-white/60 text-sm">{h}</Text>
                                        <View className="w-5 h-5 rounded-md border border-white/20 items-center justify-center">
                                            <Check size={12} color="#1DD1A1" opacity={0.2} />
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </Card>
                    </Animated.View>
                )}

                {step === 4 && (
                    <Animated.View entering={FadeInRight.duration(400)} className="gap-8">
                        <View>
                            <Text className="text-white font-black text-xl mb-6">Tobacco & Exposure</Text>
                            <View className="flex-row gap-4 mb-6">
                                <Pressable
                                    onPress={() => setIsSmoker(true)}
                                    className={`flex-1 p-5 rounded-2xl border items-center ${isSmoker ? 'bg-red-500/20 border-red-500' : 'bg-white/5 border-white/10'}`}
                                >
                                    <Text className="text-white font-black">Active/Ex-Smoker</Text>
                                </Pressable>
                                <Pressable
                                    onPress={() => setIsSmoker(false)}
                                    className={`flex-1 p-5 rounded-2xl border items-center ${!isSmoker ? 'bg-nxtcure-primary/20 border-nxtcure-primary' : 'bg-white/5 border-white/10'}`}
                                >
                                    <Text className="text-white font-black">Never Smoked</Text>
                                </Pressable>
                            </View>

                            {isSmoker && (
                                <Animated.View entering={FadeInLeft}>
                                    <Text className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-2 ml-1">Est. Pack-Years (Packs/Day * Years)</Text>
                                    <TextInput
                                        value={packYears}
                                        onChangeText={setPackYears}
                                        keyboardType="numeric"
                                        placeholder="e.g. 20"
                                        placeholderTextColor="rgba(255,255,255,0.2)"
                                        className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white text-xl font-bold"
                                    />
                                    <View className="flex-row items-center mt-3 ml-1">
                                        <Info size={12} color="rgba(255,255,255,0.4)" className="mr-2" />
                                        <Text className="text-white/30 text-[10px]">USPSTF recommends screening for 20+ pack-years.</Text>
                                    </View>
                                </Animated.View>
                            )}
                        </View>
                    </Animated.View>
                )}
            </ScrollView>

            {/* Bottom Button */}
            <View className="absolute bottom-10 left-6 right-6">
                <Pressable
                    onPress={handleNext}
                    className="bg-nxtcure-primary h-18 rounded-[24px] flex-row items-center justify-center shadow-lg shadow-nxtcure-primary/20"
                >
                    <Text className="text-white font-black uppercase tracking-widest text-lg ml-4">
                        {step === STEPS.length ? 'Finalize Profile' : 'Continue'}
                    </Text>
                    <ChevronRight size={24} color="white" className="ml-2" />
                </Pressable>
            </View>
        </ScreenContainer>
    );
}
