import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { ColorPalate, MyFonts } from '../constants/var';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useEffect } from 'react';
import useCustomerId from './customHooks/customerId';
import useCurrentCustomer from './customHooks/currentCustomer';
import { putProfile } from '../utils/api';
import { setCurrentCustomerData } from '../store/redux/reduxToolkit/filteredDataSlice';
import { useDispatch } from 'react-redux';
import { useCallback } from 'react';

// const HomeDropdown = ({ options, onSelect, value, label, selectedValue }) => {
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const customerId = useCustomerId();
//   const currentCustomer = useCurrentCustomer(customerId)
//   const dispatch = useDispatch( )

// const [showEmirate, setShowEmirate] =  useState(null)

//   const handleOptionSelect = option => {
//     setSelectedOption(option);
//     onSelect(option);
//     setIsDropdownOpen(false);
//   };

//   useEffect(() => {
//     selectedValue ? setSelectedOption(selectedValue) : null;
//   }, []);


//   const updateEmirate = async () => {
//     try {
//       await putProfile({
//         id: currentCustomer?.id,
//         rate_code: selectedOption,
//         Password: currentCustomer?.Password,
//       });

//       dispatch(setCurrentCustomerData(currentCustomer))
//       // console.log('ratecode', rate_code);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     setSelectedOption(selectedOption);
//     setShowEmirate(selectedOption)
//     updateEmirate();
//   }, [selectedOption]);

//   useEffect(() => {
//     if (currentCustomer?.rate_code) {
//       setSelectedOption(currentCustomer.rate_code);
//       setShowEmirate(currentCustomer.rate_code)
//     }
//   }, [currentCustomer?.rate_code]);

const HomeDropdown = ({ options, onSelect, value, selectedValue }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const customerId = useCustomerId();
  const currentCustomer = useCurrentCustomer(customerId)
  const dispatch = useDispatch();
  const [showEmirate, setShowEmirate] = useState(null);

  useEffect(() => {
    const initialValue = selectedValue || currentCustomer?.rate_code || null;
    setShowEmirate(initialValue);
  }, [selectedValue, currentCustomer?.rate_code]);

  const handleOptionSelect = useCallback((optionValue) => {
    setShowEmirate(optionValue);
    onSelect(optionValue);
    setIsDropdownOpen(false);

    const updateEmirate = async () => {
      try {
        await putProfile({
          id: currentCustomer?.id,
          rate_code: optionValue,
          Password: currentCustomer?.Password,
        });

        dispatch(setCurrentCustomerData(currentCustomer));
      } catch (error) {
        console.log(error);
        // Possibly set some error state to show the user.
      }
    };

    updateEmirate();
  }, [currentCustomer, dispatch, onSelect]);

  const toggleDropdown = () => {
    setIsDropdownOpen(prevState => !prevState);
  };


  return (
    <View style={styles.container}>
    <TouchableOpacity
      style={styles.dropdownButton}
      activeOpacity={0.7}
      onPress={toggleDropdown}
    >
        <View style={styles.dropdownButtonContent}>
          {/* <Text style={styles.dropdownButtonText}>{currentCustomer?.rate_code || selectedOption || 'Home'}</Text> */}
          <Text style={styles.dropdownButtonText}>{showEmirate || 'Home'}</Text>
          <MaterialIcons
            name={isDropdownOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
            size={28}
            color={ColorPalate.themeprimary}
          />
        </View>
      </TouchableOpacity>

      {isDropdownOpen && (
        <ScrollView style={styles.dropdownList}>
          {options?.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.dropdownListItem}
              onPress={() =>{ 
                console.log(option)
                return handleOptionSelect(option[value])}}
                >
              <Text style={styles.dropdownListItemText}>{option[value]}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};
// export default HomeDropdown;
export default React.memo(HomeDropdown);


const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width:'100%',
    zIndex:99999,
  },
  label: {
    fontFamily: MyFonts.fontregular,
    fontSize: 16,
    color: ColorPalate.themeprimary,
    marginTop: 5,
    marginBottom: 3,
    marginLeft: 1,
  },
  dropdownButton: {
    position:'relative',
    top:0,
    zIndex:100000000,
    backgroundColor: ColorPalate.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderColor: ColorPalate.dgrey,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
   dropdownButtonText: {
    fontFamily: MyFonts.fontbold,
    fontSize: 18,
    color: ColorPalate.themeprimary,
    zIndex: 999,
  },
  dropdownButtonContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        zIndex:99999
      },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    width: '100%',
    opacity:1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: ColorPalate.lgrey,
    borderRadius: 5,
    // maxHeight: 250,
    overflow: 'scroll',
    zIndex: 10000,
    marginTop: 4,
    zIndex: 999,
    width: '100%',
  },
  dropdownListItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: ColorPalate.lgrey,
    zIndex: 99999,
  },
  dropdownListItemText: {
    fontFamily: MyFonts.fontregular,
    fontSize: 16,
    color: ColorPalate.dgrey,
    zIndex: 99999,
  },
});

