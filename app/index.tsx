import { View, Text, Pressable, Image, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../src/components/ui/ScreenContainer';
import { Button } from '../src/components/ui/Button';
import { Shield, Search, Heart, Activity, CheckCircle2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Logo } from '../src/components/ui/Logo';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
    const router = useRouter();

    return (
        <ScreenContainer hasWave={false} darkStatus={false} withPadding={false} className="bg-black">
            {/* Fullscreen Cinematic Hero with LinearGradient Protection */}
            <View style={styles.heroContainer}>
                <Image
                    source={require('../assets/medical_hero_v2.png')}
                    style={styles.heroImage}
                    resizeMode="cover"
                />
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(5, 53, 61, 0.95)', '#05353D']}
                    style={styles.gradientOverlay}
                    locations={[0, 0.3, 0.6, 0.9]}
                />
            </View>

            <View className="flex-1 justify-end">
                {/* Branding Section - Animated Entrance */}
                <Animated.View
                    entering={FadeInDown.duration(1000).delay(200)}
                    className="px-8 pb-10"
                >
                    <View className="flex-row items-center mb-6">
                        <Logo size={40} style={{ marginRight: 16 }} />
                        <Text style={styles.brandingText} className="text-sm font-black text-white tracking-[6px] uppercase opacity-90">NxtCure</Text>
                    </View>

                    <Text style={styles.mainHeadline} className="text-6xl font-black text-white leading-[60px] tracking-tighter">
                        Next-Gen{'\n'}
                        <Text className="text-nxtcure-primary">Oncology.</Text>
                    </Text>

                    <View className="flex-row items-center mt-6 gap-4">
                        <View className="flex-row items-center bg-white/10 px-3 py-2 rounded-xl border border-white/20 backdrop-blur-md">
                            <CheckCircle2 size={14} color="#1DD1A1" />
                            <Text className="text-white/90 text-[10px] font-black ml-2 uppercase tracking-widest">Medical Grade</Text>
                        </View>
                        <View className="flex-row items-center bg-white/10 px-3 py-2 rounded-xl border border-white/20 backdrop-blur-md">
                            <Activity size={14} color="#45AAF2" />
                            <Text className="text-white/90 text-[10px] font-black ml-2 uppercase tracking-widest">AI Prevention</Text>
                        </View>
                    </View>
                </Animated.View>

                {/* Premium Glassmorphism CTA Area - Animated Upward Slide */}
                <Animated.View
                    entering={FadeInUp.duration(1000).delay(500)}
                    className="bg-white/10 p-10 rounded-t-[60px] border-t border-white/30 backdrop-blur-3xl shadow-2xl"
                >
                    <Text className="text-white/95 text-[17px] leading-7 font-semibold mb-10 text-center">
                        Experience the <Text className="text-nxtcure-primary">Gold Standard</Text> in personalized cancer prevention.
                    </Text>

                    <View className="flex-row gap-6 mb-10 justify-between">
                        {[
                            { icon: Shield, label: 'Prevent', color: '#1DD1A1' },
                            { icon: Search, label: 'Detect', color: '#45AAF2' },
                            { icon: Heart, label: 'Support', color: '#1DD1A1' }
                        ].map((item, idx) => (
                            <View key={idx} className="items-center flex-1">
                                <View className="w-16 h-16 bg-white/10 rounded-[28px] items-center justify-center mb-3 border border-white/20 shadow-lg">
                                    <item.icon size={28} color="white" strokeWidth={1.5} />
                                </View>
                                <Text className="text-[10px] text-white/70 font-black uppercase tracking-[2px]">{item.label}</Text>
                            </View>
                        ))}
                    </View>

                    <Button
                        title="Start Your Journey"
                        onPress={() => router.push('/onboarding/goals')}
                        className="w-full h-20 rounded-[32px] bg-nxtcure-primary shadow-2xl shadow-nxtcure-primary/50"
                        style={{ height: 72 }}
                    />

                    <View className="mt-8 items-center">
                        <Text className="text-white/40 text-[11px] font-semibold tracking-wide">
                            Trusted by Leading Oncologists Worldwide
                        </Text>
                        <Pressable onPress={() => router.push('/privacy')} className="mt-2 active:opacity-60">
                            <Text className="text-white/60 text-[11px] font-bold underline">Privacy Policy & Terms</Text>
                        </Pressable>
                    </View>
                </Animated.View>
            </View>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    heroContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: height,
        zIndex: -1,
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    gradientOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    brandingText: {
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    mainHeadline: {
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 10,
    }
});
