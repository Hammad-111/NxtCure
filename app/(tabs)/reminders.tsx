import React, { useMemo } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Dimensions, Image } from 'react-native';
import { Calendar, Bell, CheckCircle2, AlertCircle, Clock, Plus, ChevronRight, User, Info, ShieldCheck, Zap, Video } from 'lucide-react-native';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { Card } from '../../src/components/ui/Card';
import { useScreeningStore, ScreeningType } from '../../src/store/screeningStore';
import { useRiskStore } from '../../src/store/riskStore';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface ScreeningProtocol {
    id: ScreeningType;
    title: string;
    frequency: 'Monthly' | '6 Months' | 'Annual' | 'Future' | 'Clinical';
    frequencyMonths: number;
    icon: any;
    description: string;
    color: string;
    videoUrl?: string;
    ageStart?: number;
    sex?: 'male' | 'female' | 'both';
}

const PROTOCOLS: ScreeningProtocol[] = [
    {
        id: 'testicular',
        title: 'Testicular Self-Exam',
        frequency: 'Monthly',
        frequencyMonths: 1,
        icon: User,
        description: 'Monthly manual check for lumps or changes.',
        color: '#1DD1A1',
        sex: 'male'
    },
    {
        id: 'breast_self',
        title: 'Breast Self-Exam',
        frequency: 'Monthly',
        frequencyMonths: 1,
        icon: ShieldCheck,
        description: 'Monthly manual check for lumps or changes.',
        color: '#A55EEA',
        videoUrl: '#',
        sex: 'female'
    },
    {
        id: 'skin',
        title: 'Skin Self-Check',
        frequency: '6 Months',
        frequencyMonths: 6,
        icon: Zap,
        description: 'Check moles for ABCDE changes.',
        color: '#45AAF2'
    },
    {
        id: 'dental',
        title: 'Dental Oral Exam',
        frequency: 'Annual',
        frequencyMonths: 12,
        icon: Info,
        description: 'Clinical screening for oral cancers.',
        color: '#F7B731'
    },
    {
        id: 'mammogram',
        title: 'Mammogram',
        frequency: 'Annual',
        frequencyMonths: 12,
        icon: ShieldCheck,
        description: 'X-ray screening for early detection.',
        color: '#FF4757',
        ageStart: 40,
        sex: 'female'
    },
    {
        id: 'pap_smear',
        title: 'Pap Smear',
        frequency: 'Clinical',
        frequencyMonths: 36,
        icon: ShieldCheck,
        description: 'Cervical cancer screening.',
        color: '#A55EEA',
        sex: 'female'
    },
    {
        id: 'colonoscopy',
        title: 'Colonoscopy',
        frequency: 'Clinical',
        frequencyMonths: 120,
        icon: AlertCircle,
        description: 'The gold standard for colorectal detection.',
        color: '#F7B731',
        ageStart: 45
    },
    {
        id: 'prostate_psa',
        title: 'Prostate PSA',
        frequency: 'Annual',
        frequencyMonths: 12,
        icon: User,
        description: 'PSA blood test for standard monitoring.',
        color: '#45AAF2',
        ageStart: 50,
        sex: 'male'
    },
    {
        id: 'ldct_lung',
        title: 'Low-Dose CT Chest',
        frequency: 'Annual',
        frequencyMonths: 12,
        icon: Info,
        description: 'Smoking history screening.',
        color: '#FF4757',
        ageStart: 50
    }
];

