import { View } from 'react-native';

export function ProgressBar({ progress, color }: { progress: number, color: string }) {
    return (
        <View className="h-2 bg-slate-100 rounded-full overflow-hidden w-full">
            <View
                className="h-full rounded-full"
                style={{ width: `${progress * 100}%`, backgroundColor: color }}
            />
        </View>
    );
}
