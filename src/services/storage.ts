import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// For non-sensitive data, we might use AsyncStorage, but for medical apps
// defaulting to SecureStore for user-identifiable info is safer on mobile.
// For large datasets (like food logs), we will use SQLite later.

export async function saveSecure(key: string, value: string) {
    if (Platform.OS === 'web') {
        // Fallback for web (not secure, but for dev)
        localStorage.setItem(key, value);
        return;
    }
    await SecureStore.setItemAsync(key, value);
}

export async function getSecure(key: string) {
    if (Platform.OS === 'web') {
        return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
}

export async function deleteSecure(key: string) {
    if (Platform.OS === 'web') {
        localStorage.removeItem(key);
        return;
    }
    await SecureStore.deleteItemAsync(key);
}

export const KEYS = {
    HAS_SEEN_DISCLAIMER: 'guardian_has_seen_disclaimer_v1',
    USER_PROFILE: 'guardian_user_profile',
};
