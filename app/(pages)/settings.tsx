import { StatusBar } from 'expo-status-bar';
import { Platform, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ToggleTheme from '@/components/ToggleTheme';

export default function SettingsPage() {
  return (
    <SafeAreaView className="flex-1 pt-2 items-center justify-start bg-white dark:bg-black">
      {/* THEME SETTINGS */}
      <View className="flex w-full items-center justify-center my-10 py-2" style={{ gap: 12 }}>
        <ToggleTheme />
      </View>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </SafeAreaView>
  );
}
