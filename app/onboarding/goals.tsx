import { useState } from 'react';
import { View, Text, TouchableOpacity, Pressable, Image, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { Button } from '../../src/components/ui/Button';
import { ChevronLeft, Check, Shield, Activity, Heart, Search, UserPlus } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp, useAnimatedStyle, withSpring, useDerivedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const GOALS = [
    { id: '1', label: 'Prevent cancer', icon: Shield },
    { id: '2', label: 'Learn self-exams', icon: Search },
    { id: '3', label: 'I have cancer', icon: Activity },
    { id: '4', label: "I'm a survivor", icon: Heart },
    { id: '5', label: 'Supporting someone', icon: UserPlus },
];

function GoalCard({ goal, isSelected, onPress, index }: { goal: typeof GOALS[0], isSelected: boolean, onPress: () => void, index: number }) {
    const scale = useDerivedValue(() => withSpring(isSelected ? 1.05 : 1));

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        borderColor: withSpring(isSelected ? '#1DD1A1' : 'rgba(255,255,255,0.15)'),
        backgroundColor: withSpring(isSelected ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)'),
    }));

    return (
        <Animated.View
            entering={FadeInUp.duration(600).delay(400 + index * 100)}
            style={[animatedStyle]}
            className="rounded-[20px] border mb-2 overflow-hidden"
        >
            <Pressable
                onPress={onPress}
                className="flex-row items-center p-3.5 active:opacity-80"
            >
                <View className={`w-10 h-10 rounded-xl items-center justify-center mr-3.5 ${isSelected ? 'bg-nxtcure-primary' : 'bg-white/10'}`}>
                    <goal.icon size={20} color="white" strokeWidth={2} opacity={isSelected ? 1 : 0.6} />
                </View>

                <View className="flex-1">
                    <Text className={`text-base tracking-tight ${isSelected ? 'text-white font-black' : 'text-white/70 font-bold'}`}>
                        {goal.label}
                    </Text>
                </View>

                <View className={`w-5 h-5 rounded-full border items-center justify-center ${isSelected ? 'bg-nxtcure-primary border-nxtcure-primary' : 'border-white/30 bg-white/5'}`}>
                    {isSelected && <Check size={10} color="white" strokeWidth={5} />}
                </View>
            </Pressable>
        </Animated.View>
    );
}

export default function GoalsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [selected, setSelected] = useState<string[]>([]);

    const handleBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/');
        }
    };

    const toggle = (id: string) => {
        if (selected.includes(id)) setSelected(selected.filter(i => i !== id));
        else setSelected([...selected, id]);
    };

    return (
        <ScreenContainer hasWave={false} darkStatus={false} withPadding={false} className="bg-black">
            {/* Cinematic Background */}
            <View style={styles.bgContainer}>
                <Image
                    source={require('../../assets/goals_bg_v2.png')}
                    style={styles.bgImage}
                    resizeMode="cover"
                />
                <LinearGradient
                    colors={['rgba(5, 53, 61, 0.3)', 'rgba(5, 53, 61, 0.8)', '#05353D']}
                    style={styles.gradientOverlay}
                    locations={[0, 0.5, 0.9]}
                />
            </View>

            <View style={{ flex: 1, paddingHorizontal: 28, paddingTop: insets.top + 10, paddingBottom: insets.bottom + 20 }}>
                {/* Header */}
                <View className="flex-row items-center justify-between mb-4">
                    <TouchableOpacity
                        onPress={handleBack}
                        style={styles.backButton}
                        className="bg-white/10 rounded-2xl items-center justify-center border border-white/20 backdrop-blur-xl"
                    >
                        <ChevronLeft size={24} color="white" />
                    </TouchableOpacity>
                    <View className="flex-row items-center bg-white/10 px-3 py-2.5 rounded-xl border border-white/20">
                        <Activity size={12} color="#1DD1A1" />
                        <Text className="text-white/80 text-[10px] font-black ml-2 uppercase tracking-[2px]">Goal Tracking</Text>
                    </View>
                </View>

                {/* Main Content - Strictly No Scroll */}
                <View className="flex-1 justify-center">
                    <Animated.View
                        entering={FadeInDown.duration(800)}
                        className="mb-6"
                    >
                        <View className="flex-row items-center mb-2">
                            <View className="w-6 h-1 bg-nxtcure-primary rounded-full mr-2" />
                            <Text className="text-[10px] font-black text-white/40 uppercase tracking-[4px]">Step 1/3</Text>
                        </View>
                        <Text style={styles.headline} className="text-4xl font-black text-white leading-none tracking-tighter">
                            Select Your{'\n'}
                            <Text className="text-nxtcure-primary">Goals.</Text>
                        </Text>
                    </Animated.View>

                    <View>
                        {GOALS.map((goal, index) => (
                            <GoalCard
                                key={goal.id}
                                goal={goal}
                                index={index}
                                isSelected={selected.includes(goal.id)}
                                onPress={() => toggle(goal.id)}
                            />
                        ))}
                    </View>
                </View>

                {/* Footer Action */}
                <Animated.View
                    entering={FadeInUp.duration(1000).delay(800)}
                    className="mt-6"
                >
                    <Button
                        title={selected.length > 0 ? "Continue Journey" : "Skip Progress"}
                        onPress={() => router.push('/(tabs)/home')}
                        className="w-full h-18 rounded-[28px] bg-nxtcure-primary shadow-2xl shadow-nxtcure-primary/40"
                        style={{ height: 64 }}
                    />
                    <Text className="text-white/30 text-center mt-5 text-[9px] font-bold uppercase tracking-widest">
                        Standard Clincal Protocol Applied
                    </Text>
                </Animated.View>
            </View>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    bgContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
    },
    bgImage: {
        width: '100%',
        height: '100%',
    },
    gradientOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    backButton: {
        width: 48,
        height: 48,
    },
    headline: {
        textShadowColor: 'rgba(0, 0, 0, 0.4)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8,
    }
});
