import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Title from "../../components/Title";
import { ColorPalate, MyFonts } from "../../constants/var";
import useCurrentCustomer from "../../components/customHooks/currentCustomer";
import useCustomerId from "../../components/customHooks/customerId";
import { useState } from "react";
import useCurrentUserOrders from "../../components/customHooks/getOrders";
import { useEffect } from "react";
import { formatDate } from "../../utils/helperFunctions";
import { setOrderData } from "../../store/redux/reduxToolkit/filteredDataSlice";
import { useDispatch } from "react-redux";

const ThanksScreen = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(0);

  const deliveryTypes = [
    { id: 1, name: "Standard" },
    { id: 2, name: "Express" },
    { id: 3, name: "Sameday" },
  ];
  const customerId = useCustomerId();

  const data = route.params.data;
  const {
    deliveryType,
    subtotal,
    order_item,
    emirate_id,
    deliveryDate,
    pickupDate,
  } = data;

  const dispatch = useDispatch();
  // const orders = useCurrentUserOrders();
  // useEffect(() => {
  //   // dispatch(setOrderData(orders));
  // }, [orders]);

  useEffect(() => {
    data ? setIsLoading(false) : setIsLoading(true);
  }, [data]);

  useEffect(() => {
    const totalItems = order_item.reduce((accumulator, currentItem) => {
      return parseInt(accumulator) + parseInt(currentItem.qty);
    }, 0);
    setQuantity(totalItems);
  }, [quantity]);

  const viewOrderHandler = () => {
    // setTimeout(() => {
    //   dispatch(setOrderData(orders));
    // }, 3000);
    navigation.navigate("OrdersScreen");
  };

  const goToHomeHandler = () => {
    // setTimeout(() => {
    //   dispatch(setOrderData(orders));
    // }, 3000);
    navigation.navigate("Category");
  };

  return (
    <>
      {isLoading ? (
        <View style={{}}>
          <ActivityIndicator size="large" color={ColorPalate.themeprimary} />
        </View>
      ) : (
        <View style={styles.container}>
          {/* <View> */}
          <View style={styles.messageContainer}>
            <Title text="Thank You" />
            <Text style={styles.subTitle}>Your order has been confirmed</Text>
          </View>
          <MaterialIcons
            name="check-circle"
            size={80}
            color={ColorPalate.themeprimary}
          />
          <View style={styles.card}>
            <View style={styles.cardItem}>
              <Text style={styles.cardText}>Emirate</Text>
              <Text style={styles.cardValue}>
                {route.params.emirate && route.params.emirate}
              </Text>
            </View>

            <View style={styles.cardItem}>
              <Text style={styles.cardText}>Delivery Type</Text>
              <Text style={styles.cardValue}>
                {
                  deliveryTypes.find((type) => type.id == (deliveryType || "1"))
                    ?.name
                }
              </Text>
            </View>
            <View style={styles.cardItem}>
              <Text style={styles.cardText}>Delivery Date</Text>
              <Text style={styles.cardValue}>{formatDate(deliveryDate)}</Text>
            </View>
            <View style={styles.cardItem}>
              <Text style={styles.cardText}>Pickup Date</Text>
              <Text style={styles.cardValue}>{formatDate(pickupDate)}</Text>
            </View>
            {/* */}
            {/* <View style={styles.cardItem}>
              <Text style={styles.cardText}>Total Price</Text>
              <Text style={styles.cardValue}>AED {subtotal}</Text>
            </View> */}
            <View style={styles.cardItem}>
              <Text style={styles.cardText}>Total Item</Text>
              <Text style={styles.cardValue}>{quantity}</Text>
            </View>

            <View style={styles.cardBorder} />
            <TouchableOpacity
              style={{ alignSelf: "center" }}
              onPress={goToHomeHandler}
            >
              <Text style={{ color: ColorPalate.themeprimary }}>
                Go To Home
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={viewOrderHandler}>
              <Text style={styles.buttonText}>View Orders</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.totalPriceContainer}>
            <Text style={styles.totalPriceText}>Total Price{"    "}</Text>
            <Text style={styles.totalPriceValue}>AED {subtotal}</Text>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: ColorPalate.white,
  },
  messageContainer: {
    marginBottom: 10,
  },
  subTitle: {
    color: ColorPalate.dgrey,
    fontFamily: MyFonts.fontregular,
    fontSize: 16,
  },
  card: {
    width: "80%",
    backgroundColor: ColorPalate.white,
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 20,
  },
  cardItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    fontFamily: MyFonts.fontregular,
    textTransform: "capitalize",
    color: ColorPalate.dgrey,
  },
  cardValue: {
    fontSize: 16,
    fontFamily: MyFonts.fontbold,
    color: ColorPalate.dgrey,
  },
  cardBorder: {
    borderBottomColor: ColorPalate.themeprimary,
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  button: {
    backgroundColor: ColorPalate.themeprimary,
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  buttonText: {
    color: ColorPalate.white,
    fontFamily: MyFonts.fontregular,
    fontSize: 16,
    textAlign: "center",
  },

  totalPriceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  totalPriceText: {
    fontSize: 18,
    fontFamily: MyFonts.fontbold,
    color: ColorPalate.dgrey,
  },
  totalPriceValue: {
    fontSize: 18,
    fontFamily: MyFonts.fontregular,
    color: ColorPalate.dgrey,
  },
});

export default ThanksScreen;

// ++++++++++++++++++++++++++++++++
