import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Dimensions, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ShieldAlert, ChevronRight, Microscope, BookOpen, Heart, Activity, Search, Info, Award } from 'lucide-react-native';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { Card } from '../../src/components/ui/Card';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Logo } from '../../src/components/ui/Logo';

const { width, height } = Dimensions.get('window');

function LearnCategory({ title, items, router }: any) {
    return (
        <View className="mb-8">
            <Text className="text-white/40 text-[9px] font-black uppercase tracking-[4px] ml-2 mb-4">{title}</Text>
            <View className="gap-3">
                {items.map((item: any, index: number) => (
                    <Animated.View
                        key={item.title}
                        entering={FadeInDown.duration(600).delay(200 + index * 100)}
                    >
                        <Pressable onPress={() => router.push(item.path)}>
                            <Card className="bg-white/5 border-white/10 p-5 flex-row items-center backdrop-blur-3xl">
                                <View
                                    className="w-12 h-12 rounded-2xl items-center justify-center mr-4 border border-white/5"
                                    style={{ backgroundColor: item.color + '15' }}
                                >
                                    {typeof item.icon === 'string' ? (
                                        <Text className="text-2xl">{item.icon}</Text>
                                    ) : (
                                        <item.icon size={22} color={item.color} strokeWidth={2} />
                                    )}
                                </View>
                                <View className="flex-1">
                                    <Text className="text-white font-bold text-base leading-tight">{item.title}</Text>
                                    <Text className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-0.5">{item.subtitle}</Text>
                                </View>
                                <ChevronRight size={18} color="rgba(255,255,255,0.2)" />
                            </Card>
                        </Pressable>
                    </Animated.View>
                ))}
            </View>
        </View>
    );
}

export default function LearnScreen() {
    const router = useRouter();

    const clinicalDatabases = [
        {
            title: 'Carcinogen Registry',
            subtitle: '120+ High-Risk Agents',
            icon: ShieldAlert,
            color: '#FF4757',
            path: '/learn/carcinogen-db'
        },
        {
            title: 'ASCO Research Hub',
            subtitle: 'Next-Gen Clinical Trials',
            icon: Microscope,
            color: '#1DD1A1',
            path: '/learn/research'
        },
    ];

    const supportGuides = [
        {
            title: 'Physical Markers',
            subtitle: 'Monthly Self-Exam Scan',
            icon: '🤲',
            color: '#45AAF2',
            path: '/learn/self-exam-tse'
        },
        {
            title: 'Triage Protocol',
            subtitle: 'Side Effect Thresholds',
            icon: '⚠️',
            color: '#FF4757',
            path: '/learn/side-effects'
        },
        {
            title: 'Synthesis Diet',
            subtitle: 'Neutropenic Nutrition',
            icon: '🍲',
            color: '#F9CA24',
            path: '/learn/chemo-nutrition'
        }
    ];

    return (
        <ScreenContainer darkStatus={false} withPadding={false} className="bg-black">
            {/* Cinematic Background */}
            <View style={styles.bgContainer}>
                <Image
                    source={require('../../assets/home_hero_bg.png')}
                    style={styles.bgImage}
                    resizeMode="cover"
                    blurRadius={4}
                />
                <LinearGradient
                    colors={['rgba(0,0,0,0.85)', 'rgba(5, 53, 61, 0.4)', 'rgba(0, 0, 0, 0.8)', 'black']}
                    style={StyleSheet.absoluteFill}
                    locations={[0, 0.2, 0.5, 0.95]}
                />
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                {/* Header Section */}
                <Animated.View entering={FadeInDown.duration(1000)} className="px-8 pt-12 pb-10">
                    <View className="flex-row items-center mb-1">
                        <Logo size={24} style={{ marginRight: 8 }} />
                        <Text className="text-white/40 text-[9px] font-black uppercase tracking-[5px]">Academy Hub</Text>
                    </View>
                    <Text className="text-white text-4xl font-black tracking-tighter">Clinical{'\n'}Encyclopedia</Text>
                    <View className="h-1 w-12 bg-nxtcure-primary rounded-full mt-4" />
                </Animated.View>

                {/* Categories */}
                <View className="px-8">
                    <LearnCategory
                        title="Medical Intelligence"
                        items={clinicalDatabases}
                        router={router}
                    />

                    <LearnCategory
                        title="Patient Protocols"
                        items={supportGuides}
                        router={router}
                    />

                    {/* Featured Research Card */}
                    <Animated.View entering={FadeInDown.duration(800).delay(500)}>
                        <Pressable>
                            <Card className="bg-nxtcure-primary/10 border-nxtcure-primary/20 p-6 overflow-hidden">
                                <View className="absolute -right-10 -top-10 w-40 h-40 bg-nxtcure-primary/5 rounded-full blur-3xl" />
                                <View className="flex-row items-center mb-2">
                                    <Award size={18} color="#1DD1A1" />
                                    <Text className="text-nxtcure-primary font-black text-[10px] uppercase tracking-widest ml-2">Premium Content</Text>
                                </View>
                                <Text className="text-white font-black text-xl mb-2">Genomic Prevention 2026</Text>
                                <Text className="text-white/60 text-xs leading-5">Explore the latest breakthroughs in CRISPR-guided screening protocols and personalized immunotherapy.</Text>
                                <View className="flex-row items-center mt-4">
                                    <Text className="text-white font-bold text-xs">Read Abstract</Text>
                                    <ChevronRight size={14} color="white" style={{ marginLeft: 4 }} />
                                </View>
                            </Card>
                        </Pressable>
                    </Animated.View>
                </View>
            </ScrollView>

            <LinearGradient
                colors={['transparent', 'black']}
                style={styles.bottomFade}
            />
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    bgContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: height,
        zIndex: -1,
    },
    bgImage: {
        width: '100%',
        height: '100%',
        opacity: 0.8,
    },
    bottomFade: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: height * 0.4,
        pointerEvents: 'none'
    }
});
