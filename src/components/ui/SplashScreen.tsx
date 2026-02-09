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
import Svg, { Circle, Path, G } from 'react-native-svg';
import * as NativeSplashScreen from 'expo-splash-screen';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
    onFinish: () => void;
}

// Floating particle component
function FloatingParticle({ delay, duration, startX, startY }: { delay: number; duration: number; startX: number; startY: number }) {
    const translateY = useSharedValue(startY);
    const opacity = useSharedValue(0);

    useEffect(() => {
        opacity.value = withDelay(delay, withTiming(0.6, { duration: 800 }));
        translateY.value = withDelay(
            delay,
            withRepeat(
                withSequence(
                    withTiming(startY - 100, { duration, easing: Easing.inOut(Easing.ease) }),
                    withTiming(startY, { duration, easing: Easing.inOut(Easing.ease) })
                ),
                -1,
                true
            )
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }],
    }));

    return (
        <Animated.View
            style={[
                {
                    position: 'absolute',
                    left: startX,
                    top: startY,
                    width: 4,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: '#1DD1A1',
                },
                animatedStyle,
            ]}
        />
    );
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
    const logoScale = useSharedValue(0.7);
    const logoOpacity = useSharedValue(0);
    const bgOpacity = useSharedValue(1);
    const pulseValue = useSharedValue(1);
    const textStagger = useSharedValue(0);
    const helixRotation = useSharedValue(0);
    const particlesOpacity = useSharedValue(0);
    const backgroundOpacity = useSharedValue(0); // Start solid black

    useEffect(() => {
        // Hide native splash once we're ready to show our custom animation
        NativeSplashScreen.hideAsync().catch(() => { });

        // Stage 0: Fade in our background colors smoothly
        backgroundOpacity.value = withTiming(1, { duration: 1000 });

        // Stage 1: Reveal logo with a "pop"
        logoOpacity.value = withTiming(1, { duration: 1200 });
        logoScale.value = withTiming(1, {
            duration: 1500,
            easing: Easing.out(Easing.back(1.2))
        });

        // Stage 2: DNA Helix rotation
        helixRotation.value = withRepeat(
            withTiming(360, { duration: 8000, easing: Easing.linear }),
            -1,
            false
        );

        // Stage 3: Pulse effect
        pulseValue.value = withRepeat(
            withSequence(
                withTiming(1.2, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
                withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) })
            ),
            -1,
            true
        );

        // Stage 4: Particles fade in
        particlesOpacity.value = withDelay(500, withTiming(1, { duration: 1000 }));

        // Stage 5: Text reveal
        textStagger.value = withDelay(800, withTiming(1, { duration: 1000 }));

        // Stage 6: Exit
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

    const animatedGradientStyle = useAnimatedStyle(() => ({
        opacity: backgroundOpacity.value,
    }));

    const animatedPulseStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulseValue.value }],
        opacity: interpolate(pulseValue.value, [1, 1.2], [0.4, 0.15]),
    }));

    const animatedTextStyle = useAnimatedStyle(() => ({
        opacity: textStagger.value,
        transform: [{ translateY: interpolate(textStagger.value, [0, 1], [10, 0]) }],
    }));

    const animatedHelixStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${helixRotation.value}deg` }],
        opacity: 0.15,
    }));

    const animatedParticlesStyle = useAnimatedStyle(() => ({
        opacity: particlesOpacity.value,
    }));

    return (
        <Animated.View style={[StyleSheet.absoluteFill, styles.container, animatedBgStyle]}>
            {/* Pure Black Layer to match native splash perfectly during transition */}
            <View style={[StyleSheet.absoluteFill, { backgroundColor: '#000000' }]} />

            {/* Premium Medical Gradient Background - Fades in over pure black */}
            <Animated.View style={[StyleSheet.absoluteFill, animatedGradientStyle]}>
                <LinearGradient
                    colors={['#000000', '#05353D', '#0F3460', '#05353D', '#000000']}
                    style={StyleSheet.absoluteFill}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                />
            </Animated.View>

            {/* DNA Helix Background */}
            <Animated.View style={[styles.helixContainer, animatedHelixStyle]}>
                <Svg width={width} height={height} viewBox="0 0 400 800">
                    <G>
                        {/* DNA Strand 1 */}
                        <Path
                            d="M100,0 Q150,100 100,200 Q50,300 100,400 Q150,500 100,600 Q50,700 100,800"
                            stroke="#1DD1A1"
                            strokeWidth="2"
                            fill="none"
                            opacity={0.3}
                        />
                        {/* DNA Strand 2 */}
                        <Path
                            d="M300,0 Q250,100 300,200 Q350,300 300,400 Q250,500 300,600 Q350,700 300,800"
                            stroke="#45AAF2"
                            strokeWidth="2"
                            fill="none"
                            opacity={0.3}
                        />
                        {/* Connecting lines */}
                        {[0, 100, 200, 300, 400, 500, 600, 700].map((y, i) => (
                            <Path
                                key={i}
                                d={`M${100 + (i % 2) * 50},${y} L${300 - (i % 2) * 50},${y}`}
                                stroke="#1DD1A1"
                                strokeWidth="1"
                                fill="none"
                                opacity={0.2}
                            />
                        ))}
                    </G>
                </Svg>
            </Animated.View>

            {/* Floating Particles */}
            <Animated.View style={[StyleSheet.absoluteFill, animatedParticlesStyle]}>
                {[...Array(12)].map((_, i) => (
                    <FloatingParticle
                        key={i}
                        delay={i * 100}
                        duration={3000 + i * 200}
                        startX={Math.random() * width}
                        startY={Math.random() * height}
                    />
                ))}
            </Animated.View>

            {/* Multi-layer Pulse Circles */}
            <Animated.View style={[styles.pulseCircle, animatedPulseStyle, { overflow: 'hidden' }]}>
                <LinearGradient
                    colors={['#1DD1A1', 'transparent']}
                    style={[StyleSheet.absoluteFill, { borderRadius: width }]}
                />
            </Animated.View>
            <Animated.View style={[styles.pulseCircle2, animatedPulseStyle, { overflow: 'hidden' }]}>
                <LinearGradient
                    colors={['#45AAF2', 'transparent']}
                    style={[StyleSheet.absoluteFill, { borderRadius: width }]}
                />
            </Animated.View>

            <Animated.View style={[styles.inner, animatedLogoStyle]}>
                <View className="relative items-center justify-center">
                    <Logo size={140} />
                    {/* Enhanced Outer Glow - Multiple Layers */}
                    <View
                        style={{
                            position: 'absolute',
                            width: 140, height: 140,
                            backgroundColor: '#1DD1A1',
                            opacity: 0.2,
                            borderRadius: 140,
                            transform: [{ scale: 1.3 }],
                            zIndex: -1
                        }}
                    />
                    <View
                        style={{
                            position: 'absolute',
                            width: 140, height: 140,
                            backgroundColor: '#1DD1A1',
                            opacity: 0.1,
                            borderRadius: 140,
                            transform: [{ scale: 1.6 }],
                            zIndex: -2
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
                            Medical Grade AI
                        </Text>
                    </View>
                    {/* Loading indicator */}
                    <View className="mt-6 w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                        <Animated.View
                            style={[
                                {
                                    height: '100%',
                                    backgroundColor: '#1DD1A1',
                                    borderRadius: 999,
                                },
                                animatedTextStyle,
                                {
                                    width: '100%',
                                }
                            ]}
                        />
                    </View>
                </Animated.View>
            </Animated.View>

            {/* Scanline effect */}
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
    helixContainer: {
        position: 'absolute',
        width: width,
        height: height,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pulseCircle: {
        position: 'absolute',
        width: width * 1.2,
        height: width * 1.2,
        borderRadius: width,
    },
    pulseCircle2: {
        position: 'absolute',
        width: width * 0.9,
        height: width * 0.9,
        borderRadius: width,
    },
    textShadow: {
        textShadowColor: 'rgba(29, 209, 161, 0.6)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 30,
    },
    scanline: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: 'rgba(29, 209, 161, 0.05)',
        zIndex: 10000,
    }
});
