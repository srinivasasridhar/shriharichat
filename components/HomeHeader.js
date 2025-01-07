import {
  View,
  Text,
  Platform,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { hp } from "@/utils/utils";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { blurhash } from "@/utils/utils";
import { useAuth } from "@/context/authContext";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { MenuItems } from "./CustomMenuItems";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
const ios = Platform.OS === "ios";

export default function HomeHeader({ headerText, showBackButton = false }) {
  const { top } = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const router = useRouter();
  const handleProfile = () => {
    router.push({ pathname: "/profile", params: user });
    //router.push({ pathname: "/upload" });
  };
  const handleLogout = async () => {
    await logout();
  };

  //console.log("user-header", user);
  return (
    <View
      style={{ paddingTop: ios ? top : top + 10 }}
      className="flex-row px-5 pb-6  justify-between rounded-b-3xl bg-indigo-400 shadow"
    >
      <View className="flex-row items-center gap-2">
        {showBackButton && (
          <Pressable onPress={() => router.back()}>
            <Ionicons
              name="arrow-back-circle-outline"
              size={hp(3.5)}
              color="white"
            />
          </Pressable>
        )}
        <Text style={{ fontSize: hp(3) }} className="font-medium text-white">
          {headerText}
        </Text>
      </View>
      <View>
        <TouchableOpacity onPress={handleProfile}>
          <Image
            style={{ height: hp(5), aspectRatio: 1, borderRadius: 100 }}
            source={user?.profileUrl}
            placeholder={{ blurhash }}
            contentFit="cover"
            transition={1000}
          />
        </TouchableOpacity>
        {/* <Menu>
          <MenuTrigger customStyles={{ triggerWrapper: {} }}>
            <Image
              style={{ height: hp(5), aspectRatio: 1, borderRadius: 100 }}
              source={user?.profileUrl}
              placeholder={{ blurhash }}
              contentFit="cover"
              transition={1000}
            />
          </MenuTrigger>
          <MenuOptions
            customStyles={{
              optionsContainer: {
                borderRadius: 10,
                borderCurve: "continuous",
                marginTop: hp(5),
                marginLeft: -30,
                width: 160,
              },
              optionsWrapper: {
                //width: wp(40),
                //marginTop: hp(5),
                borderRadius: 10,
                backgroundColor: "#fff",
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              },
            }}
          >
            <MenuItems
              text="Profile"
              action={handleProfile}
              value={null}
              icon={<Feather name="user" size={hp(2)} color="#737373" />}
            />
            <Divider />
            <MenuItems
              text="Sign Out"
              action={handleLogout}
              value={null}
              icon={<AntDesign name="logout" size={hp(2)} color="#737373" />}
            />
          </MenuOptions>
        </Menu> */}
      </View>
    </View>
  );
}

const Divider = () => {
  return (
    <View
      style={{
        height: 1,
        width: "100%",
        backgroundColor: "#737373",
      }}
    ></View>
  );
};
