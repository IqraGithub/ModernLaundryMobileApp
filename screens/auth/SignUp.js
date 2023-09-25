import React, {useContext, useState} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import AuthContent from '../../components/Auth/AuthContent';
import Caption from '../../components/Caption';
import Title from '../../components/Title';
import {postSignUp} from '../../utils/api';
import {AuthContext} from '../../store/checkAuth';
import LoadingOverlay from '../../UI/LoadingOverlay';
import { showMessage } from 'react-native-flash-message';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Signup = ({navigation}) => {
  const [isUserSigningUp, setIsUserSigningUp] = useState(false);
  const authContext = useContext(AuthContext);

  const handleSignUp = async (userData) => {
    const isFieldEmpty = Object.values(userData).some(value => !value);
    if (isFieldEmpty) {
      showMessage({
        message: "One or more fields are empty",
        icon:()=><MaterialIcons name="error" size={24} color="white" />,
        type: "danger",
      });
      return;
    }
    if(userData.Password != userData.confirmPassword){
      showMessage({
        message: "Password Error",
        description: "The entered passwords do not match. Please try again.",
        icon:()=><MaterialIcons name="error" size={24} color="white" />,
        type: "danger",
      });
      return
    }
    
    try {
      const response = await postSignUp(userData);
      console.log('Response', response);

      if (response.errors.email) {
        console.log('this is an existing email. ', response.errors.email);
        showMessage({
          message: "Existing Email",
          description: "please try another email",
          icon:()=><MaterialIcons name="error" size={24} color="white" />,
          type: "danger",
        });
        return;
      }
      setIsUserSigningUp(true);

      if (response) {
        showMessage({
          message: "User Has Been Created",
          icon:()=><MaterialIcons name="check-circle" size={24} color="white" />,
          type: "success",
        });
        navigation.replace('SignIn');
      } else {
        // Handle signup failure
        showMessage({
          message: "Signup failed",
          icon:()=><MaterialIcons name="error" size={24} color="white" />,
          type: "danger",
        });
      }
    } catch (error) {
      console.log('Error occurred during signup:', error);
    }
    setIsUserSigningUp(false);
  };

  if (isUserSigningUp) {
    return <LoadingOverlay message="Signing you up..." />;
  }

  return (
    <View style={styles.form}>
      <Title text="Sign Up!!" size={35} />
      <Caption text="Get Your Laundry Done Effortlessly" />
      <AuthContent onAuthenticate={handleSignUp} />
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default Signup;
