import { Pressable, Text, View, StyleSheet } from "react-native";
import { useColorScheme } from "nativewind";

const themes: ("light" | "dark" | "system")[] = ["light", "dark", "system"];

export default function ToggleTheme() {
  const { colorScheme, setColorScheme } = useColorScheme();

  return (
    <View style={styles.container}>
      {themes.map((theme) => {
        const active = colorScheme === theme;
        return (
          <Pressable
            key={theme}
            onPress={() => setColorScheme(theme)}
            style={[
              styles.option,
              active ? styles.optionActive : styles.optionInactive,
            ]}
          >
            <Text
              style={[
                styles.label,
                active ? styles.labelActive : styles.labelInactive,
              ]}
            >
              {theme.charAt(0).toUpperCase() + theme.slice(1)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "83%", // w-5/6
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#888",
  },
  option: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  optionInactive: {
    backgroundColor: "transparent",
  },
  optionActive: {
    backgroundColor: "#2563eb", // Tailwind blue-600
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
  labelInactive: {
    color: "#444",
  },
  labelActive: {
    color: "white",
  },
});
