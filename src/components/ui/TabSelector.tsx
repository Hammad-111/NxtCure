import { View, Text, TouchableOpacity } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

interface TabItem {
    id: string;
    label: string;
    icon: LucideIcon;
}

interface TabSelectorProps {
    tabs: TabItem[];
    activeTab: string;
    onTabChange: (id: string) => void;
}

export function TabSelector({ tabs, activeTab, onTabChange }: TabSelectorProps) {
    return (
        <View className="flex-row bg-white rounded-3xl p-1.5 shadow-sm mb-6 border border-slate-50">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                    <TouchableOpacity
                        key={tab.id}
                        onPress={() => onTabChange(tab.id)}
                        className={`flex-1 py-3.5 rounded-2xl items-center justify-center`}
                        activeOpacity={0.8}
                    >
                        {isActive && (
                            <View className="absolute inset-0 bg-nxtcure-secondary/10 rounded-2xl" />
                        )}
                        <View className="items-center">
                            <Icon size={22} color={isActive ? '#1DD1A1' : '#a4b0be'} />
                            <Text className={`font-bold text-xs mt-1.5 ${isActive ? 'text-nxtcure-secondary' : 'text-nxtcure-subtext'}`}>
                                {tab.label}
                            </Text>
                        </View>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}
