import { View, Text, FlatList, RefreshControl } from "react-native";
import React, { useState } from "react";
import { hp } from "@/utils/utils";
import ChatItem from "./ChatItem";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/authContext";
import { getDocs, query, where } from "firebase/firestore";
import { userRef } from "@/firebaseConfig";

export default function ChatList() {
  const router = useRouter();
  const { updateUserData, user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const [users, setUsers] = useState([]);
  const id = user?.uid ? user.uid : user?.userId;
  React.useEffect(() => {
    if (id) {
      getUsers();
    }
  }, []);
  const getUsers = async () => {
    try {
      //console.log("id", id);
      const q = query(userRef, where("userId", "!=", id));
      const querySnapshot = await getDocs(q);
      let data = [];
      querySnapshot.forEach((doc) => {
        data.push({ ...doc.data() });
      });
      setUsers(data);

      //console.log("id:", id, "users", data);
    } catch (error) {
      console.log("error", error.message);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // setTimeout(() => {
    //   setRefreshing(false);
    // }, 2000);
    console.log("refreshing");
    getUsers();
    setRefreshing(false);
  }, []);
  return (
    <View className="flex-1">
      <FlatList
        data={users}
        contentContainerStyle={{
          flex: 1,
          paddingVertical: 25,
          paddingBottom: hp(10),
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        keyExtractor={(item) => Math.random()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <ChatItem
            item={item}
            idx={index}
            noBorder={index + 1 == users.length}
            router={router}
          />
        )}
      ></FlatList>
    </View>
  );
}
