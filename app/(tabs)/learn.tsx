import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, ShieldAlert, BookOpen, ChevronRight } from 'lucide-react-native';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { Card } from '../../src/components/ui/Card';

export default function LearnScreen() {
    const router = useRouter();

    const sections = [
        {
            title: 'IARC Carcinogens',
            subtitle: 'Database of 120+ Group 1 agents',
            icon: ShieldAlert,
            color: '#ef4444',
            path: '/learn/carcinogen-db'
        },
        {
            title: 'Cancer Types',
            subtitle: 'Statistics, risks, and symptoms',
            icon: BookOpen,
            color: '#45aaf2',
            path: '/(tabs)/learn' // Placeholder
        },
    ];

    const guides = [
        {
            title: 'Testicular Exam',
            subtitle: 'Recommended monthly for men 15-35',
            icon: ShieldAlert,
            color: '#1DD1A1',
            path: '/learn/self-exam-tse'
        },
        {
            title: 'Side Effect Manager',
            subtitle: 'When to call your oncology team',
            icon: ShieldAlert,
            color: '#ef4444',
            path: '/learn/side-effects'
        }
    ];

    return (
        <ScreenContainer hasWave={true} waveVariant="compact" darkStatus={false} className="bg-white">
            <View className="px-6 py-4">
                <Text className="text-2xl font-bold text-white">Learn</Text>
            </View>

            <ScrollView className="flex-1 px-6 pt-6 ">
                <Text className="text-nxtcure-subtext font-bold text-xs uppercase tracking-widest mb-4">Databases</Text>

                <View className="gap-4 mb-8">
                    {sections.map(section => (
                        <Pressable
                            key={section.title}
                            onPress={() => router.push(section.path as any)}
                        >
                            <Card className="flex-row items-center p-5">
                                <View
                                    className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                                    style={{ backgroundColor: section.color + '15' }}
                                >
                                    <section.icon size={26} color={section.color} />
                                </View>
                                <View className="flex-1">
                                    <Text className="font-bold text-nxtcure-text text-lg">{section.title}</Text>
                                    <Text className="text-nxtcure-subtext text-xs">{section.subtitle}</Text>
                                </View>
                                <ChevronRight size={20} color="#a4b0be" />
                            </Card>
                        </Pressable>
                    ))}
                </View>

                <Text className="text-nxtcure-subtext font-bold text-xs uppercase tracking-widest mb-4">Self-Exam Guides</Text>

                <View className="gap-4">
                    {guides.map(guide => (
                        <Pressable
                            key={guide.title}
                            onPress={() => router.push(guide.path as any)}
                        >
                            <Card className="flex-row items-center p-5">
                                <View
                                    className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                                    style={{ backgroundColor: guide.color + '15' }}
                                >
                                    <View className="items-center justify-center">
                                        <Text className="text-2xl">🤲</Text>
                                    </View>
                                </View>
                                <View className="flex-1">
                                    <Text className="font-bold text-nxtcure-text text-lg">{guide.title}</Text>
                                    <Text className="text-nxtcure-subtext text-xs">{guide.subtitle}</Text>
                                </View>
                                <ChevronRight size={20} color="#a4b0be" />
                            </Card>
                        </Pressable>
                    ))}
                </View>
                <View className="h-20" />
            </ScrollView>
        </ScreenContainer>
    );
}

