import { Link, useNavigate} from "react-router-dom"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {signInStart,signInSuccess,signInFailure} from '../redux/user/userSlice'
import OAuth from "../components/OAuth"
 
export default function Signin() {

  // All Use Satate 
  const [formData, setFormData] = useState({})
  const {loading,error} = useSelector((state) => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()

// All Function Declareation
  const handleChange = (e) => {
     setFormData({
      ...formData,
      [e.target.id]:e.target.value,
     })
  };

  const handleSubmit = async (e) => {
     e.preventDefault();
     try {
      dispatch(signInStart())
      const Res = await fetch('/api/auth/signin',
      {
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify(formData)
      })
      const data = await Res.json()
      console.log(data);
      if(data.success === false){
       dispatch(signInFailure(data.message))
       return
      }
      dispatch(signInSuccess(data))
      navigate('/')
     } catch (error) {
       dispatch(signInFailure(error.message))
     }
    
  }
 //console.log(formData);   For Console Data to Sjow  in Brower Console



  return (
    <div className='p-3 max-w-lg mx-auto'>
    <h1 className='text-3xl text-center font-semibold my-7'>Sign in </h1>

    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
      <input type='email' placeholder='Email' className='border p-3 rounded-lg' id='email'onChange={handleChange}/>
      <input type='password' placeholder='Password' className='border p-3 rounded-lg' id='password' onChange={handleChange}/>
      <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Loading...' : 'Sign in'}</button>
      <OAuth></OAuth>
    </form>
        <div className="flex gap-2 mt-5">
          <p>Dont have an account?</p>
          <Link to='/Sign-up'> 
               <span className="text-blue-700">Sign Up</span>
          </Link>
        </div> 
        {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  )
}
