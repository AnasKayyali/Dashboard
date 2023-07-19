import { useState } from 'react'
import './Login.css'
import axios from 'axios';
import Cookie from "cookie-universal"

const Login = () => {

  const cookie = Cookie()  

  const [secure, setSecure] = useState("show") 

  const [email, setEmail] = useState("") 
  
  const [password, setPassword] = useState("")

  const [checked, setChecked] = useState(false);

  const handleSecure = () => {
    secure === "show" ? setSecure("hide") : setSecure("show")
  }   

  const handleChange = () => {
    setChecked(!checked);
  }

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try {
        await axios.post('https://vv3eyp0jq4.execute-api.eu-central-1.amazonaws.com/test/api/dashboard/auth/admin-login',
        {
            email: email,
            password: password,
            remember_me: checked   
        })
        .then((res) => {
            const token = res.data.access_token
            cookie.set("auth_Info",token)
        })
    } catch (error) {
        console.log(error)
    }
  }

  return (
    <div className="bg-gray-200 py-8 px-6">
        <div className="grid justify-content-center">
            <div className="gr sm:col-12 md:col-5 lg:col-4 bg-blue-500 border1 pt-5">
                <div className='flex justify-content-center'>
                    <img src="/public/assets/favicon.ico" className="w-11rem" alt="logo"/>
                </div>
                <div className="p-5 mb-6 mt-2">
                    <p className="text-center text-white text-lg" style={{fontFamily:'Inconsolata'}}>
                        with the I2VPN admin panel, you can manage servers, products, countries, users  and see thier feedbacks and interact with them, set your own custom style and do more.
                    </p>
                </div>
                <div className="flex justify-content-between">
                    <span className="text-white text-sm mb-2" style={{fontFamily:'Merriweather'}}>
                        &copy; 2021 Copyright I2VPN. all rights reserved       
                    </span>
                    <span className='gap-icon flex sm:gap-4 md:gap-2 lg:gap-3 mr-4'>
                        <i className="pi pi-globe" style={{color:"white", fontSize:'1rem'}}></i>
                        <i className="pi pi-twitter" style={{color:"white", fontSize:'1rem'}}></i>
                        <i className="pi pi-facebook" style={{color:"white", fontSize:'1rem'}}></i>
                    </span>
                </div>
            </div>
            <div className="gr sm:col-12 md:col-5 lg:col-4 bg-white border2 pl-6 pr-8 pt-5">
                <form onSubmit={handleSubmit}>
                    <span className='text-5xl text-blue-500' style={{fontFamily:'Ubuntu Mono'}}>WELCOME BACK!</span>
                    <label className="grid text-sm my-4">
                        <div className="relative">
                            <i className="pi pi-user absolute top text-xl ml-2" style={{color:'grey'}} onClick={() => handleSecure()}></i>                            
                            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="in-w pl-5 py-2 text-lg text-gray-700 mt-2 input2 border-round-sm" style={{borderColor:'rgb(240,240,240)'}}/>                     
                          </div>
                    </label>  
                    <label className="grid text-sm">
                        <div className="relative">
                            {
                            secure === "show" ?
                            <i className="pi pi-unlock absolute top text-xl ml-2" style={{color:'grey'}} onClick={() => handleSecure()}></i> 
                            :
                            <i className="pi pi-lock absolute top text-xl ml-2" style={{color:'grey'}} onClick={() => handleSecure()}></i>
                            }
                            <input required type={secure === "show" ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}  className="in-w pl-5 py-2 text-lg mt-2 input2 border-round-sm" style={{borderColor:'rgb(240,240,240)'}}/>
                        </div>
                    </label> 
                    <label>
                        <div className="flex align-items-center gap-1 mt-4">
                            <input type="checkbox" className="checkstyle" checked={checked} onChange={handleChange} />
                            <span style={{fontFamily:'Tajawal'}}> Remember me </span> 
                        </div>
                    </label>
                    <input type="submit" value="Sign in" style={{fontFamily:'PT Sans'}} className="mb-5 border-round-sm pa-y px-6 mt-6 border-none bg-blue-500 text-white text-lg cursor-pointer"/>    
                </form>        
            </div>
        </div>
    </div>
  )
}

export default Login