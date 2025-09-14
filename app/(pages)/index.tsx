import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { Audio } from 'expo-av';
import Colors from '@/constants/Colors';

export default function HomePage() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [playbackObject, setPlaybackObject] = useState<Audio.Sound | null>(null);

  const startRecording = async () => {
    try {
      // Request audio permissions
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access microphone is required to record audio!');
        return;
      }

      // Configure and start the recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
      console.log('Recording started');
    } catch (error) {
      console.error('Failed to start recording', error);
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    if (!recording) {
      console.warn('No recording in progress.');
      return;
    }
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecordingUri(uri);
    setRecording(null); // Clear recording state
    console.log('Recording stopped and stored at', uri);
  };

  const playRecording = async () => {
    if (!recordingUri) {
      console.warn('No recording available to play.');
      return;
    }
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: recordingUri },
        { shouldPlay: true }
      );
      setPlaybackObject(sound);
      await sound.playAsync();
      console.log('Playback started');

      // Unload sound when it finishes playing
      sound.setOnPlaybackStatusUpdate(status => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
          setPlaybackObject(null);
          console.log('Playback finished');
        }
      });
    } catch (error) {
      console.error('Failed to play sound', error);
    }
  };

  // UI rendering based on state
  const renderScreenContent = () => {
    if (isRecording) {
      // Show audio waves while recording
      return (
        <View className="w-screen flex flex-row space-x-2 justify-center items-center h-20">
          <View className="w-2 h-16 bg-blue-500 rounded-full animate-pulse-wave" />
          <View className="w-2 h-12 bg-blue-500 rounded-full animate-pulse-wave" />
          <View className="w-2 h-20 bg-blue-500 rounded-full animate-pulse-wave" />
          <View className="w-2 h-14 bg-blue-500 rounded-full animate-pulse-wave" />
          <View className="w-2 h-18 bg-blue-500 rounded-full animate-pulse-wave" />
        </View>
      );
    } else if (recordingUri) {
      // Show audio player after recording
      return (
        <Pressable
          onPress={playRecording}
          className="bg-gray-200 dark:bg-gray-700 p-4 rounded-full flex-row items-center justify-center"
        >
          <MaterialIcons name="play-arrow" size={32} color={Colors[colorScheme ?? 'light'].text} />
          <Text className="ml-2 text-black dark:text-white">Play Recording</Text>
        </Pressable>
      );
    } else {
      // Default dummy content
      return (
        <Text className="text-center text-black dark:text-white text-lg font-bold">
          What's the problem? Ask me anything!
        </Text>
      );
    }
  };

  return (
    <SafeAreaView className="h-screen flex bg-white/95 dark:bg-black">
      <View className='w-screen flex justify-center items-end px-4' id='header'>
        <Pressable onPress={() => router.push('/(pages)/settings')}>
          <View>
            <MaterialIcons name="settings" size={32} color={Colors[colorScheme ?? 'light'].text} />
          </View>
        </Pressable>
      </View>
      
      {/* Dynamic Screen View */}
      <View className="mt-2 mx-5 items-center flex-1 justify-center" id='screen'>
        {renderScreenContent()}
      </View>

      {/* Voice Button */}
      <View id='voice-button' className="flex h-fit items-center justify-end p-8">
        <Pressable
          onPress={isRecording ? stopRecording : startRecording}
          className={`
            w-32 h-32 rounded-full items-center justify-center
            ${isRecording ? 'bg-red-500' : 'dark:bg-white/90 bg-black/90'}
          `}
        >
        </Pressable>
      </View>
    </SafeAreaView>
  );
}