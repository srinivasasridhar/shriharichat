import { ActivityIndicator, Alert, Button, ImageBackground, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useAuth } from '@/context/authContext';
import { hp, wp } from '@/utils/utils';
import { blurhash } from '@/utils/utils';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import Feather from '@expo/vector-icons/Feather';
import Octicons from '@expo/vector-icons/Octicons';
import CustomKeyboardView from '@/components/customkeyboardview';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import { Cloudinary } from '@cloudinary/url-gen';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';


const Profile = () => {
    const router = useRouter();
    const user = useLocalSearchParams();
    const usernameRef = useRef(user?.username);
    const passwordRef = useRef("");
    const profileUrlRef = useRef(user?.profileUrl);
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const { logout, updateUserData } = useAuth();

    const cld = new Cloudinary({
        cloud: { cloudName: 'db03wqtda' },
        setConfig: ({
            cloud_name: 'db03wqtda',
            api_key: '542652633426841',
            api_secret: 'NTbqmB7jJ5QbvGO8Mq845XlyAYo' // Click 'View API Keys' above to copy your API secret
        })
    });

    /***** Camera ******/
    const [permission, requestPermission] = useCameraPermissions();
    // if (!permission) {
    //     // Camera permissions are still loading.
    //     return <View />;
    // }

    // if (!permission.granted) {
    //     // Camera permissions are not granted yet.
    //     return (
    //         <View style={styles.container}>
    //             <Text style={styles.message}>We need your permission to show the camera</Text>
    //             <Button onPress={requestPermission} title="grant permission" />
    //         </View>
    //     );
    // }

    const openCamera = async () => {

        if (!permission.granted) {
            // Camera permissions are not granted yet.
            return (

                Alert.alert(
                    "Permission Required",
                    "Please grant permission to access the camera",
                    [
                        { text: "Allow", onPress: requestPermission },

                        { text: "Do Not Allow", style: 'cancel' }

                    ],
                    { cancelable: true, userInterfaceStyle: 'light' },
                )
            );
        }

        try {
            let result = await ImagePicker.launchCameraAsync({
                mediaTypes: "images",
                quality: 1,
                allowsEditing: true,
                cameraType: ImagePicker.CameraType.front,
            });
            if (!result.cancelled) {
                profileUrlRef.current = result.assets[0].uri;
                setSelectedImage(result.assets[0].uri);
            }
        } catch (error) {
            console.log("Error occurred while launching the camera: ", error);
        }
    };


    /***** Camera - End ******/


    const handleSignout = async () => {
        await logout();
    }

    const handleUpdate = async () => {
        setLoading(true);

        try {
            user.username = usernameRef.current;
            user.profileUrl = profileUrlRef.current;
            await setDoc(doc(db, "users", user.uid), {
                username: usernameRef.current,
                profileUrl: selectedImage ? user.profileUrl : profileUrlRef.current,
                userId: user.uid
            });
            await updateUserData(user);

        } catch (error) {
            console.log(error.message);
        }
        setLoading(false);
        router.push({ pathname: "/home" });
    }

    const selectOptions = () => {

        Alert.alert(
            "Select Image",
            "Choose an image from your gallery or take a new photo",
            [
                { text: "Gallery", onPress: pickImage },
                { text: "Camera", onPress: openCamera },
                { text: "Cancel", style: 'cancel' }

            ],
            { cancelable: true, userInterfaceStyle: 'light' },
        );

    };
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            //aspect: [4, 3],
            quality: 1,
        });

        //console.log(result);

        if (!result.canceled) {
            profileUrlRef.current = result.assets[0].uri;
            setSelectedImage(result.assets[0].uri);
        }
    };

    function uploadFile(file) {
        const url = `https://api.cloudinary.com/v1_1/db03wqtda/image/upload`;
        const fd = new FormData();
        fd.append('upload_preset', "shrihari_unsigned");
        //fd.append('tags', 'browser_upload'); // Optional - add tags for image admin in Cloudinary
        fd.append('file', file);
        fd.append("public_id", user.username + "_" + Math.random().toString(36).substring(7));
        fd.append("api_key", 'NTbqmB7jJ5QbvGO8Mq845XlyAYo');
        fetch(url, {
            method: 'POST',
            body: fd,
        })
            .then((response) => response.json())
            .then((data) => {
                // File uploaded successfully
                const url = data.secure_url;
                profileUrlRef.current = url;
                handleUpdate();
            })
            .catch((error) => {
                console.error('Error uploading the file:', error);
            });
    }

    const uploadImage = async () => {

        try {
            setLoading(true);
            if (selectedImage) {
                const base64 = await FileSystem.readAsStringAsync(selectedImage, { encoding: FileSystem.EncodingType.Base64 });
                uploadFile(`data:image/jpg;base64,${base64}`);
            } else {
                handleUpdate();
            }
        } catch (error) {
            console.log(error.message);
            setLoading(false);
        }
    }
    const image = require('@/assets/images/bg-wallpaper-2.png');
    return (
        //<CustomKeyboardView>
        <ImageBackground
            source={image}
            resizeMode="cover"
            className="flex-1 justify-center h-full"
        >
            <ScrollView className='flex-1'>

                <View className="flex-1 rounded-2xl h-full">
                    <StatusBar style='dark' />
                    <View className="flex-1 gap-2 items-center">
                        <Image
                            style={styles.image}
                            source={profileUrlRef.current}
                            placeholder={{ blurhash }}
                            transition={1000}
                        />
                        <TouchableOpacity onPress={selectOptions} style={{ height: hp(4) }} className="bg-neutral-200 px-3 rounded-xl flex-row gap-2 items-center justify-center">
                            <Feather name="edit" size={hp(2)} />
                            <Text style={{ fontSize: hp(1.8) }} className="font-semibold text-black">Change</Text>
                        </TouchableOpacity>
                    </View>
                    <View className="flex-1">
                        <View className='gap-5 mx-2'>
                            <View style={{ height: hp(7) }} className="px-4 flex-row gap-4 rounded-xl items-center">
                                <Octicons name="mail" size={hp(2.7)} color="gray" />
                                <Text style={{ fontSize: hp(2) }} className="flex-1 font-semibold text-neutral-500">{user?.email}</Text>
                            </View>
                            <View style={{ height: hp(7) }} className="bg-neutral-50 px-4 flex-row gap-4 rounded-xl items-center">
                                <Feather name="user" size={hp(2.7)} color="gray" />
                                <TextInput
                                    onChangeText={value => usernameRef.current = value}
                                    placeholder="Display Name"
                                    placeholderTextColor={"gray"}
                                    style={{ fontSize: hp(2), height: hp(6) }}
                                    className="flex-1 font-semibold text-neutral-700"
                                    defaultValue={user?.username}
                                />
                            </View>

                            {/* Submit Button */}
                            <View className='flex-row justify-center m-4  gap-4'>
                                {
                                    loading ? (
                                        <View className='flex-row justify-center gap-4'>
                                            <TouchableOpacity style={{ height: hp(5), width: 150 }} className="bg-indigo-500 rounded-xl items-center px-8 justify-center">
                                                <ActivityIndicator size="small" color="#ffffff" />
                                            </TouchableOpacity>

                                        </View>
                                    ) : (
                                        <View className='flex-row justify-center gap-4'>
                                            <TouchableOpacity onPress={uploadImage} style={{ height: hp(5), width: 150 }} className="bg-indigo-500 rounded-xl items-center justify-center">
                                                <Text style={{ fontSize: hp(2) }} className="font-semibold text-white">Update</Text>
                                            </TouchableOpacity>

                                        </View>
                                    )
                                }<TouchableOpacity onPress={handleSignout} style={{ height: hp(5), width: 150 }} className="bg-red-400 rounded-xl flex px-4 justify-center items-center">
                                    <View style={{ fontSize: hp(2) }} className="font-semibold text-white  gap-2 flex-row items-center justify-center">
                                        <Ionicons name="arrow-back-circle-outline" size={hp(2.7)} color="white" />
                                        <Text style={{ fontSize: hp(2) }} className="font-semibold text-white">Sign Out</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>



                        </View>
                    </View>
                </View>
            </ScrollView>
        </ImageBackground>
        //</CustomKeyboardView>

    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 150,
        aspectRatio: 1,
        borderRadius: "100%",
        borderWidth: 2,
        borderColor: "#94a3b8",
        marginTop: 20
    },
    imageBg: {
        flex: 1,
        justifyContent: 'center',
    },
    selectedImage: {
        width: 80,
        height: 80,
        aspectRatio: 1,
        borderRadius: "100%",
        borderWidth: 2,
        borderColor: "#94a3b8"
    }
});
export default Profile