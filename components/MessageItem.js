import { View, Text, Modal, Pressable } from "react-native";
import React, { useState } from "react";
import { blurhash, formatDate, hp, wp } from "@/utils/utils";
import { useAuth } from "@/context/authContext";
import { Image } from "expo-image";
import AntDesign from "@expo/vector-icons/AntDesign";
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

  const thumbnail = (uri) => {
    //https://res.cloudinary.com/db03wqtda/image/upload/c_thumb,w_200,g_face/v1736161277/Shrilu_w2rhxm.jpg
    let parts = uri.split("/");
    let thumb = parts.slice(0, 6).join("/"); // "https://res.cloudinary.com/db03wqtda/image/upload"
    thumb = thumb + "/c_thumb,w_200,g_face/"; // Add "/c_thumb,w_200,g_face/"
    thumb = thumb + parts.slice(6).join("/"); // Now Add Image Name
    return thumb;
  };

  const ViewSelectedImage = () => {
    return (
      <Modal
        animationType="slide"
        //transparent={true}
        visible={modalVisible}
        presentationStyle="pageSheet"
      >
        <View className="flex-1 justify-center items-center bg-neutral-200 relative">
          <Pressable
            className="p-1 bg-white  rounded-full w-fit self-end mb-2 top-3 right-10"
            onPress={() => setModalVisible(!modalVisible)}
          >
            <AntDesign name="closecircle" size={24} color="red" />
          </Pressable>
          <View className="bg-white p-2 rounded-lg">
            <Image
              source={{ uri: userImage }}
              contentFit="cover"
              style={{ width: wp(70), height: hp(70), borderRadius: 5 }}
            />
          </View>
        </View>
      </Modal>
    );
  };

  if (message?.userId == user?.userId) {
    return (
      <View className="flex-row justify-end mb-3 mr-3">
        <View style={{ width: wp(80) }}>
          <View className="flex self-end p-3 bg-lime-300 rounded-2xl border border-neutral-200">
            {message.sharedImage && (
              <Pressable onPress={() => handleViewImage(message.sharedImage)}>
                <Image
                  source={{ uri: thumbnail(message.sharedImage) }}
                  contentFit="cover"
                  style={{ width: wp(30), height: hp(10), borderRadius: 5 }}
                  transition={1000}
                  placeholder={{ blurhash }}
                />
                <ViewSelectedImage />
              </Pressable>
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
      </View>
    );
  } else {
    return (
      <View style={{ width: wp(80) }} className="ml-3 mb-3">
        <View className="flex self-start p-3 bg-indigo-200 rounded-2xl border border-neutral-200">
          {message.sharedImage && (
            <Pressable onPress={() => handleViewImage(message.sharedImage)}>
              <Image
                source={{ uri: thumbnail(message.sharedImage) }}
                contentFit="cover"
                style={{ width: wp(30), height: hp(10), borderRadius: 5 }}
                transition={1000}
                placeholder={{ blurhash }}
              />
              <ViewSelectedImage />
            </Pressable>
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
