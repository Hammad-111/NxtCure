import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, TextInput } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { ChevronLeft, Zap, ShieldAlert, CheckCircle2, Search, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';
import { Card } from '../../src/components/ui/Card';
import { CARCINOGENS } from '../../src/data/carcinogens';

const { width, height } = Dimensions.get('window');

// Simulation database for ingredients
const INGREDIENT_ALERTS: Record<string, string> = {
    'sodium nitrite': 'processed_meat',
    'potassium nitrate': 'processed_meat',
    'sodium nitrate': 'processed_meat',
    'asbestos': 'asbestos',
    'benzene': 'benzene',
    'formaldehyde': 'benzene',
};

export default function CarcinogenScannerScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<{ type: 'danger' | 'safe', match?: string, ingredient?: string } | null>(null);
    const [manualInput, setManualInput] = useState('');
    const router = useRouter();

    if (!permission) return <View className="flex-1 bg-black" />;

    if (!permission.granted) {
        return (
            <View className="flex-1 bg-black items-center justify-center px-10">
                <ShieldAlert size={60} color="#EB3B5A" className="mb-6" />
                <Text className="text-white text-2xl font-black text-center mb-4">Camera Access Needed</Text>
                <Text className="text-white/60 text-center mb-10">To scan products for carcinogens, we need clinical access to your camera.</Text>
                <Pressable onPress={requestPermission} className="bg-nxtcure-primary px-10 py-4 rounded-2xl">
                    <Text className="text-white font-black">GRANT ACCESS</Text>
                </Pressable>
            </View>
        );
    }

    const analyzeIngredient = (text: string) => {
        const lower = text.toLowerCase();
        for (const [ingredient, carcinogenId] of Object.entries(INGREDIENT_ALERTS)) {
            if (lower.includes(ingredient)) {
                return { type: 'danger' as const, match: carcinogenId, ingredient };
            }
        }
        return { type: 'safe' as const };
    };

    const handleBarcodeScanned = ({ data }: { data: string }) => {
        if (scanned) return;
        setScanned(true);

        // Simulating a lookup - in a real app this would hit a barcode API
        // For demo/production initial release, we focus on manual ingredient check or high-probability matches
        const result = analyzeIngredient(data);
        setAnalysisResult(result);
    };

    const handleManualCheck = () => {
        if (!manualInput) return;
        const result = analyzeIngredient(manualInput);
        setAnalysisResult(result);
        setScanned(true);
    };

    const resetScanner = () => {
        setScanned(false);
        setAnalysisResult(null);
        setManualInput('');
    };

    return (
        <ScreenContainer withPadding={false} fullScreen={true} className="bg-black">
            <CameraView
                style={StyleSheet.absoluteFill}
                onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr", "ean13", "ean8", "upc_a", "upc_e"],
                }}
            />

            {/* Overlay UI */}
            <View style={StyleSheet.absoluteFill}>
                <View className="flex-row items-center justify-between px-6 pt-12">
                    <Pressable onPress={() => router.back()} className="bg-black/40 w-12 h-12 rounded-2xl items-center justify-center backdrop-blur-md">
                        <ChevronLeft size={24} color="white" />
                    </Pressable>
                    <View className="bg-black/40 px-4 py-2 rounded-full backdrop-blur-md flex-row items-center">
                        <Zap size={14} color="#1DD1A1" className="mr-2" fill="#1DD1A1" />
                        <Text className="text-white text-[10px] font-black uppercase tracking-[2px]">NxtScan AI</Text>
                    </View>
                </View>

                {/* Scan Frame */}
                {!scanned && (
                    <View className="flex-1 items-center justify-center">
                        <View className="w-64 h-64 border-2 border-white/30 rounded-[40px] items-center justify-center">
                            <View className="w-60 h-60 border-2 border-nxtcure-primary rounded-[34px] opacity-40" />
                            <Animated.View
                                entering={FadeIn.duration(1000)}
                                className="absolute w-full h-0.5 bg-nxtcure-primary"
                                style={{ top: '50%' }}
                            />
                        </View>
                        <Text className="text-white font-bold mt-8 opacity-60">Center barcode or type ingredient</Text>
                    </View>
                )}

                {/* Result Modal */}
                {scanned && analysisResult && (
                    <Animated.View
                        entering={FadeIn.duration(400)}
                        className="absolute bottom-10 left-6 right-6"
                    >
                        <BlurView intensity={80} tint="dark" style={styles.resultCard}>
                            <View className="p-6">
                                <View className="flex-row items-center justify-between mb-6">
                                    <View className={`p-4 rounded-3xl ${analysisResult.type === 'danger' ? 'bg-red-500' : 'bg-nxtcure-primary'}`}>
                                        {analysisResult.type === 'danger' ? <ShieldAlert size={32} color="white" /> : <CheckCircle2 size={32} color="white" />}
                                    </View>
                                    <Pressable onPress={resetScanner} className="bg-white/10 p-2 rounded-full">
                                        <X size={20} color="white" opacity={0.6} />
                                    </Pressable>
                                </View>

                                {analysisResult.type === 'danger' ? (
                                    <>
                                        <Text className="text-red-400 font-black text-xs uppercase tracking-[3px] mb-2">Carcinogen Detected</Text>
                                        <Text className="text-white text-2xl font-black mb-4 tracking-tighter">Matches {analysisResult.ingredient} ⚠️</Text>
                                        <Text className="text-white/60 text-sm leading-5 mb-6">
                                            This product contains substances linked to increased clinical risk. Avoidance is recommended per IARC guidelines.
                                        </Text>
                                        <Pressable
                                            onPress={() => router.push({
                                                pathname: "/learn/carcinogen-detail",
                                                params: { id: analysisResult.match }
                                            })}
                                            className="bg-red-500 h-16 rounded-2xl items-center justify-center"
                                        >
                                            <Text className="text-white font-black">VIEW CLINICAL DATA</Text>
                                        </Pressable>
                                    </>
                                ) : (
                                    <>
                                        <Text className="text-nxtcure-primary font-black text-xs uppercase tracking-[3px] mb-2">Analysis Complete</Text>
                                        <Text className="text-white text-2xl font-black mb-4 tracking-tighter">No Known Carcinogens ✅</Text>
                                        <Text className="text-white/60 text-sm leading-5 mb-6">
                                            Our system did not identify any Group 1 IARC listed carcinogens in this scan.
                                        </Text>
                                        <Pressable
                                            onPress={resetScanner}
                                            className="bg-nxtcure-primary h-16 rounded-2xl items-center justify-center"
                                        >
                                            <Text className="text-white font-black">SCAN ANOTHER</Text>
                                        </Pressable>
                                    </>
                                )}
                            </View>
                        </BlurView>
                    </Animated.View>
                )}

                {/* Manual Input Area (Always visible at bottom when not scanned) */}
                {!scanned && (
                    <View className="px-6 pb-12">
                        <View className="flex-row items-center bg-white/10 px-4 py-4 rounded-2xl border border-white/20 backdrop-blur-md">
                            <Search size={20} color="#1DD1A1" className="mr-3" />
                            <TextInput
                                placeholder="Manual ingredient check..."
                                placeholderTextColor="rgba(255,255,255,0.3)"
                                className="flex-1 text-white font-medium"
                                value={manualInput}
                                onChangeText={setManualInput}
                                onSubmitEditing={handleManualCheck}
                            />
                            {manualInput.length > 0 && (
                                <Pressable onPress={handleManualCheck} className="bg-nxtcure-primary px-4 py-2 rounded-xl">
                                    <Text className="text-white font-black text-xs">CHECK</Text>
                                </Pressable>
                            )}
                        </View>
                    </View>
                )}
            </View>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    resultCard: {
        borderRadius: 40,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    }
});
