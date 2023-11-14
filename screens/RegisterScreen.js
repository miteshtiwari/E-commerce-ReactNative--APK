import { Image, KeyboardAvoidingView, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View,Alert
 } from 'react-native'
import React, { useState } from 'react'
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
const RegisterScreen = () => {
  const [email, setemail] = useState("");
  const [name, setname] = useState("");
  const [password, setpassword] = useState("");
  const navigation = useNavigation();

  const handleRegister = async () => {
    const user = {
      name: name,
      email: email,
      password: password,
    };
    axios
      .post("http://192.168.1.4:8000/register", user)
      .then((response) => {
        console.log("response",response);
        Alert.alert(
          "Registration successful",
          "You have been registered Successfully"
        );
        setname("");
        setemail("");
        setpassword("");
      })
      .catch((error) => {
        Alert.alert(
          "Registration Error",
          "An error occurred while registering"
        );
        console.log("registration failed", error);
      });
  };
  
  return (
    <SafeAreaView
      style={{ alignItems: 'center' }}
      className=" bg-yellow-50 h-screen"
    >
      <View>
        <Image
          className="mt-11"
          style={{ height: 100, width: 250 }}
          source={{
            uri: "https://purepng.com/public/uploads/large/amazon-logo-s3f.png"
          }}></Image>
      </View>

      <KeyboardAvoidingView className="w-[300]">
        <View className="align-center justify-center"
        >
          <Text className="text-lg font-bold text-stone-800 ml-[75]">Register To your Account </Text>
        </View>


        <View className="mt-[70] ">
          <View style={{ gap: 5, backgroundColor: "#D0D0D0", paddingVertical: 9, borderRadius: 5, flexDirection: 'row', marginTop: 30, paddingLeft: 3 }}>
            <FontAwesome name="user" size={24} color="black"style={{ marginLeft: 8, marginRight: 8, paddingVertical: 6, fontSize: name ? 28 : 23 }} />
            <TextInput placeholder='Enter your Name' value={name} style={{ color: "gray" }} onChangeText={(prev) => { setname(prev) }} />
          </View>

          <View style={{ gap: 5, backgroundColor: "#D0D0D0", paddingVertical: 9, borderRadius: 5, flexDirection: 'row', marginTop: 30, paddingLeft: 3 }}>
            <MaterialIcons name="email" size={24} color="black" style={{ marginLeft: 8, marginRight: 8, paddingVertical: 6, fontSize: email ? 28 : 23 }} />
            <TextInput placeholder='Enter your E-mail' value={email} style={{ color: "gray" }} onChangeText={(prev) => { setemail(prev) }} />
          </View>

          <View>
            <View style={{ gap: 5, backgroundColor: "#D0D0D0", paddingVertical: 9, borderRadius: 5, flexDirection: 'row', marginTop: 30, paddingLeft: 3 }}>
              <AntDesign name="lock" size={24} color="black" style={{ marginLeft: 8, marginRight: 8, paddingVertical: 6, fontSize: password ? 28 : 23 }} />
              <TextInput placeholder='Enter your Password' value={password} style={{ color: "black" }} onChangeText={(prev) => { setpassword(prev) }} secureTextEntry />
            </View>
          </View>
        </View>

        <View className="flex-row mt-2 align-center justify-between ">
          <Text>Keep me logged In</Text>

          <Text style={{ color: "#007FFF", fontWeight: "500" }}>Forgot Password ?</Text>
        </View>

        <View style={{ marginTop: 90 }} />

        <Pressable style={{ width: 200, backgroundColor: "#FEBE10", borderRadius: 10, marginLeft: "auto", marginRight: "auto", padding: 15 }}
        onPress={handleRegister}>
          <Text className="text-center text-xl text-white font-bold" >Register</Text>
        </Pressable>

        <Pressable className="mt-[15]" onPress={() => { navigation.navigate("Login") }}>
          <Text className="text-center" style={{ color: "gray", fontSize: 16 }}>
            Already have an Account ? Sign In
          </Text>
        </Pressable>
      </KeyboardAvoidingView>

    </SafeAreaView>
  )
}

export default RegisterScreen

const styles = StyleSheet.create({})