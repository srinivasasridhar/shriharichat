import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, Keyboard, Image, Button, Pressable } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar';
import ChatRoomHeader from '@/components/ChatRoomHeader';
import MessageList from '@/components/MessageList';
import { hp, wp } from '@/utils/utils';
import Feather from '@expo/vector-icons/Feather';
import CustomKeyboardView from '@/components/customkeyboardview';
import { useAuth } from '@/context/authContext';
import { getRoomId } from '@/utils/utils';
import { addDoc, collection, doc, onSnapshot, orderBy, query, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import Loading from '@/components/loading';


export default function ChatRoom() {
    const item = useLocalSearchParams(); // Selected User
    const { user } = useAuth(); // Loggedin User
    const router = useRouter();
    const [messages, setMessages] = useState([]);
    const textRef = useRef('');
    const inputRef = useRef(null);
    const scrollViewRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false);


    let roomid = getRoomId(user?.uid, item?.userId);
    //console.log(user?.uid, item?.userId);
    useEffect(() => {
        createRoomIfNotExists();
        const docRef = doc(db, "rooms", roomid);
        const messagesRef = collection(docRef, 'messages');
        const q = query(messagesRef, orderBy('createAt', 'asc'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            let messages = [];
            querySnapshot.docs.forEach((doc) => {
                messages.push(doc.data());
            });
            setMessages([...messages]);
            //updateScollView();
        });

        //const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', updateScollView);
        return () => {
            unsubscribe();
            //keyboardDidShowListener.remove();
        }


    }, []);

    // useEffect(() => {
    //     updateScollView();
    // }, [messages]);

    const updateScollView = () => {
        setTimeout(() => scrollViewRef.current.scrollToEnd({ duration: 500, animated: true }), 1000);
    }

    const createRoomIfNotExists = async () => {
        try {
            // Check if room exists if not create room
            await setDoc(doc(db, 'rooms', roomid), {
                roomId: roomid,
                createAt: Timestamp.fromDate(new Date()),
            });
        } catch (error) {
            console.log(error);
        }
    }
    const handleShowGallery = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            //aspect: [4, 3],
            quality: 1,
            //base64: true,
        });

        //console.log(result);

        if (!result.canceled) {
            //setSelectedImage(`data:image/jpg;base64,${result.assets[0].base64}`);
            setSelectedImage(result.assets[0].uri);
        }
    }
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
                //const url = data.secure_url;
                //profileUrlRef.current = url;
                //setSelectedImage();
                saveMessage(data.secure_url);
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
                saveMessage("");
            }
        } catch (error) {
            console.log(error.message);
            setLoading(false);
        }

    }
    const saveMessage = async (fileURL) => {
        const msg = textRef.current;
        //console.log('SaveMessage:', selectedImage);
        try {
            const docRef = doc(db, "rooms", roomid);
            const messageRef = collection(docRef, 'messages');
            textRef.current = '';
            if (inputRef) inputRef?.current?.clear();
            const newDoc = await addDoc(messageRef, {
                userId: user?.uid,
                text: msg,
                senderName: user.username,
                profileUrl: user.profileUrl,
                createAt: Timestamp.fromDate(new Date()),
                sharedImage: fileURL,
                //sharedImage: imgUrl != "" ? imgUrl : null,

            });
            //console.log('Document written with ID: ', newDoc.id);
            setSelectedImage(null);
            setLoading(false);


        } catch (error) {
            console.log(error);
            Alert.alert('Message', error.message);
        }
    }
    const handleSendMessage = async () => {
        if (selectedImage) {
            uploadImage();
        } else {
            saveMessage("");
        }

    }


    //console.log('Messages', messages);
    const image = require("@/assets/images/bg-wallpaper-1.png");
    return (
        <CustomKeyboardView inChat={true}>
            <View className='flex-1 bg-white' >
                <StatusBar style="dark" />
                <ChatRoomHeader user={item} router={router} />
                <View className='h-3 border-b border-neutral-300'></View>

                <View className='flex-1 justify-between overflow-visible bg-neutral-100'  >
                    <View className='flex-1'>
                        {
                            messages.length == 0 &&
                            <View className='flex-1 justify-center items-center'>
                                <Text className='text-neutral-400'>No messages</Text>
                            </View>
                        }
                        <MessageList messages={messages} currentUser={user} />
                    </View>
                    <View
                        style={{ width: wp(100) }}
                        className='h-26 p-2 pb-4 flex-row items-center bg-neutral-500 overflow-scroll'>

                        <TouchableOpacity
                            onPress={handleShowGallery}
                            className='flex-start bg-neutral-200 rounded-full p-2 m-2'>
                            <Feather name='plus' size={hp(2.7)} color='#737373' />
                        </TouchableOpacity>
                        <ScrollView style={{ flex: 1 }}>
                            <TextInput
                                ref={inputRef}
                                onChangeText={(text) => textRef.current = text}
                                multiline={true}
                                placeholder='Type a message'
                                style={{ fontSize: hp(2) }}
                                className='flex-grow p-2 bg-white rounded-full border h-12 border-neutral-300 overflow-scroll'
                            /></ScrollView>
                        {
                            loading ? (

                                <View className='bg-neutral-200 rounded-full p-2 m-2'>
                                    <Loading />
                                </View>

                            ) : (
                                <TouchableOpacity
                                    onPress={handleSendMessage}
                                    className='flex-end bg-neutral-200 rounded-full p-2 m-2'>
                                    <Feather name='send' size={hp(2.7)} color='#737373' />
                                </TouchableOpacity>
                            )
                        }

                    </View>

                    {selectedImage &&
                        <View>
                            <View className='h-[1px] border-b border-neutral-400'></View>

                            <View className='bg-neutral-500'>
                                <Image source={{ uri: selectedImage }}
                                    style={{
                                        width: wp(20),
                                        height: hp(20),
                                        aspectRatio: 1,
                                        resizeMode: 'contain',
                                        justifyContent: 'center',
                                        alignSelf: 'center',
                                    }} />
                                <Pressable
                                    style={{ position: 'absolute', top: hp(1), right: wp(2) }}
                                    className='bg-red-600 rounded-full p-1  font-bold'
                                    onPress={() => setSelectedImage(null)}
                                >
                                    <Feather name='x' size={hp(2.7)} color='white' onPress={() => setSelectedImage(null)} />
                                </Pressable>
                                {/* <Button title='Cancel' className="text-white font-semibold" onPress={() => setSelectedImage(null)} /> */}
                            </View>
                        </View>
                    }



                </View>
            </View>
        </CustomKeyboardView>
    )
}