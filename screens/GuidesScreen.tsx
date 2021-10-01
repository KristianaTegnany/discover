import * as React from "react";
var Parse = require("parse/react-native");
import GuideComponent from "../components/GuideComponent";
import { ActivityIndicator, FlatList, Platform, Route, StyleSheet } from "react-native";
import _ from "lodash";
import { Text, View } from "../components/Themed";
import { NavigationScreenProp, NavigationState } from "react-navigation";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
interface NavigationParams {
  text: string;
}
type Navigation = NavigationScreenProp<NavigationState, NavigationParams>;
interface Props {
  navigation: Navigation;
  route: Route;
  restaurant: [];
}

export const GuidesScreen = ({ route, navigation }: Props) => {
  const [guides, setGuidesList] = useState();
  const [show, setShow] = useState(false)

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
  useEffect(() => {
    getGuides();
  }, []);

  async function getGuides() {
    await Parse.Cloud.run("getGuides")
      .then((response: any) => {
        setGuidesList(response);
        setShow(true)
      })
      .catch((error: any) => console.log(error));
  }

  return (
    <View>
      {show == false &&
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size="large" color="grey" />
        </View>
      }
      {show == true &&
        <>
          <Text style={{ fontFamily: 'geometria-bold', color: textColor, fontSize: 25, paddingTop: Platform.OS === 'ios' ? 50 : 40, marginHorizontal: 20, lineHeight: 25 }}>
            Découvrez les hommes et les femmes en cuisine</Text>
          <FlatList
            style={styles.FlatList}
            data={guides}
            contentContainerStyle={{ paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableWithoutFeedback
                onPress={() => {
                  navigation.navigate("GuideScreen", {
                    text: "Hello!",
                    guideId: item.id,
                  });
                }}
              >
                <GuideComponent
                  imgUrl={item.attributes.FrontPic._url}
                  onPress={() => {
                    navigation.navigate("GuideScreen", {
                      text: "Hello!",
                      guideId: item.id,
                    });
                  }}
                  corponame={item.attributes.title}
                  categ={item.attributes.category || ""}
                  date={item.attributes.createdAt || ""}

                  city={item.attributes.cityvenue}
                  StyleK={item.attributes.style}
                ></GuideComponent>
              </TouchableWithoutFeedback>
            )}
          />
        </>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  container2: {
    width: "100%"
  },
  FlatList: {
    marginTop: 20,
    width: "100%",
    marginLeft: 0,
    paddingLeft: 0
  },
  wrapindicator: {
    alignItems: "center",
    height: "100%",
    justifyContent: "center",
  },
  searchHeader: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderRadius: 10,
    width: "83%",
    backgroundColor: "#fff",
    marginTop: 0,
    marginRight: "auto",

    marginLeft: "auto",
    paddingRight: 20,
    marginBottom: 10,
    alignSelf: "baseline",
  },
  searchIcon: {
    color: "grey",
    fontSize: 20,
    marginLeft: 5,
    marginRight: 1,
  },
  searchInput: {
    width: 239,
    height: 40,
    color: "#000",
    marginRight: 1,
    marginLeft: 5,
    fontSize: 14,
    fontFamily: "geometria-regular",
  },
  postSection: {
    flex: 1
  },
  postSection_contentContainerStyle: {
    height: 600,
    justifyContent: "flex-start",
  },
  rect: {
    top: 4,
    width: 352,
    height: 107,
    position: "absolute",
    backgroundColor: "#E6E6E6",
    borderRadius: 25,
  },
  bigTitle: {
    fontFamily: "geometria-regular",
    height: 60,
    width: "83%",
    fontSize: 16,
    marginTop: 20,
    marginBottom: 0,
    marginLeft: "auto",
    marginRight: "auto",
  },
  title: {
    fontSize: 20,
    fontFamily: "geometria-bold"
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  item: {
    fontSize: 18,
    height: 44,
  },
});
export default GuidesScreen;
