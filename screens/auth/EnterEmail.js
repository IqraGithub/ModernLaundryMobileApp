import { View, Text, Pressable, Alert } from "react-native";
import React from "react";
import Input from "../../components/Auth/Input";
import { useState } from "react";
import { ColorPalate } from "../../constants/var";
import MyGradientButton from "../../components/MyGradientButton";
import commonStyle from "./commonStyle";
import { getCustomers } from "../../utils/api";
import { showMessage } from "react-native-flash-message";



const EnterEmail = ({ navigation }) => {
  const [EnteredEmail, setEnteredEmail] = useState("");
  const varifyEmailHandler = async () => {
    try {
      const customers = await getCustomers();
      const emailExist = customers?.data?.find(
        (customer) => customer.email === EnteredEmail
      );


      if (emailExist) {
        navigation.navigate("OTPVarify", { customer: emailExist });
        // console.log("exist email")
      } else {  
        // Alert.alert("Incorrect Email", "Pleas Enter Correct Email");
        showMessage({
          message: "Incorrect Email",
          description: "Pleas Enter Correct Email",
          type: "danger",
        });
      }
    } catch (e) {
      console.log("got an error while checking email is valid or not. -->", e);
    }
  };
  return (
    <View style={commonStyle.rootContainer}>
      {/* <Text>EnterEmail</Text> */}
      <View style={commonStyle.textContainer}>
        <Text style={commonStyle.headText}>Forget Password</Text>
        <Text style={commonStyle.text}>
          Provide your account's email for which you want to reset your password
        </Text>
      </View>
      <View style={commonStyle.inputContainer}>
        <Input
          label="Enter Email"
          value={EnteredEmail}
          onUpdateValue={(value) => setEnteredEmail(value)}
        />
      </View>
      <View style={commonStyle.buttonContainer}>
        <MyGradientButton onPressBtn={varifyEmailHandler} title="Send OTP" />
        <Pressable onPress={() => navigation.navigate("SignIn")}>
          <Text
            style={[
              commonStyle.text,
              { color: ColorPalate.themeprimary, marginTop: 10 },
            ]}
          >
            Go To Login
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default EnterEmail;
