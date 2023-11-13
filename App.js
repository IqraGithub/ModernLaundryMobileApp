import React, { useEffect, useState, useContext } from "react";
import RNBootSplash from "react-native-bootsplash";
import { StatusBar, ScrollView, Button, StyleSheet } from "react-native";
import LoadingOverlay from "./UI/LoadingOverlay";
import Welcome from "./screens/Welcome";
import SignIn from "./screens/auth/SignIn";
import SignUp from "./screens/auth/SignUp";
import store from "./store/redux/store";
import AuthContentProvider from "./store/checkAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "./store/checkAuth";
import { Provider, useDispatch } from "react-redux";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  HomeScreenNavigator,
  OrderScreenNavigator,
  ProfileScreenNavigator,
} from "./CustomNavigation";
import { ColorPalate, MyFonts } from "./constants/var";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwsomeIcon from "react-native-vector-icons/FontAwesome";
import LoginAsGuest from "./screens/auth/LoginAsGuest";
import EnterEmail from "./screens/auth/EnterEmail";
import OTPVarificationScreen from "./screens/auth/OTPVarificationScreen";
import ForgotPasswordScreen from "./screens/auth/ForgotPasswordScreen";
import useCurrentUserOrders from "./components/customHooks/getOrders";
import { setOrderData } from "./store/redux/reduxToolkit/filteredDataSlice";
import FlashMessage from "react-native-flash-message";
import NetworkLogger from "react-native-network-logger";
import { View } from "react-native";

const Stack = createNativeStackNavigator();
const Bottom = createBottomTabNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="Email" component={EnterEmail} />
      <Stack.Screen name="OTPVarify" component={OTPVarificationScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="Guest" component={LoginAsGuest} />
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {

  return (
    <Bottom.Navigator
      screenOptions={{
        tabBarActiveTintColor: ColorPalate.themeprimary,
        headerShown: false,
      }}
    >
      <Bottom.Screen
        name="HomeScreen"
        component={HomeScreenNavigator}
        options={{
          title: "Modern Laundry",
          tabBarLabel: "Home",
          tabBarLabelStyle: { fontFamily: MyFonts.fontregular },
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <Bottom.Screen
        name="OrdersScreen"
        component={OrderScreenNavigator}
        options={{
          tabBarLabel: "Orders",
          tabBarLabelStyle: { fontFamily: MyFonts.fontregular },
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="list-alt" color={color} size={26} />
          ),
        }}
      />
      <Bottom.Screen
        name="ProfileScreen"
        component={ProfileScreenNavigator}
        options={{
          tabBarLabel: "Account",
          tabBarLabelStyle: { fontFamily: MyFonts.fontregular },
          tabBarIcon: ({ color, size }) => (
            <FontAwsomeIcon name="user" color={color} size={26} />
          ),
        }}
      />
    </Bottom.Navigator>
  );
}

function Navigation() {
  const authCntx = useContext(AuthContext);
  return (
    <NavigationContainer>
      {!authCntx.isAuthendicate ? <AuthStack /> : <AuthenticatedStack />}
    </NavigationContainer>
  );
}
function TokenCheck() {
  const [isTryingToLogging, setisTryingToLogging] = useState(true);
  const authCntx = useContext(AuthContext);
  useEffect(() => {
    const checkStoredToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("customerId");
        storedToken && authCntx.authenticate(storedToken);
        setisTryingToLogging(false);
      } catch (error) {
        console.log(error);
      }
    };
    checkStoredToken();
  }, []);

  if (isTryingToLogging) return <LoadingOverlay message="wait a moment" />;
  return <Navigation />
}

const App = () => {
  useEffect(() => {
    RNBootSplash.hide();

    // const clearTime = setTimeout(() => {
    //   // console.log("HIDING SPLASH SCREEN")
    //   RNBootSplash.hide();
    // }, 3000);

    // return () => {
    //   clearTimeout(clearTime);
    // };
  }, []);

  const [showNetworkLogger, setShowNetworkLogger] = useState(false);

  const toggleNetworkLogger = () => {
    setShowNetworkLogger(!showNetworkLogger);
  };
  return (
    <>
      <Provider store={store}>
        <AuthContentProvider>
          <StatusBar style="light" />
          <TokenCheck />

          <FlashMessage
            position="top"
            textStyle={{
              fontFamily: MyFonts.fontregular,
            }}
            titleStyle={{
              fontFamily: MyFonts.fontregular,
            }}
          />
          {showNetworkLogger && <NetworkLogger />}

        </AuthContentProvider>
        {/* <View style={styles.networkLoggerButton}>
          <Button title="💻" onPress={toggleNetworkLogger} />
        </View> */}
      </Provider>
    </>
  );
};

const styles = StyleSheet.create({
  networkLoggerButton: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    backgroundColor: 'white', // or any color that suits your app's theme
    borderRadius: 30,
    padding: 10,
    elevation: 10, // this adds a shadow on Android
    shadowColor: 'black', // these shadow properties add a shadow on iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});

export default App;
