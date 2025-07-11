import axios from "axios";
import { showAlert } from "./alerts";


export const signup = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'https://greentour-app.onrender.com/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm,
        
      }
      
    });
    console.log(email); // Should output the email address string.

  
    if (res.data.status === 'success') {
      showAlert('success', 'Account created successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};