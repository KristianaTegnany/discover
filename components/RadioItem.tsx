import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { RadioButton } from "react-native-paper";

interface IProps {
  checked: boolean
  setChecked: () => void
  title: string
}

const RadioItem = (props: IProps) => {
  const { checked, setChecked, title } = props;
  return (
    <View
      style={styles.container}
    >
      <RadioButton.Android
        onPress={setChecked}
        color="#F50F50"
        uncheckedColor='black'
        status={checked ? "checked" : "unchecked"}
      />
      <Text
        style={{
          fontSize: 18,
        }}
      >
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginRight: 10,
    flexDirection: "row",
    alignItems: "center",
  }
})
export default RadioItem;
