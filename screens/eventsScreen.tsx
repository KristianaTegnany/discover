import * as React from "react";
var Parse = require("parse/react-native");
import EventComponent from "../components/EventComponent";
import { ActivityIndicator, FlatList, Platform, Route, SafeAreaView, StyleSheet } from "react-native";
import _ from "lodash";
import { Text, View } from "../components/Themed";
import { NavigationScreenProp, NavigationState } from "react-navigation";

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

export const eventsScreen = ({ route, navigation }: Props) => {

  const [events, setEventsList] = useState();
  const [size, setSize] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    getEvents();
  }, [])

  async function getEvents() {
    await Parse.Cloud.run("getAllEventsActive")
      .then((response: any) => {
        setEventsList(response)
        setSize(response.length)
        setShow(true)
      })
      .catch((error: any) => console.log(error));
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
        <View>
          <Text style={{ fontFamily: 'geometria-bold', fontSize: 25, paddingTop: Platform.OS === 'ios' ? 50 : 40, marginHorizontal: 20, lineHeight: 25 }}>
            Découvrez des évènements qui vont vous régaler </Text>
          {size == 0 &&
            <Text style={{ fontFamily: 'geometria-bold', fontSize: 10, paddingTop: 50, marginHorizontal: 20, lineHeight: 25 }}>
              De nouveaux évènements arrivent bientôt ;-)</Text>
          }
          {size > 0 &&
            <FlatList
              style={styles.FlatList}
              data={events}
              contentContainerStyle={{ paddingBottom: 120 }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableWithoutFeedback
                  onPress={() => {
                    navigation.navigate("eventScreen", {
                      text: "Hello!",
                      eventId: item.id,
                    });
                  }}
                >
                  <EventComponent
                    imgUrl={item?.attributes.image?._url || ''}
                    onPress={() => {
                      navigation.navigate("eventScreen", {
                        text: "Hello!",
                        eventId: item.id,
                      });
                    }}
                    resto={item.attributes.intcust.attributes.corporation}
                    dateevent={item.attributes.date}
                    city={item.attributes.intcust.attributes.cityvenue}
                    titleevent={item.attributes.title}
                  />
                </TouchableWithoutFeedback>
              )}
            />}
        </View>
      }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container2: {
    width: "100%",
  },
  FlatList: {
    marginTop: 20,
    width: "100%",
    marginLeft: 0,
    paddingLeft: 0,
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
    fontFamily: "geometria-bold",
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

export default eventsScreen;
