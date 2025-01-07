import React, { useEffect } from "react";
import "@/global.css";
import { Slot, useRouter, useSegments } from "expo-router";
import { AuthProvider, useAuth } from "@/context/authContext";
import * as SplashScreen from "expo-splash-screen";
const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  //const image = { uri: "https://legacy.reactjs.org/logo-og.png" };
  useEffect(() => {
    if (typeof isAuthenticated === "undefined") {
      return;
    }
    const inApp = segments[0] === "(app)";
    if (!isAuthenticated) {
      router.replace("/signin");
    } else if (isAuthenticated && !inApp) {
      router.replace("/home");
    }
  }, [isAuthenticated]);
  return <Slot />;
};
export default function RootLayout() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
