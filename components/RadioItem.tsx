import React from "react";
import { View, StyleSheet } from "react-native";
import { RadioButton } from "react-native-paper";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import Text from './Text';

interface IProps {
  checked: boolean
  setChecked: () => void
  title: string
}

const RadioItem = (props: IProps) => {
  const { checked, setChecked, title } = props;
  const color = useThemeColor({ light: "black", dark: "white" }, "text");

  function useThemeColor(
    props: { light?: string; dark?: string },
    colorName: keyof typeof Colors.light & keyof typeof Colors.dark
  ) {
    const theme = useColorScheme();
    const colorFromProps = props[theme];

    if (colorFromProps) {
      return colorFromProps;
    } else {
      return Colors[theme][colorName];
    }
  }
  return (
    <View
      style={styles.container}
    >
      <RadioButton.Android
        onPress={setChecked}
        color="#F50F50"
        uncheckedColor={color}
        status={checked ? "checked" : "unchecked"}
      />
      <Text
        style={styles.modeText}
      >
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  modeText: {
    fontSize: 14,
    fontFamily: "geometria-regular"
  }
})
export default RadioItem;
