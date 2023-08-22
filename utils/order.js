const order = {
  customerId : "2",
  PickUpDate: "", // string date
  DeliveryDate: "", // string date
  DeliverTo: "1", // address table - address id
  SpecialRequests: "", // text
  totalQty: "14",
  totalAmt: "233.20",
  DeliveryMode: "2", // 1 - Standard, 2 - Express, 3 - SameDay
  emirateId: "", // 1- Ras-al-Khaimah, 2 - Sarjha, etc...
  items: [
    { itemId: "12", Quantity: "3", service: "2", deliveryType: "Folded", price:"" },
    { itemId: "34", Quantity: "7", service: "1", deliveryType: "hanger", price:"" },
    { itemId: "13", Quantity: "4", service: "1", deliveryType: "hanger", price:"" },
  ],
};
