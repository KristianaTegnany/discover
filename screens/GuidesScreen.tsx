import * as React from "react";
var Parse = require("parse/react-native");
import GuideComponent from "../components/GuideComponent";
import { ActivityIndicator, FlatList, Route, StyleSheet } from "react-native";
import _ from "lodash";
import { Text, View } from "../components/Themed";
import { NavigationScreenProp, NavigationState } from "react-navigation";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import { ScrollView, TouchableWithoutFeedback } from "react-native-gesture-handler";
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
  const backgroundColor = useThemeColor(
    { light: "white", dark: "black" },
    "background"
  );
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
  },[]);

  async function getGuides() {
    await Parse.Cloud.run("getGuides")
      .then((response: any) => {
        setGuidesList(response);
      })
      .catch((error: any) => console.log(error));
  }

  //  const colors =useThemeColor({ light: 'lightColors', dark: 'darkColors' }, 'text');

  return (
    <ScrollView style={{backgroundColor:backgroundColor}}>
        {!guides && (
          <View style={styles.wrapindicator}>
            <ActivityIndicator size="large" color="#F50F50" />
          </View>
        )}

<Text style={{fontFamily:'geometria-bold', color:textColor, fontSize:25,paddingTop:50, marginHorizontal:20,lineHeight: 25}}>
            Découvrez les hommes et les femmes en cuisine</Text>
        <FlatList
          style={styles.FlatList}
          data={guides}
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
                style={styles.guideComponent}
              ></GuideComponent>
            </TouchableWithoutFeedback>
          )}
        />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //width: '95%',

    // alignItems: 'left',
    //justifyContent: 'center',
    //  backgroundColor: "rgba(255,255,255,1)"
  },
  container2: {
    // flex: 1,
    width: "100%",

    // alignItems: 'left',
    //justifyContent: 'center',
    //  backgroundColor: "rgba(255,255,255,1)"
  },
  FlatList: {
    marginTop: 20,

    width: "100%",
    marginLeft: 0,
    paddingLeft: 0,
    // justifyContent: "flex-start",
    // justifyContent: 'center',
    //  backgroundColor: "rgba(255,255,255,1)"
  },
  guideComponent: {
    // height: 120,
    //  alignSelf: "stretch",
    //   backgroundColor: "rgba(255,255,255,1)"
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
    flex: 1,
    //   marginTop: 23
  },
  postSection_contentContainerStyle: {
    height: 600,
    justifyContent: "flex-start",
  },
  rect: {
    top: 4,
    //   left: 4,
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
    fontFamily: "geometria-bold",
    //   fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  item: {
    // padding: 10,
    fontSize: 18,
    height: 44,
  },
});
export default GuidesScreen;
