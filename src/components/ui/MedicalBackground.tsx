import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

const { width } = Dimensions.get('window');

export type WaveVariant = 'hero' | 'compact' | 'accent';

interface MedicalBackgroundProps {
    variant?: WaveVariant;
    height?: number;
}

export function MedicalBackground({ variant = 'hero', height }: MedicalBackgroundProps) {
    // Default heights based on variant
    const defaultHeight = {
        hero: 320,
        compact: 160,
        accent: 220
    }[variant];

    const actualHeight = height || defaultHeight;

    // Gradient colors based on variant
    const colors = {
        hero: { start: '#0FB9B1', end: '#2D98DA' },
        compact: { start: '#0FB9B1', end: '#2D98DA' },
        accent: { start: '#7158E2', end: '#2D98DA' } // Purple to Blue for accent
    }[variant];

    // Wave intensity/depth based on variant
    const waveDepth = {
        hero: 100,
        compact: 40,
        accent: 60
    }[variant];

    return (
        <View style={[styles.container, { height: actualHeight }]}>
            <Svg
                width={width}
                height={actualHeight}
                viewBox={`0 0 ${width} ${actualHeight}`}
                preserveAspectRatio="none"
            >
                <Defs>
                    <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <Stop offset="0%" stopColor={colors.start} stopOpacity="1" />
                        <Stop offset="100%" stopColor={colors.end} stopOpacity="1" />
                    </LinearGradient>
                    <LinearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <Stop offset="0%" stopColor={colors.start} stopOpacity="0.2" />
                        <Stop offset="100%" stopColor={colors.end} stopOpacity="0.2" />
                    </LinearGradient>
                </Defs>

                {/* Layer 1: Background Fill */}
                <Path
                    d={`M0 0 H${width} V${actualHeight - waveDepth} Q${width * 0.75} ${actualHeight - waveDepth + 50}, ${width * 0.5} ${actualHeight - waveDepth} T0 ${actualHeight - waveDepth + 20} V0 Z`}
                    fill="url(#grad)"
                />

                {/* Layer 2: Organic Wave Overlay 1 */}
                <Path
                    d={`M0 0 H${width} V${actualHeight - waveDepth - 20} Q${width * 0.8} ${actualHeight - waveDepth + 60}, ${width * 0.4} ${actualHeight - waveDepth - 10} T0 ${actualHeight - waveDepth + 10} V0 Z`}
                    fill="url(#grad2)"
                    opacity="0.6"
                />

                {/* Layer 3: Organic Wave Overlay 2 */}
                <Path
                    d={`M0 0 H${width} V${actualHeight - waveDepth - 40} Q${width * 0.6} ${actualHeight - waveDepth + 40}, ${width * 0.3} ${actualHeight - waveDepth - 20} T0 ${actualHeight - waveDepth} V0 Z`}
                    fill="white"
                    opacity="0.1"
                />
            </Svg>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: -1,
    },
});
