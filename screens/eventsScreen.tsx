import * as React from "react";
var Parse = require("parse/react-native");
import EventComponent from "../components/EventComponent";
import { ActivityIndicator, FlatList, Route, ScrollView, StyleSheet } from "react-native";
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
    
 
  useEffect(() => {
    //  this.getLocationAsync();
    getEvents();
  })

  async function getEvents() {
    await Parse.Cloud.run("getAllEventsActive")
      .then((response: any) => {
        setEventsList(response)
      
      })
      .catch((error: any) => console.log(error));
  }



 
    //  const colors =useThemeColor({ light: 'lightColors', dark: 'darkColors' }, 'text');

    return (

      <View style={styles.container}>
        <View style={styles.container2}>

          {!events ? (
              <View style={styles.wrapindicator}>
                <ActivityIndicator size="large" color="#F50F50" />
              </View>
            ):null}

          <ScrollView>

          <Text style={{fontFamily:'geometria-bold', fontSize:25,paddingTop:50, marginHorizontal:20,lineHeight: 25}}>
            Découvrez des évènements qui vont vous régaler</Text>
                     <View>

          <FlatList
            style={styles.FlatList}
            data={events}
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
                  imgUrl={item.attributes.image._url}
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
                 // style={styles.eventComponent}
                ></EventComponent>
              </TouchableWithoutFeedback>
            )}
          />             
          </View>
          </ScrollView>
        </View>
      </View> 
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
  guideComponent: {
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
