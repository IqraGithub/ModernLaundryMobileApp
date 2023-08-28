import React, { useCallback, useEffect, useMemo, useState } from "react";
import { TabView, TabBar } from "react-native-tab-view";
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Text,
  Pressable,
  Image,
  Alert,
  SafeAreaView,
} from "react-native";
import { ColorPalate, MyFonts } from "../../constants/var";

// import ProductItem from "./ProductItem";
import HomeDropdown from "../HomeDropdown";
import { useDispatch, useSelector } from "react-redux";
import useEmirates from "../customHooks/getEmirates";
import useCustomerId from "../customHooks/customerId";
import useCurrentCustomer from "../customHooks/currentCustomer";
import useCurrentUserOrders from "../customHooks/getOrders";
import { useProducts } from "../customHooks/allProducts";
import {
  setAllProductsData,
  setCurrentCustomerData,
  setEmirateId,
  setEmiratesData,
  setOrderData,
  setFilteredData
} from "../../store/redux/reduxToolkit/filteredDataSlice";

import {
  addToCart,
  removeFromCart,
  selectItemTotalPrice,
  updateCartItemQuantity,
  updateItemServiceType,
  updateItemDelivery,
  selectCartItemById,
} from "../../store/redux/reduxToolkit/cartSlice";

import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import debounce from "lodash.debounce";
// ----------


const deliveryType = "1";
const delivery = [{ title: "Folded" }, { title: "Hanger" }];

