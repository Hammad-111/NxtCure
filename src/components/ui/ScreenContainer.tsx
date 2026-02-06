import { SafeAreaView } from 'react-native-safe-area-context';
import { View, ViewProps } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MedicalBackground, WaveVariant } from './MedicalBackground';

interface ScreenContainerProps extends ViewProps {
    children: React.ReactNode;
    darkStatus?: boolean;
    withPadding?: boolean;
    hasWave?: boolean;
    waveVariant?: WaveVariant;
}

export function ScreenContainer({
    children,
    darkStatus = true,
    withPadding = true,
    hasWave = false,
    waveVariant = 'hero',
    className,
    ...props
}: ScreenContainerProps) {
    return (
        <SafeAreaView className={`flex-1 ${hasWave ? 'bg-white' : 'bg-nxtcure-bg'} ${className}`} edges={['top', 'left', 'right']} {...props}>
            <StatusBar style={darkStatus ? 'dark' : 'light'} />
            {hasWave && <MedicalBackground variant={waveVariant} />}
            <View className={`flex-1 ${withPadding ? 'px-6' : ''}`}>
                {children}
            </View>
        </SafeAreaView>
    );
}
