import axios from "axios"

const api = axios.create({
    baseURL: 'http://localhost:3000/api/auth',
    withCredentials : true
})

export async function registerUser({email, password, username}){

   try {
     const response = await api.post("/register",{
        username,email,password
    },{
        withCredentials : true
    })
    return response.data
  }  catch(error){
    console.error("Register API error:", error);
    throw error;
  }

}

export async function loginUser({email, password}){

   try {
     const response = await api.post("/login",{
        email,password
    },{
        withCredentials : true
    })
    return response.data
  }  catch(error){
    console.error("Login API error:", error);
    throw error;
  }

}

export async function logoutUser(){

    try {
      const response = await api.get("/logout",{
          withCredentials : true
      })
      return response.data
    }  catch(error){
      console.error("Logout API error:", error);
      throw error;
    }

}

export async function getMe(){

    try {
      const response = await api.get("/get-me",{
          withCredentials : true
      })
      return response.data
    }  catch(error){
      console.log("User not authenticated:", error.message);
      throw error;
    }

}