// import { ADD_TO_CART, REMOVE_FROM_CART } from './cartAction';

// const initialState = {
//   items: [], // array to hold added items
//   total: 0, // total price of added items
// };

// const cartReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case ADD_TO_CART: {
//       const itemIndex = state.items.findIndex(item => item.id === action.payload.id);
//       if (itemIndex >= 0) {
//         // item already exists in the cart, so update its quantity and price
//         const updatedItem = {
//           ...state.items[itemIndex],
//           quantity: state.items[itemIndex].quantity + action.payload.quantity,
//           price: state.items[itemIndex].price + action.payload.price,
//         };
//         return {
//           ...state,
//           items: [
//             ...state.items.slice(0, itemIndex),
//             updatedItem,
//             ...state.items.slice(itemIndex + 1),
//           ],
//           total: state.total + action.payload.price,
//         };
//       } else {
//         // item does not exist in the cart, so add it
//         const newItem = {
//           ...action.payload,
//           price: action.payload.price * action.payload.quantity,
//         };
//         return {
//           ...state,
//           items: [...state.items, newItem],
//           total: state.total + newItem.price,
//         };
//       }
//     }
//     case REMOVE_FROM_CART: {
//       const itemIndex = state.items.findIndex(item => item.id === action.payload);
//       if (itemIndex >= 0) {
//         // item exists in the cart, so remove it
//         const itemPrice = state.items[itemIndex].price;
//         return {
//           ...state,
//           items: [
//             ...state.items.slice(0, itemIndex),
//             ...state.items.slice(itemIndex + 1),
//           ],
//           total: state.total - itemPrice,
//         };
//       } else {
//         // item does not exist in the cart, so return current state
//         return state;
//       }
//     }
//     default:
//       return state;
//   }
// };

// export default cartReducer;



