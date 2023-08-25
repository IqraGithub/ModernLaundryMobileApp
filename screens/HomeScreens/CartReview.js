import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  Pressable,
  View,
} from "react-native";



import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";

import {
  emptyProducts,
  removeFromCart,
  selectAllCartItems,
  selectCartTotalPrice,
  selectCartTotalQuantity,
  updateCartItemQuantity,
} from "../../store/redux/reduxToolkit/cartSlice";

import { postOrder } from "../../utils/api";
import {
  showToast,
  confirmationAlert,
  changeEmirateTo,
  formatDate,
} from "../../utils/helperFunctions";

import { ColorPalate, MyFonts } from "../../constants/var";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import useCustomerId from "../../components/customHooks/customerId";
import useCurrentCustomer from "../../components/customHooks/currentCustomer";

// const purchaseType = [
//   {
//     id: '1',
//     type: 'Cash on delivery',
//   },
//   {
//     id: '2',
//     type: 'Cash on delivery',
//     //
//   },
//   {
//     id: '3',
//     type: 'pay online',
//     //
//   },
// ];

const deliveryTypes = [
  { id: 1, name: "Standard" },
  { id: 2, name: "Express" },
  { id: 3, name: "Sameday" },
];

const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "green", opacity: 1 }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: "400",
      }}
    />
  ),

  error: (props) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: "red", opacity: 1 }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 17,
      }}
      text2Style={{
        fontSize: 15,
      }}
    />
  ),
};
const CartOld = ({ navigation, route }) => {
  const emirates = [
    { RateCodeID: "3", rate_code: "Dubai" },
    { RateCodeID: "4", rate_code: "Umm Al Quwain " },
    { RateCodeID: "1", rate_code: "Ras Al Khaimah" },
    { RateCodeID: "2", rate_code: "Sharjah" },
    { RateCodeID: "5", rate_code: "Ajman" },
  ];

  const services = [
    { id: "1", service: "Dryclean" },
    { id: "2", service: "Press" },
    { id: "3", service: "Laundry" },
  ];

  const [orderData, setOrderData] = useState(null);
  const dispatch = useDispatch();
  const cartItems = useSelector(selectAllCartItems);
  const { pickupDateString, deliveryDateString, notes } = route.params;

  const totalPrice = useSelector(selectCartTotalPrice);
  const totalQty = useSelector(selectCartTotalQuantity);

  const customerId = useCustomerId();
  // const currentCustomer = useCurrentCustomer(customerId);
  const currentCustomer = useSelector((state) =>  state?.filteredData?.currentCustomerData);


  // Function to handle item deletion
  const handleDeleteItem = (itemID) => {
    confirmationAlert(
      "Delete",
      "Confirm to delete",
      () => console.log("Cancel Pressed"),
      () => {
        dispatch(removeFromCart(itemID));
        showToast("error", "Item removed", "Your item has been removed.");
      }
    );
  };

  // Function to handle quantity update
  const handleUpdateQuantity = async (item, action) => {
    if (
      item &&
      (action === "increase" || (action === "decrease" && item.quantity > 0))
    ) {
      // If quantity is 1 and action is 'decrease', delete the item
      item.quantity === 1 && action === "decrease"
        ? handleDeleteItem(item.id)
        : dispatch(
            updateCartItemQuantity({
              id: item.id,
              quantity:
                action === "increase" ? item.quantity + 1 : item.quantity - 1,
            })
          );
    }
  };

  // Function to confirm and place the order
  function confirmOrder() {
    // Prepare the data object with the necessary order details
    const isFieldEmpty =
      currentCustomer &&
      Object.values(currentCustomer)?.some((value) => !value);
    if (isFieldEmpty) {
      console.log("please fill your details!");
      // Alert.alert("Missing Detail", "Please Enter All Details");

      navigation.navigate("UpdateProfile");
      return;
    }

    const data = {
      branch: "12",
      SpecialRequests: notes,
      customerID: customerId,
      subtotal: totalPrice.toString(),
      deliveryType: cartItems[0]?.deliveryType.toString(),
      pickupDate: pickupDateString,
      order_source: "Mobile",
      emirate_id: emirates.find(
        (emirate) => emirate?.rate_code === currentCustomer?.rate_code
      )?.RateCodeID, //Todo : make it working
      orderDelete: "-",
      order_item: cartItems.reduce((result, item) => {
        result.push({
          item: item.cartItem.itemID.toString(),
          service: services.find(
            (service) => service.service === item.service.type
          ).id,
          DELIVERY: item.delivery.type,
          qty: item.quantity.toString(),
          Price: item.service.price.toString(),
        });
        return result;
      }, []),
      deliveryDate: deliveryDateString,
    };
    setOrderData(data);
    try {
      // Display confirmation alert before placing the order
      confirmationAlert(
        "confirm",
        "confirm order",
        () => console.log("Cancel Pressed"),
        () => {
          try {
            if (data.order_item.length > 0 && customerId) {
              // if (!isFieldEmpty) {
              postOrder(data);
              console.log(data);

              dispatch(emptyProducts());

              navigation.navigate("Thanks", {
                data,
                emirate: currentCustomer?.rate_code,
              });
            } else {
              showToast(
                "error",
                "Can't orderrrr!",
                "At least one item is required to place an order."
              );
            }
          } catch (e) {
            console.log("may be your api is not fetched correctly");
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  const renderItem = ({ item }) => {
    return (
      <View style={[styles.item]}>
        <View style={{ flex: 2 }}>
          <Text style={[styles.itemName, { fontSize: 17 }]}>{item.name}</Text>
          <Text style={[styles.itemName, { color: ColorPalate.dgrey }]}>
            {item.service.type} & {item.delivery.type || "delivery"}
          </Text>
        </View>

        <View>
          <View style={styles.quantityHandlerContainer}>
            <View style={{ alignItems: "center" }}>
              <Text style={styles.quantityText}>{item.quantity}</Text>

              <View style={styles.quantityContainer}>
                <Pressable
                  onPress={() => handleUpdateQuantity(item, "decrease")}
                  style={styles.quantityButton}
                  activeOpacity={0.7}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </Pressable>

                <Pressable
                  onPress={() => handleUpdateQuantity(item, "increase")}
                  style={styles.quantityButton}
                  activeOpacity={0.7}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </Pressable>
              </View>
            </View>

            <Text style={styles.itemPrice}>
              AED {(item.quantity * item.service.price).toFixed(2)}
            </Text>

            <Pressable
              onPress={() => handleDeleteItem(item.id)}
              style={styles.deleteButton}
              activeOpacity={0.7}
            >
              <Text>
                <MaterialIcons
                  name="delete"
                  size={20}
                  color={ColorPalate.dgrey}
                />
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container]}>
      {/* <View style={{ flex: 1 }}>  */}
      {/* <Toast config={toastConfig} /> */}

      <FlatList
        style={{ zIndex: -1 }}
        data={cartItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ListHeaderComponent={
          <View style={styles.card}>
            <View style={styles.reviewOrder}>
              <View style={styles.reviewTextsContainer}>
                <Text
                  style={[
                    styles.reviewOrderTexts,
                    { color: ColorPalate.dgrey },
                  ]}
                >
                  mode :{" "}
                </Text>
                <Text style={styles.reviewOrderTexts}>
                  {" "}
                  {
                    deliveryTypes.find(
                      (type) => type.id == (cartItems[0]?.deliveryType || "1")
                    )?.name
                  }{" "}
                </Text>
              </View>

              <View style={styles.reviewTextsContainer}>
                <Text
                  style={[
                    styles.reviewOrderTexts,
                    { color: ColorPalate.dgrey },
                  ]}
                >
                  pickup date{" "}
                </Text>
                <Text style={styles.reviewOrderTexts}>
                  {formatDate(pickupDateString)}{" "}
                </Text>
              </View>

              <View style={styles.reviewTextsContainer}>
                <Text
                  style={[
                    styles.reviewOrderTexts,
                    { color: ColorPalate.dgrey },
                  ]}
                >
                  delivery date{" "}
                </Text>
                <Text style={styles.reviewOrderTexts}>
                  {" "}
                  {formatDate(deliveryDateString)}{" "}
                </Text>
              </View>

              <View style={styles.reviewTextsContainer}>
                <Text
                  style={[
                    styles.reviewOrderTexts,
                    { color: ColorPalate.dgrey },
                  ]}
                >
                  special request{" "}
                </Text>
                <Text style={styles.reviewOrderTexts}>{notes}</Text>
              </View>

              <View style={styles.reviewTextsContainer}>
                <Text
                  style={[
                    styles.reviewOrderTexts,
                    { color: ColorPalate.dgrey },
                  ]}
                >
                  {" "}
                  Emirate{" "}
                </Text>
                <Text style={styles.reviewOrderTexts}>
                  {currentCustomer?.rate_code}
                </Text>
              </View>

              <View style={[styles.reviewTextsContainer,{flexWrap:'wrap'}]}>
                <Text
                  style={[
                    styles.reviewOrderTexts,
                    { color: ColorPalate.dgrey },
                  ]}
                >
                  {" "}
                  address{" : "}
                </Text>
                {/* <Text style={styles.reviewOrderTexts}>
                {currentCustomer?.address}
              </Text>  */}
                <Text style={styles.reviewOrderTexts}>
                  {currentCustomer?.apartment &&
                    currentCustomer?.apartment + " "}
                  {currentCustomer?.street_name &&
                    currentCustomer?.street_name + ", "}
                  {currentCustomer?.area && currentCustomer?.area + ", "}
                  {currentCustomer?.rate_code}
                </Text>
              </View>

              <View style={styles.reviewTextsContainer}>
                <Text
                  style={[
                    styles.reviewOrderTexts,
                    { color: ColorPalate.dgrey },
                  ]}
                >
                  {" "}
                  Total{" "}
                </Text>
                <Text style={styles.reviewOrderTexts}>{totalPrice}</Text>
              </View>

              <View style={styles.reviewTextsContainer}>
                <Text
                  style={[
                    styles.reviewOrderTexts,
                    { color: ColorPalate.dgrey },
                  ]}
                >
                  {" "}
                  Total items
                </Text>
                <Text style={styles.reviewOrderTexts}>{totalQty}</Text>
              </View>
            </View>
          </View>
        }
      />

      <View style={[styles.totalContainer, { marginTop: 10 }]}>
        <Pressable onPress={confirmOrder}>
          <Text style={styles.totalText}>Confirm Order</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#FFFFFF',
    // padding: 10,
    // borderRadius:25,
    // // marginTop:10,
    // marginHorizontal:2,
    // margin:10
  },
  card: {
    backgroundColor: "#FFFFFF",
    marginVertical: 10,
    // padding: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  item: {
    marginVertical: 5,
    padding: 20,
    borderRadius: 5,
    height: 70,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: ColorPalate.themeprimary,
  },
  itemName: {
    textTransform: "capitalize",
    fontSize: 14,
    color: ColorPalate.themeprimary,
    fontFamily: MyFonts.fontregular,
    marginBottom: 10,
  },
  quantityContainer: {
    alignItems: "center",
    marginHorizontal: 3,
    flexDirection: "row",
    // marginHorizontal: 3,
  },
  quantityButton: {
    width: 18,
    height: 18,
    marginVertical: 4,
    marginHorizontal: 4,
    backgroundColor: ColorPalate.themesecondary,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityText: {
    fontSize: 20,
    color: ColorPalate.themesecondary,
    fontFamily: MyFonts.fontmid,
  },
  deleteButton: {
    width: 20,
    height: 25,
    // marginLeft: 6,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  itemPrice: {
    fontSize: 14,
    color: ColorPalate.themeprimary,
    fontFamily: MyFonts.fontmid,
    marginHorizontal: 10,
  },
  quantityHandlerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButtonText: {
    fontSize: 14,
    color: ColorPalate.white,
    fontFamily: MyFonts.fontbold,
  },
  reviewOrder: {
    zIndex: -1000,
    marginVertical: 10,
    // height: 275,

    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  reviewOrderTexts: {
    textTransform: "capitalize",
    fontSize: 14,
    color: ColorPalate.themeprimary,
    marginBottom: 10,
    marginTop: 5,
    fontFamily: MyFonts.fontregular,
  },
  reviewTextsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 13,
    alignItems: "center",
    // marginHorizontal: 8,
    // borderBottomWidth: 1,
    // borderBottomColor: ColorPalate.themeprimary,
  },
  totalContainer: {
    backgroundColor: ColorPalate.themesecondary,
    paddingHorizontal: 10,
    paddingVertical: 15,
    justifyContent: "center",
    flexDirection: "row",
  },
  totalText: {
    color: ColorPalate.white,
    fontFamily: MyFonts.fontregular,
    fontSize: 18,
  },
  // cashTypeContainer: {
  //   width: "100%",
  //   height: 50,
  //   flexDirection: "row",
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
  // cashTypeButton: {
  //   borderWidth: 1,
  //   borderColor: ColorPalate.themesecondary,
  //   color: ColorPalate.themesecondary,
  //   height: 50,
  //   width: 110,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   aspectRatio: 2.5,
  // },
  // cashTypeButtonText: {
  //   fontFamily: MyFonts.fontbold,
  //   fontSize: 13,
  // },
});

export default CartOld;
