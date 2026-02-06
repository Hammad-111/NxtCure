import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, AlertTriangle, ShieldCheck, BookOpen } from 'lucide-react-native';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { Card } from '../../src/components/ui/Card';
import { CARCINOGENS } from '../../src/data/carcinogens';

export default function CarcinogenDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const item = CARCINOGENS.find(c => c.id === id);

    if (!item) return <Text>Not found</Text>;

    return (
        <ScreenContainer className="bg-white" withPadding={false}>
            <View className="px-6 py-4 flex-row items-center border-b border-slate-50">
                <Pressable onPress={() => router.back()} className="p-2 -ml-2">
                    <ChevronLeft size={24} color="#2d3436" />
                </Pressable>
                <Text className="text-xl font-bold text-nxtcure-text ml-2">Detail</Text>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="p-6">
                    <View className="bg-red-50 self-start px-3 py-1 rounded-full mb-4">
                        <Text className="text-red-600 text-[10px] font-bold uppercase">IARC Group 1</Text>
                    </View>

                    <Text className="text-3xl font-extrabold text-nxtcure-text mb-2">{item.name}</Text>
                    <Text className="text-nxtcure-subtext text-base leading-6 mb-8">{item.summary}</Text>

                    <Card className="mb-8 border-l-4 border-l-red-500 bg-red-50/30">
                        <View className="flex-row items-center mb-3">
                            <AlertTriangle size={20} color="#ef4444" />
                            <Text className="ml-2 font-bold text-red-700 text-lg">Cancer Risk</Text>
                        </View>
                        <Text className="text-red-900/80 leading-6">{item.cancerRisk}</Text>
                    </Card>

                    <View className="mb-8">
                        <Text className="text-lg font-bold text-nxtcure-text mb-4">Common Examples</Text>
                        <View className="flex-row flex-wrap gap-2">
                            {item.examples.map(ex => (
                                <View key={ex} className="bg-slate-100 px-4 py-2 rounded-xl">
                                    <Text className="text-nxtcure-text font-medium">{ex}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View className="mb-8">
                        <Text className="text-lg font-bold text-nxtcure-text mb-4">Why it's harmful</Text>
                        {item.whyHarmful.map((point, i) => (
                            <View key={i} className="flex-row mb-3">
                                <View className="w-1.5 h-1.5 rounded-full bg-nxtcure-primary mt-2 mr-3" />
                                <Text className="flex-1 text-nxtcure-text leading-6">{point}</Text>
                            </View>
                        ))}
                    </View>

                    <Card className="mb-8 border-l-4 border-l-nxtcure-primary bg-nxtcure-primary/5">
                        <View className="flex-row items-center mb-3">
                            <ShieldCheck size={20} color="#1DD1A1" />
                            <Text className="ml-2 font-bold text-nxtcure-text text-lg">Safe Alternatives</Text>
                        </View>
                        {item.safeAlternatives.map((alt, i) => (
                            <Text key={i} className="text-nxtcure-text/80 mb-1 leading-6">• {alt}</Text>
                        ))}
                    </Card>

                    <View className="mb-10">
                        <View className="flex-row items-center mb-4">
                            <BookOpen size={20} color="#a4b0be" />
                            <Text className="ml-2 text-lg font-bold text-nxtcure-text">Key Research</Text>
                        </View>
                        {item.research.map((r, i) => (
                            <Text key={i} className="text-nxtcure-subtext mb-2 italic">• {r}</Text>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </ScreenContainer>
    );
}