// const ProductItem = ({ index, product, serviceId, delveryTimeId }) => {
const ProductItem = React.memo(({ product, index, selectedEmirate }) => {
  const cartItemPrice = useSelector((state) =>
    selectItemTotalPrice(state, product.id)
  );
  const cartItem = useSelector((state) =>
    selectCartItemById(state, product.id)
  );
  let emirates = useSelector((state) => state.filteredData.emiratesData);
  let filteredPricing = useSelector(
    (state) => state.filteredData.filteredPricing[product.id]
  );

  // const { cartItemPrice, cartItem, emirates, filteredPricing } = useSelector(
  //   (state) => ({
  //     cartItemPrice: selectItemTotalPrice(state, product.id),
  //     cartItem: selectCartItemById(state, product.id),
  //     emirates: state.filteredData.emiratesData,
  //     filteredPricing: state.filteredData.filteredPricing[product.id],
  //   })
  // );

  const [selectedService, setSelectedService] = useState(
    cartItem ? cartItem.service : { type: undefined, price: 0 }
  );
  const [selectedDelivery, setSelectedDelivery] = useState(
    cartItem ? cartItem.delivery : { type: undefined }
  );
  const [emirateId, setEmirateId] = useState(null);
  const [filtered, setFiltered] = useState([]);

  const customerId = useCustomerId();
  const currentCustomer = useCurrentCustomer(customerId);
  const dispatch = useDispatch();

  // -----------------------
  // console.log('selectedEmirate',selectedEmirate)
  // useEffect(() => {
  //   async function getEmirateId() {
  //     try {
  //       const emirate = emirates?.find(
  //         (emirate) => emirate.rate_code === selectedEmirate
  //       );
  //       // console.log('selected Emirate in product item',selectedEmirate)
  //       if (emirate) {
  //         setEmirateId(emirate.RateCodeID);
  //       }
  //     } catch (error) {
  //       console.log("got an error while fatching emirates ", error);
  //     }
  //   }
  //   getEmirateId();
  // }, [currentCustomer]);
  useEffect(() => {
    const emirate = emirates?.find((e) => e.rate_code === selectedEmirate);
    if (emirate) setEmirateId(emirate.RateCodeID);
  }, [selectedEmirate]);
  // -----------------------

  // -----------------------

  useEffect(() => {
    if (emirateId) {
      let filteredPricingData = product.pricing?.filter(
        (obj) =>
          obj.deliveryType === deliveryType && obj.emirate_id == emirateId
      );
      // .map(({ service, price }) => ({ service, price }));
      dispatch(
        setFilteredData({
          productId: product.id,
          filteredData: filteredPricingData,
        })
      );
    }
  }, [product, emirateId]);
  // const getFilteredData = useCallback(() => {
  //   if (emirateId) {
  //     const filteredPricingData = product?.pricing?.filter(
  //       (obj) =>
  //         obj.deliveryType === deliveryType && obj.emirate_id == emirateId
  //     );
  //     dispatch(
  //       setFilteredData({
  //         productId: product.id,
  //         filteredData: filteredPricingData,
  //       })
  //     );
  //   }
  // }, [product, emirateId]);

  // useEffect(getFilteredData, [product, emirateId]);
  // -------------------------------
  // -------------------------------
  // const sortSubArrays = (arr) => {
  //   return arr.sort((a, b) => a.service.localeCompare(b.service));
  // };

  // useEffect(() => {
  //   if (filteredPricing !== undefined) {
  //     const tr = [...filteredPricing];
  //     const sortedarr = sortSubArrays(tr);
  //     setFiltered(sortedarr);
  //   }
  // }, [filteredPricing]);

  const sortSubArrays = useCallback((arr) => {
    return arr.sort((a, b) => a.service.localeCompare(b.service));
  }, []);

  useEffect(() => {
    if (filteredPricing) {
      const sortedArray = sortSubArrays([...filteredPricing]);
      setFiltered(sortedArray);
    }
  }, [filteredPricing]);

  // -------------------------------
  // Decrease the quantity of the selected service
  function decreaseQtyHandler() {
    if (selectedService) {
      // Check if `cartItem` is truthy
      cartItem
        ? cartItem.quantity === 1
          ? dispatch(removeFromCart(cartItem.id)) // If the quantity is 1, dispatch the `removeFromCart` action with `id` to remove it from the cart
          : dispatch(
              updateCartItemQuantity({
                id: cartItem.id,
                quantity: cartItem.quantity - 1,
              })
            ) // Dispatch the `updateCartItemQuantity` action with the `cartItem.id` and decreased quantity to update the cart item's quantity
        : {}; // If `cartItem` is falsy, do nothing
    }
  }

  // Increase the quantity of the selected service
  function increaseQtyHandler() {
    // Check if both service and delivery are selected
    if (!selectedService.type || !selectedDelivery.type) {
      Alert.alert("Please select a service and delivery");
    }
    // If service and delivery are selected, add or update the cart
    if (selectedService.type && selectedDelivery.type) {
      // If the cart item already exists, update its quantity
      if (cartItem) {
        dispatch(
          updateCartItemQuantity({
            id: cartItem?.id,
            quantity: cartItem.quantity + 1,
          })
        );
      } else {
        // If the cart item doesn't exist, add it to the cart
        dispatch(
          addToCart({
            cartItem: product,
            service: selectedService,
            delivery: selectedDelivery,
            id: product.id,
            name: product.item_name,
            quantity: 1,
            category: product.item_cat1,
            deliveryType,
            emirateId,
            emirateName: currentCustomer?.rate_code,
            pickupDate: new Date(),
            deliveryDate: new Date(),
          })
        );
      }
    }
  }

  // Update the selected service and dispatch the action to update the item's service type
  function serviceButtonHandler(service) {
    // Set the selected service
    setSelectedService({
      type: service.service,
      price: Number(parseFloat(service.price).toFixed(2)) ?? 1,
    });

    // If a cart item exists, dispatch the action to updat/e the item's service type
    cartItem &&
      dispatch(
        updateItemServiceType({
          id: product.id,
          serviceType: service.service,
          servicePrice: Number(parseFloat(service.price).toFixed(2)) ?? 1,
          deliveryType,
        })
      );
  }

  // Update the selected delivery and dispatch the action to update the item's delivery type
  function deliveryButtonHandler(delivery) {
    // Set the selected delivery
    setSelectedDelivery({ type: delivery.title });

    // If a cart item exists, dispatch the action to update the item's delivery type
    cartItem &&
      dispatch(
        updateItemDelivery({
          id: product.id,
          deliveryType: delivery.title,
        })
      );
  }

  return (
    <View key={index} style={styles.itemContainer}>
      <Text style={styles.itemName}>{product.item_name}</Text>
      <View style={styles.contentConatiner}>
        <View
          style={{
            borderRightColor: ColorPalate.themesecondary,
            borderRightWidth: 1,
            flex: 1,
            padding: 10,
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Image
            source={{
              uri: product.image_url,
            }}
            style={styles.itemImage}
          />
          <View style={styles.qntyBtnContainer}>
            <Pressable
              onPress={decreaseQtyHandler}
              activeOpacity={0.7}
              style={styles.quantityBtn}
            >
              <Text style={[styles.quantityBtnText]}>-</Text>
            </Pressable>
            <Text
              style={{
                color: ColorPalate.themesecondary,
                fontSize: 24,
                fontFamily: MyFonts.fontmid,
              }}
            >
              {cartItem?.quantity ?? 0}
            </Text>
            <Pressable
              onPress={increaseQtyHandler}
              activeOpacity={0.7}
              style={styles.quantityBtn}
            >
              <Text style={styles.quantityBtnText}>+</Text>
            </Pressable>
          </View>
        </View>
        <View
          style={{
            flex: 3,
            flexDirection: "row",
            justifyContent: "space-evenly",
            paddingVertical: 10,
          }}
        >
          <View style={{}}>
            <View style={[styles.contentitems, {}]}>
              <Text
                style={{
                  color: ColorPalate.white,
                  color: ColorPalate.white,
                  backgroundColor: ColorPalate.themesecondary,
                  borderRadius: 5,
                  fontSize: 11,
                  fontFamily: MyFonts.fontregular,
                  textTransform: "uppercase",
                }}
              >
                {"service"}
              </Text>
            </View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <FlatList
                data={filtered && filtered}
                // data={pricingFilter}
                keyExtractor={(item, idx) => idx}
                renderItem={(item) => {
                  return (
                    <Pressable
                      onPress={() => serviceButtonHandler(item.item)}
                      activeOpacity={0.7}
                      style={[
                        styles.slection,
                        {
                          backgroundColor:
                            selectedService.type == item.item.service
                              ? ColorPalate.themesecondary
                              : undefined,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.slectionText,
                          {
                            color:
                              selectedService.type == item.item.service
                                ? "white"
                                : ColorPalate.themesecondary,
                            fontFamily: MyFonts.fontbold,
                          },
                        ]}
                      >
                        {item.item.service}
                      </Text>
                    </Pressable>
                  );
                }}
              />

              {/* =============================== */}
            </View>
          </View>
          <View style={{}}>
            <Text style={styles.contentitems}>delivery</Text>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              {/* =========================================== */}
              <FlatList
                listKey={(item, index) => "D" + index.toString()} // Assigning a unique key to each item in the list
                data={delivery}
                // keyExtractor={(item,index) => index}
                renderItem={(item, idx) => {
                  return (
                    <Pressable
                      // key={idx}
                      onPress={() => deliveryButtonHandler(item.item)}
                      activeOpacity={0.7}
                      style={[
                        styles.slection,
                        {
                          backgroundColor:
                            selectedDelivery.type == item.item.title
                              ? ColorPalate.themesecondary
                              : undefined,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.slectionText,
                          {
                            color:
                              selectedDelivery.type == item.item.title
                                ? "white"
                                : ColorPalate.themesecondary,
                            fontFamily: MyFonts.fontmid,
                          },
                        ]}
                      >
                        {item.item.title}
                      </Text>
                    </Pressable>
                  );
                }}
              />
            </View>
          </View>

          <View>
            <Text style={styles.contentitems}>price</Text>
            <Text style={styles.priceText}>AED</Text>
            <Text style={[styles.priceText, { fontSize: 20 }]}>
              {cartItemPrice}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
});



const routes = [
  { key: "Men", title: "Men" },
  { key: "Ladies", title: "Ladies" },
  { key: "Kids", title: "Kids" },
  { key: "Home", title: "Home" },
];


const renderTabBar = (props) => (
  <TabBar
    {...props}
    bounces
    inactiveColor={ColorPalate.dgrey}
    activeColor={ColorPalate.themeprimary}
    pressColor={ColorPalate.lgrey}
    indicatorStyle={{ backgroundColor: ColorPalate.themeprimary, height: 3 }}
    style={{ backgroundColor: ColorPalate.white }}
    labelStyle={{ fontFamily: MyFonts.fontregular, fontSize: 12 }}
  />
);

const MyTabView = ({ selectedTime, selectedServiceId }) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [index, setIndex] = useState(0);
  const [isSearchExpanded, setSearchExpanded] = useState(false);
  const [selectedEmirate, setSelectedEmirate] = useState();
  const [filteredProducts, setFilteredProducts] = useState([]);

  const { products, isLoading } = useProducts();
  // const { products, isLoading, isError } = useGetCustomersQuery()
  const orders = useCurrentUserOrders();
  const emirates = useEmirates();
  const customerId = useCustomerId();
  const currentCustomer = useCurrentCustomer(customerId);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setCurrentCustomerData(currentCustomer));
    setSelectedEmirate(currentCustomer?.rate_code);
  }, [currentCustomer]);

  useEffect(() => {
    dispatch(setOrderData(orders));
  }, [orders]);

  useEffect(() => {
    if (emirates) {
      dispatch(setEmiratesData(emirates));
    }
  }, [emirates]);

  useEffect(() => {
    const handleSearch = () => {
      if (searchKeyword.trim() !== "") {
        const filtered = products?.filter((product) =>
          product.item_name.toLowerCase().includes(searchKeyword.toLowerCase())
        );
        setFilteredProducts(filtered);

        // Check if the filtered product is in a different tab and switch to that tab
        const category = filtered.length > 0 ? filtered[0].item_cat1 : null;
        const tabIndex = routes.findIndex((route) => route.key === category);
        if (tabIndex !== -1 && tabIndex !== index) {
          setIndex(tabIndex);
        }
      } else {
        setFilteredProducts(products);
      }
    };
    handleSearch();
  }, [searchKeyword, products]);

  const headerCollapseHandler = useCallback((shouldExpand) => {
    setSearchExpanded(shouldExpand);
  }, []);

  // useEffect(() => {
  //   const register = async () => {
  //     try {
  //       const userId = await AsyncStorage.getItem("customerId");
  //       console.log("userId home--------" + userId);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   register();
  // }, []);

  const CategoryList = ({ categoryName }) => {
    const filteredData = useMemo(() => {
      return filteredProducts?.filter(
        (item) => item.item_cat1 === categoryName
      );
    }, [filteredProducts, categoryName]);
    // console.log("isloading", isLoading);
    return isLoading ? (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={ColorPalate.themeprimary} />
      </View>
    ) : (
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.itemID}
        renderItem={({ item, index }) => (
          <ProductItem
            product={item}
            selectedEmirate={selectedEmirate}
            index={index}
            serviceId={selectedServiceId}
            delveryTimeId={selectedTime}
          />
        )}
      />
    );
  };

  const renderScene = ({ route }) => {
    return <CategoryList categoryName={route.key} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <View styles={[styles.collapseContainer]}> */}
      <View
        style={{
          height: 53,
          backgroundColor: ColorPalate.white,
          zIndex: 100000,
          flexDirection: "row",
          paddingTop: 10,
        }}
      >
        {isSearchExpanded ? (
          <View
            style={[
              styles.searchContainer,
              { flex: 1, justifyContent: "center", alignItems: "center" },
            ]}
          >
            <View
              style={[
                styles.searchInputContainer,
                {
                  backgroundColor: ColorPalate.white,
                  width: "100%",
                  position: "absolute",
                },
              ]}
            >
              <TextInput
                style={styles.searchInput}
                placeholder="Search product"
                value={searchKeyword}
                onChangeText={(text) => setSearchKeyword(text)}
              />
              <FontAwesomeIcon
                name="search"
                size={24}
                color={ColorPalate.dgrey}
                style={styles.searchIcon}
              />
            </View>
          </View>
        ) : (
          <View
            style={{
              position: "relative",
              height: 45,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 7,
            }}
          >
            <Pressable style={{}} onPress={() => headerCollapseHandler(true)}>
              <Text style={{}}>
                <FontAwesomeIcon
                  name="search"
                  size={22}
                  style={styles.searchIcon}
                  color={ColorPalate.dgrey}
                />
              </Text>
            </Pressable>
          </View>
        )}

        {isSearchExpanded ? (
          <Pressable
            style={{
              position: "relative",
              height: 45,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => headerCollapseHandler(false)}
          >
            <View>
              <Text style={{ marginRight: 14 }}>
                <FontAwesomeIcon
                  name="map"
                  size={22}
                  color={ColorPalate.dgrey}
                  style={styles.mapIcon}
                />
              </Text>
            </View>
          </Pressable>
        ) : (
          <View
            style={{
              flex: 1,
              height: 50,
              position: "relative",
              right: 1,
            }}
          >
            <HomeDropdown
              options={emirates}
              onSelect={setSelectedEmirate}
              key={"RateCodeID"}
              value={"rate_code"}
              selectedValue={selectedEmirate ?? currentCustomer?.rate_code}
            />
          </View>
        )}
      </View>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={renderTabBar}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  collapseContainer: {
    flex: 1,
    width: "100%",
    borderTopWidth: 10,
    backgroundColor: ColorPalate.white,
  },
  searchContainer: {
    paddingHorizontal: 16,
    backgroundColor: ColorPalate.white,
    paddingTop: 16,
  },
  smallSearchContainer: {
    marginLeft: 16,
    backgroundColor: ColorPalate.white,
    paddingTop: 16,
    width: "12%",
    justifyContent: "center",
    alignItems: "center",
  },

  searchInputContainer: {
    // position: "relative",
  },

  searchInput: {
    backgroundColor: ColorPalate.lgrey,
    color: ColorPalate.dgrey,
    borderColor: ColorPalate.dgrey,
    fontFamily: MyFonts.fontregular,
    fontSize: 14,
    height: 40,
    paddingHorizontal: 8,
    paddingRight: 40,
    borderWidth: 1,
    borderRadius: 8,
  },

  searchIcon: {
    position: "absolute",
    right: 8,
    top: 8,
    color: ColorPalate.themeprimary,
  },
  centerSearchIcon: {
    position: "absolute",
    alignSelf: "center",
    top: 8,
  },

  // ------------------------------------------------

  container: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: "column",
    backgroundColor: "#fff",
    marginHorizontal: 10,
    marginVertical: 15,
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
    borderWidth: 2,
    borderColor: ColorPalate.themesecondary,
  },
  itemName: {
    marginLeft: -1,
    marginTop: -1,
    textTransform: "uppercase",
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: ColorPalate.themesecondary,
    color: ColorPalate.white,
    fontFamily: MyFonts.fontregular,
  },
  contentConatiner: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemImage: {
    width: 80,
    height: 80,
  },
  qntyBtnContainer: {
    marginTop: 10,
    width: 85,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quantityBtn: {
    // width: 27,
    // height: 25,
    // // flex:1/2,
    // // width:40,
    // color: ColorPalate.white,
    // backgroundColor: ColorPalate.themesecondary,
    // // paddingVertical: 0,
    // // paddingHorizontal: 2,
    // borderRadius: 5,
    // alignItems: "center",
    // justifyContent: "center",

    backgroundColor: ColorPalate.themesecondary,
    // paddingHorizontal:10,
    // paddingVertical:5,
    paddingHorizontal: 7,
    borderRadius: 5,
  },
  quantityBtnText: {
    // textAlign: "center",
    fontSize: 20,
    // // fontWeight: "100",
    fontFamily: MyFonts.fontmid,
    color: ColorPalate.white,
    // marginBottom:8,
    // paddingHorizontal:8
  },
  contentitems: {
    color: ColorPalate.white,
    backgroundColor: ColorPalate.themesecondary,
    paddingHorizontal: 10,
    selfalign: "center",
    paddingVertical: 5,
    borderRadius: 5,
    fontSize: 11,
    fontFamily: MyFonts.fontregular,
    textTransform: "uppercase",
    justifyContent: "center",
    alignItems: "center",
  },
  slection: {
    width: 80,
    borderWidth: 1,
    borderColor: ColorPalate.themesecondary,
    borderRadius: 5,
    marginTop: 10,
    paddingHorizontal: 5,
    paddingVertical: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  slectionText: {
    fontSize: 11,
    fontFamily: MyFonts.fontregular,
    color: ColorPalate.themesecondary,
    textAlign: "center",
  },
  priceText: {
    marginTop: 5,
    color: ColorPalate.themesecondary,
    paddingHorizontal: 5,
    paddingVertical: 3,
    textAlign: "center",
    fontSize: 15,
    fontFamily: MyFonts.fontregular,
  },
  stylePress: {
    opacity: 0.75,
  },
});

export default MyTabView;
