import { View, Text } from 'react-native';

export default function HomePage() {
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-black">
      <View className="mt-2 mx-5 items-center">
        <Text className="text-center text-blue-500 dark:text-red-500">
          Marvel was here baby
        </Text>
      </View>
    </View>
  );
}
