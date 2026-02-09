import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Dimensions, Share, Image } from 'react-native';
import { User, Settings, FileText, Download, Shield, ChevronRight, Fingerprint, Award, Activity, Heart, Info, LogOut } from 'lucide-react-native';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { Card } from '../../src/components/ui/Card';
import { useProfileStore } from '../../src/store/profileStore';
import { useDietStore } from '../../src/store/dietStore';
import { useLifestyleStore } from '../../src/store/lifestyleStore';
import { useSymptomStore } from '../../src/store/symptomStore';
import { useScreeningStore } from '../../src/store/screeningStore';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Logo } from '../../src/components/ui/Logo';

const { width, height } = Dimensions.get('window');

export default function ProfileScreen() {
    const { name, nxtId, familyHistory, medicalHistory } = useProfileStore();
    const { logs: dietLogs } = useDietStore();
    const { logs: lifestyleLogs } = useLifestyleStore();
    const { logs: symptomLogs } = useSymptomStore();
    const { logs: screeningLogs } = useScreeningStore();

    const handleExport = async () => {
        const fullAudit = {
            identity: { name, nxtId },
            history: { familyHistory, medicalHistory },
            data: {
                nutritionalEvents: Object.keys(dietLogs).length,
                lifestyleCheckins: Object.keys(lifestyleLogs).length,
                symptomEntries: symptomLogs.length,
                screeningsCompleted: Object.keys(screeningLogs).length
            },
            timestamp: new Date().toISOString()
        };

        try {
            await Share.share({
                message: `NxtCure Medical Export - ${name} (${nxtId})\n\nReport generated on ${new Date().toLocaleDateString()}\n\nAudit Summary:\n- Symptoms Logged: ${symptomLogs.length}\n- Diet Events: ${Object.keys(dietLogs).length}\n- Lifestyle Events: ${Object.keys(lifestyleLogs).length}\n- Screenings: ${Object.keys(screeningLogs).length}\n\nThis data is provided for clinical review.`,
                title: 'NxtCure Medical Export'
            });
        } catch (error) {
            console.log('Error sharing:', error);
        }
    };

    return (
        <ScreenContainer darkStatus={false} withPadding={false} className="bg-black">
            {/* Cinematic Background */}
            <View style={styles.headerGradient}>
                <Image
                    source={require('../../assets/goals_bg_v2.png')}
                    style={StyleSheet.absoluteFill}
                    resizeMode="cover"
                    blurRadius={10}
                />
                <LinearGradient
                    colors={['rgba(0,0,0,0.85)', 'rgba(5, 53, 61, 0.4)', 'rgba(0, 0, 0, 0.8)', 'black']}
                    style={StyleSheet.absoluteFill}
                    locations={[0, 0.2, 0.5, 0.95]}
                />
            </View>

            <ScrollView className="flex-1 px-8" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                {/* Profile Identity */}
                <Animated.View entering={FadeInDown.duration(800)} className="pt-12 items-center mb-10">
                    <View className="w-24 h-24 bg-white/5 rounded-[35px] border border-white/10 items-center justify-center mb-4 backdrop-blur-3xl">
                        <Logo size={56} />
                    </View>
                    <View className="flex-row items-center mb-1">
                        <Fingerprint size={12} color="#1DD1A1" opacity={0.6} />
                        <Text className="text-white/40 text-[9px] font-black uppercase tracking-[3px] ml-2">Medical Identity</Text>
                    </View>
                    <Text className="text-white text-3xl font-black tracking-tighter">{name}</Text>
                    <Text className="text-white/40 text-xs font-bold mt-1">NXT-ID: {nxtId}</Text>
                </Animated.View>

                {/* Medical History Section */}
                <View className="mb-10">
                    <Text className="text-white/40 text-[9px] font-black uppercase tracking-[4px] ml-2 mb-4">Baseline History</Text>

                    <Card className="bg-white/5 border-white/10 p-6 mb-4">
                        <View className="flex-row items-center mb-4">
                            <Heart size={18} color="#FF4757" />
                            <Text className="text-white font-bold ml-3 text-base">Oncology Risk factors</Text>
                        </View>
                        <View className="flex-row flex-wrap gap-2">
                            {familyHistory.length > 0 ? familyHistory.map((h, i) => (
                                <View key={i} className="bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20">
                                    <Text className="text-red-400 text-[10px] font-bold uppercase">{h}</Text>
                                </View>
                            )) : (
                                <Text className="text-white/30 text-xs italic">No critical history flagged.</Text>
                            )}
                            <Pressable className="bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                                <Text className="text-white/60 text-[10px] font-bold uppercase">+ Add Marker</Text>
                            </Pressable>
                        </View>
                    </Card>

                    <Card className="bg-white/5 border-white/10 p-6">
                        <View className="flex-row items-center mb-4">
                            <Shield size={18} color="#1DD1A1" />
                            <Text className="text-white font-bold ml-3 text-base">Prior Screenings</Text>
                        </View>
                        <Text className="text-white/40 text-xs leading-5">
                            {Object.keys(screeningLogs).length} screenings logged on your device. All data is end-to-end encrypted and stored locally.
                        </Text>
                    </Card>
                </View>

                {/* Settings & Export */}
                <View className="mb-8">
                    <Text className="text-white/40 text-[9px] font-black uppercase tracking-[4px] ml-2 mb-4">Command Center</Text>

                    <Pressable onPress={handleExport} className="mb-3">
                        <Card className="bg-nxtcure-info/10 border-nxtcure-info/20 flex-row items-center p-5">
                            <View className="w-10 h-10 bg-nxtcure-info/20 rounded-xl items-center justify-center mr-4">
                                <Download size={20} color="#45AAF2" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-white font-bold text-base">Export Health Data</Text>
                                <Text className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-0.5">Generate Clinician Report</Text>
                            </View>
                            <ChevronRight size={18} color="rgba(255,255,255,0.2)" />
                        </Card>
                    </Pressable>

                    <Pressable className="mb-3">
                        <Card className="bg-white/5 border-white/10 flex-row items-center p-5">
                            <View className="w-10 h-10 bg-white/10 rounded-xl items-center justify-center mr-4">
                                <Settings size={20} color="white" opacity={0.6} />
                            </View>
                            <View className="flex-1">
                                <Text className="text-white font-bold text-base">App Settings</Text>
                                <Text className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-0.5">Security & Privacy</Text>
                            </View>
                            <ChevronRight size={18} color="rgba(255,255,255,0.2)" />
                        </Card>
                    </Pressable>

                    <Pressable className="mt-4 items-center py-4 border border-red-500/20 rounded-3xl bg-red-500/5 active:bg-red-500/10">
                        <View className="flex-row items-center">
                            <LogOut size={16} color="#FF4757" />
                            <Text className="text-red-400 font-bold ml-2 uppercase tracking-widest text-[11px]">Terminate Session</Text>
                        </View>
                    </Pressable>
                </View>
            </ScrollView>

            <LinearGradient
                colors={['transparent', 'black']}
                style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 100, pointerEvents: 'none' }}
            />
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    headerGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: height,
        zIndex: -1,
    }
});
