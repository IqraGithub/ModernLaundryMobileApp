import axios from "axios";

const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/js',
      api_key: '457e93fd1d01411eaefb7b8513d09a29',
      api_id:'API-f54eb871-4796-4bf5-9d28-1ccdee50baf7'
    },
  };
const API_URL = 'https://jogetdev8.ghobash.com:8443'


async function getCustomers() {
  try {
    const response = await axios.get(`${API_URL}/jw/api/list/list_customersAPI`, config);
    const data = await response.data;
    return data;
  } catch (error) {
    console.log(error);
    throw new Error('Unable to fetch customer data. Please try again later.');
  }
}

async function getProducts() {
  try {
    const response = await axios.get(`${API_URL}/jw/api/list/Items_API_2`, config);
    // const data = response.data;
    const data = response.data.data;
    return data
  } catch (error) {
    console.error(error); 
  }
}

  // async function getProducts() {
  //   try {
  //     // const response = await axios.get(`${API_URL}/jw/api/list/Items_API_2`, config);
      
  //   // created json server of our products to check weather our api is slow or the logic i wrote
  //     const response = await axios.get(`https://my-products-db.vercel.app/data`);
  //     // console.log('data called',response)
      
  //     // const data = response;
  //     return response
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

async function getServices() {
  try {
    const response = await axios.get(`${API_URL}/jw/api/list/categories_api`, config);
    const data = response.data;
    return data
  } catch (error) {
    console.error(error);
  }
}

async function getDeliveryTypes() {
  try {
    const response = await axios.get(`${API_URL}/jw/api/list/list_deliveryTypeAPI`, config);
    const data = response.data.data;
    return data
  } catch (error) {
    console.error(error);
  }
}

async function getEmirates() {
  try {
    const response = await axios.get(`${API_URL}/jw/api/list/list_rateCodesAPI`, config);
    const data = response.data;
    return data.data
  } catch (error) {
    console.error(error);
  }
}
async function getArea() {
  try {
    const response = await axios.get(`${API_URL}/jw/api/list/list_areaListAPI`, config);
    const data = response.data;
    return data
  } catch (error) {
    console.error(error);
  }
}


const postOrder = async (data) => {

  try {
      const response = await axios.post(`${API_URL}/jw/api/form/orderFormAPI`,data,config)
      console.log(response.data)
      return response.data
  } catch (error) {
      console.error(error);
  }

}

const getOrders = async () => {
  try {
    const response = await axios.get(`${API_URL}/jw/api/list/order_api`, config);
    // console.log(response.data);
    return response.data; 
  } catch (error) {
    console.error(error);
  }
}

const postSignUp = async(data)=>{
  try{
    const response = await axios.post(`${API_URL}/jw/api/form/customers`,data,config)
    console.log('post signup response', response.data)
      return response.data
  }catch(e){
    console.log(e)
  }
}

const  putProfile = async(updatedData)=> {
  try{
    const response = await axios.put(`${API_URL}/jw/api/form/customers`, updatedData,config)
    console.log('response.data',response.data)
    return response.data
  }catch(e){
    console.log(e.response.data); 
  }
}

// const  postOTP = async(data)=> {
//   try{
//     // const response = await axios.post(`${API_URL}jw/api/process/forgetPasswordProcess/startProcessByUser/admin`, data,config)
//     console.log('data',data)
//     const response = await axios.post(`https://jogettestdx8.ghobash.com:8443/jw/api/process/forgetPasswordProcess/startProcessByUser/admin`,  {"customer_id": "87", "email": "bagbanikram@gmail.com", "id": 999, "otp": 2342},{api_key: 'dbd603e47c4543d1ab88983e637d100d', api_id:'API-f54eb871-4796-4bf5-9d28-1ccdee50baf7'})
//     console.log('response',response)
//     return response
//   }catch(e){ 
//     console.log(e);
    
//   }
// }

const postOTP = async (data) => {
  try {
    const response = await axios.post(
      `https://jogettestdx8.ghobash.com:8443/jw/api/process/forgetPasswordProcess/startProcessByUser/admin`,
      data,
      { 
        headers: {
          api_key: 'dbd603e47c4543d1ab88983e637d100d',
          api_id: 'API-f54eb871-4796-4bf5-9d28-1ccdee50baf7'
        }
      }
    );
    return response;
  } catch (e) {
    console.log(e);
    throw e; 
  }
};


// export {getCustomers, getProducts, getServices, getDeliveryTypes,getEmirates,getArea, postOrder,getOrders, postSignUp,putProfile,postOTP};
