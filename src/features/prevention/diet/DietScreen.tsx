import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDietStore, DailyLog } from '../../../store/dietStore';
import { Check, X, Leaf, Fish, Beef, Wheat, Droplets, Apple, Candy } from 'lucide-react-native';
import clsx from 'clsx';

export default function DietScreen() {
    const today = new Date().toISOString().split('T')[0];
    const { logs, toggleItem, getScore } = useDietStore();
    const activeLog = logs[today] || {};
    const score = getScore(today);

    const TrackItem = ({
        id,
        label,
        icon: Icon,
        color,
        isNegative = false
    }: {
        id: keyof DailyLog;
        label: string;
        icon: any;
        color: string;
        isNegative?: boolean;
    }) => {
        const isChecked = !!activeLog[id];
        return (
            <TouchableOpacity
                onPress={() => toggleItem(today, id)}
                className={clsx(
                    "flex-row items-center p-4 mb-3 rounded-2xl border-2 transition-all",
                    isChecked
                        ? (isNegative ? "bg-red-50 border-red-500" : "bg-green-50 border-green-500")
                        : "bg-white border-gray-100"
                )}
            >
                <View className={clsx("p-2 rounded-full mr-4", isChecked ? "bg-white" : "bg-gray-100")}>
                    <Icon size={24} color={color} />
                </View>
                <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-800">{label}</Text>
                    <Text className="text-sm text-gray-500">
                        {isNegative ? "Avoid for better health" : "Daily Goal: 1+ Serving"}
                    </Text>
                </View>
                <View className={clsx(
                    "w-8 h-8 rounded-full items-center justify-center border",
                    isChecked
                        ? (isNegative ? "bg-red-500 border-red-500" : "bg-green-500 border-green-500")
                        : "border-gray-300"
                )}>
                    {isChecked && <Check size={18} color="white" />}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <ScrollView className="flex-1 bg-gray-50">
            <View className="p-6 pt-8 bg-white rounded-b-3xl shadow-sm mb-6">
                <Text className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">Today's Progress</Text>
                <View className="flex-row justify-between items-end">
                    <Text className="text-3xl font-bold text-gray-900">Mediterranean Score</Text>
                    <View className="items-end">
                        <Text className={clsx(
                            "text-4xl font-black",
                            score >= 6 ? "text-green-600" : "text-yellow-600"
                        )}>{score}/10</Text>
                    </View>
                </View>
                <View className="h-2 bg-gray-100 rounded-full mt-4 overflow-hidden">
                    <View
                        className={clsx("h-full rounded-full transition-all", score >= 6 ? "bg-green-500" : "bg-yellow-500")}
                        style={{ width: `${(score / 10) * 100}%` }}
                    />
                </View>
            </View>

            <View className="px-5 pb-10">
                <Text className="text-xl font-bold text-gray-800 mb-4 px-1">Foods to Eat ✅</Text>

                <TrackItem id="oliveOil" label="Olive Oil" icon={Droplets} color="#EAB308" />
                <TrackItem id="vegetables" label="Vegetables (2+ serv)" icon={Leaf} color="#16A34A" />
                <TrackItem id="fruit" label="Fruits (2+ serv)" icon={Apple} color="#EA580C" />
                <TrackItem id="wholeGrains" label="Whole Grains" icon={Wheat} color="#D97706" />
                <TrackItem id="nuts" label="Nuts & Seeds" icon={Leaf} color="#854D0E" />
                <TrackItem id="fish" label="Fish / Seafood" icon={Fish} color="#2563EB" />
                <TrackItem id="legumes" label="Legumes / Beans" icon={Leaf} color="#65A30D" />

                <Text className="text-xl font-bold text-gray-800 mt-6 mb-4 px-1">Foods to Limit ⚠️</Text>

                <TrackItem id="redMeat" label="Red Meat" icon={Beef} color="#DC2626" isNegative />
                <TrackItem id="processedMeat" label="Processed Meat" icon={Beef} color="#991B1B" isNegative />
                <TrackItem id="soda" label="Sugary Drinks" icon={Candy} color="#DB2777" isNegative />
            </View>
        </ScrollView>
    );
}
