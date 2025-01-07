import { View, Text, ScrollView } from "react-native";
import React from "react";
import MessageItem from "./MessageItem";

export default function MessageList({ messages, scrollViewRef, currentUser }) {
  return (
    <ScrollView
      ref={scrollViewRef}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flex: 1, justifyContent: "flex-end" }}
    >
      {messages.map((message, idx) => {
        return (
          <MessageItem key={idx} message={message} currentUser={currentUser} />
        );
      })}
    </ScrollView>
  );
}
