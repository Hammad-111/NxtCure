import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { ChevronLeft, ChevronRight, PlayCircle, Info, ShieldCheck, AlertCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { useScreeningStore } from '../../src/store/screeningStore';

const STEPS = [
    {
        title: 'Visual Inspection',
        description: 'Stand in front of a mirror. Look for swelling, asymmetry, or changes in skin texture.',
        tips: "It's normal for one testicle to be slightly larger or hang lower.",
        icon: '👀'
    },
    {
        title: 'Feeling (Palpation)',
        description: 'Cup scrotum in palm. Use thumb and fingers to gently roll each testicle.',
        tips: 'Feel for hard lumps, thickness, or changes in size.',
        icon: '🤲'
    },
    {
        title: 'What\'s Normal',
        description: 'The epididymis is a rope-like tube on the back of each testicle. This is NOT a lump.',
        tips: 'Normal testicles are smooth, firm, and egg-shaped.',
        icon: '✅'
    }
];

export default function TSEScreen() {
    const [step, setStep] = useState(0);
    const router = useRouter();

    const isLastStep = step === STEPS.length - 1;

    return (
        <ScreenContainer className="bg-white" withPadding={false}>
            <View className="px-6 py-4 flex-row items-center border-b border-slate-50">
                <Pressable onPress={() => router.back()} className="p-2 -ml-2">
                    <ChevronLeft size={24} color="#2d3436" />
                </Pressable>
                <Text className="text-xl font-bold text-nxtcure-text ml-2">Self-Exam Guide</Text>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="p-6">
                    <View className="items-center mb-8">
                        <View className="w-48 h-48 bg-nxtcure-primary/10 rounded-full items-center justify-center mb-6 relative">
                            <Text className="text-7xl">{STEPS[step].icon}</Text>
                            <View className="absolute inset-0 rounded-full border-2 border-dashed border-nxtcure-primary/30" />
                        </View>

                        <View className="flex-row gap-2 mb-6">
                            {STEPS.map((_, i) => (
                                <View
                                    key={i}
                                    className={`h-1.5 rounded-full ${i === step ? 'w-8 bg-nxtcure-primary' : 'w-2 bg-slate-200'}`}
                                />
                            ))}
                        </View>

                        <Text className="text-2xl font-bold text-nxtcure-text text-center mb-4">{STEPS[step].title}</Text>
                        <Text className="text-center text-nxtcure-subtext text-base leading-6 px-4">
                            {STEPS[step].description}
                        </Text>
                    </View>

                    <Card className="bg-blue-50/50 border border-blue-100 mb-8">
                        <View className="flex-row items-center mb-2">
                            <Info size={16} color="#45aaf2" />
                            <Text className="ml-2 font-bold text-nxtcure-secondary text-sm">Pro Tip</Text>
                        </View>
                        <Text className="text-slate-600 text-xs leading-5">
                            {STEPS[step].tips}
                        </Text>
                    </Card>

                    <View className="gap-3">
                        {!isLastStep ? (
                            <Button
                                title="Next Step"
                                onPress={() => setStep(step + 1)}
                            />
                        ) : (
                            <Button
                                title="Finish Exam"
                                onPress={() => {
                                    useScreeningStore.getState().markAsDone('tse');
                                    router.back();
                                }}
                            />
                        )}
                        <Pressable
                            onPress={() => router.back()}
                            className="py-4 items-center"
                        >
                            <Text className="text-nxtcure-subtext font-bold">Skip for now</Text>
                        </Pressable>
                    </View>
                </View>

                <View className="px-6 pb-12">
                    <Card className="bg-red-50 border border-red-100">
                        <View className="flex-row items-center mb-2">
                            <AlertCircle size={18} color="#ef4444" />
                            <Text className="ml-2 font-bold text-red-700">Red Flags</Text>
                        </View>
                        <Text className="text-red-900/60 text-xs leading-5">
                            • Hard, painless lump{'\n'}
                            • Sudden swelling{'\n'}
                            • Feeling of heaviness
                        </Text>
                    </Card>
                </View>
            </ScrollView>
        </ScreenContainer>
    );
}
