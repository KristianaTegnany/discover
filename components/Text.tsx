import * as React from "react";
import { Text } from "react-native";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";

export default function MyText(props: any) {
  const textColor = useThemeColor({ light: "black", dark: "white" }, "text");

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
    <Text
      {...props}
      style={[
        props.style,
        {
          fontFamily:
            props.style?.fontWeight === "bold"
              ? "geometria-bold"
              : "geometria-regular",
          color: props.style?.color ? props.style?.color : textColor,
        },
      ]}
    >
      {props.children}
    </Text>
  );
}
