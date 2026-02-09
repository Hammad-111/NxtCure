import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, StyleSheet } from 'react-native';
import { Search, ChevronRight, AlertCircle, Info, Shield, Zap, Activity, Microscope, Globe, Beaker } from 'lucide-react-native';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { Card } from '../../src/components/ui/Card';
import { CARCINOGENS, Carcinogen } from '../../src/data/carcinogens';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

const CATEGORY_ICONS: Record<string, any> = {
    'Lifestyle': Shield,
    'Dietary': Activity,
    'Occupational': Zap,
    'Environmental': Globe,
    'Infectious': Beaker,
};

const CATEGORY_COLORS: Record<string, string> = {
    'Lifestyle': '#1DD1A1',
    'Dietary': '#45AAF2',
    'Occupational': '#F7B731',
    'Environmental': '#A55EEA',
    'Infectious': '#EB3B5A',
};

export default function CarcinogenDBScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const filtered = CARCINOGENS.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const categories = ['Lifestyle', 'Dietary', 'Occupational', 'Environmental', 'Infectious'] as const;

    return (
        <ScreenContainer hasWave={false} darkStatus={false} withPadding={false} fullScreen={true} className="bg-black">
            {/* Header / Background Area */}
            <LinearGradient
                colors={['#05353D', '#000000']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 0.4 }}
            />

            <View className="px-6 pt-12 pb-6">
                <Animated.View entering={FadeInDown.duration(800)}>
                    <View className="flex-row items-center mb-2">
                        <View className="w-6 h-1 bg-nxtcure-primary rounded-full mr-2" />
                        <Text className="text-[10px] font-black text-white/40 uppercase tracking-[4px]">IARC TIER 1</Text>
                    </View>
                    <Text className="text-4xl font-black text-white tracking-tighter mb-4">
                        Carcinogen{'\n'}
                        <Text className="text-nxtcure-primary">Database.</Text>
                    </Text>
                </Animated.View>

                {/* Search Bar */}
                <Animated.View entering={FadeInDown.delay(200).duration(800)}>
                    <View className="flex-row items-center bg-white/10 px-4 py-3.5 rounded-2xl border border-white/20 backdrop-blur-xl">
                        <Search size={20} color="#1DD1A1" opacity={0.6} />
                        <TextInput
                            placeholder="Search clinical substances..."
                            placeholderTextColor="rgba(255,255,255,0.3)"
                            className="flex-1 ml-3 text-base text-white font-medium"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                </Animated.View>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}>
                {/* IARC Warning Header */}
                <Animated.View entering={FadeInDown.delay(400).duration(800)} className="mb-8">
                    <Card className="bg-red-500/10 border-red-500/30 p-5 rounded-3xl">
                        <View className="flex-row items-center mb-3">
                            <View className="bg-red-500 p-1.5 rounded-lg mr-3">
                                <AlertCircle size={18} color="white" strokeWidth={3} />
                            </View>
                            <Text className="text-red-500 font-black tracking-widest text-xs uppercase">IARC Group 1 Warning</Text>
                        </View>
                        <Text className="text-white/80 text-xs leading-5 font-medium">
                            Substances in this database are classified by the International Agency for Research on Cancer as <Text className="text-red-400 font-bold">Group 1 Carcinogens</Text>—known human carcinogens with sufficient clinical evidence. Avoidance is standard medical protocol.
                        </Text>
                    </Card>
                </Animated.View>

                {categories.map((cat, catIdx) => {
                    const items = filtered.filter(f => f.category === cat);
                    if (items.length === 0) return null;

                    const Icon = CATEGORY_ICONS[cat];
                    const color = CATEGORY_COLORS[cat];

                    return (
                        <View key={cat} className="mb-10">
                            <Animated.View entering={FadeInDown.delay(500 + catIdx * 100)} className="flex-row items-center mb-4 px-2">
                                <View style={{ backgroundColor: color }} className="w-8 h-8 rounded-xl items-center justify-center mr-3 shadow-lg">
                                    <Icon size={18} color="white" strokeWidth={2.5} />
                                </View>
                                <Text className="text-sm font-black text-white/50 uppercase tracking-[3px]">
                                    {cat}
                                </Text>
                            </Animated.View>

                            <View className="gap-4">
                                {items.map((item, idx) => (
                                    <Animated.View
                                        key={item.id}
                                        entering={FadeInRight.delay(600 + idx * 50).duration(600)}
                                    >
                                        <Pressable
                                            onPress={() => router.push({
                                                pathname: "/learn/carcinogen-detail",
                                                params: { id: item.id }
                                            })}
                                        >
                                            <Card className="bg-white/5 border-white/10 p-5 rounded-[22px] flex-row items-center">
                                                <View className="flex-1">
                                                    <View className="flex-row items-center mb-1.5">
                                                        <View className="w-2 h-2 rounded-full bg-red-500 mr-2" />
                                                        <Text className="text-white font-black text-lg tracking-tight">{item.name}</Text>
                                                    </View>
                                                    <Text className="text-white/40 text-xs font-medium" numberOfLines={1}>{item.summary}</Text>
                                                </View>
                                                <View className="bg-white/10 w-10 h-10 rounded-full items-center justify-center border border-white/10">
                                                    <ChevronRight size={20} color="white" opacity={0.6} />
                                                </View>
                                            </Card>
                                        </Pressable>
                                    </Animated.View>
                                ))}
                            </View>
                        </View>
                    );
                })}

                <View className="items-center py-6">
                    <Text className="text-white/20 text-[10px] font-black uppercase tracking-[2px]">Standard Clinical Reference (2025)</Text>
                </View>
            </ScrollView>
        </ScreenContainer>
    );
}
