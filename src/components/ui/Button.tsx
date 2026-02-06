import { Pressable, Text, PressableProps } from 'react-native';

interface ButtonProps extends PressableProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    textClassName?: string;
}

export function Button({ title, onPress, variant = 'primary', className, textClassName, ...props }: ButtonProps) {
    const bgClass = variant === 'primary' ? 'bg-nxtcure-primary' : variant === 'secondary' ? 'bg-nxtcure-secondary' : 'bg-transparent border border-nxtcure-primary';
    const defaultTextClass = variant === 'outline' ? 'text-nxtcure-primary' : 'text-white';

    return (
        <Pressable
            onPress={onPress}
            className={`${bgClass} py-4 px-6 rounded-2xl items-center shadow-sm active:opacity-80 ${className}`}
            {...props}
        >
            <Text className={`${defaultTextClass} font-bold text-lg tracking-wide ${textClassName}`}>{title}</Text>
        </Pressable>
    );
}
