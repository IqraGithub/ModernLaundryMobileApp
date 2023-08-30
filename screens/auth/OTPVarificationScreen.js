import { View, Text, Pressable, Alert } from "react-native";
import React from "react";
import Input from "../../components/Auth/Input";
import { useState } from "react";
import { ColorPalate, MyFonts } from "../../constants/var";
import MyGradientButton from "../../components/MyGradientButton";
import commonStyle from "./commonStyle";
import { useEffect } from "react";

import uuid from "react-native-uuid";
import { postOTP } from "../../utils/api";
import { showMessage } from "react-native-flash-message";
const OTPVarificationScreen = ({ navigation, route }) => {
  const [EnteredOTP, setEnteredOTP] = useState("");
  const [OTP, setOTP] = useState(null);
  // const customerId = useCustomerId();

  const { customer } = route.params;

  const generateOTP = () => {
    const o = Math.floor(Math.random() * 9000 + 1000).toString();
    // console.log(Date.now().toString() + uuid.v4());
    setOTP(o);
  };

  // async function sendOTPHandler() {
  //   // if (OTP) {
  //     const data = {
  //       id: Date.now().toString() + uuid.v4(),
  //       customer_id: customer.serialNo,
  //       email: customer.email,
  //       otp: 2342,
  //     }
  //     try {
  //       const sendOTP = await postOTP(data);

  //       console.log('-------------------------------');
  //       console.log('sendOTP',sendOTP)
  //       console.log(data)
  //       // console.log("otpp called");
  //       console.log('-------------------------------');
  //     } catch (e) {
  //       console.log('got an error while sending error',e);
  //     }
    // }
  // }
  useEffect(() => {
    // sendOTPHandler();
    generateOTP()
    
  }, []);
  useEffect(() => {
  
    async function sendOTPHandler() {
      if (OTP) {
        // const data = {
        //   id: 999,
        //   customer_id: customer.serialNo,
        //   email: customer.email,
        //   otp: 2342,
        // }
         try {
          const sendOTP = await postOTP(data);
  
          console.log('-------------------------------');
          console.log('sendOTP',sendOTP.data)
          console.log(data)
          // console.log("otpp called");
          console.log('-------------------------------');
        } catch (e) {
          console.log('got an error while sending error',e);
        }
      }
    }
     
       
    sendOTPHandler();
  
      
  }, [OTP]);

  const OTPVerificationHandler = () => {

    // generateOTP();
    if (EnteredOTP === OTP) {
      navigation.navigate("ForgotPassword",{customer});
    } else {
      // Alert.alert("Not Verfied", "OTP is Incorrrect! Please Enter Correct OTP");
      showMessage({
        message: "Not Verfied",
        description: "OTP is Incorrrect! Please Enter Correct OTP",
        type: "danger",
      });
    }
  };

  return (
    <View style={commonStyle.rootContainer}>
      <Text style={commonStyle.text}>OTP {OTP}</Text>
      <View style={commonStyle.inputContainer}>
        <Text style={commonStyle.headText}>OTP Verification</Text>
        <Input
          label="Enter OTP"
          value={EnteredOTP}
          onUpdateValue={(value) => setEnteredOTP(value)}
        />
      </View>
      <View style={commonStyle.buttonContainer}>
        <MyGradientButton
          onPressBtn={OTPVerificationHandler}
          title="Verify OTP"
        />
      </View>
    </View>
  );
};

export default OTPVarificationScreen;
