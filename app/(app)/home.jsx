import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/context/authContext';
//import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { hp, wp } from '@/utils/utils';
import { StatusBar } from 'expo-status-bar';
import ChatList from '@/components/ChatList';
import { getDocs, query, where } from 'firebase/firestore';
import { userRef } from '@/firebaseConfig';
import { useRoute } from '@react-navigation/native';

const HomePage = () => {
    const { logout, user } = useAuth();
    const [users, setUsers] = useState([]);

    const router = useRoute();
    const id = user?.uid ? user?.uid : user?.userId;

    useEffect(() => {

        if (id) {
            getUsers();
        }
    }, []);
    const getUsers = async () => {
        try {
            //const id = user?.uid ? "" : user?.userId;
            //console.log("id", id);
            const q = query(userRef, where("userId", "!=", id));
            const querySnapshot = await getDocs(q);
            let data = [];
            querySnapshot.forEach(doc => {
                data.push({ ...doc.data() });
            });
            setUsers(data);

            //console.log("id:", id, "users", data);
        } catch (error) {
            console.log("error", error.message);
        }

    };

    const handleLogout = async () => {
        await logout();
    };
    //console.log("user-homepage", user);
    return (

        <View className='flex-1' >
            <StatusBar style="light" />
            {
                users.length > 0 ? (
                    <ChatList users={users} />

                ) : (
                    <View className='flex-1 items-center' style={{ top: hp(30) }} >
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                )
            }
        </View>

    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        flex: 1,
        justifyContent: 'center',
    },
    text: {
        color: 'white',
        fontSize: 42,
        lineHeight: 84,
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: '#000000c0',
    },
});
export default HomePage

