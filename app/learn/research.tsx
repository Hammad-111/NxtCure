import React from 'react';
import { View, Text, ScrollView, Pressable, Linking } from 'react-native';
import { ChevronLeft, BookOpen, ExternalLink, Microscope, Globe, Search } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { Card } from '../../src/components/ui/Card';

const RESEARCH_ITEMS = [
    {
        title: 'ASCO 2025: Immunotherapy Breakthroughs',
        source: 'American Society of Clinical Oncology',
        summary: 'New results show significant improvement in survival rates for late-stage lung cancer using combined checkpoint inhibitors.',
        link: 'https://www.asco.org',
        type: 'Conference Report'
    },
    {
        title: 'IARC Monograph: Processed Meat Risk',
        source: 'WHO / IARC',
        summary: 'A comprehensive review confirming the classification of processed meat as a Group 1 carcinogen with updated global mortality data.',
        link: 'https://www.iarc.who.int',
        type: 'Global Guideline'
    },
    {
        title: 'ClinicalTrial.gov: Active Studies Search',
        source: 'National Institutes of Health',
        summary: 'Access the world\'s largest database of privately and publicly funded clinical studies conducted around the world.',
        link: 'https://clinicaltrials.gov',
        type: 'Registry Search'
    }
];

export default function ResearchScreen() {
    const router = useRouter();

    const openLink = (url: string) => {
        Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
    };

    return (
        <ScreenContainer className="bg-white" withPadding={false}>
            <View className="px-6 py-4 flex-row items-center border-b border-slate-50">
                <Pressable onPress={() => router.back()} className="p-2 -ml-2">
                    <ChevronLeft size={24} color="#2d3436" />
                </Pressable>
                <Text className="text-xl font-bold text-nxtcure-text ml-2">Research Aggregation</Text>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="p-6">
                    <View className="bg-nxtcure-primary/5 p-6 rounded-3xl mb-8 border border-nxtcure-primary/10">
                        <Microscope size={32} color="#0FB9B1" className="mb-4" />
                        <Text className="text-lg font-bold text-nxtcure-text mb-2">Evidence-Based Insights</Text>
                        <Text className="text-slate-600 text-sm leading-5">
                            We summarize the latest oncology breakthroughs from the world's leading research institutions to keep you informed.
                        </Text>
                    </View>

                    <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 ml-2">Latest Publications</Text>

                    {RESEARCH_ITEMS.map((item, i) => (
                        <Card key={i} className="mb-4 p-5 shadow-sm border border-slate-100">
                            <View className="bg-nxtcure-primary/10 self-start px-2 py-1 rounded-md mb-3">
                                <Text className="text-[10px] font-bold text-nxtcure-primary uppercase">{item.type}</Text>
                            </View>
                            <Text className="text-lg font-bold text-nxtcure-text mb-2">{item.title}</Text>
                            <View className="flex-row items-center mb-3">
                                <Globe size={12} color="#636E72" />
                                <Text className="text-xs text-slate-500 ml-1.5">{item.source}</Text>
                            </View>
                            <Text className="text-slate-600 text-sm leading-5 mb-4">
                                {item.summary}
                            </Text>
                            <Pressable
                                onPress={() => openLink(item.link)}
                                className="flex-row items-center justify-center bg-slate-50 py-3 rounded-2xl border border-slate-100 active:bg-slate-100"
                            >
                                <ExternalLink size={16} color="#0FB9B1" />
                                <Text className="text-nxtcure-primary font-bold ml-2">Read Full Publication</Text>
                            </Pressable>
                        </Card>
                    ))}

                    <View className="mt-6 bg-nxtcure-info p-6 rounded-3xl shadow-lg shadow-nxtcure-info/20">
                        <Search size={24} color="white" className="mb-3" />
                        <Text className="text-white font-bold text-lg mb-1">Clinical Trial Finder</Text>
                        <Text className="text-white/80 text-sm mb-4">Search for active trials matching your specific diagnosis and location.</Text>
                        <Pressable
                            onPress={() => openLink('https://www.cancer.gov/about-cancer/treatment/clinical-trials/search')}
                            className="bg-white py-3 rounded-2xl items-center"
                        >
                            <Text className="text-nxtcure-info font-bold">Search NIH Database</Text>
                        </Pressable>
                    </View>
                </View>
                <View className="h-20" />
            </ScrollView>
        </ScreenContainer>
    );
}
