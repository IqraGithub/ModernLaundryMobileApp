// import axios from 'axios';

// const key = 'AIzaSyBv_Vf3Ox_TqnNmDm0GnW6Zcy0gTTliwxA';

// async function auth(mode, email, password) {
//   const res = await axios.post(
//     `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${key}`,
//     { email: email, password: password, returnSecureToken: true }
//   );
//   return res.data.idToken;
// }

// export const createUser = async (email, password) => {
//   const token = auth('signUp', email, password);
//   return token;
// };
// export const checkUser = async (email, password) => {
//   const token = auth('signInWithPassword', email, password);
//   return token;
// };
// // export async function createUser(email, password) {
// //     try {
// //       const res = await axios.post(
// //         `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${key}`,
// //         { email: email, password: password, returnSecureToken: true }
// //       );
// //     } catch (error) {
// //       console.log(error.response.data);
// //       throw error;
// //     }
// //   }



















  //   await fetch('/mapplogin', {
  //     method: 'POST',
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       email: email,
  //       password: password,
  //     }),
  //   }).then(res => {
  //     console.log(res)
  //   }).catch(err => {
  //     console.log(err)
  //   })
  // const config = {
  //     method: 'post',
  //     url: 'http://127.0.0.1:5001/mapplogin',
  //     headers: {
  //       'content-Type': 'multipart/form-data'
  //     },
  //     data : {email : email, password : password}
  //   };

  // console.log("APIreq", email,password);

  // const res = await axios.post('/mapplogin', {
  //   email: "user@gmail.com",
  //   password: "1",
  // },

  // await axios(config)
  // .then(response => {
  //     console.log("res" +response.data);
  // }).catch(err => {
  //     console.log(err)
  // })

  // return res.data;
  // if (res && res.data && res.data.idToken) {
  // } else {
  //   throw new Error("Invalid response from API");
  // }