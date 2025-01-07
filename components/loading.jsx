import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
//import LottieView from 'lottie-react-native';
const Loading = () => {
    return (
        <View>
            {/* <LottieView style={{ flex: 1 }} source={require('@/assets/images/loading.json')} autoPlay loop /> */}
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    )
}

export default Loading