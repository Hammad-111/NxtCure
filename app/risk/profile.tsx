import React, { useMemo } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Dimensions } from 'react-native';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { Card } from '../../src/components/ui/Card';
import { useRiskStore, CancerSpecificRisk } from '../../src/store/riskStore';
import { ChevronLeft, ShieldCheck, AlertCircle, Info, FileText, Calendar, Zap, Share2, ArrowRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp, Layout } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const RiskItem = ({ risk, idx }: { risk: CancerSpecificRisk, idx: number }) => {
    const isElevated = risk.level === 'Elevated' || risk.level === 'High';
    const isBelow = risk.level === 'Below Average';

    const iconColor = isElevated ? '#EB3B5A' : isBelow ? '#1DD1A1' : '#F7B731';
    const bgColor = isElevated ? 'rgba(235, 59, 90, 0.1)' : isBelow ? 'rgba(29, 209, 161, 0.1)' : 'rgba(247, 183, 49, 0.1)';

    return (
        <Animated.View entering={FadeInDown.delay(400 + idx * 100)}>
            <Card className="bg-white/5 border-white/10 p-6 rounded-[32px] mb-4">
                <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-row items-center">
                        <View style={{ backgroundColor: iconColor }} className="w-2 h-2 rounded-full mr-3" />
                        <Text className="text-white font-black text-lg">{risk.type}</Text>
                    </View>
                    <View style={{ backgroundColor: bgColor }} className="px-3 py-1 rounded-full">
                        <Text style={{ color: iconColor }} className="text-[9px] font-black uppercase tracking-widest">{risk.level}</Text>
                    </View>
                </View>

                <Text className="text-white/40 text-xs leading-5 mb-4">{risk.reason}</Text>

                <View className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <Text className="text-white/80 font-bold text-[10px] uppercase tracking-widest mb-2">Recommendation</Text>
                    <Text className="text-white/60 text-xs leading-5">{risk.recommendation}</Text>
                </View>
            </Card>
        </Animated.View>
    );
};

