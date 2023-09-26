import { createSlice } from "@reduxjs/toolkit";

const filteredDataSlice = createSlice({
  name: "filteredData",
  initialState: {
    filteredPricing: {},
    currentCustomerData: {},
    orderData: [],
    emiratesData:[]
  },
  reducers: {
    setFilteredData: (state, action) => {
      const { productId, filteredData } = action.payload;
      state.filteredPricing[productId] = filteredData;
    },
    setCurrentCustomerData: (state, action) => {
      state.currentCustomerData = action?.payload;
    },
    setOrderData: (state, action) => {
      state.orderData = action.payload;
    },
    setEmiratesData: (state, action) => {
      state.emiratesData = action.payload;
    },
  },
});

export const {setFilteredData, setCurrentCustomerData, setOrderData,setEmiratesData } =
  filteredDataSlice.actions;

export default filteredDataSlice.reducer;
