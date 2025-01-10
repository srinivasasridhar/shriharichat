import { View, Text, Modal, Pressable, ImageBackground } from "react-native";
import React, { useState } from "react";
import { blurhash, formatDate, getInitials, hp, wp } from "@/utils/utils";
import { useAuth } from "@/context/authContext";
import { Image } from "expo-image";
import AntDesign from "@expo/vector-icons/AntDesign";
import ImageModal from "react-native-image-modal";

export default function MessageItem({ message }) {
  //console.log(message.userId, currentUser.userId);
  const { user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [userImage, setUserImage] = useState("");

  const handleViewImage = (img) => {
    setUserImage(img);
    setModalVisible(true);
    //viewImage(img);
  };

  const sender1 = () => {
    if (message.userId == user.userId) {
      return "You";
    } else {
      return message.userName;
    }
  };

  const thumbnail = (uri) => {
    //example : https://res.cloudinary.com/db03wqtda/image/upload/c_thumb,w_200,g_face/v1736161277/Shrilu_w2rhxm.jpg
    let parts = uri.split("/");
    let thumb = parts.slice(0, 6).join("/"); // "https://res.cloudinary.com/db03wqtda/image/upload"
    thumb = thumb + "/c_thumb,w_200,g_face/"; // Add "/c_thumb,w_200,g_face/"
    thumb = thumb + parts.slice(6).join("/"); // Now Add Image Name
    return thumb;
  };
  //console.log(message);
  return (
    <>
      <View
        style={{ width: wp(80) }}
        className={`${
          message.userId == user.userId
            ? "self-end mr-3 mb-3"
            : "self-start ml-3 mb-3"
        } `}
      >
        <View
          className={`flex ${
            message.userId == user.userId
              ? "self-end bg-lime-300 "
              : "self-start bg-indigo-200 "
          } p-3 rounded-2xl border border-neutral-200`}
        >
          <Text className="font-thin text-[8px] mb-1 self-end">
            {message.senderName}
          </Text>
          {message.sharedImage && (
            <ImageModal
              resizeMode="contain"
              imageBackgroundColor="#000000"
              style={{ width: wp(35), height: hp(15), borderRadius: 5 }}
              source={{ uri: message.sharedImage }}
            />
          )}
          <Text style={{ fontSize: hp(1.9) }}>{message.text}</Text>
          <Text
            style={{ fontSize: hp(0.8) }}
            className="font-semibold text-slate-400 self-end"
          >
            {formatDate(new Date(message.createAt?.seconds * 1000))}
          </Text>
        </View>
      </View>
    </>
  );
  if (message?.userId == user?.userId) {
    return (
      <View
        style={{ width: wp(80) }}
        className={`${
          message.userId == user.userId
            ? "self-end mr-3 mb-3"
            : "self-start ml-3 mb-3"
        } `}
      >
        <View
          className={`flex ${
            message.userId == user.userId ? "self-end" : "self-start"
          } p-3 bg-lime-300 rounded-2xl border border-neutral-200`}
        >
          {message.sharedImage && (
            <ImageModal
              resizeMode="contain"
              imageBackgroundColor="#000000"
              style={{ width: wp(35), height: hp(15), borderRadius: 5 }}
              source={{ uri: message.sharedImage }}
            />
          )}
          <Text style={{ fontSize: hp(1.9) }}>{message.text}</Text>
          <Text
            style={{ fontSize: hp(0.8) }}
            className="font-semibold text-slate-400 self-end"
          >
            {formatDate(new Date(message.createAt?.seconds * 1000))}
          </Text>
        </View>
      </View>
    );
  } else {
    return (
      <View style={{ width: wp(80) }} className="selft-start ml-3 mb-3">
        <View className="flex self-start p-3 bg-indigo-200 rounded-2xl border border-neutral-200">
          {message.sharedImage && (
            <ImageModal
              resizeMode="contain"
              imageBackgroundColor="#000000"
              style={{ width: wp(35), height: hp(15), borderRadius: 5 }}
              source={{ uri: message.sharedImage }}
            />
          )}
          <Text style={{ fontSize: hp(1.9) }}>{message.text}</Text>
          <Text
            style={{ fontSize: hp(0.8) }}
            className="font-semibold text-slate-400 self-end"
          >
            {formatDate(new Date(message.createAt?.seconds * 1000))}
          </Text>
        </View>
      </View>
    );
  }
}
