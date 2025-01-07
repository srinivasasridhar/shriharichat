import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Pressable,
} from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { hp } from "@/utils/utils";
import { Image } from "expo-image";
import { toTitleCase } from "@/utils/utils";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "@/context/authContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
export default function ChatRoomHeader({ router, user }) {
  //const { username, profileUrl } = user;
  //const { user } = useAuth();
  //const user = item;
  const ios = Platform.OS === "ios";
  const { top } = useSafeAreaInsets();
  //const { router } = useRouter();
  const handleBack = () => {
    //console.log("back");
    //router.push({ pathname: "/home" });
    router.back();
  };
  return (
    <Stack.Screen
      options={{
        //title: `${user.username}`,
        title: "", //toTitleCase(user?.username),
        headerShadowVisible: false,
        headerLeft: () => (
          <View className="flex-row items-center  gap-4 ">
            <TouchableOpacity onLongPress={handleBack} onPress={handleBack}>
              <Ionicons name="arrow-back-circle" size={hp(4)} color="#737373" />
            </TouchableOpacity>
            <View className="flex-row items-center gap-3">
              <Image
                source={user?.profileUrl}
                style={{
                  height: hp(4.6),
                  aspectRatio: 1,
                  borderRadius: 100,
                }}
              />
            </View>
            <View className="flex-row items-center gap-3">
              <Text
                style={{ fontSize: hp(2.2) }}
                className="font-semibold text-neutral-800"
              >
                {toTitleCase(user?.username)}
              </Text>
            </View>
          </View>
        ),
        headerRight: () => (
          <View className="flex-row items-center gap-8">
            <Ionicons name="call" size={hp(3)} color="#737373" />
            <Ionicons name="videocam" size={hp(3)} color="#737373" />
          </View>
        ),
      }}
    />
  );
}
