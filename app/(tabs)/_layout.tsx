import { Pressable } from 'react-native';
import { Link, Stack } from 'expo-router';
import { useColorScheme } from 'nativewind';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import Colors from '@/constants/Colors';

export default function StackLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <Stack
      screenOptions={{
        // Use theme tint for header elements
        headerShown: false,
        headerTintColor: Colors[colorScheme ?? 'light'].tint,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
          title: 'Home',
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: 'Settings',
        }}
      />
    </Stack>
  );
}
