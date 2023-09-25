import React, { useEffect, useState } from "react";
import { StyleSheet, Pressable, View, Text } from "react-native";
import { useSelector } from "react-redux";
import { ColorPalate, MyFonts } from "../constants/var";
import { useNavigation } from "@react-navigation/native";
import {
  selectCartTotalPrice,
  selectCartTotalQuantity,
} from "../store/redux/reduxToolkit/cartSlice";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export const Totaling = ({ navigateTo, detailRoute }) => {
  const navigation = useNavigation();
  const [isDisabled, setIsDisabled] = useState();

  const totalPrice = useSelector(selectCartTotalPrice);
  const totalQty = useSelector(selectCartTotalQuantity);

  useEffect(() => {
    if (totalPrice && totalPrice > 0) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
    // console.log(isDisabled);
  }, [totalPrice]);

  return (
    <View style={styles.root}>
      <View style={[styles.totalContainer]}>
        <Text style={styles.totalText}>
          Total AED {totalPrice} |{" "}
          <Text style={styles.totalQtyText}>{totalQty} items added</Text>
        </Text>
      </View>

      <View style={[styles.nextBTNContainer]}>
        <Pressable
          disabled={isDisabled}
          style={[
            styles.nextButton,
            isDisabled && { backgroundColor: ColorPalate.dgrey, opacity: 0.8, width: "100%"  },
          ]}
          onPress={() => navigation.navigate(navigateTo, detailRoute)}
        >
          <View style={styles.nextButtonContent}>
            <Text style={styles.nextButtonText}>Next</Text>
            <MaterialIcons
              name="chevron-right"
              size={20}
              color={ColorPalate.white}
              style={styles.icon}
            />
          </View>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: ColorPalate.dgrey,
  },
  totalContainer: {
    backgroundColor: ColorPalate.white,
    paddingHorizontal: 10,
    // paddingVertical: 15,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: ColorPalate.lgrey,
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
  },
  totalText: {
    color: ColorPalate.themesecondary,
    fontFamily: MyFonts.fontregular,
    fontSize: 18,
  },
  totalQtyText: {
    fontSize: 14,
  },
  nextButton: {
    backgroundColor: ColorPalate.themesecondary,

    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  nextButtonText: {
    color: ColorPalate.white,
    fontFamily: MyFonts.fontregular,
    fontSize: 16,
    paddingVertical: 4,
  },
  nextBTNContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  nextButton: {
    backgroundColor: ColorPalate.themesecondary,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  nextButtonText: {
    color: ColorPalate.white,
    fontFamily: MyFonts.fontregular,
    fontSize: 16,
    paddingVertical: 4,
    marginLeft: 5, // Add left margin to create space between icon and text
  },
  nextButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 5, // Add right margin to separate icon from text
  },
  nextBTNContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
