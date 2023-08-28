import { useContext, useState } from "react";
import { View, Alert, StyleSheet } from "react-native";
import AuthContent from "../../components/Auth/AuthContent";
import LoadingOverlay from "../../UI/LoadingOverlay";
import { AuthContext } from "../../store/checkAuth";
import Title from "../../components/Title";
import Caption from "../../components/Caption";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCustomers } from "../../utils/api";
import { useEffect } from "react";
// const customerData = [
//   {
//     area: '1',
//     address: '',
//     last_name: 'CHARAN',
//     id: '0d2dd08e-61de-4283-a2b3-c5476e73871b',
//     first_name: 'MITHU',
//     rate_code: '2',
//     email: 'CHARANMITHU7@yahoo.com',
//     apartment: '',
//     street_name: 'Al Shaikh Street',
//     contact_number: '0552573946',
//     serialNo: '6',
//     Password: '',
//   },
//   {
//     area: '2',
//     address: '',
//     last_name: 'Kalam',
//     id: '6cac4cbb-ee65-4258-88f0-1f0d7e516652',
//     first_name: 'Abdul',
//     rate_code: '2',
//     email: 'Abd786@gmail.com',
//     apartment: '',
//     street_name: 'Jones Street',
//     contact_number: '8754696321',
//     serialNo: '9',
//     Password: '',
//   },
//   {
//     area: '1',
//     address: '',
//     last_name: 'Anderson',
//     id: '73e4bf7e-fb53-46d2-b140-351f996f3435',
//     first_name: 'James',
//     rate_code: '3',
//     email: 'Anderson@yahoo.com',
//     apartment: '',
//     street_name: 'Kinslet Street',
//     contact_number: '65648451213',
//     serialNo: '8',
//     Password: '',
//   },
//   {
//     area: '2',
//     address: '',
//     last_name: 'Testing',
//     id: '96e431a8-779f-46a2-9117-3f2c0a1df074',
//     first_name: 'Test',
//     rate_code: '3',
//     email: 'test@gmail.com',
//     apartment: '',
//     street_name: 'LK Street',
//     contact_number: '8654651212',
//     serialNo: '10',
//     Password: '',
//   },
//   {
//     area: '1',
//     address: '',
//     last_name: 'Shaikh',
//     id: 'c48f3077-518a-4e8b-ba09-8a0a9edb0e9a',
//     first_name: 'HUDOOB YOUNIS',
//     rate_code: '3',
//     email: 'Hudoob84@yahoo.com',
//     apartment: '',
//     street_name: 'BK Street',
//     contact_number: '72541254122',
//     serialNo: '5',
//     Password: '',
//   },
//   {
//     area: '2',
//     address: '',
//     last_name: 'KHAN',
//     id: 'c6bc2786-a317-4d68-9300-c90bb7dee329',
//     first_name: 'YOSUF',
//     rate_code: '1',
//     email: 'YOSUF45@hotmail.com',
//     apartment: '',
//     street_name: 'MK MART ROAD',
//     contact_number: '541351532',
//     serialNo: '7',
//     Password: '',
//   },
//   {
//     area: '1',
//     address: 'Node xyz',
//     last_name: 'ahmed',
//     id: 'random',
//     first_name: 'imran',
//     rate_code: '1',
//     email: 'imranahmed@gmail.com',
//     apartment: 'Node APt',
//     street_name: 'Node Street',
//     contact_number: '123456',
//     serialNo: '11',
//     Password: '1',
//   },
// ];
const SignIn = ({ navigation }) => {
  // State variable to track if the user is logging in
  const [isUserLogging, setisUserLogging] = useState(false);

  // Access the authentication context
  const authCntx = useContext(AuthContext);

  useEffect(() => {
    if (authCntx.isAuthendicate) {
      navigation.navigate("Category", { id: authCntx.userId });
    }
  }, [authCntx.isAuthendicate, navigation]);

  // Handle the login process
  const handleLogin = async ({ email, Password }) => {
    console.log("loginn: " + email, Password);

    // Get customer data
    const customerData = await getCustomers();

    // Set the flag to indicate that the user is logging in
    // setisUserLogging(true);
    try {
      // Check if email and password are provided
      if (!email || !Password) {
        alert("Please enter your email and password.");
        return;
      }
      // Find the user based on the provided email and password
      const user = customerData.data.find(
        (c) => c.email === email && c.Password === Password
      );
      console.log("user", user);

      if (user) {
        console.log("userId", user.serialNo);
        // Store the authenticated user's ID in AsyncStorage
        await AsyncStorage.setItem("customerId", user.serialNo);
        authCntx.authenticate(user.serialNo);
        // navigation.navigate('Category', {id: user.serialNo});
        setisUserLogging(true);
      } else {
        alert("Invalid email or password");
      }
    } catch (error) {
      console.log(error);
      throw new Error("Unable to login. Please try again later.");
    }
    // Store the authenticated user's ID in AsyncStorage
    setisUserLogging(false);
  };

  // Show a loading overlay while the user is logging in
  if (isUserLogging) {
    return <LoadingOverlay message="Logging you in..." />;
  }
  return (
    <View style={styles.form}>
      <Title text="Welcome Back" size={35} />
      <Caption text="Please sign in to your Laundry App account" />
      <AuthContent isLogin onAuthenticate={handleLogin} />
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  form: {
    flex: 1,
    justifyContent: "center",
  },
});
