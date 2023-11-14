import {
  Image,
  KeyboardAvoidingView,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
const LoginScreen = () => {
  const [email, setemail] = useState("");
  const [Password, setpassword] = useState("");
  const navigation = useNavigation();
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");

        if (token) {
          navigation.replace("Main");
        }
      } catch (err) {
        console.log("error message", err);
      }
    };
    // checkLoginStatus();
    printAsyncStorage();
  }, []);

  // method to remove data from async storage
  // useEffect(() => {
  //   const removeItemValue = async (key) => {
  //     try {
  //       await AsyncStorage.removeItem("authToken");
  //       console.log('Item removed successfully');
  //     } catch (exception) {
  //       console.error('Error removing item:', exception);
  //     }
  //   };

  //   // Replace 'yourKey' with the actual key you want to remove
  //   removeItemValue('yourKey');
  // }, []);
  //-------------------
  // meethod to console.log all async storage -------------
  const printAsyncStorage = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const stores = await AsyncStorage.multiGet(keys);
  
      let parsedAsyncStorage = {};
      stores.forEach((result, i, store) => {
        try {
          // Attempt to parse the stored value as JSON
          parsedAsyncStorage[store[i][0]] = JSON.parse(store[i][1]);
        } catch (error) {
          // If parsing fails, store the raw string
          parsedAsyncStorage[store[i][0]] = store[i][1];
        }
      });
  
      console.log("Parsed AsyncStorage data:", parsedAsyncStorage);
    } catch (error) {
      console.error("Error retrieving AsyncStorage data:", error);
    }
  };
  //-------------
  const handlelogin = () => {
    console.log("pressed in login");
    const user = {
      email: email,
      password: Password,
    };
    axios
      .post("http://192.168.1.4:8000/login", user)
      .then((response) => {
        const userJson = JSON.stringify(response.data.user);
        const token = response.data.token;
        // const userid = response.data.userJson;
        AsyncStorage.setItem("authToken", token);
        AsyncStorage.setItem("User", userJson);
        navigation.replace("Main");
      })
      .catch((error) => {
        Alert.alert("Login Error", "Invalid Email");
        console.log(error);
      });
  };
  return (
    <SafeAreaView
      style={{ alignItems: "center" ,marginTop:50}}
      className=" bg-yellow-50 h-screen "
    >
      <View>
        <Image
          className="mt-11"
          style={{ height: 100, width: 250 }}
          source={{
            uri: "https://purepng.com/public/uploads/large/amazon-logo-s3f.png",
          }}
        ></Image>
      </View>

      <KeyboardAvoidingView className="w-[300]">
        <View className="align-center justify-center">
          <Text className="text-lg font-bold text-stone-800 ml-[75]">
            Login To your Account{" "}
          </Text>
        </View>
        <View className="mt-[70] ">
          <View
            style={{
              gap: 5,
              backgroundColor: "#D0D0D0",
              paddingVertical: 9,
              borderRadius: 5,
              flexDirection: "row",
              marginTop: 30,
              paddingLeft: 3,
            }}
          >
            <MaterialIcons
              name="email"
              size={24}
              color="black"
              style={{
                marginLeft: 8,
                marginRight: 8,
                paddingVertical: 6,
                fontSize: email ? 28 : 23,
              }}
            />
            <TextInput
              placeholder="Enter your E-mail"
              value={email}
              style={{ color: "gray" }}
              onChangeText={(prev) => {
                setemail(prev);
              }}
            />
          </View>

          <View className="mt-[15]">
            <View
              style={{
                gap: 5,
                backgroundColor: "#D0D0D0",
                paddingVertical: 9,
                borderRadius: 5,
                flexDirection: "row",
                marginTop: 30,
                paddingLeft: 3,
              }}
            >
              <AntDesign
                name="lock"
                size={24}
                color="black"
                style={{
                  marginLeft: 8,
                  marginRight: 8,
                  paddingVertical: 6,
                  fontSize: Password ? 28 : 23,
                }}
              />
              <TextInput
                placeholder="Enter your Password"
                value={Password}
                style={{ color: "black" }}
                onChangeText={(prev) => {
                  setpassword(prev);
                }}
                secureTextEntry
              />
            </View>
          </View>
        </View>

        <View className="flex-row mt-2 align-center justify-between ">
          <Text>Keep me logged In</Text>

          <Text style={{ color: "#007FFF", fontWeight: "500" }}>
            Forgot Password ?
          </Text>
        </View>

        <View style={{ marginTop: 90 }} />

        <Pressable
          onPress={handlelogin}
          style={{
            width: 200,
            backgroundColor: "#FEBE10",
            borderRadius: 10,
            marginLeft: "auto",
            marginRight: "auto",
            padding: 15,
          }}
        >
          <Text className="text-center text-xl text-white font-bold">
            Login
          </Text>
        </Pressable>

        <Pressable
          className="mt-[15]"
          onPress={() => {
            navigation.navigate("Register");
          }}
        >
          <Text className="text-center" style={{ color: "gray", fontSize: 16 }}>
            Dont have an Account ? Sign up
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
