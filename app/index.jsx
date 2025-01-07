import { ActivityIndicator, ImageBackground, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { hp } from '@/utils/utils';
const StartPage = () => {

    //const image = { uri: 'https://legacy.reactjs.org/logo-og.png' };
    const image = require('@/assets/images/bg-wallpaper-1.png');
    return (
        <ImageBackground source={image} resizeMode="cover" style={styles.image}>
            <View
                className='flex-1 justify-end items-center'
                style={{ paddingBottom: hp(20) }}
            >
                <Text className='text-4xl font-extrabold text-indigo-600'> Welcome !!</Text>
                <ActivityIndicator size="large" color="white" className='pt-3' />
            </View>
        </ImageBackground>
    )
}
const styles = StyleSheet.create({
    image: {
        flex: 1,
        justifyContent: 'center',
    },

});
export default StartPage