export default function RemindersScreen() {
    const { logs, markAsDone } = useScreeningStore();
    const { factors } = useRiskStore();
    const router = useRouter();

    const filteredProtocols = useMemo(() => {
        const now = new Date();
        return PROTOCOLS.map(p => {
            // Check if applicable
            const isSexMatch = !p.sex || p.sex === factors.sex || p.sex === 'both';
            const isAgeMatch = !p.ageStart || factors.age >= p.ageStart;

            const lastDone = logs[p.id];
            let status = 'Pending';
            let overdue = false;
            let nextDateText = '';
            let lastDoneText = '';

            if (lastDone) {
                const lastDate = new Date(lastDone);
                lastDoneText = `${Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))} days ago`;

                const nextDate = new Date(lastDate);
                nextDate.setMonth(nextDate.getMonth() + p.frequencyMonths);

                const diffTime = nextDate.getTime() - now.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays <= 0) {
                    status = 'OVERDUE';
                    overdue = true;
                } else {
                    status = 'Actionable';
                    nextDateText = `Next: ${nextDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
                }
            } else {
                status = isAgeMatch ? 'Initial Due' : 'Not Yet Recommended';
                overdue = isAgeMatch;
            }

            return {
                ...p,
                isApplicable: isSexMatch,
                isRecommended: isAgeMatch,
                status,
                overdue,
                nextDateText,
                lastDoneText
            };
        });
    }, [factors, logs]);

    const sections = [
        { title: 'MONTHLY', data: filteredProtocols.filter(p => p.isApplicable && p.isRecommended && p.frequency === 'Monthly') },
        { title: 'EVERY 6 MONTHS', data: filteredProtocols.filter(p => p.isApplicable && p.isRecommended && p.frequency === '6 Months') },
        { title: 'ANNUALLY', data: filteredProtocols.filter(p => p.isApplicable && p.isRecommended && (p.frequency === 'Annual' || p.frequency === 'Clinical')) },
        { title: 'NOT YET RECOMMENDED', data: filteredProtocols.filter(p => p.isApplicable && !p.isRecommended) },
    ];

    return (
        <ScreenContainer hasWave={false} darkStatus={false} withPadding={false} fullScreen={true} className="bg-black">
            <LinearGradient colors={['#05253D', '#000000']} style={StyleSheet.absoluteFill} />

            <View className="px-8 pt-12 pb-6 flex-row justify-between items-center">
                <View>
                    <Text className="text-white/40 text-[9px] font-black uppercase tracking-[5px] mb-1">Pillar 2: Early Detection</Text>
                    <Text className="text-white text-3xl font-black tracking-tighter">Human Baseline.</Text>
                </View>
                <View className="bg-white/10 w-12 h-12 rounded-2xl items-center justify-center border border-white/20">
                    <Bell size={24} color="white" />
                </View>
            </View>

            <ScrollView className="flex-1 px-8" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
                {/* Protocol Card Highlight */}
                {sections.map((section, sIdx) => (
                    section.data.length > 0 && (
                        <Animated.View key={section.title} entering={FadeInDown.delay(sIdx * 200)} className="mb-8">
                            <Text className="text-white/40 text-[10px] font-black uppercase tracking-[4px] ml-2 mb-4">{section.title}</Text>
                            {section.data.map((item, iIdx) => (
                                <Card key={item.id} className={`mb-4 bg-white/5 border-white/10 p-6 rounded-[32px] ${item.overdue ? 'border-l-4 border-l-red-500' : ''}`}>
                                    <View className="flex-row items-center justify-between mb-4">
                                        <View className="flex-row items-center flex-1">
                                            <View style={{ backgroundColor: `${item.color}20` }} className="w-12 h-12 rounded-2xl items-center justify-center mr-4">
                                                <item.icon size={22} color={item.color} />
                                            </View>
                                            <View className="flex-1">
                                                <View className="flex-row items-center">
                                                    {item.overdue && <AlertCircle size={14} color="#FF4757" className="mr-1.5" />}
                                                    <Text className={`text-white font-black text-lg ${item.overdue ? 'text-red-400' : ''}`}>{item.title}</Text>
                                                </View>
                                                {item.lastDoneText ? (
                                                    <Text className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-0.5">Last Done: {item.lastDoneText}</Text>
                                                ) : item.isRecommended ? (
                                                    <Text className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-0.5">Initial Protocol Due</Text>
                                                ) : (
                                                    <Text className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-0.5">Starts age {item.ageStart}</Text>
                                                )}
                                            </View>
                                        </View>
                                    </View>

                                    {item.isRecommended ? (
                                        <View className="flex-row gap-3">
                                            <Pressable
                                                onPress={() => {
                                                    const routeMap: Record<string, string> = {
                                                        testicular: '/learn/self-exam-tse',
                                                        breast_self: '/learn/self-exam-breast',
                                                        skin: '/learn/self-exam-skin',
                                                        dental: '/learn/self-exam-oral'
                                                    };
                                                    const route = routeMap[item.id] || '/learn';
                                                    router.push(route as any);
                                                }}
                                                className="flex-1 bg-nxtcure-primary/10 border border-nxtcure-primary/30 py-3.5 rounded-2xl items-center flex-row justify-center"
                                            >
                                                <CheckCircle2 size={16} color="#1DD1A1" className="mr-2" />
                                                <Text className="text-white font-black text-[10px] uppercase tracking-widest">Mark Done</Text>
                                            </Pressable>

                                            {item.videoUrl && (
                                                <Pressable className="bg-white/5 border border-white/10 px-5 rounded-2xl items-center justify-center">
                                                    <Video size={18} color="white" opacity={0.6} />
                                                </Pressable>
                                            )}

                                            <Pressable className="bg-white/5 border border-white/10 py-3.5 px-6 rounded-2xl items-center justify-center">
                                                <ChevronRight size={16} color="white" opacity={0.4} />
                                            </Pressable>
                                        </View>
                                    ) : (
                                        <View className="bg-white/5 p-4 rounded-2xl">
                                            <Text className="text-white/20 text-[10px] font-bold leading-4">
                                                Standard guideline for {factors.sex} patients at age {item.ageStart}. Clinical surveillance not required currently.
                                            </Text>
                                        </View>
                                    )}

                                    {item.status === 'Actionable' && (
                                        <View className="mt-4 flex-row items-center ml-1">
                                            <Clock size={12} color="rgba(255,255,255,0.4)" className="mr-2" />
                                            <Text className="text-white/40 text-[10px] font-bold">{item.nextDateText}</Text>
                                        </View>
                                    )}
                                </Card>
                            ))}
                        </Animated.View>
                    )
                ))}

                {/* Clinical Note */}
                <Animated.View entering={FadeInDown.delay(800)} className="bg-white/5 p-8 rounded-[40px] border border-white/10 items-center">
                    <ShieldCheck size={32} color="#1DD1A1" opacity={0.6} className="mb-4" />
                    <Text className="text-white font-black text-center text-lg mb-2">Validated Guidelines</Text>
                    <Text className="text-white/40 text-center text-xs leading-5">
                        Recommendations are based on ACS and USPSTF clinical data. High-risk profiles should consult with their primary oncologist.
                    </Text>
                </Animated.View>
            </ScrollView>
        </ScreenContainer>
    );
}
