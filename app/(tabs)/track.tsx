import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, StyleSheet, Dimensions, Modal, TextInput } from 'react-native';
import { Check, Info, AlertCircle, CigaretteOff, WineOff, Sun, Activity as ExerciseIcon, ShieldCheck, ChevronLeft, Fingerprint, Plus, Activity, Microscope, Zap, BarChart3 } from 'lucide-react-native';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { useDietStore, DailyLog } from '../../src/store/dietStore';
import { useLifestyleStore } from '../../src/store/lifestyleStore';
import { useRiskStore } from '../../src/store/riskStore';
import { useSymptomStore } from '../../src/store/symptomStore';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, useAnimatedProps, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const DIET_ITEMS: { id: keyof DailyLog; label: string; icon: string; penalty?: boolean }[] = [
    { id: 'oliveOil', label: 'Olive Oil (primary fat)', icon: '🫒' },
    { id: 'vegetables', label: 'Vegetables (>= 2 servings)', icon: '🥗' },
    { id: 'fruit', label: 'Fruit (>= 2 servings)', icon: '🍎' },
    { id: 'nuts', label: 'Nuts (handful)', icon: '🥜' },
    { id: 'wholeGrains', label: 'Whole Grains', icon: '🌾' },
    { id: 'fish', label: 'Fish / Seafood', icon: '🐟' },
    { id: 'legumes', label: 'Legumes / Beans', icon: '🫘' },
    { id: 'redMeat', label: 'Red Meat', icon: '🥩', penalty: true },
    { id: 'processedMeat', label: 'Processed Meat', icon: '🥓', penalty: true },
    { id: 'soda', label: 'Sugary Drinks / Soda', icon: '🥤', penalty: true },
];

function MiniGauge({ score }: { score: number }) {
    const size = 70;
    const strokeWidth = 8;
    const center = size / 2;
    const radius = center - strokeWidth;
    const circumference = 2 * Math.PI * radius;
    const percentage = score / 100;

    const animatedProps = useAnimatedProps(() => ({
        strokeDashoffset: withTiming(circumference * (1 - percentage), { duration: 1500 }),
    }));

    return (
        <View className="items-center justify-center">
            <Svg width={size} height={size}>
                <Defs>
                    <SvgGradient id="miniGaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <Stop offset="0%" stopColor="#1DD1A1" />
                        <Stop offset="100%" stopColor="#45AAF2" />
                    </SvgGradient>
                </Defs>
                <Circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                <AnimatedCircle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke="url(#miniGaugeGrad)"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    animatedProps={animatedProps}
                    strokeLinecap="round"
                    fill="none"
                    transform={`rotate(-90 ${center} ${center})`}
                />
            </Svg>
            <View className="absolute">
                <Text className="text-white font-black text-lg">{score}</Text>
            </View>
        </View>
    );
}

