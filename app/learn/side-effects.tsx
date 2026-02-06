import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { ChevronLeft, Info, Activity, AlertCircle, Thermometer, Droplets } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { Card } from '../../src/components/ui/Card';

const SIDE_EFFECTS = [
    {
        id: 'fever',
        title: 'Fever',
        threshold: '> 38°C (100.4°F)',
        action: 'Contact Oncology Team Immediately',
        icon: Thermometer,
        color: '#ef4444'
    },
    {
        id: 'nausea',
        title: 'Severe Nausea',
        threshold: 'Unable to keep liquids down for 12h',
        action: 'Call Oncology Nurse',
        icon: Droplets,
        color: '#f59e0b'
    },
    {
        id: 'fatigue',
        title: 'Extreme Fatigue',
        threshold: 'Unable to get out of bed',
        action: 'Monitor and report at next visit',
        icon: Activity,
        color: '#45aaf2'
    }
];

export default function SideEffectManagementScreen() {
    const router = useRouter();

    return (
        <ScreenContainer className="bg-white" withPadding={false}>
            <View className="px-6 py-4 flex-row items-center border-b border-slate-50">
                <Pressable onPress={() => router.back()} className="p-2 -ml-2">
                    <ChevronLeft size={24} color="#2d3436" />
                </Pressable>
                <Text className="text-xl font-bold text-nxtcure-text ml-2">Side Effects</Text>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="p-6">
                    <View className="bg-nxtcure-primary/5 p-6 rounded-3xl mb-8 border border-nxtcure-primary/10">
                        <Text className="text-lg font-bold text-nxtcure-text mb-2">When to Call?</Text>
                        <Text className="text-slate-600 text-sm leading-5">
                            Treatment side effects are common, but some require immediate medical attention. Use this guide to determine your next step.
                        </Text>
                    </View>

                    <View className="gap-4">
                        {SIDE_EFFECTS.map((se) => (
                            <Card key={se.id} className="border-l-4" style={{ borderLeftColor: se.color }}>
                                <View className="flex-row items-center mb-3">
                                    <se.icon size={20} color={se.color} />
                                    <Text className="ml-2 font-bold text-lg text-nxtcure-text">{se.title}</Text>
                                </View>
                                <View className="bg-slate-50 p-3 rounded-xl mb-3">
                                    <Text className="text-xs text-nxtcure-subtext uppercase font-bold mb-1">Threshold</Text>
                                    <Text className="text-nxtcure-text font-medium">{se.threshold}</Text>
                                </View>
                                <View className="flex-row items-center">
                                    <AlertCircle size={14} color="#ef4444" />
                                    <Text className="ml-2 text-red-600 font-bold text-sm flex-1">{se.action}</Text>
                                </View>
                            </Card>
                        ))}
                    </View>

                    <View className="mt-10 bg-red-600 p-6 rounded-3xl items-center">
                        <Text className="text-white font-bold text-lg mb-1">Oncology Hot-Line</Text>
                        <Text className="text-red-100 text-sm mb-4">Available 24/7 for urgent concerns</Text>
                        <Pressable className="bg-white px-8 py-3 rounded-2xl w-full items-center">
                            <Text className="text-red-600 font-bold">Call Now</Text>
                        </Pressable>
                    </View>
                </View>
                <View className="h-20" />
            </ScrollView>
        </ScreenContainer>
    );
}
