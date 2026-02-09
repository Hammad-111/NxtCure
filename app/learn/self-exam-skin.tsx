import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Dimensions } from 'react-native';
import { ChevronLeft, Info, ShieldCheck, AlertCircle, Camera, MapPin, Eye, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { Card } from '../../src/components/ui/Card';
import { useScreeningStore } from '../../src/store/screeningStore';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const ABCDE_RULES = [
    { rule: 'A', title: 'Asymmetry', desc: 'One half of the mole does not match the other.', color: '#FF4757' },
    { rule: 'B', title: 'Border', desc: 'Edges are ragged, notched, or blurred.', color: '#F7B731' },
    { rule: 'C', title: 'Color', desc: 'The color is not uniform; has shades of tan, brown, black.', color: '#45AAF2' },
    { rule: 'D', title: 'Diameter', desc: 'Larger than 6mm (approx. pencil eraser).', color: '#1DD1A1' },
    { rule: 'E', title: 'Evolving', desc: 'The mole is changing in size, shape, or color.', color: '#A55EEA' },
];

export default function SkinExamScreen() {
    const [view, setView] = useState<'rules' | 'map' | 'tracker'>('rules');
    const router = useRouter();
    const { markAsDone } = useScreeningStore();

    const handleComplete = () => {
        markAsDone('skin');
        router.back();
    };

    return (
        <ScreenContainer hasWave={false} darkStatus={false} withPadding={false} fullScreen={true} className="bg-black">
            <LinearGradient colors={['#05253D', '#000000']} style={StyleSheet.absoluteFill} />

            <View className="px-6 pt-12 pb-6 flex-row items-center justify-between">
                <Pressable onPress={() => view === 'rules' ? router.back() : setView('rules')} className="bg-white/10 w-12 h-12 rounded-2xl items-center justify-center border border-white/20">
                    <ChevronLeft size={24} color="white" />
                </Pressable>
                <Text className="text-white font-black uppercase tracking-[3px] text-xs">Skin Surveillance</Text>
                <View className="w-12 h-12" />
            </View>

            <ScrollView className="flex-1 px-8" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {view === 'rules' && (
                    <Animated.View entering={FadeInDown.duration(800)}>
                        <Text className="text-white/40 text-[10px] font-black uppercase tracking-[5px] mb-4">ABCDE WARNING SIGNS</Text>
                        <Text className="text-white text-4xl font-black tracking-tighter mb-10 leading-[45px]">
                            Identify Early{'\n'}Melanoma.
                        </Text>

                        {ABCDE_RULES.map((item, idx) => (
                            <Animated.View key={item.rule} entering={FadeInDown.delay(100 * idx)}>
                                <Card className="bg-white/5 border-white/10 p-6 rounded-[32px] mb-4 flex-row items-center">
                                    <View style={{ backgroundColor: `${item.color}20` }} className="w-14 h-14 rounded-2xl items-center justify-center mr-6 border border-white/5">
                                        <Text style={{ color: item.color }} className="text-2xl font-black">{item.rule}</Text>
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-white font-black text-lg">{item.title}</Text>
                                        <Text className="text-white/40 text-[11px] leading-4 mt-1 font-bold">{item.desc}</Text>
                                    </View>
                                </Card>
                            </Animated.View>
                        ))}

                        <Card className="bg-red-500/10 border border-red-500/30 p-8 rounded-[40px] mt-6 mb-8">
                            <View className="flex-row items-center mb-4">
                                <Eye size={20} color="#FF4757" className="mr-4" />
                                <Text className="text-white font-black text-lg">"Ugly Duckling" Sign</Text>
                            </View>
                            <Text className="text-white/60 text-xs leading-5">
                                Most normal moles look alike. A melanoma often stands out—it looks different from the others. If you see an "ugly duckling," get it checked.
                            </Text>
                        </Card>

                        <Pressable
                            onPress={() => setView('map')}
                            className="bg-nxtcure-primary h-18 rounded-[24px] flex-row items-center justify-center shadow-lg shadow-nxtcure-primary/20"
                        >
                            <Text className="text-white font-black uppercase tracking-widest text-lg">Open Body Map</Text>
                            <ArrowRight size={24} color="white" className="ml-2" />
                        </Pressable>
                    </Animated.View>
                )}

                {view === 'map' && (
                    <Animated.View entering={FadeInDown.duration(800)}>
                        <Text className="text-white/40 text-[10px] font-black uppercase tracking-[5px] mb-4">INTERACTIVE MAP</Text>
                        <Text className="text-white text-4xl font-black tracking-tighter mb-8 leading-[45px]">
                            Body Mole{'\n'}Tracker.
                        </Text>

                        <Card className="bg-white/5 border-white/10 p-4 rounded-[40px] items-center mb-8 relative overflow-hidden">
                            {/* Simplistic Body Map Representation */}
                            <View className="w-full h-80 items-center justify-center">
                                <View className="w-20 h-28 bg-white/10 rounded-full mb-2" />
                                <View className="w-32 h-40 bg-white/10 rounded-3xl" />

                                {/* Sample Markers */}
                                <View className="absolute top-20 left-24 bg-red-500 w-3 h-3 rounded-full border-2 border-white/20" />
                                <View className="absolute top-44 left-40 bg-yellow-500 w-3 h-3 rounded-full border-2 border-white/20" />
                                <Text className="absolute bottom-4 text-white/20 font-black text-[10px] uppercase tracking-widest">Marked Zones: 2</Text>
                            </View>
                        </Card>

                        <View className="gap-4">
                            <Pressable className="bg-white/5 border border-white/10 p-6 rounded-3xl flex-row items-center">
                                <MapPin size={24} color="#45AAF2" className="mr-5" />
                                <View className="flex-1">
                                    <Text className="text-white font-black">Add New Marker</Text>
                                    <Text className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">Tag a specific location</Text>
                                </View>
                                <ChevronRight size={20} color="white" opacity={0.2} />
                            </Pressable>

                            <Pressable
                                onPress={() => setView('tracker')}
                                className="bg-white/5 border border-dashed border-white/20 p-8 rounded-[40px] items-center"
                            >
                                <Camera size={40} color="rgba(255,255,255,0.4)" className="mb-4" />
                                <Text className="text-white font-black text-lg">Photo Documentation</Text>
                                <Text className="text-white/30 text-xs text-center mt-2 leading-5">Securely store high-res photos to compare mole evolution over 6-month cycles.</Text>
                            </Pressable>
                        </View>
                    </Animated.View>
                )}

                {view === 'tracker' && (
                    <Animated.View entering={FadeInDown.duration(800)} className="items-center justify-center pt-20">
                        <View className="w-24 h-24 bg-nxtcure-primary/10 rounded-full items-center justify-center mb-10">
                            <ShieldCheck size={48} color="#1DD1A1" opacity={0.6} />
                        </View>
                        <Text className="text-white text-3xl font-black tracking-tight text-center mb-6">Privacy First.</Text>
                        <Text className="text-white/40 text-center leading-6 mb-12">
                            Self-exam photos are encrypted locally. They are never uploaded to our servers and are only accessible via biometric auth.
                        </Text>

                        <Pressable
                            onPress={handleComplete}
                            className="bg-nxtcure-primary w-full h-18 rounded-[24px] items-center justify-center shadow-lg shadow-nxtcure-primary/20"
                        >
                            <Text className="text-white font-black uppercase tracking-widest text-lg">Finalize Skin Log</Text>
                        </Pressable>
                    </Animated.View>
                )}
            </ScrollView>
        </ScreenContainer>
    );
}
