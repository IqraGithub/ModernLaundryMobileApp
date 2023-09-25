import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { ColorPalate, MyFonts } from "../../constants/var";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import useCurrentUserOrders from "../../components/customHooks/getOrders";

export const deliveryTypes = [
  { id: 1, name: "Standard" },
  { id: 2, name: "Express" },
  { id: 3, name: "Sameday" },
];
const OrderScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const o = useCurrentUserOrders()
  let filteredOrder = o?.slice()?.reverse(); 
  // let filteredOrder = o?.slice()?.sort((a, b) => b.id - a.id);

  useEffect(() => {
    filteredOrder ? setIsLoading(false) : setIsLoading(true)
  }, [filteredOrder]);


  return (
    <>
      {isLoading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={ColorPalate.themeprimary} />
        </View>
      ) : (
        <ScrollView>
          <Toast />
          <View style={styles.container}>
            {filteredOrder && filteredOrder.length > 0 ? (
              filteredOrder.map((order) => {
                return (
                  <View key={order.id} style={styles.orderTypeContainer}>
                    <Pressable
                      activeOpacity={0.6}
                      onPress={() =>
                        navigation.navigate("OrderDetails", { order })
                      }
                    >
                      <View>
                        <View
                          style={[
                            styles.orderTextContainer,
                            {
                              borderBottomWidth: 1,
                              paddingBottom: 10,
                              borderColor: ColorPalate.dgrey,
                            },
                          ]}
                        >
                          <View style={{ flexDirection: "row" }}>
                            <Text
                              style={[styles.orderText, styles.orderNumberText]}
                            >
                              Order No.{" "}
                            </Text>
                            <Text
                              style={[
                                styles.orderText,
                                styles.serviceText,
                                { marginLeft: 10 },
                              ]}
                            >
                              {order.id}
                            </Text>
                          </View>

                          <View style={{ flexDirection: "row" }}>
                            <Text
                              style={[styles.orderText, styles.orderNumberText]}
                            >
                              AED{" "}
                            </Text>
                            <Text style={[styles.orderText, styles.priceText]}>
                              {order.subtotal}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.orderTextContainer}>
                          <Text
                            style={[styles.orderText, styles.orderNumberText]}
                          >
                            Pickup Date{" "}
                          </Text>
                          <Text style={[styles.orderText, styles.serviceText]}>
                            {new Date(order.pickupDate).toLocaleDateString(
                              "en-GB"
                            )}
                          </Text>
                        </View>
                        <View style={styles.orderTextContainer}>
                          <Text
                            style={[styles.orderText, styles.orderNumberText]}
                          >
                            Delivery Date{" "}
                          </Text>
                          <Text style={[styles.orderText, styles.serviceText]}>
                            {new Date(order.deliveryDate).toLocaleDateString(
                              "en-GB"
                            )}
                          </Text>
                        </View>
                        <View style={styles.orderTextContainer}>
                          <Text
                            style={[styles.orderText, styles.orderNumberText]}
                          >
                            Emirate
                          </Text>
                          <Text style={[styles.orderText, styles.serviceText]}>
                            {order.emirate_id}
                          </Text>
                        </View>
                        <View style={styles.orderTextContainer}>
                          <Text
                            style={[styles.orderText, styles.orderNumberText]}
                          >
                            Mode
                          </Text>
                          <Text style={[styles.orderText, styles.serviceText]}>
                            {
                              deliveryTypes.find(
                                (i) => i.id == order.deliveryType
                              )?.name
                            }
                          </Text>
                        </View>

                        <View style={styles.orderTextContainer}>
                          <Text
                            style={[styles.orderText, styles.orderNumberText]}
                          >
                            Status
                          </Text>
                          <Text style={[styles.orderText, styles.serviceText]}>
                            {order.orderStatus}
                          </Text>
                        </View>
                      </View>
                    </Pressable>
                  </View>
                );
              })
            ) : (
              <Text style={styles.text}>you dont have any order</Text>
            )}
          </View>
        </ScrollView>
      )}
    </>
  );
};

export default OrderScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  text: {
    color: ColorPalate.themeprimary,
    textAlign: "center",
    fontSize: 20,
    padding: 10,
    fontFamily: MyFonts.fontregular,
  },
  orderTypeContainer: {
    borderWidth: 1,
    borderColor: ColorPalate.skyblue,
    backgroundColor: ColorPalate.white,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    margin: 10,
    marginTop: 20,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  orderTextContainer: {
    marginVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  orderText: {
    fontFamily: MyFonts.fontregular,
  },
  serviceText: {
    color: ColorPalate.themeprimary,
    fontFamily: MyFonts.fontregular,
    fontSize: 18,
  },
  priceText: {
    color: ColorPalate.themeprimary,
    fontFamily: MyFonts.fontregular,

    fontSize: 18,
    marginLeft: 10,
  },
  orderNumberText: {
    color: ColorPalate.dgrey,
    fontFamily: MyFonts.fontregular,

    fontSize: 16,
  },
});
