import React, { Component } from "react";
import { StyleSheet, Image, Dimensions, ImageBackground } from "react-native";
import { Text, View } from "./Themed";
import moment from "moment";

function PostComponent(props: any) {
  return (

    
    <View style={[styles.container, props.style]}>
      <ImageBackground
        source={{
          uri: props.imgUrl ||'',
        }}
        imageStyle={{ borderRadius: 17 }}
        style={styles.image}
      >
        <View style={styles.postHeader}>
        <Text style={styles.postDetails}>{props.resto || "nondef"} - {props.city || "nondef"} </Text>

          <Text style={styles.postTitle}>{props.titleevent || "nondef"}</Text>
          <Text style={styles.postDetails}>{moment(props.dateevent).format("dddd DD MMM") || "nondef"} - {moment(props.dateevent).format("HH:mm") || "nondef"}</Text>

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
    height: 500,
    borderRadius: 17,
    padding: 20,
    marginHorizontal: 20,
  },

  postTitle: {
    fontSize: 17,
    fontFamily: "geometria-bold",
    marginTop: 5,
    color: "white",
    flexWrap: "wrap",
    marginRight:10,

  },
  postDetails: {
    fontSize: 15,
    fontFamily: "geometria-regular",
    color: "white",
    marginRight:10,

  },
});

export default PostComponent;