export default function TrackScreen() {
    const today = new Date().toISOString().split('T')[0];
    const { logs: dietLogs, toggleItem, getScore: getDietScore } = useDietStore();
    const { logs: lifestyleLogs, toggleHabit, setExercise, getConsistencyScore } = useLifestyleStore();
    const { calculateRisk } = useRiskStore();
    const { addLog: addSymptomLog } = useSymptomStore();
    const router = useRouter();

    const [symptomModal, setSymptomModal] = useState(false);
    const [symptomText, setSymptomText] = useState('');
    const [severity, setSeverity] = useState(5);

    const currentLog = dietLogs[today] || {};
    const currentLifestyle = lifestyleLogs[today] || {
        smokingFree: true,
        alcoholFree: true,
        sunScreenApplied: false,
        carcinogenAwareness: false,
        exerciseMinutes: 0
    };

    const dietScore = getDietScore(today);
    const lifestyleScore = getConsistencyScore(today);
    const { score: totalPreventionScore } = calculateRisk(dietScore, lifestyleScore);

    const handleSymptomSubmit = () => {
        if (symptomText.trim()) {
            addSymptomLog({
                symptoms: [symptomText],
                severity,
                notes: ''
            });
            setSymptomText('');
            setSymptomModal(false);
        }
    };

    return (
        <ScreenContainer darkStatus={false} withPadding={false} className="bg-black">
            {/* Premium Biotech Background */}
            <View style={StyleSheet.absoluteFill}>
                <Image
                    source={require('../../assets/medical_hero_v2.png')}
                    style={StyleSheet.absoluteFill}
                    resizeMode="cover"
                />
                <LinearGradient
                    colors={['rgba(26, 26, 46, 0.8)', 'rgba(5, 53, 61, 0.4)', 'rgba(0, 0, 0, 0.85)', 'black']}
                    style={StyleSheet.absoluteFill}
                    locations={[0, 0.3, 0.6, 0.95]}
                />
            </View>

            {/* Premium Header */}
            <View className="px-8 pt-4 pb-4 flex-row items-center justify-between">
                <View className="flex-row items-center">
                    <Pressable onPress={() => router.back()} className="w-10 h-10 bg-white/10 rounded-2xl border border-white/20 items-center justify-center mr-4 backdrop-blur-3xl active:opacity-70">
                        <ChevronLeft size={20} color="white" />
                    </Pressable>
                    <View>
                        <View className="flex-row items-center mb-0.5">
                            <Fingerprint size={10} color="#1DD1A1" opacity={0.6} />
                            <Text className="text-white/40 text-[8px] font-black uppercase tracking-[2px] ml-1.5">Daily synthesis</Text>
                        </View>
                        <Text className="text-white text-2xl font-black tracking-tighter">Protocol Log</Text>
                    </View>
                </View>
                <MiniGauge score={totalPreventionScore} />
            </View>

            <ScrollView className="flex-1 px-8" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
                {/* Protocol Shortcuts (NEW: Symptom & Exam Logging) */}
                <Animated.View entering={FadeInDown.duration(800)} className="mb-8">
                    <Text className="text-white/40 text-[9px] font-black uppercase tracking-[4px] ml-2 mb-4">Command Center</Text>
                    <View className="flex-row gap-4">
                        <Pressable
                            onPress={() => setSymptomModal(true)}
                            className="flex-1 bg-white/5 border border-white/10 p-5 rounded-[28px] items-center backdrop-blur-3xl"
                        >
                            <View className="w-12 h-12 bg-red-500/10 rounded-2xl items-center justify-center mb-3">
                                <Activity size={24} color="#FF4757" />
                            </View>
                            <Text className="text-white font-bold text-center text-xs">Log Symptom</Text>
                        </Pressable>

                        <Pressable
                            onPress={() => router.push('/learn/self-exam-tse')}
                            className="flex-1 bg-white/5 border border-white/10 p-5 rounded-[28px] items-center backdrop-blur-3xl"
                        >
                            <View className="w-12 h-12 bg-nxtcure-primary/10 rounded-2xl items-center justify-center mb-3">
                                <Microscope size={24} color="#1DD1A1" />
                            </View>
                            <Text className="text-white font-bold text-center text-xs">Perform Exam</Text>
                        </Pressable>
                    </View>

                    <View className="flex-row gap-4 mt-4">
                        <Pressable
                            onPress={() => router.push('/learn/scanner')}
                            className="flex-1 bg-white/5 border border-white/10 p-5 rounded-[28px] items-center backdrop-blur-3xl"
                        >
                            <View className="w-12 h-12 bg-blue-500/10 rounded-2xl items-center justify-center mb-3">
                                <Zap size={24} color="#45AAF2" />
                            </View>
                            <Text className="text-white font-bold text-center text-xs">AI Scanner</Text>
                        </Pressable>

                        <Pressable
                            onPress={() => router.push('/learn/report')}
                            className="flex-1 bg-white/5 border border-white/10 p-5 rounded-[28px] items-center backdrop-blur-3xl"
                        >
                            <View className="w-12 h-12 bg-purple-500/10 rounded-2xl items-center justify-center mb-3">
                                <BarChart3 size={24} color="#A55EEA" />
                            </View>
                            <Text className="text-white font-bold text-center text-xs">Weekly Report</Text>
                        </Pressable>
                    </View>
                </Animated.View>

                {/* Lifestyle Vitals Section */}
                <Animated.View entering={FadeInDown.delay(100).duration(800)} className="mb-10">
                    <Text className="text-white/60 text-[10px] font-black uppercase tracking-[4px] ml-2 mb-4">Lifestyle Vitals</Text>

                    <View className="flex-row flex-wrap gap-3">
                        <Pressable
                            onPress={() => toggleHabit(today, 'smokingFree')}
                            style={[styles.glassCard, !currentLifestyle.smokingFree && styles.penaltyCard]}
                            className="flex-1 min-w-[45%] p-5 items-center active:opacity-80"
                        >
                            <CigaretteOff size={24} color={currentLifestyle.smokingFree ? '#1DD1A1' : '#FF4757'} />
                            <Text className={`text-[10px] font-black mt-3 uppercase tracking-widest text-center ${currentLifestyle.smokingFree ? 'text-white/80' : 'text-red-400'}`}>
                                {currentLifestyle.smokingFree ? 'Smoke Free' : 'Smoking'}
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={() => toggleHabit(today, 'alcoholFree')}
                            style={[styles.glassCard, !currentLifestyle.alcoholFree && styles.penaltyCard]}
                            className="flex-1 min-w-[45%] p-5 items-center active:opacity-80"
                        >
                            <WineOff size={24} color={currentLifestyle.alcoholFree ? '#1DD1A1' : '#FF4757'} />
                            <Text className={`text-[10px] font-black mt-3 uppercase tracking-widest text-center ${currentLifestyle.alcoholFree ? 'text-white/80' : 'text-red-400'}`}>
                                {currentLifestyle.alcoholFree ? 'Alcohol Free' : 'Drinking'}
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={() => toggleHabit(today, 'sunScreenApplied')}
                            style={[styles.glassCard, currentLifestyle.sunScreenApplied && styles.activeCard]}
                            className="flex-1 min-w-[45%] p-5 items-center active:opacity-80"
                        >
                            <Sun size={24} color={currentLifestyle.sunScreenApplied ? '#1DD1A1' : 'rgba(255,255,255,0.4)'} />
                            <Text className={`text-[10px] font-black mt-3 uppercase tracking-widest text-center ${currentLifestyle.sunScreenApplied ? 'text-nxtcure-primary' : 'text-white/60'}`}>
                                SPF Shield
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={() => router.push('/learn/carcinogen-db')}
                            style={[styles.glassCard, currentLifestyle.carcinogenAwareness && styles.activeCard]}
                            className="flex-1 min-w-[45%] p-5 items-center active:opacity-80"
                        >
                            <ShieldCheck size={24} color={currentLifestyle.carcinogenAwareness ? '#1DD1A1' : 'rgba(255,255,255,0.4)'} />
                            <Text className={`text-[10px] font-black mt-3 uppercase tracking-widest text-center ${currentLifestyle.carcinogenAwareness ? 'text-nxtcure-primary' : 'text-white/60'}`}>
                                IARC Aware
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={() => setExercise(today, currentLifestyle.exerciseMinutes >= 30 ? 0 : 30)}
                            style={[styles.glassCard, currentLifestyle.exerciseMinutes >= 30 && styles.activeCard]}
                            className="w-full p-6 flex-row items-center border-white/10 active:opacity-80"
                        >
                            <View className={`w-14 h-14 rounded-2xl items-center justify-center ${currentLifestyle.exerciseMinutes >= 30 ? 'bg-nxtcure-primary/10' : 'bg-white/5'}`}>
                                <ExerciseIcon size={26} color={currentLifestyle.exerciseMinutes >= 30 ? '#1DD1A1' : 'rgba(255,255,255,0.4)'} />
                            </View>
                            <View className="ml-5 flex-1">
                                <Text className="text-white font-bold text-lg">30m+ Physical Activity</Text>
                                <Text className="text-white/60 text-[10px] font-black uppercase tracking-widest mt-1">Metabolic Optimization</Text>
                            </View>
                            <View className={`w-7 h-7 rounded-full border ${currentLifestyle.exerciseMinutes >= 30 ? 'bg-nxtcure-primary border-nxtcure-primary' : 'border-white/20'} items-center justify-center`}>
                                {currentLifestyle.exerciseMinutes >= 30 && <Check size={16} color="white" strokeWidth={3} />}
                            </View>
                        </Pressable>
                    </View>
                </Animated.View>

                {/* Mediterranean Synthesis Section */}
                <Animated.View entering={FadeInDown.delay(300).duration(800)}>
                    <View className="flex-row items-center justify-between mb-4 px-2">
                        <Text className="text-white/60 text-[10px] font-black uppercase tracking-[4px]">Mediterranean Synthesis</Text>
                        <Text className="text-nxtcure-primary text-[11px] font-black tracking-widest">{dietScore}/10 Protocol</Text>
                    </View>

                    <View className="gap-3">
                        {DIET_ITEMS.map((item) => {
                            const isSelected = !!currentLog[item.id as keyof DailyLog];
                            return (
                                <Pressable
                                    key={item.id}
                                    onPress={() => toggleItem(today, item.id as keyof DailyLog)}
                                    style={[styles.glassCard, isSelected && (item.penalty ? styles.penaltyCard : styles.activeCard)]}
                                    className="p-5 flex-row items-center active:opacity-80"
                                >
                                    <View className="w-12 h-12 rounded-2xl bg-white/5 items-center justify-center mr-5 border border-white/10">
                                        <Text className="text-3xl">{item.icon}</Text>
                                    </View>
                                    <View className="flex-1">
                                        <Text className={`text-[8px] font-black uppercase tracking-[2px] mb-1 ${item.penalty ? 'text-red-400/80' : 'text-white/50'}`}>
                                            {item.penalty ? 'Avoidance Protocol' : 'Nutritional Pillar'}
                                        </Text>
                                        <Text className="text-white text-lg font-bold leading-tight">{item.label}</Text>
                                    </View>
                                    <View className={`w-8 h-8 rounded-full items-center justify-center border ${isSelected ? (item.penalty ? 'bg-red-500 border-red-400' : 'bg-nxtcure-primary border-nxtcure-primary/50') : 'border-white/20'}`}>
                                        {isSelected && <Check size={18} color="white" strokeWidth={3} />}
                                    </View>
                                </Pressable>
                            );
                        })}
                    </View>
                </Animated.View>
            </ScrollView>

            {/* Symptom Modal */}
            <Modal
                transparent
                visible={symptomModal}
                animationType="fade"
                onRequestClose={() => setSymptomModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View className="bg-[#1A1A2E] w-[85%] rounded-[40px] p-8 border border-white/10">
                        <Text className="text-white text-2xl font-black mb-2">Log Symptom</Text>
                        <Text className="text-white/40 text-xs mb-6 font-bold uppercase tracking-widest">Biometric Event Capture</Text>

                        <TextInput
                            value={symptomText}
                            onChangeText={setSymptomText}
                            placeholder="What are you feeling?"
                            placeholderTextColor="rgba(255,255,255,0.2)"
                            className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white mb-6"
                        />

                        <Text className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-4">Severity: {severity}/10</Text>
                        <View className="flex-row justify-between mb-8">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(val => (
                                <Pressable
                                    key={val}
                                    onPress={() => setSeverity(val)}
                                    className={`w-7 h-7 rounded-full items-center justify-center ${severity === val ? 'bg-nxtcure-primary' : 'bg-white/5 border border-white/10'}`}
                                >
                                    <Text className={`text-[10px] font-black ${severity === val ? 'text-black' : 'text-white'}`}>{val}</Text>
                                </Pressable>
                            ))}
                        </View>

                        <View className="flex-row gap-4">
                            <Pressable
                                onPress={() => setSymptomModal(false)}
                                className="flex-1 py-4 items-center"
                            >
                                <Text className="text-white/40 font-bold">Cancel</Text>
                            </Pressable>
                            <Pressable
                                onPress={handleSymptomSubmit}
                                className="flex-2 bg-nxtcure-primary py-4 rounded-2xl items-center px-8 shadow-lg shadow-nxtcure-primary/20"
                            >
                                <Text className="text-black font-black uppercase tracking-widest">Protocol Save</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Bottom Fade Mask */}
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)', 'black']}
                style={styles.bottomFade}
            />
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    glassCard: {
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        borderRadius: 28,
    },
    activeCard: {
        backgroundColor: 'rgba(29, 209, 161, 0.08)',
        borderColor: 'rgba(29, 209, 161, 0.25)',
    },
    penaltyCard: {
        backgroundColor: 'rgba(255, 71, 87, 0.08)',
        borderColor: 'rgba(255, 71, 87, 0.25)',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomFade: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 120,
        pointerEvents: 'none',
        zIndex: 10,
    }
});
