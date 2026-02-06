import { Tabs } from 'expo-router';
import { Home, Activity, BookOpen, Bell, User } from 'lucide-react-native';
import { View, Platform, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: 'transparent',
                    borderTopWidth: 0,
                    elevation: 0,
                    height: 85,
                    paddingTop: 10,
                    paddingBottom: Platform.OS === 'ios' ? 25 : 15,
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                },
                tabBarActiveTintColor: '#1DD1A1',
                tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.4)',
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: '900',
                    marginTop: 4,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                },
                tabBarBackground: () => (
                    <View style={StyleSheet.absoluteFill}>
                        <BlurView
                            intensity={60}
                            tint="dark"
                            style={StyleSheet.absoluteFill}
                            className="overflow-hidden rounded-t-[40px] border-t border-white/20"
                        />
                        <View
                            style={StyleSheet.absoluteFill}
                            className="bg-black/30 rounded-t-[40px]"
                        />
                    </View>
                )
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <View className={color === '#1DD1A1' ? 'shadow-lg shadow-nxtcure-primary/40' : ''}>
                            <Home size={22} color={color} strokeWidth={2.5} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="track"
                options={{
                    title: 'Track',
                    tabBarIcon: ({ color, size }) => <Activity size={22} color={color} strokeWidth={2.5} />,
                }}
            />
            <Tabs.Screen
                name="learn"
                options={{
                    title: 'Learn',
                    tabBarIcon: ({ color, size }) => <BookOpen size={22} color={color} strokeWidth={2.5} />,
                }}
            />
            <Tabs.Screen
                name="reminders"
                options={{
                    title: 'Reminders',
                    tabBarIcon: ({ color, size }) => <Bell size={22} color={color} strokeWidth={2.5} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => <User size={22} color={color} strokeWidth={2.5} />,
                }}
            />
        </Tabs>
    );
}
