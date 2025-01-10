import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { hp } from "@/utils/utils";
import { Image } from "expo-image";
import { blurhash, formatDate, getRoomId, toTitleCase } from "@/utils/utils";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useAuth } from "@/context/authContext";
import { db } from "@/firebaseConfig";
export default function ChatItem({ item, router, noBorder, idx }) {
  //console.log(noBorder, idx);
  const [lastMessage, setLastMessage] = useState(undefined);
  const { user } = useAuth();

  let roomid = getRoomId(user?.uid, item?.userId);
  //console.log("user:" + user?.uid, "item:" + item?.userId);
  //console.log("roomid", roomid);

  useEffect(() => {
    const docRef = doc(db, "rooms", roomid);
    const messagesRef = collection(docRef, "messages");
    const q = query(messagesRef, orderBy("createAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let messages = [];
      querySnapshot.docs.forEach((doc) => {
        messages.push(doc.data());
      });
      setLastMessage(messages[0] ? messages[0] : null);
    });
    return () => unsubscribe();
  }, []);

  const renderTime = () => {
    if (typeof lastMessage == "undefied") return "Loading..";
    if (lastMessage) {
      return formatDate(new Date(lastMessage.createAt?.seconds * 1000));
    } else {
      return "";
    }
  };
  const renderLastMessage = () => {
    if (typeof lastMessage == "undefied") return "Loading..";
    if (lastMessage) {
      if (user?.userId === lastMessage.userId) {
        return `You: ${lastMessage.text}`;
      }
      return lastMessage.text;
    } else {
      return "Say Hi 👋 ";
    }
  };

  const openChatRoom = () => {
    router.push({ pathname: "/chatRoom", params: item });
  };
  return (
    <TouchableOpacity
      onPress={openChatRoom}
      className={`flex-row items-center justify-between pb-2 mx-4 mb-4 gap-3 ${
        noBorder ? "" : "border-b border-b-indigo-300"
      }`}
    >
      <Image
        style={{
          height: hp(6),
          width: hp(6),
          aspectRatio: 1,
          borderRadius: 100,
        }}
        className="rounded-full bg-indigo-400"
        source={item?.profileUrl}
        placeholder={blurhash}
        transition={500}
      />
      <View className="flex-1">
        <View className="flex-row justify-between">
          <Text
            style={{ fontSize: hp(1.8) }}
            className="font-semibold text-neutral-800"
          >
            {toTitleCase(item.username)}
          </Text>
          <Text
            style={{ fontSize: hp(1.6) }}
            className="font-medium text-neutral-500"
          >
            {renderTime()}
          </Text>
        </View>
        <Text
          style={{ fontSize: hp(1.6) }}
          className="font-medium text-neutral-500"
        >
          {renderLastMessage()}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
