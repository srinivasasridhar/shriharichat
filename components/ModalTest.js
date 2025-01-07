import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { hp } from "@/utils/utils";
import { blurhash } from "@/utils/utils";
import Ionicons from "@expo/vector-icons/Ionicons";
const ModalTest = ({ isModalVisible }) => {
  const [modalVisible, setModalVisible] = useState(true);
  const [image, setImage] = useState(require("@/assets/images/ak.png"));
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      isModalVisible = false;
      modalVisible = false;
    }
  };
  return (
    <Modal
      animationType="slide"
      presentationStyle="pageSheet"
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
      onShow={pickImage}
    >
      <View className="flex-1 items-center justify-center bg-white">
        <Image
          style={{
            height: hp(30),
            aspectRatio: 1,
            borderRadius: "100%",
          }}
          source={image}
          contentFit="contain"
          placeholder={{ blurhash }}
          //contentFit="cover"
          transition={1000}
        />
        <Pressable
          className="flex-row items-center gap-3 mt-3"
          onPress={() => setModalVisible(false)}
        >
          <Ionicons name="close" size={hp(3)} color="#737373" />
          <Text className="text-indigo-500 font-bold text-xl">Cancel</Text>
        </Pressable>
      </View>
    </Modal>
  );
};

export default ModalTest;

const styles = StyleSheet.create({});
