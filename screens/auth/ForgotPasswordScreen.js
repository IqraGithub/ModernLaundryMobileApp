import { View, Text, Pressable, Alert } from "react-native";
import React from "react";
import Input from "../../components/Auth/Input";
import { useState } from "react";
import { ColorPalate, MyFonts } from "../../constants/var";
import MyGradientButton from "../../components/MyGradientButton";
import commonStyle from "./commonStyle";
import { putProfile } from "../../utils/api";
import { showMessage } from "react-native-flash-message";

const ForgotPasswordScreen = ({ navigation, route }) => {
  const [EnteredPassword, setEnteredPassword] = useState("");
  const [EnteredConfirmPassword, setEnteredConfirmPassword] = useState("");
  
  const { customer } = route.params;
  const ChangePasswordHandler = async () => {
try{

  if(!EnteredPassword || !EnteredConfirmPassword){
    showMessage({
      message: "All Fileds Are Mandatory.",
      type: "danger",
    });
    return;
  }

  if (EnteredPassword === EnteredConfirmPassword) {
    const updatePassword = await putProfile({
      id: customer.id,
      Password: EnteredPassword,
    });
    updatePassword ?(
       navigation.navigate("SignIn") ,
       showMessage({
        message: "Password Has Been Changed",
        // description: "The entered passwords do not match. Please try again.",
        type: "success",
      })
      ): null;
  }else{
    // Alert.alert(
    //   "Password Error",
    //   "The entered passwords do not match. Please try again.",
    // );

    showMessage({
      message: "Password Error",
      description: "The entered passwords do not match. Please try again.",
      type: "danger",
    });
      }
}catch(e){
  console.log('got an error while changing password', e)
}
  };
  return (
    <View style={commonStyle.rootContainer}>
      <View style={commonStyle.inputContainer}>
        <Text style={commonStyle.headText}>Change Password</Text>
        <Input
          label="Enter Password"
          secure
          value={EnteredPassword}
          onUpdateValue={(value) => setEnteredPassword(value)}
        />
        <Input
          label="Confirm Password"
          secure
          value={EnteredConfirmPassword}
          onUpdateValue={(value) => setEnteredConfirmPassword(value)}
        />
      </View>
      <View style={commonStyle.buttonContainer}>
        <MyGradientButton
          onPressBtn={ChangePasswordHandler}
          title="Change Password"
        />
      </View>
    </View>
  );
};

export default ForgotPasswordScreen;

// const commonStyle = commonStyleheet.create({
//   rootContainer: {
//     flex: 1,
//     justifyContent: "center",
//     // alignItems: "center",
//   },
//   inputContainer: {
//     width: "90%",
//     alignSelf: "center",
//   },
//   text: {
//     alignSelf: "center",
//     fontSize: 25,
//     color: ColorPalate.themeprimary,
//     fontFamily:MyFonts.fontmid,
//     marginBottom: 20,
//   },
//   buttonContainer:{
//     width:'90%',
//     alignSelf:'center',
//     marginTop:20
//   }
// });
