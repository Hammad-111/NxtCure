import React, { useMemo } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Calendar, Bell, CheckCircle2, AlertCircle, Clock } from 'lucide-react-native';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { Card } from '../../src/components/ui/Card';
import { useScreeningStore, ScreeningType } from '../../src/store/screeningStore';
import { useRiskStore } from '../../src/store/riskStore';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

interface ScreeningRecommendation {
    id: ScreeningType;
    title: string;
    frequencyMonths: number;
    icon: any;
    color: string;
    route: string;
}

export default function RemindersScreen() {
    const { logs } = useScreeningStore();
    const { factors } = useRiskStore();
    const router = useRouter();

    const baseRecommendations: ScreeningRecommendation[] = useMemo(() => {
        const list: ScreeningRecommendation[] = [
            {
                id: 'tse',
                title: 'Testicular Self-Exam',
                frequencyMonths: 1,
                icon: Clock,
                color: '#1DD1A1',
                route: '/learn/self-exam-tse'
            },
            {
                id: 'skin',
                title: 'Skin Self-Check',
                frequencyMonths: 6,
                icon: Calendar,
                color: '#45aaf2',
                route: '/learn' // placeholder for skin guide
            },
            {
                id: 'dental',
                title: 'Dental Exam (Oral Screening)',
                frequencyMonths: 12,
                icon: Calendar,
                color: '#a4b0be',
                route: '/learn' // placeholder
            }
        ];

        if (factors.age >= 45) {
            list.push({
                id: 'colonoscopy',
                title: 'Colonoscopy Screening',
                frequencyMonths: 120, // 10 years
                icon: AlertCircle,
                color: '#FF4757',
                route: '/learn'
            });
        }

        return list;
    }, [factors.age]);

    const items = useMemo(() => {
        const now = new Date();
        return baseRecommendations.map(rec => {
            const lastDone = logs[rec.id];
            let status = 'Not started';
            let urgent = true;

            if (lastDone) {
                const lastDate = new Date(lastDone);
                const nextDate = new Date(lastDate);
                nextDate.setMonth(nextDate.getMonth() + rec.frequencyMonths);

                const diffTime = nextDate.getTime() - now.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays <= 0) {
                    status = 'Due today';
                    urgent = true;
                } else {
                    status = `Next: ${nextDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
                    urgent = false;
                }
            }

            return { ...rec, status, urgent };
        });
    }, [baseRecommendations, logs]);

    const urgent = items.filter(i => i.urgent);
    const upcoming = items.filter(i => !i.urgent);

    return (
        <ScreenContainer hasWave={true} waveVariant="compact" darkStatus={false} withPadding={false} className="bg-white">
            <View className="px-6 py-4 flex-row justify-between items-center">
                <Text className="text-2xl font-bold text-white">Reminders</Text>
                <Pressable className="p-2">
                    <Bell size={22} color="white" />
                </Pressable>
            </View>

            <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
                {urgent.length > 0 && (
                    <View className="mb-8">
                        <Text className="text-red-500 font-bold text-xs uppercase tracking-widest mb-4">Action Required</Text>
                        {urgent.map(item => (
                            <Card key={item.id} className="border-l-4 border-l-red-500 bg-red-50/20 mb-3">
                                <View className="flex-row items-center">
                                    <View className="w-10 h-10 rounded-full bg-red-100 items-center justify-center mr-4">
                                        <item.icon size={20} color="#ef4444" />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="font-bold text-nxtcure-text text-base">{item.title}</Text>
                                        <Text className="text-red-600 text-xs font-semibold">{item.status}</Text>
                                    </View>
                                    <Pressable
                                        onPress={() => router.push(item.route as any)}
                                        className="bg-red-500 px-4 py-2 rounded-xl"
                                    >
                                        <Text className="text-white font-bold text-xs">Do Now</Text>
                                    </Pressable>
                                </View>
                            </Card>
                        ))}
                    </View>
                )}

                <View className="mb-8">
                    <Text className="text-nxtcure-subtext font-bold text-xs uppercase tracking-widest mb-4">Upcoming Schedule</Text>
                    {upcoming.length > 0 ? upcoming.map(item => (
                        <Card key={item.id} className="mb-3">
                            <View className="flex-row items-center">
                                <View className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center mr-4">
                                    <item.icon size={20} color="#a4b0be" />
                                </View>
                                <View className="flex-1">
                                    <Text className="font-bold text-nxtcure-text text-base">{item.title}</Text>
                                    <Text className="text-nxtcure-subtext text-xs">{item.status} (Every {item.frequencyMonths}m)</Text>
                                </View>
                            </View>
                        </Card>
                    )) : (
                        <Text className="text-slate-400 text-xs text-center py-4 italic">No upcoming screenings in this period.</Text>
                    )}
                </View>

                <View className="bg-nxtcure-primary/5 p-6 rounded-3xl border border-nxtcure-primary/10 mb-10">
                    <View className="flex-row items-center mb-2">
                        <CheckCircle2 size={18} color="#1DD1A1" />
                        <Text className="ml-2 font-bold text-nxtcure-text">Smart Recommendations</Text>
                    </View>
                    <Text className="text-slate-600 text-xs leading-5">
                        Your schedule is based on your age ({factors.age}) and sex ({factors.sex}). As you get older, we'll automatically add new screenings like Colonoscopy (at age 45).
                    </Text>
                </View>

                <View className="h-32" />
            </ScrollView>

            <LinearGradient
                colors={['transparent', 'rgba(255,255,255,0.8)', 'white']}
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 100,
                    pointerEvents: 'none',
                }}
            />
        </ScreenContainer>
    );
}
