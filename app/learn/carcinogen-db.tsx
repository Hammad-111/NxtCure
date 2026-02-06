import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Pressable } from 'react-native';
import { Search, ChevronRight, AlertCircle, Info } from 'lucide-react-native';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { Card } from '../../src/components/ui/Card';
import { CARCINOGENS, Carcinogen } from '../../src/data/carcinogens';
import { useRouter } from 'expo-router';

export default function CarcinogenDBScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const filtered = CARCINOGENS.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const categories = ['Lifestyle', 'Dietary', 'Occupational', 'Environmental', 'Infectious'] as const;

    return (
        <ScreenContainer hasWave={true} waveVariant="compact" darkStatus={false} className="bg-white">
            <View className="flex-row items-center px-6 py-4">
                <Text className="text-2xl font-bold text-white">IARC Base</Text>
            </View>

            <View className="px-6 py-4">
                <View className="flex-row items-center bg-slate-100 px-4 py-3 rounded-2xl">
                    <Search size={20} color="#a4b0be" />
                    <TextInput
                        placeholder="Search carcinogens..."
                        className="flex-1 ml-3 text-base text-nxtcure-text"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                <View className="bg-red-50 p-4 rounded-2xl mb-6 flex-row items-center border border-red-100">
                    <AlertCircle size={20} color="#e44d26" />
                    <Text className="ml-3 text-red-800 text-xs flex-1 leading-4">
                        <Text className="font-bold">IARC Group 1:</Text> These substances are known to cause cancer in humans based on sufficient evidence.
                    </Text>
                </View>

                {categories.map(cat => {
                    const items = filtered.filter(f => f.category === cat);
                    if (items.length === 0) return null;

                    return (
                        <View key={cat} className="mb-6">
                            <Text className="text-sm font-bold text-nxtcure-subtext uppercase tracking-wider mb-3">
                                {cat}
                            </Text>
                            <View className="gap-3">
                                {items.map(item => (
                                    <Pressable
                                        key={item.id}
                                        onPress={() => router.push({
                                            pathname: "/learn/carcinogen-detail",
                                            params: { id: item.id }
                                        })}
                                    >
                                        <Card className="flex-row items-center p-4">
                                            <View className="flex-1">
                                                <Text className="font-bold text-nxtcure-text text-base">{item.name}</Text>
                                                <Text className="text-nxtcure-subtext text-xs" numberOfLines={1}>{item.summary}</Text>
                                            </View>
                                            <ChevronRight size={20} color="#a4b0be" />
                                        </Card>
                                    </Pressable>
                                ))}
                            </View>
                        </View>
                    );
                })}

                <View className="h-20" />
            </ScrollView>
        </ScreenContainer>
    );
}
