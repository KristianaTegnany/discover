import moment from "moment";
import React from "react";
import { StyleSheet, ImageBackground } from "react-native";
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
          <Text style={{ fontFamily: "geometria-regular" }}>{props.categ || "nondef"} -Publié le {moment(props.date).format("DD/MM/YYYY")} </Text>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    width: "100%",
  },
  postHeader: {
    width: "100%",
    opacity: 0.95,
    position: 'absolute',
    bottom: 0,
    paddingLeft: 20,
    borderBottomEndRadius: 17,
    borderBottomStartRadius: 17,
    paddingVertical: 20,
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
    color: "white",
    flexWrap: "wrap",
  },
  postDetails: {
    color: "#808080",
    fontSize: 12,
    fontFamily: "geometria-regular"
  },
});

export default PostComponent;
