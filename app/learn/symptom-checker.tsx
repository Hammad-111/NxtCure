import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Pressable } from 'react-native';
import { ChevronLeft, Send, AlertTriangle, ShieldCheck, Info } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';

export default function SymptomCheckerScreen() {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [result, setResult] = useState<null | { type: 'urgent' | 'monitoring' | 'benign', text: string }>(null);

    const handleCheck = () => {
        if (!query.trim()) return;

        // Simple Real Logic Triage (Red Flags)
        const q = query.toLowerCase();
        const redFlags = ['blood', 'lump', 'weight loss', 'night sweats', 'bloating', 'sores', 'bowel', 'hoarseness', 'swallowing', 'moles'];

        if (redFlags.some(flag => q.includes(flag))) {
            setResult({
                type: 'urgent',
                text: 'Based on your description, these "Red Flag" symptoms require clinical evaluation. A lump, persistent bloating, change in bowel habits, or non-healing sores should be seen by a doctor within 1-2 weeks.'
            });
        } else if (q.includes('cough') || q.includes('fatigue') || q.includes('pain') || q.includes('fever')) {
            setResult({
                type: 'monitoring',
                text: 'These symptoms can be caused by many non-cancerous conditions. However, if they persist for more than 3 weeks, you should consult a doctor.'
            });
        } else {
            setResult({
                type: 'benign',
                text: 'Based on your description, this doesn\'t match common cancer warning signs, but always listen to your body. Monitor for changes.'
            });
        }
    };

    return (
        <ScreenContainer hasWave={true} waveVariant="accent" darkStatus={false} withPadding={false} className="bg-white">
            <View className="px-6 py-4 flex-row items-center">
                <Pressable onPress={() => router.back()} className="p-2 -ml-2">
                    <ChevronLeft size={24} color="white" />
                </Pressable>
                <Text className="text-xl font-bold text-white ml-2">Symptom Triage</Text>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="p-6">
                    <Text className="text-2xl font-bold text-nxtcure-text mb-2">How are you feeling?</Text>
                    <Text className="text-nxtcure-subtext text-base mb-6 leading-6">
                        Describe any physical changes or symptoms you've noticed. Be as specific as possible (e.g., "painless lump on neck").
                    </Text>

                    <Card className="mb-6 border border-slate-100 bg-slate-50">
                        <TextInput
                            placeholder="Type your symptoms here..."
                            multiline
                            numberOfLines={6}
                            className="text-base text-nxtcure-text min-h-[150px] textAlignVertical-top"
                            value={query}
                            onChangeText={setQuery}
                        />
                    </Card>

                    <Button title="Analyze Symptoms" onPress={handleCheck} className="mb-8" />

                    {result && (
                        <Card className={`border-l-4 ${result.type === 'urgent' ? 'border-l-red-500 bg-red-50/30' : result.type === 'monitoring' ? 'border-l-amber-500 bg-amber-50/30' : 'border-l-nxtcure-primary bg-nxtcure-primary/5'}`}>
                            <View className="flex-row items-center mb-3">
                                {result.type === 'urgent' ? <AlertTriangle size={20} color="#ef4444" /> : <Info size={20} color={result.type === 'monitoring' ? '#f59e0b' : '#1DD1A1'} />}
                                <Text className={`ml-2 font-bold text-lg ${result.type === 'urgent' ? 'text-red-700' : result.type === 'monitoring' ? 'text-amber-700' : 'text-nxtcure-text'}`}>
                                    {result.type === 'urgent' ? 'Requires Attention' : 'Recommendation'}
                                </Text>
                            </View>
                            <Text className="text-slate-700 leading-6 mb-4">{result.text}</Text>

                            {result.type === 'urgent' && (
                                <View className="bg-white p-4 rounded-xl border border-red-100 shadow-sm">
                                    <View className="flex-row items-center mb-1">
                                        <ShieldCheck size={16} color="#ef4444" />
                                        <Text className="ml-2 font-bold text-xs text-red-600 uppercase">Next Step</Text>
                                    </View>
                                    <Text className="text-nxtcure-text font-semibold">Book an appointment via GP Gateway</Text>
                                </View>
                            )}
                        </Card>
                    )}

                    <View className="mt-8 bg-blue-50 p-4 rounded-2xl flex-row items-start">
                        <Info size={18} color="#45aaf2" className="mt-1" />
                        <Text className="ml-3 text-blue-800 text-xs leading-4 flex-1">
                            This tool uses rule-based triage. It is <Text className="font-bold">NOT</Text> a diagnostic tool. If you are concerned, always consult a medical professional immediately regardless of the result.
                        </Text>
                    </View>
                </View>
                <View className="h-20" />
            </ScrollView>
        </ScreenContainer>
    );
}
