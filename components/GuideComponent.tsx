import moment from "moment";
import React, { Component } from "react";
import { StyleSheet, Image, Dimensions, ImageBackground } from "react-native";
import { Text, View } from "./Themed";

function PostComponent(props: any) {
  return (
    <View style={[styles.container, props.style]}>
      <ImageBackground
        source={{
          uri: props.imgUrl,
        }}
        imageStyle={{ borderRadius: 17 }}
        style={styles.image}
      >
        <View style={styles.postHeader}>
          <Text style={styles.postTitle}>{props.corponame || "nondef"} </Text>
          <Text style={{fontFamily:"geometria-regular"}}>{props.categ || "nondef"} -Publié le {moment(props.date).format("DD/MM/YYYY")} </Text>

          {/* <Text style={styles.postDetails}>{props.corponame || "nondef"}</Text> */}
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // alignItems: "center",
    // justifyContent: "space-around",
    marginTop: 30,
    width: "100%",
  },
  postHeader: {
    width: "100%",
    opacity:0.95,
   // flexDirection: "row",
    position: 'absolute',
    bottom:0,  
    paddingLeft:20,
    borderBottomEndRadius:17,
    borderBottomStartRadius:17,
   paddingVertical:20,
    backgroundColor: "#ff5050",
    marginLeft: 0,
  },
  image: {
    width: "100%",
    height: 360,
    borderRadius: 17,
    padding: 20,
    marginHorizontal: 20,
  },

  postTitle: {
    fontSize: 18,
    fontFamily: "geometria-bold",
    marginTop: 5,
    width: "90%",
    //  justifyContent: 'center', //Centered vertically
    color: "white",
    flexWrap: "wrap",
  },
  postDetails: {
    color: "#808080",
    fontSize: 12,
    fontFamily: "geometria-regular",
    //  letterSpacing: 1,
    //  alignSelf: "baseline"
  },
});

export default PostComponent;
