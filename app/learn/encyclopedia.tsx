import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Dimensions } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { ChevronLeft, GraduationCap, ChevronRight, Search, BookOpen, Activity, Heart, Shield } from 'lucide-react-native';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { Card } from '../../src/components/ui/Card';
import { CANCER_DATABASE } from '../../src/data/cancerDatabase';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function EncyclopediaScreen() {
    const router = useRouter();
    const cancers = Object.values(CANCER_DATABASE);

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <ScreenContainer hasWave={false} darkStatus={false} withPadding={false} fullScreen={true} className="bg-black">
                <LinearGradient colors={['#05353D', '#000000']} style={StyleSheet.absoluteFill} locations={[0, 0.4]} />

                <View className="px-6 pt-12 pb-6 flex-row items-center justify-between">
                    <Pressable onPress={() => router.back()} className="bg-white/10 w-12 h-12 rounded-2xl items-center justify-center border border-white/20">
                        <ChevronLeft size={24} color="white" />
                    </Pressable>
                    <View className="flex-row items-center bg-white/10 px-4 py-2 rounded-xl border border-white/20">
                        <BookOpen size={16} color="#1DD1A1" className="mr-3" />
                        <Text className="text-white/80 text-[10px] font-black uppercase tracking-[2px]">Encyclopia</Text>
                    </View>
                    <View className="w-12 h-12" />
                </View>

                <ScrollView className="flex-1 px-8" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                    <Animated.View entering={FadeInDown.duration(800)}>
                        <Text className="text-white/40 text-[10px] font-black uppercase tracking-[5px] mb-4">CLINICAL DATABASE</Text>
                        <Text className="text-white text-4xl font-black tracking-tighter mb-4 leading-[45px]">
                            Cancer{'\n'}Knowledge Base.
                        </Text>
                        <Text className="text-white/40 text-sm leading-6 mb-10">
                            Access medically-validated profiles, risk factors, and clinical warning signs for over 100+ oncological classifications.
                        </Text>

                        <View className="gap-4">
                            {cancers.map((cancer, idx) => (
                                <Animated.View key={cancer.id} entering={FadeInDown.delay(100 * idx)}>
                                    <Pressable
                                        onPress={() => router.push(`/learn/cancer/${cancer.id}`)}
                                        className="bg-white/5 border border-white/10 p-6 rounded-[32px] flex-row items-center"
                                    >
                                        <View className="bg-nxtcure-primary/10 w-12 h-12 rounded-2xl items-center justify-center mr-5">
                                            <Activity size={24} color="#1DD1A1" />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-white font-black text-lg">{cancer.title}</Text>
                                            <View className="flex-row items-center mt-1">
                                                <Text className="text-white/30 text-[9px] font-bold uppercase tracking-widest">{cancer.stats.survival} Survival Rate</Text>
                                                <View className="w-1 h-1 rounded-full bg-white/20 mx-2" />
                                                <Text className="text-white/30 text-[9px] font-bold uppercase tracking-widest">Age {cancer.stats.ageGroup}</Text>
                                            </View>
                                        </View>
                                        <ChevronRight size={20} color="white" opacity={0.2} />
                                    </Pressable>
                                </Animated.View>
                            ))}
                        </View>

                        <Card className="bg-nxtcure-info/5 border border-nxtcure-info/20 p-8 rounded-[40px] mt-10">
                            <View className="flex-row items-center mb-4">
                                <Shield size={20} color="#45AAF2" className="mr-4" />
                                <Text className="text-white font-black text-lg">Data Standards</Text>
                            </View>
                            <Text className="text-white/40 text-xs leading-5">
                                All clinical profiles are aggregated from NCI, WHO, and peer-reviewed oncological literature. This database is updated daily with latest clinical trial outcomes.
                            </Text>
                        </Card>
                    </Animated.View>
                </ScrollView>
            </ScreenContainer>
        </>
    );
}

const styles = StyleSheet.create({});
