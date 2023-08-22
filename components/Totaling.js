// import {StyleSheet, TouchableOpacity, View, Text} from 'react-native';
// import {useSelector} from 'react-redux';
// import {ColorPalate, MyFonts} from '../constants/var';
// import {useNavigation} from '@react-navigation/native';
// import {
//   selectCartTotalPrice,
//   selectCartTotalQuantity,
// } from '../store/redux/reduxToolkit/cartSlice';

// export const Totaling = ({navigateTo, detailRoute}) => {
//   const usenavigation = useNavigation(); // Importing and initializing the useNavigation hook from a navigation library

//   // Retrieving the total price from the Redux store using the selectCartTotalPrice selector
//   const totalPrice = useSelector(selectCartTotalPrice);

//   // Retrieving the total quantity from the Redux store using the selectCartTotalQuantity selector
//   const totalQty = useSelector(selectCartTotalQuantity);

//   return (
//     <View style={styles.totalContainer}>
//       <View>
//         <Text style={styles.totalText}>
//           Total ${totalPrice} |
//           <Text style={{fontSize: 14}}> {totalQty} items added</Text>
//         </Text>
//       </View>
//       <View>
//         <TouchableOpacity
//           onPress={() => usenavigation.navigate(navigateTo, detailRoute)}>
//           <Text>Next</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   totalContainer: {
//     backgroundColor: ColorPalate.themesecondary,
//     paddingHorizontal: 10,
//     paddingVertical: 15,
//     justifyContent: 'center',
//     flexDirection: 'row',
//     borderWidth: 1,
//     borderColor: ColorPalate.lgrey,
//   },
//   totalText: {
//     color: ColorPalate.white,
//     fontFamily: MyFonts.fontregular,
//     fontSize: 18,
//   },
// });

// ____________________________
// -----------------------------

import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
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
      {/* <View style={styles.totalContainer}> */}
      <View style={[styles.totalContainer]}>
        <Text style={styles.totalText}>
          Total ${totalPrice} |{" "}
          <Text style={styles.totalQtyText}>{totalQty} items added</Text>
        </Text>
      </View>

      <View style={[styles.nextBTNContainer]}>
        <TouchableOpacity
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
        </TouchableOpacity>
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
    // backgroundColor: ColorPalate.white,
    backgroundColor: ColorPalate.themesecondary,

    paddingHorizontal: 20,
    paddingVertical: 10,
    // borderRadius: 5,
  },
  nextButtonText: {
    // color: ColorPalate.themesecondary,
    color: ColorPalate.white,
    fontFamily: MyFonts.fontregular,
    fontSize: 16,
    paddingVertical: 4,
  },
  nextBTNContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  // =================
  nextButton: {
    backgroundColor: ColorPalate.themesecondary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    // borderRadius: 5,
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

// export default Totaling;

// import React, { useEffect, useState } from 'react';
// import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
// import { useSelector } from 'react-redux';
// import { ColorPalate, MyFonts } from '../constants/var';
// import { useNavigation } from '@react-navigation/native';
// import {
//   selectCartTotalPrice,
//   selectCartTotalQuantity,
// } from '../store/redux/reduxToolkit/cartSlice';

// export const Totaling = ({ navigateTo, detailRoute }) => {
//   const navigation = useNavigation();
//   const [isDisabled, setIsDisabled] = useState(true);
//   const [isClicked, setIsClicked] = useState(false);

//   const totalPrice = useSelector(selectCartTotalPrice);
//   const totalQty = useSelector(selectCartTotalQuantity);

//   useEffect(() => {
//     setIsDisabled(totalPrice <= 0);
//   }, [totalPrice]);

//   const handleButtonClick = () => {
//     setIsClicked(true);
//     navigation.navigate(navigateTo, detailRoute);
//   };

//   return (
//     <View style={styles.root}>
//       <View style={styles.totalContainer}>
//         <Text style={styles.totalText}>
//           Total ${totalPrice} |{' '}
//           <Text style={styles.totalQtyText}>{totalQty} items added</Text>
//         </Text>
//       </View>

//       <View style={styles.nextBTNContainer}>
//         <TouchableOpacity
//           disabled={isDisabled}
//           style={[
//             styles.nextButton,
//             isClicked && styles.nextButtonClicked,
//           ]}
//           onPress={handleButtonClick}
//         >
//           <Text style={styles.nextButtonText}>
//             Next{' '}
//             <Text style={styles.nextButtonIcon}>{'>'}</Text>
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   root: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     borderWidth: 1,
//     borderColor: ColorPalate.dgrey,
//   },
//   totalContainer: {
//     backgroundColor: ColorPalate.white,
//     paddingHorizontal: 10,
//     flexDirection: 'row',
//     borderWidth: 1,
//     borderColor: ColorPalate.lgrey,
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: '80%',
//   },
//   totalText: {
//     color: ColorPalate.themesecondary,
//     fontFamily: MyFonts.fontregular,
//     fontSize: 18,
//   },
//   totalQtyText: {
//     fontSize: 14,
//   },
//   nextButton: {
//     backgroundColor: ColorPalate.themesecondary,
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//   },
//   nextButtonClicked: {
//     paddingLeft: 5,
//   },
//   nextButtonText: {
//     color: ColorPalate.white,
//     fontFamily: MyFonts.fontregular,
//     fontSize: 16,
//     paddingVertical: 4,
//   },
//   nextButtonIcon: {},
//   nextBTNContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default Totaling;
