import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
    visible: boolean;
    onAccept: () => void;
}

export function MedicalDisclaimerModal({ visible, onAccept }: Props) {
    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View className="flex-1 bg-black/50 justify-center items-center p-4">
                <View className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-xl">
                    <SafeAreaView className="bg-red-500 p-4">
                        <Text className="text-white text-lg font-bold text-center">
                            ⚠️ IMPORTANT MEDICAL DISCLAIMER
                        </Text>
                    </SafeAreaView>

                    <ScrollView className="p-6 max-h-[400px]">
                        <Text className="text-gray-800 text-base mb-4 leading-6">
                            The "NxtCure" application is for <Text className="font-bold">informational and educational purposes only</Text>.
                        </Text>

                        <Text className="text-gray-800 text-base mb-4 leading-6">
                            It does NOT provide medical advice, diagnosis, or treatment. The content available through this app is not a substitute for professional medical advice, diagnosis, or treatment.
                        </Text>

                        <Text className="text-gray-800 text-base mb-4 leading-6">
                            <Text className="font-bold">Always seek the advice of your physician</Text> or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on this app.
                        </Text>

                        <Text className="text-gray-800 text-base mb-4 leading-6">
                            If you think you may have a medical emergency, call your doctor or emergency services immediately.
                        </Text>
                    </ScrollView>

                    <View className="p-4 border-t border-gray-100 bg-gray-50">
                        <TouchableOpacity
                            onPress={onAccept}
                            className="bg-blue-600 p-4 rounded-xl items-center active:opacity-90"
                        >
                            <Text className="text-white font-semibold text-lg">
                                I Understand & Agree
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
