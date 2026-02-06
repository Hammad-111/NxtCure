const fs = require('fs');
try {
    const plugin = require('react-native-worklets/plugin');
    console.log('Success: Found plugin');
} catch (e) {
    console.error('Error:', e);
}
