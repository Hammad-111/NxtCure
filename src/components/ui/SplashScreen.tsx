import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withRepeat,
    withSequence,
    Easing,
    runOnJS,
    withDelay,
    interpolate,
    Extrapolate
} from 'react-native-reanimated';
import { Logo } from './Logo';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
    onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
    const logoScale = useSharedValue(0.7);
    const logoOpacity = useSharedValue(0);
    const bgOpacity = useSharedValue(1);
    const pulseValue = useSharedValue(1);
    const textStagger = useSharedValue(0);
    const blurIntensity = useSharedValue(20);

    useEffect(() => {
        // Stage 1: Reveal logo with a "pop"
        logoOpacity.value = withTiming(1, { duration: 1200 });
        logoScale.value = withTiming(1, {
            duration: 1500,
            easing: Easing.out(Easing.back(1.2))
        });
        blurIntensity.value = withTiming(0, { duration: 1500 });

        // Stage 2: Subtle Biotech Pulse
        pulseValue.value = withRepeat(
            withSequence(
                withTiming(1.15, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
                withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) })
            ),
            -1,
            true
        );

        // Stage 3: Text reveal
        textStagger.value = withDelay(800, withTiming(1, { duration: 1000 }));

        // Stage 4: Mastery Outro
        const exitTimeout = setTimeout(() => {
            bgOpacity.value = withTiming(0, {
                duration: 1000,
                easing: Easing.inOut(Easing.quad)
            }, (finished) => {
                if (finished) {
                    runOnJS(onFinish)();
                }
            });
        }, 4500);

        return () => clearTimeout(exitTimeout);
    }, []);

    const animatedLogoStyle = useAnimatedStyle(() => ({
        opacity: logoOpacity.value,
        transform: [{ scale: logoScale.value }],
    }));

    const animatedBgStyle = useAnimatedStyle(() => ({
        opacity: bgOpacity.value,
    }));

    const animatedPulseStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulseValue.value }],
        opacity: interpolate(pulseValue.value, [1, 1.15], [0.3, 0.1]),
    }));

    const animatedTextStyle = useAnimatedStyle(() => ({
        opacity: textStagger.value,
        transform: [{ translateY: interpolate(textStagger.value, [0, 1], [10, 0]) }],
    }));

    return (
        <Animated.View style={[StyleSheet.absoluteFill, styles.container, animatedBgStyle]}>
            {/* Deep Biotech Gradient Background */}
            <LinearGradient
                colors={['#050510', '#0F3460', '#050510']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            {/* Biotech Energy Bloom behind logo */}
            <Animated.View style={[styles.pulseCircle, animatedPulseStyle]}>
                <LinearGradient
                    colors={['#1DD1A1', 'transparent']}
                    style={StyleSheet.absoluteFill}
                />
            </Animated.View>

            <Animated.View style={[styles.inner, animatedLogoStyle]}>
                <View className="relative">
                    <Logo size={140} />
                    {/* Subtle Outer Glow */}
                    <View
                        style={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0, bottom: 0,
                            backgroundColor: '#1DD1A1',
                            opacity: 0.1,
                            borderRadius: 100,
                            transform: [{ scale: 1.2 }],
                            zIndex: -1
                        }}
                    />
                </View>

                <Animated.View style={[animatedTextStyle, { alignItems: 'center', marginTop: 30 }]}>
                    <Text className="text-white font-black text-4xl tracking-tighter" style={styles.textShadow}>
                        NXTCURE
                    </Text>
                    <View className="flex-row items-center mt-2">
                        <View className="w-1 h-1 rounded-full bg-nxtcure-primary mr-2" />
                        <Text className="text-white/40 text-[9px] font-black uppercase tracking-[5px]">
                            Oncology Core
                        </Text>
                    </View>
                </Animated.View>
            </Animated.View>

            {/* Future Scanline effect */}
            <View style={styles.scanline} />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        zIndex: 9999,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    inner: {
        alignItems: 'center',
    },
    pulseCircle: {
        position: 'absolute',
        width: width * 0.8,
        height: width * 0.8,
        borderRadius: width * 0.4,
        opacity: 0.2,
    },
    textShadow: {
        textShadowColor: 'rgba(29, 209, 161, 0.4)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 20,
    },
    scanline: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: 'rgba(29, 209, 161, 0.03)',
        zIndex: 10000,
    }
});
