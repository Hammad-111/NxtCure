import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { ChevronLeft, Calendar, Plus, Clock, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';

const UPCOMING_APPOINTMENTS = [
    {
        id: '1',
        title: 'Oncology Consultation',
        doctor: 'Dr. Sarah Wilson',
        date: 'Feb 12, 2026',
        time: '10:00 AM',
        location: 'City General Hospital',
        type: 'Treatment'
    },
    {
        id: '2',
        title: 'Blood Test (Full Count)',
        doctor: 'Lab Services',
        date: 'Feb 15, 2026',
        time: '08:30 AM',
        location: 'Westside Clinic',
        type: 'Diagnostic'
    }
];

export default function AppointmentManagerScreen() {
    const router = useRouter();

    return (
        <ScreenContainer className="bg-white" withPadding={false}>
            <View className="px-6 py-4 flex-row items-center border-b border-slate-50 justify-between">
                <View className="flex-row items-center">
                    <Pressable onPress={() => router.back()} className="p-2 -ml-2">
                        <ChevronLeft size={24} color="#2d3436" />
                    </Pressable>
                    <Text className="text-xl font-bold text-nxtcure-text ml-2">Appointments</Text>
                </View>
                <Pressable className="bg-nxtcure-primary w-10 h-10 rounded-full items-center justify-center">
                    <Plus size={24} color="white" />
                </Pressable>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="p-6">
                    <View className="mb-8">
                        <Text className="text-nxtcure-subtext font-bold text-xs uppercase tracking-widest mb-4">Upcoming</Text>
                        <View className="gap-4">
                            {UPCOMING_APPOINTMENTS.map((app) => (
                                <Card key={app.id} className="p-0 overflow-hidden">
                                    <View className="p-5">
                                        <View className="flex-row justify-between items-start mb-4">
                                            <View className="flex-1">
                                                <Text className="text-lg font-bold text-nxtcure-text">{app.title}</Text>
                                                <Text className="text-nxtcure-subtext">{app.doctor}</Text>
                                            </View>
                                            <View className="bg-slate-100 px-3 py-1 rounded-full">
                                                <Text className="text-[10px] font-bold text-slate-500 uppercase">{app.type}</Text>
                                            </View>
                                        </View>

                                        <View className="flex-row items-center mb-2">
                                            <Calendar size={14} color="#a4b0be" />
                                            <Text className="ml-2 text-nxtcure-text text-sm">{app.date}</Text>
                                            <View className="w-1 h-1 rounded-full bg-slate-300 mx-3" />
                                            <Clock size={14} color="#a4b0be" />
                                            <Text className="ml-2 text-nxtcure-text text-sm">{app.time}</Text>
                                        </View>

                                        <Text className="text-nxtcure-subtext text-xs italic">{app.location}</Text>
                                    </View>
                                    <Pressable className="bg-slate-50 py-3 items-center border-t border-slate-100">
                                        <Text className="text-nxtcure-secondary font-bold text-xs">View Pre-Visit Instructions</Text>
                                    </Pressable>
                                </Card>
                            ))}
                        </View>
                    </View>

                    <Card className="bg-nxtcure-secondary/5 border border-nxtcure-secondary/10 mb-8 p-6">
                        <View className="flex-row items-center mb-3">
                            <CheckCircle2 size={20} color="#45aaf2" />
                            <Text className="ml-2 font-bold text-nxtcure-secondary text-lg">Completed (Past 30 Days)</Text>
                        </View>
                        <View className="flex-row items-center justify-between py-2">
                            <Text className="text-nxtcure-text">PET Scan Result Review</Text>
                            <ChevronRight size={18} color="#a4b0be" />
                        </View>
                    </Card>

                    <View className="p-6 bg-amber-50 rounded-3xl border border-amber-100">
                        <View className="flex-row items-start mb-3">
                            <AlertCircle size={20} color="#f59e0b" className="mt-1" />
                            <View className="ml-3">
                                <Text className="font-bold text-amber-800 text-lg">Next Follow-up Plan</Text>
                                <Text className="text-amber-900/60 text-sm leading-5">
                                    Your next routine blood work should be scheduled for late March per Dr. Wilson's plan.
                                </Text>
                            </View>
                        </View>
                        <Button title="Schedule Now" onPress={() => { }} variant="outline" className="mt-2" />
                    </View>
                </View>
                <View className="h-20" />
            </ScrollView>
        </ScreenContainer>
    );
}
