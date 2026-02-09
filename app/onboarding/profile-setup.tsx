import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, StyleSheet, Dimensions, Image } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { Button } from '../../src/components/ui/Button';
import { ChevronLeft, ChevronRight, User, Heart, Activity, Cigarette, Wine, Apple, Dumbbell, AlertCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProfileStore } from '../../src/store/profileStore';
import { Logo } from '../../src/components/ui/Logo';

const { width } = Dimensions.get('window');

const MEDICAL_CONDITIONS = ['Diabetes', 'Hypertension', 'Heart Disease', 'Asthma', 'Thyroid Disorder', 'None'];
const FAMILY_CANCERS = ['Breast Cancer', 'Lung Cancer', 'Colorectal Cancer', 'Prostate Cancer', 'Skin Cancer', 'None'];
const RACES = ['White', 'Black/African American', 'Asian', 'Hispanic/Latino', 'Native American', 'Other', 'Prefer not to say'];

export default function ProfileSetupScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { updateProfile } = useProfileStore();

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        sex: null as 'Male' | 'Female' | 'Other' | null,
        race: null as string | null,
        medicalHistory: [] as string[],
        familyHistory: [] as string[],
        smokingStatus: null as 'Never' | 'Former' | 'Current' | null,
        alcoholUnits: '0',
        exerciseMinutes: '0',
        dietQuality: null as 'Poor' | 'Fair' | 'Good' | 'Excellent' | null,
        healthConcerns: '',
    });

    const toggleArrayItem = (array: string[], item: string, setter: (arr: string[]) => void) => {
        if (item === 'None') {
            setter([]);
        } else {
            const newArray = array.includes(item) ? array.filter(i => i !== item) : [...array.filter(i => i !== 'None'), item];
            setter(newArray);
        }
    };

    const handleNext = () => {
        if (step < 4) {
            setStep(step + 1);
        } else {
            // Save to store
            updateProfile({
                name: formData.name || 'User',
                age: formData.age ? parseInt(formData.age) : null,
                sex: formData.sex,
                race: formData.race,
                medicalHistory: formData.medicalHistory,
                familyHistory: formData.familyHistory,
                smokingStatus: formData.smokingStatus,
                alcoholUnitsPerWeek: parseInt(formData.alcoholUnits) || 0,
                exerciseMinutesPerWeek: parseInt(formData.exerciseMinutes) || 0,
                dietQuality: formData.dietQuality,
                healthConcerns: formData.healthConcerns ? [formData.healthConcerns] : [],
                isOnboarded: true,
                profileCompleted: true,
            });
            router.replace('/(tabs)/home');
        }
    };

    const canProceed = () => {
        if (step === 1) return formData.name && formData.age && formData.sex && formData.race;
        if (step === 2) return true; // Optional
        if (step === 3) return formData.smokingStatus !== null;
        if (step === 4) return true; // Optional
        return false;
    };

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <ScreenContainer hasWave={false} darkStatus={false} withPadding={false} fullScreen={true} className="bg-black">
                {/* Cinematic Background */}
                <View style={styles.bgContainer}>
                    <Image
                        source={require('../../assets/goals_bg_v2.png')}
                        style={styles.bgImage}
                        resizeMode="cover"
                    />
                    <LinearGradient
                        colors={['rgba(0, 0, 0, 0.75)', 'rgba(5, 53, 61, 0.85)', '#05353D']}
                        style={styles.gradientOverlay}
                        locations={[0, 0.4, 0.85]}
                    />
                </View>

                <View style={{ flex: 1, paddingHorizontal: 28, paddingTop: insets.top, paddingBottom: insets.bottom + 20 }}>
                    {/* Header */}
                    <View className="flex-row items-center justify-between mb-4">
                        <Pressable
                            onPress={() => step > 1 ? setStep(step - 1) : router.back()}
                            style={styles.backButton}
                            className="bg-white/10 rounded-2xl items-center justify-center border border-white/20 backdrop-blur-xl"
                        >
                            <ChevronLeft size={24} color="white" />
                        </Pressable>
                        <View className="flex-row items-center bg-white/10 px-3 py-2.5 rounded-xl border border-white/20">
                            <Logo size={12} style={{ marginRight: 8 }} />
                            <Text className="text-white/80 text-[10px] font-black uppercase tracking-[2px]">Step {step}/4</Text>
                        </View>
                        <View className="w-12" />
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                        {step === 1 && (
                            <Animated.View entering={FadeInRight.duration(600)}>
                                <Text className="text-white/60 text-[10px] font-black uppercase tracking-[4px] mb-3" style={styles.labelText}>Demographics</Text>
                                <Text className="text-white text-4xl font-black mb-10 leading-tight" style={styles.headline}>Tell us{'\n'}about you.</Text>

                                <View className="bg-white/5 border border-white/10 p-5 rounded-3xl mb-6">
                                    <Text className="text-white/40 text-xs font-black uppercase tracking-widest mb-3">Full Name</Text>
                                    <TextInput
                                        placeholder="Enter your name"
                                        placeholderTextColor="rgba(255,255,255,0.2)"
                                        className="text-white text-lg font-medium"
                                        value={formData.name}
                                        onChangeText={(text) => setFormData({ ...formData, name: text })}
                                    />
                                </View>

                                <View className="bg-white/5 border border-white/10 p-5 rounded-3xl mb-6">
                                    <Text className="text-white/40 text-xs font-black uppercase tracking-widest mb-3">Age</Text>
                                    <TextInput
                                        placeholder="Enter your age"
                                        placeholderTextColor="rgba(255,255,255,0.2)"
                                        className="text-white text-lg font-medium"
                                        keyboardType="number-pad"
                                        value={formData.age}
                                        onChangeText={(text) => setFormData({ ...formData, age: text })}
                                    />
                                </View>

                                <Text className="text-white/40 text-xs font-black uppercase tracking-widest mb-4">Biological Sex</Text>
                                <View className="flex-row gap-3 mb-6">
                                    {(['Male', 'Female', 'Other'] as const).map((sex) => (
                                        <Pressable
                                            key={sex}
                                            onPress={() => setFormData({ ...formData, sex })}
                                            className={`flex-1 py-4 rounded-2xl border items-center ${formData.sex === sex ? 'bg-nxtcure-primary border-nxtcure-primary' : 'bg-white/5 border-white/10'}`}
                                        >
                                            <Text className={`font-black text-sm ${formData.sex === sex ? 'text-white' : 'text-white/40'}`}>{sex}</Text>
                                        </Pressable>
                                    ))}
                                </View>

                                <Text className="text-white/40 text-xs font-black uppercase tracking-widest mb-4">Race/Ethnicity</Text>
                                <View className="gap-3">
                                    {RACES.map((race) => (
                                        <Pressable
                                            key={race}
                                            onPress={() => setFormData({ ...formData, race })}
                                            className={`p-4 rounded-2xl border flex-row items-center ${formData.race === race ? 'bg-nxtcure-primary/20 border-nxtcure-primary' : 'bg-white/5 border-white/10'}`}
                                        >
                                            <View className={`w-5 h-5 rounded-full border mr-3 ${formData.race === race ? 'bg-nxtcure-primary border-nxtcure-primary' : 'border-white/30'}`} />
                                            <Text className={`font-bold text-sm ${formData.race === race ? 'text-white' : 'text-white/60'}`}>{race}</Text>
                                        </Pressable>
                                    ))}
                                </View>
                            </Animated.View>
                        )}

                        {step === 2 && (
                            <Animated.View entering={FadeInRight.duration(600)}>
                                <Text className="text-white/60 text-[10px] font-black uppercase tracking-[4px] mb-3" style={styles.labelText}>Medical Background</Text>
                                <Text className="text-white text-4xl font-black mb-10 leading-tight" style={styles.headline}>Your{'\n'}History.</Text>

                                <Text className="text-white/40 text-xs font-black uppercase tracking-widest mb-4">Personal Medical History</Text>
                                <View className="gap-3 mb-8">
                                    {MEDICAL_CONDITIONS.map((condition) => (
                                        <Pressable
                                            key={condition}
                                            onPress={() => toggleArrayItem(formData.medicalHistory, condition, (arr) => setFormData({ ...formData, medicalHistory: arr }))}
                                            className={`p-4 rounded-2xl border flex-row items-center ${formData.medicalHistory.includes(condition) || (condition === 'None' && formData.medicalHistory.length === 0) ? 'bg-nxtcure-primary/20 border-nxtcure-primary' : 'bg-white/5 border-white/10'}`}
                                        >
                                            <View className={`w-5 h-5 rounded-full border mr-3 ${formData.medicalHistory.includes(condition) || (condition === 'None' && formData.medicalHistory.length === 0) ? 'bg-nxtcure-primary border-nxtcure-primary' : 'border-white/30'}`} />
                                            <Text className={`font-bold text-sm ${formData.medicalHistory.includes(condition) || (condition === 'None' && formData.medicalHistory.length === 0) ? 'text-white' : 'text-white/60'}`}>{condition}</Text>
                                        </Pressable>
                                    ))}
                                </View>

                                <Text className="text-white/40 text-xs font-black uppercase tracking-widest mb-4">Family Cancer History</Text>
                                <View className="gap-3">
                                    {FAMILY_CANCERS.map((cancer) => (
                                        <Pressable
                                            key={cancer}
                                            onPress={() => toggleArrayItem(formData.familyHistory, cancer, (arr) => setFormData({ ...formData, familyHistory: arr }))}
                                            className={`p-4 rounded-2xl border flex-row items-center ${formData.familyHistory.includes(cancer) || (cancer === 'None' && formData.familyHistory.length === 0) ? 'bg-nxtcure-primary/20 border-nxtcure-primary' : 'bg-white/5 border-white/10'}`}
                                        >
                                            <View className={`w-5 h-5 rounded-full border mr-3 ${formData.familyHistory.includes(cancer) || (cancer === 'None' && formData.familyHistory.length === 0) ? 'bg-nxtcure-primary border-nxtcure-primary' : 'border-white/30'}`} />
                                            <Text className={`font-bold text-sm ${formData.familyHistory.includes(cancer) || (cancer === 'None' && formData.familyHistory.length === 0) ? 'text-white' : 'text-white/60'}`}>{cancer}</Text>
                                        </Pressable>
                                    ))}
                                </View>
                            </Animated.View>
                        )}

                        {step === 3 && (
                            <Animated.View entering={FadeInRight.duration(600)}>
                                <Text className="text-white/60 text-[10px] font-black uppercase tracking-[4px] mb-3" style={styles.labelText}>Lifestyle</Text>
                                <Text className="text-white text-4xl font-black mb-10 leading-tight" style={styles.headline}>Daily{'\n'}Habits.</Text>

                                <Text className="text-white/40 text-xs font-black uppercase tracking-widest mb-4">Smoking Status</Text>
                                <View className="flex-row gap-3 mb-8">
                                    {(['Never', 'Former', 'Current'] as const).map((status) => (
                                        <Pressable
                                            key={status}
                                            onPress={() => setFormData({ ...formData, smokingStatus: status })}
                                            className={`flex-1 py-4 rounded-2xl border items-center ${formData.smokingStatus === status ? 'bg-nxtcure-primary border-nxtcure-primary' : 'bg-white/5 border-white/10'}`}
                                        >
                                            <Text className={`font-black text-sm ${formData.smokingStatus === status ? 'text-white' : 'text-white/40'}`}>{status}</Text>
                                        </Pressable>
                                    ))}
                                </View>

                                <View className="bg-white/5 border border-white/10 p-5 rounded-3xl mb-6">
                                    <Text className="text-white/40 text-xs font-black uppercase tracking-widest mb-3">Alcohol (units/week)</Text>
                                    <TextInput
                                        placeholder="0"
                                        placeholderTextColor="rgba(255,255,255,0.2)"
                                        className="text-white text-lg font-medium"
                                        keyboardType="number-pad"
                                        value={formData.alcoholUnits}
                                        onChangeText={(text) => setFormData({ ...formData, alcoholUnits: text })}
                                    />
                                </View>

                                <View className="bg-white/5 border border-white/10 p-5 rounded-3xl mb-6">
                                    <Text className="text-white/40 text-xs font-black uppercase tracking-widest mb-3">Exercise (min/week)</Text>
                                    <TextInput
                                        placeholder="0"
                                        placeholderTextColor="rgba(255,255,255,0.2)"
                                        className="text-white text-lg font-medium"
                                        keyboardType="number-pad"
                                        value={formData.exerciseMinutes}
                                        onChangeText={(text) => setFormData({ ...formData, exerciseMinutes: text })}
                                    />
                                </View>

                                <Text className="text-white/40 text-xs font-black uppercase tracking-widest mb-4">Diet Quality</Text>
                                <View className="flex-row gap-2">
                                    {(['Poor', 'Fair', 'Good', 'Excellent'] as const).map((quality) => (
                                        <Pressable
                                            key={quality}
                                            onPress={() => setFormData({ ...formData, dietQuality: quality })}
                                            className={`flex-1 py-3 rounded-2xl border items-center ${formData.dietQuality === quality ? 'bg-nxtcure-primary border-nxtcure-primary' : 'bg-white/5 border-white/10'}`}
                                        >
                                            <Text className={`font-black text-xs ${formData.dietQuality === quality ? 'text-white' : 'text-white/40'}`}>{quality}</Text>
                                        </Pressable>
                                    ))}
                                </View>
                            </Animated.View>
                        )}

                        {step === 4 && (
                            <Animated.View entering={FadeInRight.duration(600)}>
                                <Text className="text-white/60 text-[10px] font-black uppercase tracking-[4px] mb-3" style={styles.labelText}>Current Health</Text>
                                <Text className="text-white text-4xl font-black mb-10 leading-tight" style={styles.headline}>Any{'\n'}Concerns?</Text>

                                <View className="bg-white/5 border border-white/10 p-5 rounded-3xl mb-6">
                                    <Text className="text-white/40 text-xs font-black uppercase tracking-widest mb-3">Health Concerns (Optional)</Text>
                                    <TextInput
                                        placeholder="e.g., Persistent cough, unexplained weight loss"
                                        placeholderTextColor="rgba(255,255,255,0.2)"
                                        className="text-white text-base font-medium"
                                        multiline
                                        numberOfLines={4}
                                        value={formData.healthConcerns}
                                        onChangeText={(text) => setFormData({ ...formData, healthConcerns: text })}
                                        style={{ minHeight: 100, textAlignVertical: 'top' }}
                                    />
                                </View>

                                <View className="bg-blue-500/10 border border-blue-500/20 p-5 rounded-3xl flex-row items-start">
                                    <AlertCircle size={20} color="#60A5FA" className="mr-3 mt-0.5" />
                                    <Text className="flex-1 text-blue-100/60 text-xs leading-5">
                                        This information helps us personalize your prevention plan and risk assessment. All data is encrypted and stored locally.
                                    </Text>
                                </View>
                            </Animated.View>
                        )}
                    </ScrollView>

                    {/* Footer */}
                    <View className="mt-4">
                        <Button
                            title={step === 4 ? "Complete Setup" : "Continue"}
                            onPress={handleNext}
                            disabled={!canProceed()}
                            className={`w-full h-16 rounded-[24px] ${canProceed() ? 'bg-nxtcure-primary' : 'bg-white/10'}`}
                        />
                        {step < 4 && (
                            <Pressable onPress={() => setStep(step + 1)} className="mt-4 items-center">
                                <Text className="text-white/30 text-xs font-black uppercase tracking-widest">Skip</Text>
                            </Pressable>
                        )}
                    </View>
                </View>
            </ScreenContainer>
        </>
    );
}

const styles = StyleSheet.create({
    bgContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
    },
    bgImage: {
        width: '100%',
        height: '100%',
    },
    gradientOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    backButton: {
        width: 48,
        height: 48,
    },
    headline: {
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 10,
    },
    labelText: {
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
});
