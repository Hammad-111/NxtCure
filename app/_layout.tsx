import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { MedicalDisclaimerModal } from "../src/components/MedicalDisclaimerModal";
import { getSecure, saveSecure, KEYS } from "../src/services/storage";

export default function Layout() {
    const [showDisclaimer, setShowDisclaimer] = useState(false);
    const [isReady, setIsReady] = useState(false);

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
        return <View className="flex-1 bg-white" />;
    }

    return (
        <>
            <StatusBar style="dark" />
            <Stack screenOptions={{
                headerStyle: { backgroundColor: '#fff' },
                headerTintColor: '#000',
                contentStyle: { backgroundColor: '#fff' },
            }}>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="onboarding/goals" options={{ headerShown: false }} />
                <Stack.Screen name="privacy" options={{ title: 'Privacy Policy', presentation: 'modal' }} />
            </Stack>
            <MedicalDisclaimerModal visible={showDisclaimer} onAccept={handleAccept} />
        </>
    );
}
