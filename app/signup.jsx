import { Alert, Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
//import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { hp, wp } from '@/utils/utils';
import Octicons from '@expo/vector-icons/Octicons';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import Loading from '@/components/loading';
import CustomKeyboardView from '@/components/customkeyboardview';
import { useAuth } from '@/context/authContext';
import * as ImagePicker from 'expo-image-picker';
import { Cloudinary } from '@cloudinary/url-gen';
import { upload } from 'cloudinary-react-native';
import * as FileSystem from 'expo-file-system';
const SignUp = () => {
  const router = useRouter();
  const { register } = useAuth();
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const usernameRef = useRef("");
  const profileUrlRef = useRef("");

  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const cld = new Cloudinary({
    cloud: { cloudName: 'db03wqtda' },
    setConfig: ({
      cloud_name: 'db03wqtda',
      api_key: '542652633426841',
      api_secret: 'NTbqmB7jJ5QbvGO8Mq845XlyAYo' // Click 'View API Keys' above to copy your API secret
    })
  });
  const handleSignUp = async () => {
    if (!emailRef.current || !passwordRef.current || !usernameRef.current || !profileUrlRef.current) {
      Alert.alert("Sign In", "Please fill all fields");
      setLoading(false);
      return;
    };
    setLoading(true);
    let res = await register(emailRef.current, passwordRef.current, usernameRef.current, profileUrlRef.current);
    setLoading(false);

    if (!res.success) {
      Alert.alert("Sign Up", res.msg);
    }
  };
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
    fd.append("public_id", usernameRef.current + "_" + Math.random().toString(36).substring(7));
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
        handleSignUp();
        //console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error uploading the file:', error);
      });
  }
  const uploadImage = async () => {
    if (!selectedImage) {
      Alert.alert("Sign Up", "Please select an image");
      return;
    }
    try {
      setLoading(true);
      const base64 = await FileSystem.readAsStringAsync(selectedImage, { encoding: 'base64' });
      //console.log(base64);
      uploadFile(`data:image/jpg;base64,${base64}`);
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  }
  return (
    <CustomKeyboardView>
      <View className='flex-1 bg-white'>
        <StatusBar style='dark' />
        <View className="flex-1 gap-12">
          <View style={{ paddingTop: hp(8), paddingHorizontal: wp(5) }} className="items-center">
            <Image source={require('@/assets/images/register.png')} style={{ width: wp(80), height: hp(20), objectFit: "contain" }} />
          </View>
          <View className="gap-10">
            <Text style={{ fontSize: hp(4) }} className="font-bold tracking-wider text-center text-neutral-800">Sign Up</Text>
            <View className='gap-5 mx-2'>
              <View style={{ height: hp(7) }} className="bg-neutral-100 px-4 flex-row gap-4 rounded-xl items-center">
                <Feather name="user" size={hp(2.7)} color="gray" />
                <TextInput
                  onChangeText={value => usernameRef.current = value}
                  placeholder="Display Name"
                  placeholderTextColor={"gray"}
                  style={{ fontSize: hp(2) }}
                  className="flex-1 font-semibold text-neutral-700"
                />
              </View>
              <View style={{ height: hp(7) }} className="bg-neutral-100 px-4 flex-row gap-4 rounded-xl items-center">
                <Octicons name="mail" size={hp(2.7)} color="gray" />
                <TextInput
                  onChangeText={value => emailRef.current = value}
                  placeholder="Email"
                  placeholderTextColor={"gray"}
                  style={{ fontSize: hp(2) }}
                  autoCapitalize="none"
                  className="flex-1 font-semibold text-neutral-700"
                />
              </View>
              <View style={{ height: hp(7) }} className="bg-neutral-100 px-4 flex-row gap-4 rounded-xl items-center">
                <Octicons name="key" size={hp(2.7)} color="gray" />
                <TextInput
                  onChangeText={value => passwordRef.current = value}
                  placeholder="Password"
                  placeholderTextColor={"gray"}
                  style={{ fontSize: hp(2) }}
                  secureTextEntry={true}
                  autoCapitalize='none'
                  className="flex-1 font-semibold text-neutral-700"
                />

              </View>

              <View style={{ height: hp(7) }} className="bg-neutral-100 px-4 flex-row gap-4 rounded-xl items-center">
                {/*  <Octicons name="image" size={hp(2.7)} color="gray" />
               <TextInput
                  onChangeText={value => profileUrlRef.current = value}
                  placeholder="Profile Url"
                  placeholderTextColor={"gray"}
                  style={{ fontSize: hp(2) }}
                  className="flex-1 font-semibold text-neutral-700"
                /> */}
                <TouchableOpacity onPress={pickImage} style={{ height: hp(5) }} className="bg-orange-400 p-3 rounded-xl items-center justify-center">
                  <Text style={{ fontSize: hp(1.8) }} className="font-semibold text-white">Profile Image</Text>
                </TouchableOpacity>
                {selectedImage &&
                  <Image source={{ uri: selectedImage }}
                    style={{
                      width: 60,
                      height: 60,
                      aspectRatio: 1,
                      borderRadius: 100,
                      borderWidth: 2,
                      borderColor: "red"
                    }} />}

              </View>


              {/* Submit Button */}
              <View>
                {
                  loading ? (
                    <View className='flex-row justify-center'>
                      <Loading size={hp(8)} />
                    </View>
                  ) : (
                    <TouchableOpacity onPress={uploadImage} style={{ height: hp(6.5) }} className="bg-indigo-500 rounded-xl items-center justify-center">
                      <Text style={{ fontSize: hp(2.5) }} className="font-semibold text-white">Sign Up</Text>
                    </TouchableOpacity>
                  )
                }
              </View>

              {/* Sign Up */}
              <View className='flex-row justify-center'>
                <Text style={{ fontSize: hp(1.8) }} className="font-semibold text-neutral-500">Already have an account?</Text>
                <Pressable onPress={() => router.push('/signin')}>
                  <Text style={{ fontSize: hp(1.8) }} className="font-bold text-indigo-500"> Sign In</Text>
                </Pressable>
              </View>

            </View>
          </View>
        </View>
      </View>
    </CustomKeyboardView>
  )
}

export default SignUp

const styles = StyleSheet.create({})