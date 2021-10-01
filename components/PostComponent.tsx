import React from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { Text, View } from "./Themed";
import { Image } from 'react-native-elements'

function PostComponent(props: any) {
  return (
    <View style={[styles.container, props.style]}>
      <View style={styles.postWrapper}>
        <View style={styles.imageWrapper}>
          <Image
            source={{
              uri: props.imgUrl,
            }}
            resizeMode="cover"
            style={[
              styles.image,
              {
                opacity:
                  props.deliveryOpen == false &&
                    props.resaOpen == false &&
                    props.takeawayOpen == false
                    ? 0.3
                    : 1,
              },
            ]}
            PlaceholderContent={<ActivityIndicator color="black" />}
          />
        </View>
        <View style={styles.postHeader}>
          <Text
            style={[styles.postTitle]}
            lightColor="rgba(0,0,0,0.8)"
            darkColor="rgba(255,255,255,0.8)"
          >
            {props.corponame || "nondef"} {props.resaOpen == true}
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.postDetailsK}>{props.StyleK || "Nondef"} </Text>
            {props.deliveryOpen == false &&
              props.resaOpen == false &&
              props.takeawayOpen == false && (
                <Text style={styles.postDetailsK}>- Bientôt. </Text>
              )}
          </View>
          <Text style={styles.postDetailsCity}>
            {props.city || "Nondef"}
            {" - "}
            {props.country || "Nondef"}{" "}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    height: 320,
    marginTop: 10,
  },
  postWrapper: {
    justifyContent: "space-around",
    width: "100%",
  },
  postHeader: {
    width: "100%",
    marginRight: 0,
    marginTop: 50,
    marginLeft: 0,
    marginBottom: 50,
  },
  image: {
    width: "100%",
    height: 210,
    borderRadius: 9,
    padding: 0,
  },
  headerGroup: {
    width: 200,
    height: 100,
    marginTop: 5,
    marginLeft: 10,
    alignSelf: "center",
    justifyContent: "center",
  },
  postTitleWrap: {
    flexDirection: "row",
    width: "100%",
  },
  postTitle: {
    fontSize: 22,
    flexWrap: "wrap",
    fontFamily: "geometria-bold",
    marginTop: 7,
  },
  postDetails: {
    color: "#808080",
    fontSize: 12,
    fontFamily: "geometria-regular",
  },
  postDetailsK: {
    color: "#808080",
    fontSize: 18,
    fontFamily: "geometria-regular",
  },
  postDetailsCity: {
    color: "#808080",
    fontSize: 16,
    fontFamily: "geometria-regular",
    alignSelf: "baseline",
  },
  imageWrapper: {},
  moreIcon: {
    color: "grey",
    fontSize: 18,
  },
});

export default React.memo(PostComponent);
