import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
    children: React.ReactNode;
}

export function Card({ children, className, ...props }: CardProps) {
    return (
        <View className={`bg-white rounded-3xl shadow-sm p-5 ${className}`} {...props}>
            {children}
        </View>
    );
}
