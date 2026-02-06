import { Stack } from 'expo-router';
import DietScreen from '../../src/features/prevention/diet/DietScreen';

export default function DietRoute() {
  return (
    <>
      <Stack.Screen options={{ title: 'Diet Tracker', headerBackTitle: 'Home' }} />
      <DietScreen />
    </>
  );
}
