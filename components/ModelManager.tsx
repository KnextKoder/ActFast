import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ActivityIndicator, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { models } from '@/constants/models';
import { useColorScheme } from 'nativewind';

type ModelKey = keyof typeof models;

function bytesToMB(bytes: number) {
  return (bytes / (1024 * 1024)).toFixed(2);
}

export default function ModelManager() {
  const { colorScheme } = useColorScheme();
  const [downloading, setDownloading] = useState<Record<string, boolean>>({});
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [exists, setExists] = useState<Record<string, boolean>>({});

  useEffect(() => {
    (async () => {
      const checks: Record<string, boolean> = {};
      for (const key of Object.keys(models) as ModelKey[]) {
        const local = getLocalPath(key);
        const info = await FileSystem.getInfoAsync(local);
        checks[key] = info.exists ?? false;
      }
      setExists(checks);
    })();
  }, []);

  const getLocalPath = (key: ModelKey) => {
    const filename = key + '_' + models[key].split('/').pop()?.split('?')[0];
    return `${FileSystem.documentDirectory}models/${filename}`;
  };

  const ensureModelsDir = async () => {
    const dir = `${FileSystem.documentDirectory}models`;
    const info = await FileSystem.getInfoAsync(dir);
    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    }
  };

  const downloadModel = async (key: ModelKey) => {
    try {
      await ensureModelsDir();
      setDownloading(prev => ({ ...prev, [key]: true }));
      setProgress(prev => ({ ...prev, [key]: 0 }));
      const uri = models[key];
      const local = getLocalPath(key);

      const callback = (downloadProgress: FileSystem.DownloadProgressData) => {
        const prog = downloadProgress.totalBytesExpectedToWrite
          ? downloadProgress.totalBytesWritten /
            downloadProgress.totalBytesExpectedToWrite
          : 0;
        setProgress(prev => ({ ...prev, [key]: prog }));
      };

      const downloadResumable = FileSystem.createDownloadResumable(
        uri,
        local,
        {},
        callback
      );
      const result = await downloadResumable.downloadAsync();
      if (result && 'status' in result && (result.status === 200 || result.status === 0)) {
        setExists(prev => ({ ...prev, [key]: true }));
      }
    } catch (err) {
      console.error('Download failed', err);
      Alert.alert('Download failed', String(err));
    } finally {
      setDownloading(prev => ({ ...prev, [key]: false }));
      setProgress(prev => ({ ...prev, [key]: 0 }));
    }
  };

  const deleteModel = async (key: ModelKey) => {
    try {
      const local = getLocalPath(key);
      const info = await FileSystem.getInfoAsync(local);
      if (info.exists) {
        await FileSystem.deleteAsync(local, { idempotent: true });
        setExists(prev => ({ ...prev, [key]: false }));
      } else {
        Alert.alert('Not found', 'Model file not found locally');
      }
    } catch (err) {
      console.error('Delete failed', err);
      Alert.alert('Delete failed', String(err));
    }
  };

  return (
    <View className="w-full px-4">

      {Object.keys(models).map(key => {
        const k = key as ModelKey;
        const local = getLocalPath(k);
        const prog = progress[k] ?? 0;
        const isDownloading = downloading[k] ?? false;
        const has = exists[k] ?? false;

        return (
          <View
            key={k}
            className="w-full mb-5 rounded-2xl border shadow-sm p-5 bg-white dark:bg-black"
            style={{
            //   backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#fff',
              borderColor: colorScheme === 'dark' ? '#2c2c2e' : '#e5e7eb',
            }}
          >
            {/* Header */}
            <View className="mb-2">
              <Text className="text-lg font-semibold text-black dark:text-white">
                {k.toUpperCase()}
              </Text>
              {/* <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {models[k]}
              </Text> */}
            </View>

            {/* Progress */}
            {isDownloading && (
              <View className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
                <View
                  className="h-full bg-blue-500"
                  style={{ width: `${Math.round(prog * 100)}%` }}
                />
              </View>
            )}

            {/* Actions */}
            <View className="flex-row space-x-3 gap-3">
              <Pressable
                onPress={() => downloadModel(k)}
                disabled={isDownloading || has}
                className={`flex-1 py-3 rounded-xl items-center ${
                  has
                    ? 'bg-green-500'
                    : isDownloading
                    ? 'bg-gray-400'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600'
                }`}
              >
                {isDownloading ? (
                  <View className="flex-row items-center">
                    <ActivityIndicator color="#fff" />
                    <Text className="ml-2 text-black dark:text-white font-medium">
                      {Math.round(prog * 100)}%
                    </Text>
                  </View>
                ) : (
                  <Text className="text-black dark:text-white font-semibold">
                    {has ? '✅ Downloaded' : '⬇️ Download'}
                  </Text>
                )}
              </Pressable>

              <Pressable
                onPress={() => deleteModel(k)}
                disabled={isDownloading || !has}
                className={`flex-1 py-3 rounded-xl items-center ${
                  isDownloading || !has ? 'bg-white/10 dark:bg-black' : 'bg-red-500'
                }`}
              >
                <Text className="text-black dark:text-white font-semibold">🗑 Delete</Text>
              </Pressable>
            </View>

            {/* Footer */}
            {has && (
              <Text className="text-xs text-gray-400 dark:text-gray-500 mt-3">
                Stored at: {local}
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
}
