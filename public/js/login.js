import axios from "axios";
import { showAlert } from "./alerts";

export const login = async (email, password) => { 
    try {
        const res = await axios({
            method: 'POST',
            url: 'https://greentour-app.onrender.com/api/v1/users/login',
            data: {
                email,
                password
            }
        });
        if(res.data.status === 'success'){
            showAlert('success','logged in successfully');
            window.setTimeout(() =>{
                location.assign('/');
            },1500)
        }
    } catch (err) {
        showAlert('error',err.response.data.message)

        }
    
};


export const logout =async()=>{
    try{
        const res = await axios({
            method: 'GET',
            url: 'https://greentour-app.onrender.com/api/v1/users/logout',
        });
        if((res.data.status='success')) location.reload(true);
    }catch(err){
        showAlert('error','error logging out! try again')
    }
}