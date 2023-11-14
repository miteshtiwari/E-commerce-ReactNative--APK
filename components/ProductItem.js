import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import React, { useState } from "react";
import { addToCart } from "../redux/CartReducer";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

const ProductItem = ({ item }) => {
  const dispatch = useDispatch();
  const [addedToCart, setAddedToCart] = useState(false);
  const cart = useSelector((state) => state.cart.cart);
  const addItemToCart = (item) =>{
    setAddedToCart(true);
    dispatch(addToCart(item));
    setTimeout(() => {
      setAddedToCart(false);
    }, 60000);
  }
  const navigation = useNavigation();
  return (
    <Pressable 
     style={{ marginHorizontal: 18, marginVertical: 25 }}>
      <Image
        style={{ width: 150, height: 120, resizeMode: "contain" }}
        source={{ uri: item?.image }}
      />

      <Text numberOfLines={1} style={{ width: 150, marginTop: 10 }}>
        {item?.title}
      </Text>

      <View
        style={{
          marginTop: 5,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: 15, fontWeight: "bold" }}>₹{item?.price}</Text>
        <Text style={{ color: "#FFC72C", fontWeight: "bold" }}>
          {item?.rating?.rate} ratings
        </Text>
      </View>
      <Pressable
      onPress={()=>{addItemToCart(item)}}
        style={{
          backgroundColor: "#FFC72C",
          padding: 11,
          borderRadius: 20,
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: 10,
          marginTop: 10,
        }}
      >
       {addedToCart ? (
          <View>
            <Text>Added to Cart</Text>
          </View>
        ) : (
          <Text>Add to Cart</Text>
        )}
      </Pressable>
    </Pressable>
  );
};

export default ProductItem;

const styles = StyleSheet.create({});
