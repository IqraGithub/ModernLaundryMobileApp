import React, {useContext, useState} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import AuthContent from '../../components/Auth/AuthContent';
import Caption from '../../components/Caption';
import Title from '../../components/Title';
import {postSignUp} from '../../utils/api';
import {AuthContext} from '../../store/checkAuth';
import LoadingOverlay from '../../UI/LoadingOverlay';
import {useNavigation} from '@react-navigation/native';

const Signup = ({navigation}) => {
  const [isUserSigningUp, setIsUserSigningUp] = useState(false);
  const authContext = useContext(AuthContext);

  const handleSignUp = async userData => {
    const isFieldEmpty = Object.values(userData).some(value => !value);
    if (isFieldEmpty) {
      console.log('One or more fields are empty');
      return;
    }
    console.log('userData', userData);
    try {
      const response = await postSignUp(userData);
      console.log('Response', response);

      if (response.errors.email) {
        console.log('this is an existing email. ');
        Alert.alert('Existing Email', 'please try another email');
        return;
      }
      setIsUserSigningUp(true);

      if (response) {
        navigation.replace('SignIn');
        // authContext.authenticate(response.userId);
        // navigation.navigate('Home', {id: response.userId});
      } else {
        // Handle signup failure
        console.log('Signup failed');
      }
    } catch (error) {
      console.log('Error occurred during signup:', error);
      // Handle error
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