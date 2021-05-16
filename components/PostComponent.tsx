import React, { Component } from "react";
import { StyleSheet, Image, Dimensions } from "react-native";
import { Text, View } from "./Themed";

function PostComponent(props: any) {
  return (
    <View style={[styles.container, props.style]}>
      <View style={styles.postWrapper}>
        <View style={styles.postHeader}>
          <Image
            source={{
              uri: props.imgUrl,
            }}
            resizeMode="cover"
            style={styles.image}
          ></Image>
          <View style={styles.headerGroup}>
            <View style={styles.postTitleWrap}>
              <Text
                style={styles.postTitle}
                lightColor="rgba(0,0,0,0.8)"
                darkColor="rgba(255,255,255,0.8)"
              >
                {props.corponame || "nondef"}{" "}
              </Text>
            </View>
            <Text style={styles.postDetailsK}>{props.StyleK || "Nondef"} </Text>
            <Text style={styles.postDetailsCity}>
              {props.city || "Nondef"}{" "}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 30,
    width: "100%",
  },
  postWrapper: {
    marginTop: 90,
    height: 200,
    // alignItems: "flex-start",
    justifyContent: "space-around",
    width: "100%",
  },

  postHeader: {
    width: "100%",
    height: 230,

    alignSelf: "center",
    justifyContent: "center",
    marginRight: 0,
    marginLeft: 0,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 17,
    padding: 0
  },
  headerGroup: {
    width: "100%",
    height: 100,
    marginTop: 5,
    marginLeft: 10,
  },
  postTitleWrap: {
    flexDirection: "row",
    width: '100%',
  },
  postTitle: {
    fontSize: 22,
    flexWrap: "wrap",
    fontFamily: "geometria-bold",
    //  marginTop:30,
    // justifyContent: 'center', //Centered vertically
    // color: "#fff",
  },
  postDetails: {
    color: "#808080",
    fontSize: 12,
    fontFamily: "geometria-regular",
    //  letterSpacing: 1,
    //  alignSelf: "baseline"
  },
  postDetailsK: {
    color: "#808080",
    fontSize: 18,
    fontFamily: "geometria-regular",
    //  letterSpacing: 1,
    // fontStyle:"italic",
    // alignSelf: "baseline"
  },
  postDetailsCity: {
    color: "#808080",
    fontSize: 16,
    fontFamily: "geometria-regular",
    //   letterSpacing: 1,
    alignSelf: "baseline",
  },
  moreIcon: {
    color: "grey",
    fontSize: 18,
  },
});

export default PostComponent;
