import React from 'react';
import { ScrollView, Text, View } from 'react-native';

export default function PrivacyScreen() {
    return (
        <ScrollView className="flex-1 bg-white p-6">
            <View className="mb-8">
                <Text className="text-2xl font-bold mb-4 text-gray-900">Privacy Policy</Text>
                <Text className="text-gray-600 mb-2">Last Updated: February 2026</Text>

                <Text className="text-lg font-semibold mt-6 mb-2 text-gray-800">1. Local-First Data</Text>
                <Text className="text-base text-gray-700 leading-6 mb-4">
                    NxtCure is designed with a "Local-First" architecture. This means your personal health data, including:
                    {'\n\n'}• Diet logs
                    {'\n'}• Risk assessment answers
                    {'\n'}• Screening history
                    {'\n'}• Symptom checks
                    {'\n\n'}
                    ...are stored securely ON YOUR DEVICE. We do not automatically upload this data to any cloud server. You own your data.
                </Text>

                <Text className="text-lg font-semibold mt-6 mb-2 text-gray-800">2. Medical Disclaimer</Text>
                <Text className="text-base text-gray-700 leading-6 mb-4">
                    This app provides information for educational purposes only. It is not a substitute for professional medical advice. Always consult with a qualified healthcare provider.
                </Text>

                <Text className="text-lg font-semibold mt-6 mb-2 text-gray-800">3. Data Security</Text>
                <Text className="text-base text-gray-700 leading-6 mb-4">
                    We use industry-standard encryption (SecureStore) to protect sensitive identifiers on your device.
                </Text>

                <View className="h-20" />
            </View>
        </ScrollView>
    );
}
