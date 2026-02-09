import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { MedicalDisclaimerModal } from "../src/components/MedicalDisclaimerModal";
import { SplashScreen } from "../src/components/ui/SplashScreen";
import { getSecure, saveSecure, KEYS } from "../src/services/storage";
import * as NativeSplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
NativeSplashScreen.preventAutoHideAsync().catch(() => {
    /* reloading the app might cause some issues with this, so we catch it */
});

export default function Layout() {
    const [showDisclaimer, setShowDisclaimer] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        checkDisclaimer();
    }, []);

    async function checkDisclaimer() {
        try {
            const hasSeen = await getSecure(KEYS.HAS_SEEN_DISCLAIMER);
            if (hasSeen !== 'true') {
                setShowDisclaimer(true);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsReady(true);
        }
    }

    async function handleAccept() {
        await saveSecure(KEYS.HAS_SEEN_DISCLAIMER, 'true');
        setShowDisclaimer(false);
    }

    if (!isReady) {
        return <View className="flex-1 bg-black" />;
    }

    return (
        <>
            <StatusBar style="light" />
            <Stack screenOptions={{
                headerStyle: { backgroundColor: '#1A1A2E' },
                headerTintColor: '#fff',
                contentStyle: { backgroundColor: '#000' },
            }}>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="onboarding/goals" options={{ headerShown: false }} />
                <Stack.Screen name="privacy" options={{ title: 'Privacy Policy', presentation: 'modal' }} />
            </Stack>

            <MedicalDisclaimerModal visible={showDisclaimer && !showSplash} onAccept={handleAccept} />

            {showSplash && (
                <SplashScreen onFinish={() => {
                    setShowSplash(false);
                }} />
            )}
        </>
    );
}
