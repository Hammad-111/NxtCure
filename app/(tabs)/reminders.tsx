import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Modal, StyleSheet, Dimensions, Image } from 'react-native';
import { Calendar, Bell, CheckCircle2, AlertCircle, Clock, Plus, ChevronLeft, MapPin, User, Trash2, Fingerprint } from 'lucide-react-native';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { Card } from '../../src/components/ui/Card';
import { useScreeningStore, ScreeningType } from '../../src/store/screeningStore';
import { useRiskStore } from '../../src/store/riskStore';
import { useAppointmentStore, Appointment } from '../../src/store/appointmentStore';
import { useRouter, Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Logo } from '../../src/components/ui/Logo';

const { width, height } = Dimensions.get('window');

export default function RemindersScreen() {
    const { logs } = useScreeningStore();
    const { factors } = useRiskStore();
    const { appointments, addAppointment, removeAppointment } = useAppointmentStore();
    const router = useRouter();

    const [modalVisible, setModalVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [doctor, setDoctor] = useState('');
    const [date, setDate] = useState('');

    const baseRecommendations = useMemo(() => {
        const list = [
            { id: 'tse', title: 'Self-Exam', frequencyMonths: 1, icon: Clock, color: '#1DD1A1', route: '/learn/self-exam-tse' },
            { id: 'skin', title: 'Skin Check', frequencyMonths: 6, icon: Calendar, color: '#45aaf2', route: '/learn' },
            { id: 'dental', title: 'Oral Scan', frequencyMonths: 12, icon: Calendar, color: '#a4b0be', route: '/learn' }
        ];
        if (factors.age >= 45) {
            list.push({ id: 'colonoscopy', title: 'Colonoscopy', frequencyMonths: 120, icon: AlertCircle, color: '#FF4757', route: '/learn' });
        }
        return list;
    }, [factors.age]);

    const screeningItems = useMemo(() => {
        const now = new Date();
        return baseRecommendations.map(rec => {
            const lastDone = logs[rec.id as ScreeningType];
            let status = 'Pending';
            let urgent = true;
            if (lastDone) {
                const lastDate = new Date(lastDone);
                const nextDate = new Date(lastDate);
                nextDate.setMonth(nextDate.getMonth() + rec.frequencyMonths);
                const diffTime = nextDate.getTime() - now.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays <= 0) { status = 'Action Required'; urgent = true; }
                else { status = `Next: ${nextDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`; urgent = false; }
            }
            return { ...rec, status, urgent };
        });
    }, [baseRecommendations, logs]);

    const handleAddAppointment = () => {
        if (title && date) {
            addAppointment({
                title,
                doctor,
                date: new Date(date).toISOString(),
                location: 'Main Clinic',
                type: 'oncology'
            });
            setModalVisible(false);
            setTitle('');
            setDoctor('');
            setDate('');
        }
    };

    return (
        <ScreenContainer darkStatus={false} withPadding={false} className="bg-black">
            {/* Cinematic Background */}
            <View style={styles.bgContainer}>
                <Image
                    source={require('../../assets/goals_hero.png')}
                    style={styles.bgImage}
                    resizeMode="cover"
                    blurRadius={3}
                />
                <LinearGradient
                    colors={['rgba(0,0,0,0.85)', 'rgba(5, 53, 61, 0.4)', 'rgba(0, 0, 0, 0.8)', 'black']}
                    style={StyleSheet.absoluteFill}
                    locations={[0, 0.2, 0.5, 0.95]}
                />
            </View>

            {/* Header */}
            <View className="px-8 pt-12 pb-6 flex-row justify-between items-center">
                <View>
                    <View className="flex-row items-center mb-1">
                        <Logo size={20} style={{ marginRight: 8 }} />
                        <Text className="text-white/40 text-[9px] font-black uppercase tracking-[5px]">Schedule Hub</Text>
                    </View>
                    <Text className="text-white text-3xl font-black tracking-tighter">Clinical Reminders</Text>
                </View>
                <Pressable onPress={() => setModalVisible(true)} className="bg-nxtcure-primary/20 w-12 h-12 rounded-2xl items-center justify-center border border-nxtcure-primary/30 backdrop-blur-3xl">
                    <Plus size={24} color="#1DD1A1" />
                </Pressable>
            </View>

            <ScrollView className="flex-1 px-8" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
                {/* Appointments Section */}
                <Animated.View entering={FadeInDown.duration(800)} className="mb-10">
                    <Text className="text-white/60 text-[10px] font-black uppercase tracking-[4px] ml-2 mb-4">Upcoming Appointments</Text>
                    {appointments.length > 0 ? appointments.map((app) => (
                        <Card key={app.id} className="mb-4 bg-white/5 border-white/10 p-6 flex-row items-center">
                            <View className="w-12 h-12 bg-nxtcure-info/10 rounded-2xl items-center justify-center mr-5">
                                <MapPin size={26} color="#45AAF2" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-white font-black text-lg mb-1">{app.title}</Text>
                                <View className="flex-row items-center mt-1">
                                    <User size={12} color="rgba(255,255,255,0.5)" />
                                    <Text className="text-white/50 text-[10px] font-bold ml-1 uppercase">{app.doctor}</Text>
                                    <View className="w-1 h-1 bg-white/10 rounded-full mx-2" />
                                    <Clock size={12} color="rgba(255,255,255,0.5)" />
                                    <Text className="text-white/50 text-[10px] font-bold ml-1 uppercase">{new Date(app.date).toLocaleDateString()}</Text>
                                </View>
                            </View>
                            <Pressable onPress={() => removeAppointment(app.id)} className="p-3 bg-red-500/10 rounded-xl">
                                <Trash2 size={20} color="#FF4757" opacity={0.8} />
                            </Pressable>
                        </Card>
                    )) : (
                        <View className="bg-white/5 border border-dashed border-white/10 p-8 rounded-[32px] items-center">
                            <Text className="text-white/30 text-xs font-bold uppercase tracking-widest">No Active Bookings</Text>
                        </View>
                    )}
                </Animated.View>

                {/* Screenings Section */}
                <Animated.View entering={FadeInDown.duration(800).delay(200)} className="mb-10">
                    <Text className="text-white/60 text-[10px] font-black uppercase tracking-[4px] ml-2 mb-4">Protocol Schedule</Text>
                    {screeningItems.map(item => (
                        <Card key={item.id} className={`mb-4 bg-white/5 border-white/10 p-6 flex-row items-center ${item.urgent ? 'border-l-4 border-l-red-500 bg-red-500/5' : ''}`}>
                            <View className={`w-12 h-12 rounded-2xl items-center justify-center mr-5 ${item.urgent ? 'bg-red-500/10' : 'bg-white/5'}`}>
                                <item.icon size={24} color={item.urgent ? '#FF4757' : 'rgba(255,255,255,0.5)'} />
                            </View>
                            <View className="flex-1">
                                <Text className="text-white font-black text-lg mb-0.5">{item.title}</Text>
                                <Text className={`${item.urgent ? 'text-red-400 font-black' : 'text-white/40 font-bold'} text-[10px] uppercase tracking-widest`}>{item.status}</Text>
                            </View>
                            {item.urgent && (
                                <Link href={item.route as any} asChild>
                                    <Pressable className="bg-red-500 px-5 py-2.5 rounded-xl shadow-lg shadow-red-500/20">
                                        <Text className="text-white font-black text-[11px] uppercase tracking-wider">Log Now</Text>
                                    </Pressable>
                                </Link>
                            )}
                        </Card>
                    ))}
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(800).delay(400)} className="bg-nxtcure-primary/5 p-8 rounded-[40px] border border-nxtcure-primary/10 mb-10">
                    <View className="flex-row items-center mb-4">
                        <CheckCircle2 size={18} color="#1DD1A1" />
                        <Text className="ml-3 font-black text-white text-sm uppercase tracking-widest">Protocol Intelligence</Text>
                    </View>
                    <Text className="text-white/40 text-[11px] leading-5 font-bold">
                        Schedule based on Human Baseline parameters: Age ({factors.age}), Sex ({factors.sex}). System synchronizes new screening directives automatically per clinical guidelines.
                    </Text>
                </Animated.View>
            </ScrollView>

            {/* Modal */}
            <Modal transparent visible={modalVisible} animationType="fade">
                <View style={styles.modalOverlay}>
                    <View className="bg-[#1A1A2E] w-[85%] rounded-[40px] p-8 border border-white/10">
                        <Text className="text-white text-2xl font-black mb-2">New Appointment</Text>
                        <Text className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-6">Clinical Slot Reservation</Text>

                        <TextInput
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Appointment Title"
                            placeholderTextColor="rgba(255,255,255,0.2)"
                            className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white mb-4"
                        />

                        <TextInput
                            value={doctor}
                            onChangeText={setDoctor}
                            placeholder="Doctor Name"
                            placeholderTextColor="rgba(255,255,255,0.2)"
                            className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white mb-4"
                        />

                        <TextInput
                            value={date}
                            onChangeText={setDate}
                            placeholder="Date (YYYY-MM-DD)"
                            placeholderTextColor="rgba(255,255,255,0.2)"
                            className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white mb-8"
                        />

                        <View className="flex-row gap-4">
                            <Pressable
                                onPress={() => setModalVisible(false)}
                                className="flex-1 py-4 items-center"
                            >
                                <Text className="text-white/40 font-bold">Cancel</Text>
                            </Pressable>
                            <Pressable
                                onPress={handleAddAppointment}
                                className="flex-2 bg-nxtcure-primary py-4 rounded-2xl items-center px-8 shadow-lg shadow-nxtcure-primary/20"
                            >
                                <Text className="text-black font-black uppercase tracking-widest">Reserve Slot</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            <LinearGradient
                colors={['transparent', 'black']}
                style={styles.bottomFade}
            />
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    bgContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: height,
        zIndex: -1,
    },
    bgImage: {
        width: '100%',
        height: '100%',
        opacity: 0.6,
    },
    bottomFade: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 120,
        pointerEvents: 'none',
        zIndex: 10,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
    }
});
