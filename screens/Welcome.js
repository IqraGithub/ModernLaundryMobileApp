import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {View,  Pressable, Image, StyleSheet} from 'react-native';
import Caption from '../components/Caption';
import MyGradientButton from '../components/MyGradientButton';
import Title from '../components/Title';
import {ColorPalate, MyFonts} from '../constants/var';

const Welcome = ({navigation}) => {
  const register = async () => {
    var token = await AsyncStorage.getItem('customerId');
    console.log('token welcome--------' + token);
  };
  register();

  return (
    <View style={styles.root}>
      <Image
        source={require("../assets/welcome.png")}
        style={{width: 300, height: 300}}
      />
      <Title text="Modern Laundry App" />
      <Caption text="Discover the Easiest Way to Do Laundry Get Your Laundry Done Effortlessly" />

      <View style={styles.btns}>
        <MyGradientButton
          title="Sign Up"
          size={130}
          onPressBtn={() => navigation.navigate('SignUp')}
        />
        <MyGradientButton
          title="Sign In"
          size={130}
          onPressBtn={() => navigation.navigate('SignIn')}
        />
      </View>
      <Pressable  onPress={() => navigation.navigate('Guest')}>
      <Caption text="Login as a Guest" />
      </Pressable>
        
    </View>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 20,
    backgroundColor: ColorPalate.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btns: {
    width: '100%',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    marginTop: 60,
  },
});
