  import { View, StyleSheet, Alert } from "react-native";
  import React, { useEffect, useState } from "react";
  import Input from "../../components/Auth/Input";
  import { getCustomers, getEmirates, postSignUp } from "../../utils/api";
  import { ColorPalate, MyFonts } from "../../constants/var";
  import Title from "../../components/Title";
  import MyGradientButton from "../../components/MyGradientButton";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import { useContext } from "react";
  import { AuthContext } from "../../store/checkAuth";
  import Dropdown from "../../components/Dropdown";
import { showMessage } from "react-native-flash-message";

  const LoginAsGuest = ({ navigation }) => {
    const [enteredEmail, setEnteredEmail] = useState("");
    const [enteredPassword, setEnteredPassword] = useState("");
    const [selectedEmirate, setSelectedEmirate] = useState();
    const [emirates, setEmirates] = useState([]);
    const [isReadyToLogin, setIsReadyToLogin] = useState(false);
    const [EnteredConfirmPassword, setEnteredConfirmPassword] = useState("");
    // Context for authentication
    const authCntx = useContext(AuthContext);

    // Fetch emirates on component mount
    useEffect(() => {
      async function fetchEmirates() {
        try {
          const e = await getEmirates();
          setEmirates(e);
        } catch (error) {
          console.log(error);
        }
      }
      fetchEmirates();
    }, []);

    // Function to Update input values based on input type
    function updateInputValueHandler(inputType, enteredValue) {
      switch (inputType) {
        case "email":
          setEnteredEmail(enteredValue);
          break;
        case "password":
          setEnteredPassword(enteredValue);
          break;
        case "confirmPassword":
          setEnteredConfirmPassword(enteredValue); // Correctly set EnteredConfirmPassword state
          break;
      }
    }

    useEffect(() => {
      // Function to login
      const onLogin = async () => {
        // User data to be sent for login
        const userData = {
          rate_code: selectedEmirate,
          email: enteredEmail,
          Password: enteredPassword,
        };

        // Check if any field is empty
        if (Object.values(userData).some((value) => !value)) {
          // Alert.alert("All the Fields are Required", "please fill all the fields");
          showMessage({
            message: "All the Fields are Required",
            description: "please fill all the fields",
            type: "danger",
          });
          return;
        }

        if(userData.Password != EnteredConfirmPassword){
          // Alert.alert(
          //   "Password Error",
          //   "The entered passwords do not match. Please try again.",
          // );
          showMessage({
            message: "Password Error",
            description: "The entered passwords do not match. Please try again.",
            type: "danger",
          });
          return
        }
        console.log("User Data:", userData);

        try {
          // Post sign up data
          const response = await postSignUp(userData);

          // User data to be sent for login
          if (response.errors.email) {
            console.log("this is an existing email. ");
            // Alert.alert("Existing Email", "please try another email");
            showMessage({
              message: "Existing Email",
              description: "please try another email",
              type: "danger",
            });
            return;
          }

          // Get customers and filter by entered email
          const customers = await getCustomers();
          const filtered = customers?.data?.find(
            (customer) => customer?.email === userData.email
          );

          // If response and filtered customer exists. Then it will execute this condition
          if (response && filtered) {
            // Set customer id in async storage and authenticate user
            await AsyncStorage.setItem("customerId", filtered.serialNo);
            authCntx.authenticate(filtered.serialNo);
            navigation.navigate("Category", { id: filtered.serialNo });
            setisUserLogging(true);
          }
        } catch (error) {
          console.log(error);
          throw new Error("Unable to login. Please try again later.");
        }
      };

      // If user click on login button this condition will be call
      if (isReadyToLogin) {
        onLogin();
        // This State set is value to false. so we can execute onLogin function everytime when we click on login button
        setIsReadyToLogin(false);
      }
    }, [isReadyToLogin]);

    // This function will trigger if user click on login button
    const handleLogin = async () => {
      // this state set is value true. so it will trigger use effect because we add it as dependancy
      setIsReadyToLogin(true);
    };

    return (
      <View style={styles.rootContainer}>
        <Title text="Login As Guest" size={35} />
        <View style={styles.container}>
          <Input
            label="Email Address"
            onUpdateValue={updateInputValueHandler.bind(this, "email")}
            value={enteredEmail}
            keyboardType="email-address"
          />
          <Input
            label="Password"
            onUpdateValue={updateInputValueHandler.bind(this, "password")}
            secure
            value={enteredPassword}
          />
          <Input
            label="Confirm Password"
            onUpdateValue={updateInputValueHandler.bind(this, "confirmPassword")}
            secure
            value={EnteredConfirmPassword}
          />

          <View style={styles.section}>
            <Dropdown
              options={emirates}
              onSelect={setSelectedEmirate}
              label={"Emirate"}
              key={"RateCodeID"}
              value={"rate_code"}
              selectedValue={selectedEmirate}
            />
          </View>
          <View style={styles.buttons}>
            <MyGradientButton onPressBtn={handleLogin} title="Login as Guest" />
          </View>
        </View>
      </View>
    );
  };

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: ColorPalate.white,
  },
  container: {
    backgroundColor: ColorPalate.white,
    marginHorizontal: 20,
    justifyContent: "center",
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontFamily: MyFonts.fontregular,
    fontSize: 16,
    color: ColorPalate.themeprimary,
    marginTop: 5,
  },
  dropdownContainer: {
    marginTop: 4,
    backgroundColor: ColorPalate.lgrey,
    borderRadius: 5,
    fontSize: 16,
    borderWidth: 1,
    borderColor: ColorPalate.dgrey,
    color: ColorPalate.dgrey,
  },
  dropdown: {
    fontFamily: MyFonts.fontregular,
    color: ColorPalate.dgrey,
  },
  buttons: {
    marginTop: 12,
  },
});

export default LoginAsGuest;
