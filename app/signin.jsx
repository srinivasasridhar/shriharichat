import { Alert, Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
//import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { hp, wp } from '@/utils/utils';
import Octicons from '@expo/vector-icons/Octicons';
import { useRouter } from 'expo-router';
import Loading from '@/components/loading';
import CustomKeyboardView from '@/components/customkeyboardview';
import { useAuth } from '@/context/authContext';


const SignIn = () => {
    const router = useRouter();
    const { login } = useAuth();
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const [loading, setLoading] = useState(false);
    const handleLogin = async () => {
        if (!emailRef.current || !passwordRef.current) {
            Alert.alert("Sing In", "Please fill all fields");
            setLoading(false);
            return;
        };
        setLoading(true);
        let res = await login(emailRef.current, passwordRef.current);
        setLoading(false);
        if (!res.success) {
            Alert.alert("Sing In", res.msg);
        }
    };
    return (
        <CustomKeyboardView>
            <View className='flex-1'>
                <StatusBar style='dark' />
                <View className="flex-1 gap-12 bg-white">
                    <View style={{ paddingTop: hp(8), paddingHorizontal: wp(5) }} className="items-center">
                        <Image source={require("@/assets/images/login.png")} style={{ width: wp(70), height: hp(30), objectFit: "contain" }} />

                    </View>
                    <View className="flex-1 gap-10">
                        <Text style={{ fontSize: hp(4) }} className="font-bold tracking-wider text-center text-neutral-800">Sign In</Text>
                        <View className='gap-5 mx-2'>
                            <View style={{ height: hp(7) }} className="bg-neutral-100 px-4 flex-row gap-4 rounded-xl items-center">
                                <Octicons name="mail" size={hp(2.7)} color="gray" />
                                <TextInput
                                    onChangeText={value => emailRef.current = value}
                                    placeholder="Email"
                                    placeholderTextColor={"gray"}
                                    style={{ fontSize: hp(2) }}
                                    className="flex-1 font-semibold text-neutral-700"
                                />
                            </View>
                            <View className='gap-3'>
                                <View style={{ height: hp(7) }} className="bg-neutral-100 px-4 flex-row gap-4 rounded-xl items-center">
                                    <Octicons name="key" size={hp(2.7)} color="gray" />
                                    <TextInput
                                        onChangeText={value => passwordRef.current = value}
                                        placeholder="Password"
                                        placeholderTextColor={"gray"}
                                        style={{ fontSize: hp(2) }}
                                        secureTextEntry={true}
                                        className="flex-1 font-semibold text-neutral-700"
                                    />

                                </View>
                                {/* <Text style={{ fontSize: hp(1.8) }} className="text-right font-semibold text-neutral-500">Forgot Password?</Text> */}
                            </View>

                            {/* Submit Button */}
                            <View>
                                {
                                    loading ? (
                                        <View className='flex-row justify-center'>
                                            <Loading size={hp(8)} />
                                        </View>
                                    ) : (
                                        <TouchableOpacity onPress={handleLogin} style={{ height: hp(6.5) }} className="bg-green-600 rounded-xl items-center justify-center">
                                            <Text style={{ fontSize: hp(2.5) }} className="font-semibold text-white">Sign In</Text>
                                        </TouchableOpacity>
                                    )
                                }
                            </View>

                            {/* Sign Up */}
                            <View className='flex-row justify-center'>
                                <Text style={{ fontSize: hp(1.8) }} className="font-semibold text-neutral-500">Don't have an account?</Text>
                                <Pressable onPress={() => router.push('/signup')}>
                                    <Text style={{ fontSize: hp(1.8) }} className="font-bold text-green-500"> Sign Up</Text>
                                </Pressable>
                            </View>

                        </View>
                    </View>
                </View>
            </View>
        </CustomKeyboardView>
    )
}

export default SignIn

const styles = StyleSheet.create({})