import React, { useState } from 'react';
import { ActivityIndicator, Button, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { AdvancedImage, upload } from 'cloudinary-react-native';
import { Image } from 'expo-image';
// Import required actions.
import { sepia } from "@cloudinary/url-gen/actions/effect";
import { Stack } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { blurhash } from '@/utils/utils';


export default function App() {

    const cld = new Cloudinary({
        cloud: { cloudName: 'db03wqtda' },
        setConfig: ({
            cloud_name: 'db03wqtda',
            api_key: '542652633426841',
            api_secret: 'NTbqmB7jJ5QbvGO8Mq845XlyAYo' // Click 'View API Keys' above to copy your API secret
        })
    });
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    // Use this sample image or upload your own via the Media Explorer
    let img = cld
        .image('csamples/smile')
        .format('auto') // Optimize delivery by resizing and applying auto-format and auto-quality
        .quality('auto')
        .resize(auto().gravity(autoGravity()).width(500).height(500)); // Transform the image: auto-crop to square aspect_ratio

    //img = cld.image('samples/smile');

    const uploadImage = async () => {
        const options = {
            upload_preset: 'shrihari_unsigned',
            unsigned: true
        }
        try {
            setLoading(true);
            await upload(cld, {
                file: imageUrl, options: options, callback: (error, response) => {
                    console.log("res:", response, "error:", error);
                    if (!error) {
                        setImage(response.public_id);
                        setImageUrl(response.secure_url);
                        console.log("Success:", response);
                    } else {
                        console.log("Error");
                        setImage(null);
                    }
                    setLoading(false);
                }
            });
        } catch (error) {
            console.log(error.message);
            setLoading(false);
        }
    }
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        //console.log(result);

        if (!result.canceled) {
            console.log(result.assets[0].uri);
            setImageUrl(result.assets[0].uri);
        }
    };

    return (
        <SafeAreaView className='flex-1 justify-center items-center' >
            <Stack.Screen options={{ headerTitle: '' }} />


            {loading && <ActivityIndicator size='large' color='#0000ff' />}

            {image && <AdvancedImage cldImg={cld.image(image)} style={{ width: 200, height: 200, alignSelf: 'center', borderWidth: 2, borderColor: "red" }} />}

            <View className='flex-1 items-center justify-center'>
                <Button title='Select Image from Photo Library' onPress={pickImage} />
                {imageUrl && <Image source={imageUrl} placeholder={{ blurhash }}
                    contentFit="cover"
                    transition={1000} style={styles.image} />}
                <Pressable className='flex-row items-center gap-3 mt-3' onPress={uploadImage}>
                    <Ionicons name='cloud-upload-outline' size={24} color='#737373' />
                    <Text className='text-indigo-500 font-bold text-xl'>Upload</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    )
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 200, height: 200, alignSelf: 'center', borderWidth: 2, borderColor: "red"
    },
});