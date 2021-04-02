import React, { Component } from "react";
import { StyleSheet, View, Image, Text, Dimensions } from "react-native";

function PostComponent(props :any) {
  return (
    <View style={[styles.container, props.style]}>
      <View style={styles.postWrapper}
      
      >
        <View style={styles.postHeader} >
          <Image
            source={{
              uri: props.imgUrl ,
            }}
            resizeMode="cover"
            style={styles.image}
            
          ></Image>
          <View style={styles.headerGroup}>
            <Text style={styles.postTitle}>{props.corponame || "nondef"} </Text>
            <Text style={styles.postDetailsK}>
              {props.StyleK || "Nondef"}            </Text>
              <Text style={styles.postDetailsCity}>
              {props.city || "Nondef"}   </Text>

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
    marginTop:30,
    width:'100%'
  },
  postWrapper: {
    marginTop:90,
    height: 230,
   // alignItems: "flex-start",
    justifyContent: "space-around",
    width: '100%',
  //  marginLeft:8

  },
  postHeader: {
    width: 321,
    height: 230,
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "space-between",
    marginRight: 0,
    marginLeft: 0
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: 17,
    padding: 0,
    margin: 7
  },
  headerGroup: {
    width: "100%",
    height: 90,
    justifyContent: 'center', //Centered vertically
    marginLeft: 10,
    flexShrink: 1
  },
  postTitle: {
    fontSize: 24,
    fontFamily: "work-sans-700",
    marginTop:30,
    justifyContent: 'center', //Centered vertically
//  color: "#808080",
    flexWrap:'wrap'

  },
  postDetails: {
    color: "#808080",
    fontSize: 12,
    fontFamily: "work-sans-regular",
  //  letterSpacing: 1,
  //  alignSelf: "baseline"
  },
  postDetailsK: {
    color: "#808080",
    fontSize: 18,
    fontFamily: "work-sans-regular",
  //  letterSpacing: 1,
   // fontStyle:"italic",
   // alignSelf: "baseline"
  },
  postDetailsCity: {
    color: "#808080",
    fontSize: 16,
    fontFamily: "work-sans-regular",
 //   letterSpacing: 1,
    alignSelf: "baseline"
  },
  moreIcon: {
    color: "grey",
    fontSize: 18
  }
});

export default PostComponent;
