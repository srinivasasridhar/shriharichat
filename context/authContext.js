import { auth, db } from "@/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);

  useEffect(() => {
    // check if user is authenticated
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setUser(user);
        updateUserData(user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    });
    return () => unsub();
  }, []);

  const refreshUser = async () => {
    const user = auth.currentUser;
    if (user) {
      setUser(user);
    }
  };

  const updateUserData = async (userObj) => {
    const docRef = doc(db, "users", userObj.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      //console.log("Document data:", docSnap.data());

      const data = docSnap.data();
      setUser({
        ...userObj,
        username: data.username,
        profileUrl: data.profileUrl,
        userId: data.userId,
      });
      //console.log("user-after :", user);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  };
  // LOGIN
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      //console.log("respose.user", userCredential?.user);
    } catch (e) {
      console.error(e);
      let msg = e.message;
      if (msg.includes("(auth/user-not-found)")) {
        msg = "User not found";
      } else if (msg.includes("(auth/invalid-credential)")) {
        msg = "Wrong password";
      }
      if (msg.includes("(auth/invalid-email).")) {
        msg = "Invalid email address";
      }
      return { success: false, msg };
    }
  };
  // LOGOUT
  const logout = async () => {
    try {
      //console.log("logout started");
      try {
        await signOut(auth);
      } catch (error) {
        console.log("error", error);
      } finally {
        setIsAuthenticated(false);
        setUser(null);
        return { success: true };
      }
    } catch (e) {
      console.error(e.message);
      return { success: false, msg: e.message, error: e };
    }
  };
  // SIGNUP
  const register = async (email, password, username, profileUrl) => {
    try {
      //console.log("register started");
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      //onsole.log("register done", user);

      // Add user to firestore
      const docRef = await setDoc(doc(db, "users", user?.uid), {
        username,
        profileUrl,
        userId: user?.uid,
      });
      //console.log("Document written with ID: ", docRef.uid);
      return { success: true, data: user?.uid };
    } catch (error) {
      let msg = error.message;
      if (msg.includes("(auth/invalid-email)")) {
        msg = "Invalid email address";
      }
      return { success: false, msg };
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, register, updateUserData }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error(
      "useAuth must be used wrapped inside a AuthContextProvider"
    );
  }
  return value;
};
