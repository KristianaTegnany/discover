import React from 'react'
import {
    ActivityIndicator,
    StyleSheet,
    View
} from 'react-native'

const Loading = () => (
    <View style={styles.container}>
      <View style={styles.content}/>
      <ActivityIndicator color="white" style={styles.loader}/>
    </View>
)

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 100001
    },
    content: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 100002,
        backgroundColor: 'black',
        opacity: 0.5
    },
    loader: { top: "49%", zIndex: 100003 }
})

export default Loading