export default function RiskProfileScreen() {
    const router = useRouter();
    const { calculateDetailedProfile } = useRiskStore();

    const profile = useMemo(() => calculateDetailedProfile(), [calculateDetailedProfile]);

    const belowAverage = profile.filter(r => r.level === 'Below Average');
    const averageRisk = profile.filter(r => r.level === 'Average');
    const elevatedRisk = profile.filter(r => r.level === 'Elevated' || r.level === 'High');

    return (
        <ScreenContainer hasWave={false} darkStatus={false} withPadding={false} fullScreen={true} className="bg-black">
            <LinearGradient colors={['#05353D', '#000000']} style={StyleSheet.absoluteFill} />

            <View className="px-6 pt-12 pb-6 flex-row items-center justify-between">
                <Pressable onPress={() => router.back()} className="bg-white/10 w-12 h-12 rounded-2xl items-center justify-center border border-white/20">
                    <ChevronLeft size={24} color="white" />
                </Pressable>
                <Text className="text-white font-black uppercase tracking-[3px] text-xs">Clinical Profile</Text>
                <Pressable className="bg-white/10 w-12 h-12 rounded-2xl items-center justify-center border border-white/20">
                    <Share2 size={20} color="white" />
                </Pressable>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}>
                {/* Dashboard Header */}
                <Animated.View entering={FadeInDown.duration(800)} className="mb-10 mt-4">
                    <Text className="text-white/40 text-[10px] font-black uppercase tracking-[5px] mb-2">VALIDATED MODEL V2.0</Text>
                    <Text className="text-white text-4xl font-black tracking-tighter leading-[40px]">
                        Your Cancer{'\n'}Risk Profile.
                    </Text>
                </Animated.View>

                {/* Risk Grid Section */}
                <View className="mb-12">
                    {/* Elevated Risk Section */}
                    {elevatedRisk.length > 0 && (
                        <View className="mb-8">
                            <View className="flex-row items-center mb-6">
                                <View className="bg-red-500 w-1.5 h-6 rounded-full mr-4" />
                                <Text className="text-white font-black text-xl tracking-tight">🔴 ELEVATED RISK</Text>
                            </View>
                            {elevatedRisk.map((r, i) => <RiskItem key={r.type} risk={r} idx={i} />)}
                        </View>
                    )}

                    {/* Average Risk Section */}
                    {averageRisk.length > 0 && (
                        <View className="mb-8">
                            <View className="flex-row items-center mb-6">
                                <View className="bg-yellow-500 w-1.5 h-6 rounded-full mr-4" />
                                <Text className="text-white font-black text-xl tracking-tight">🟡 AVERAGE RISK</Text>
                            </View>
                            {averageRisk.map((r, i) => <RiskItem key={r.type} risk={r} idx={i + elevatedRisk.length} />)}
                        </View>
                    )}

                    {/* Below Average Section */}
                    {belowAverage.length > 0 && (
                        <View className="mb-8">
                            <View className="flex-row items-center mb-6">
                                <View className="bg-nxtcure-primary w-1.5 h-6 rounded-full mr-4" />
                                <Text className="text-white font-black text-xl tracking-tight">🟢 BELOW AVERAGE RISK</Text>
                            </View>
                            {belowAverage.map((r, i) => <RiskItem key={r.type} risk={r} idx={i + elevatedRisk.length + averageRisk.length} />)}
                        </View>
                    )}
                </View>

                {/* Actionable Recommendations Global */}
                <Animated.View entering={FadeInUp.delay(800)}>
                    <Text className="text-white/40 text-[10px] font-black uppercase tracking-[4px] mb-6 ml-1">SYSTEMIC PROTOCOLS</Text>

                    <Card className="bg-nxtcure-primary/10 border-nxtcure-primary/30 p-8 rounded-[40px] mb-6">
                        <View className="flex-row items-center mb-6">
                            <Calendar size={28} color="#1DD1A1" className="mr-5" />
                            <View>
                                <Text className="text-white font-black text-2xl">Screening Plan</Text>
                                <Text className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Medical Schedule</Text>
                            </View>
                        </View>

                        <View className="gap-4">
                            <View className="flex-row items-center">
                                <View className="w-1.5 h-1.5 rounded-full bg-nxtcure-primary mr-3" />
                                <Text className="text-white/80 text-sm font-medium">Standard Colonoscopy @ Age 45</Text>
                            </View>
                            <View className="flex-row items-center">
                                <View className="w-1.5 h-1.5 rounded-full bg-nxtcure-primary mr-3" />
                                <Text className="text-white/80 text-sm font-medium">Annual Dermatology Checkup</Text>
                            </View>
                            {elevatedRisk.some(r => r.type === 'Lung Cancer') && (
                                <View className="flex-row items-center">
                                    <View className="w-1.5 h-1.5 rounded-full bg-red-400 mr-3" />
                                    <Text className="text-white/80 text-sm font-bold">Priority LDCT Lung Screening</Text>
                                </View>
                            )}
                        </View>

                        <Pressable
                            onPress={() => router.push('/(tabs)/reminders')}
                            className="bg-nxtcure-primary mt-8 py-5 rounded-2xl items-center flex-row justify-center"
                        >
                            <Text className="text-white font-black uppercase tracking-[2px] text-xs">Sync to Medical Calendar</Text>
                            <ArrowRight size={16} color="white" className="ml-3" />
                        </Pressable>
                    </Card>

                    <Card className="bg-white/5 border-white/10 p-8 rounded-[40px]">
                        <View className="flex-row items-center mb-6">
                            <Zap size={28} color="#A55EEA" className="mr-5" />
                            <View>
                                <Text className="text-white font-black text-2xl">Next Steps</Text>
                                <Text className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Action Required</Text>
                            </View>
                        </View>
                        <Text className="text-white/60 text-xs leading-6 mb-8">
                            Your risk profile is dynamic. As you implement lifestyle optimization protocol (Mediterranian diet, 150m activity), your prevention score will increase.
                        </Text>
                        <Pressable
                            onPress={() => router.push('/risk/questionnaire')}
                            className="bg-white/10 border border-white/10 py-5 rounded-2xl items-center"
                        >
                            <Text className="text-white/40 font-black uppercase tracking-[2px] text-[10px]">Update Risk Factors</Text>
                        </Pressable>
                    </Card>
                </Animated.View>
            </ScrollView>
        </ScreenContainer>
    );
}
