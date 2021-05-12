import React, { Component, useEffect, useState } from "react";
import Swiper from "react-native-deck-swiper";
import {
  Button,
  ImageBackground,
  Route,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Card } from "react-native-elements/dist/card/Card";
import { NavigationScreenProp, NavigationState } from "react-navigation";
import { flatten } from "lodash";
var Parse = require("parse/react-native");

interface NavigationParams {
  text: string;
}
type Navigation = NavigationScreenProp<NavigationState, NavigationParams>;

interface Props {
  navigation: Navigation;
  route: Route;
}

export const loveScreen = ({ route, navigation }: Props) => {
  const [cards, setCards] = useState<
    [
      {
        id: string;
        name: string;
        imageUrl: string;
        style: string;
      }
    ]
  >();
  const [swipedAllCards, setSwipedAllCards] = useState(false);
  // const [cardIndex, setcardIndex] = useState(0);

  async function getIntcusts() {
    let subscription = await Parse.Cloud.run("getIntcustsDiscover");
    subscription = subscription.map((intcust: any) => ({
      imageUrl: { uri: intcust.attributes.overviewpic._url } || "",
      name: intcust.attributes.corporation || "",
      style: intcust.attributes.style || "",
      id: intcust.id || "",
    }));
    setCards(subscription);
  }

  useEffect(() => {
    getIntcusts();
  }, []);

  async function onSwiped(type: any) {
    return console.log(`on swiped ${type}`);
  }

  async function gotoResto(index: number) {
    if (cards) {
      navigation.navigate("RestoScreen", { restoId: cards[index].id });
    }
    return console.log(`on swiped right`);
  }

  async function onSwipedAllCards() {
    setSwipedAllCards(true);
  }

  return (
    <View>
      {cards !== undefined && cards !== null && (
        <View style={styles.container}>
          <Swiper
            // ref={useSwiper}
            //  keyExtractor={card.title}
            onSwiped={() => onSwiped("general")}
            //   onSwipedLeft={() => onSwiped('left')}
            onSwipedRight={(cardIndex) => gotoResto(cardIndex)}
            //   onSwipedTop={() => this.onSwiped('top')}
            backgroundColor={"transparent"}
            onSwipedBottom={() => onSwiped("bottom")}
            //    onTapCard={swipeLeft}
            verticalSwipe={false}
            //  swipeBackCard={true}
            cards={cards}
            //    cardIndex={cardIndex}
            infinite={true}
            stackSize={2}
            cardVerticalMargin={80}
            renderCard={(card: any, index: any) => {
              {
                return (
                  <View style={styles.card}>
                    {card && card.name && card.imageUrl && (
                      <ImageBackground
                        source={card.imageUrl}
                        imageStyle={{ borderRadius: 17 }}
                        style={styles.image}
                      >
                        <View style={styles.wrapperTexts}>
                          <Text style={styles.text}>{card.name} </Text>
                          <Text style={styles.subtitle}>{card.style}</Text>
                        </View>
                      </ImageBackground>
                    )}
                  </View>
                );
              }
            }}
            onSwipedAll={onSwipedAllCards}
            //          infinite={false}
            stackSeparation={15}
            overlayLabels={{
              bottom: {
                title: "BLEAH",
                style: {
                  label: {
                    backgroundColor: "black",
                    borderColor: "black",
                    color: "white",
                    borderWidth: 1,
                  },
                  wrapper: {
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                },
              },
              left: {
                title: "Pas aujourd'hui",
                style: {
                  label: {
                    //  backgroundColor: 'black',
                    borderColor: "black",
                    //  color: 'white',
                    fontSize: 10,
                    borderWidth: 1,
                  },
                  wrapper: {
                    flexDirection: "column",
                    alignItems: "flex-end",
                    justifyContent: "flex-start",
                    marginTop: 30,
                    marginLeft: -30,
                  },
                },
              },
              right: {
                title: "Pourquoi pas !",
                style: {
                  label: {
                    //    backgroundColor: 'black',
                    borderColor: "black",
                    //  color: 'white',
                    fontSize: 10,
                    fontFamily: "geometria-regular",
                    borderWidth: 1,
                  },
                  wrapper: {
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    marginTop: 30,
                    marginLeft: 30,
                  },
                },
              },
              top: {
                title: "SUPER LIKE",
                style: {
                  label: {
                    backgroundColor: "black",
                    borderColor: "black",
                    color: "white",
                    borderWidth: 1,
                  },
                  wrapper: {
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                },
              },
            }}
            animateOverlayLabelsOpacity
            animateCardOpacity
            swipeBackCard
          ></Swiper>
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,

    //  backgroundColor: '#fff'
  },
  card: {
    flex: 1,
    borderRadius: 30,
    //  borderWidth: 1,
    borderColor: "white",
    // justifyContent: 'center',
    backgroundColor: "white",
    // alignItems : "flex-end",
    // flexDirection:'column'
  },
  wrapperTexts: {
    height: "100%",
    // alignItems : "flex-end",
    justifyContent: "flex-end",
    paddingBottom: 30,
  },
  subtitle: {
    fontFamily: "geometria-regular",
    fontSize: 20,
    color: "white",
    paddingLeft: 10,
  },
  text: {
    textAlign: "left",
    //marginLeft: 20,
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "geometria-bold",
    backgroundColor: "transparent",
    color: "white",
    paddingTop: 10,
    paddingLeft: 10,

    //  justifyContent: 'flex-end',

    // alignSelf:"flex-end"
  },
  image: {
    flex: 1,
    borderRadius: 20,
  },
  done: {
    textAlign: "center",
    fontSize: 30,
    color: "white",
    backgroundColor: "transparent",
  },
});

export default loveScreen;
