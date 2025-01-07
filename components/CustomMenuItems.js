import { View, Text } from "react-native";
import { MenuOption } from "react-native-popup-menu";
import { hp } from "@/utils/utils";
export const MenuItems = ({ text, action, value, icon }) => {
  return (
    <MenuOption onSelect={() => action(value)}>
      <View className="px-4 py-2 flex-row justify-between items-center">
        <Text
          style={{ fontSize: hp(2) }}
          className="font-semibold text-neutral-600"
        >
          {text}
        </Text>
        {icon}
      </View>
    </MenuOption>
  );
};
