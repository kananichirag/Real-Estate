import React, { useState, useEffect} from 'react'
import {useRef} from 'react'
import { useSelector } from 'react-redux'
import {getStorage, uploadBytes, uploadBytesResumable,ref,getDownloadURL} from 'firebase/storage'
import {app} from '../firebase'
import { updateUserStart,updateUserSuccess,updtaeUserFailuer,deleteUserFailure,deleteUserSuccess,deleteUserStart, signOutStart, signOutFailure, signOutSuccess } from '../redux/user/userSlice'
import { useDispatch } from 'react-redux'
import {Link} from 'react-router-dom'


export default function Profile() {
  const {currentUser,loading,error} = useSelector((state) => state.user)
  const fileRef = useRef(null)
  const [file,setFile] = useState(undefined)
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError,setFileUploadError] = useState(false);
  const [formData,setFormData] = useState({})
  const dispatch =  useDispatch()
  const [updateSuccess,setUpdateSuccess] = useState(false);
  const [showListingError,setShowListingError] = useState(false)
  const [userListing,setUserListing] = useState([])
  //console.log(file);
  //console.log(formData);
  //console.log(filePerc);
  useEffect( () => {
    if(file){
      handleFileUpload(file);
    }
  },[file]);

  /////// 1 /////
  const handleFileUpload = (file) => {
     const storage = getStorage(app);
     const fileName = new Date().getTime() + file.name;
     const storageRef = ref(storage,fileName);
     const uploadTask = uploadBytesResumable(storageRef,file)

     uploadTask.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred/snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress))
      },
    (error) => {
      setFileUploadError(true)
    },

    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        setFormData({...formData, avatar:downloadURL})
      });
    })
  }
/////// 1//////

/////// 2 //////

const handleChange = (e) => {
  setFormData({...formData,[e.target.id]:e.target.value})
}

/////// 2 //////


/////// 3 //////
const handleSubmit = async (e) => {
  e.preventDefault();
    try {
      dispatch(updateUserStart())
      const res = await fetch(`/api/user/update/${currentUser._id}`,
      {
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(formData)
      })
      const data = await res.json()
      if(data.success === false){
        dispatch(updtaeUserFailuer(data.message))
        return
      }

      dispatch(updateUserSuccess(data))
      setUpdateSuccess(true)
    } catch (error) {
      dispatch(updtaeUserFailuer(error.message))
    }
  }
  /////// 3 //////


  /////// 4 //////

  const handleDeleteUser = async () => {

    try {
      
    dispatch(deleteUserStart())

    const res = await fetch(`api/user/delete/${currentUser._id}`,{
      method:'DELETE'
    })

    const data = await res.json()
    if(data.success === false){
      dispatch(deleteUserFailure(data.message))
      return;
    }

    dispatch(deleteUserSuccess(data))

    } catch (error) {
       dispatch(deleteUserFailure(error.message))
    }

  }

  /////// 4 //////


  /////// 5 //////

   const handleSignOut = async () => {
        try {
          dispatch(signOutStart())
           const res = await fetch('/api/auth/signout');
           const data = await res.json()

           if(data.success === false) {
               dispatch(signOutFailure(data.message))
               return;
              }

              dispatch(signOutSuccess(data))
            } catch (error) {
              dispatch(signOutFailure(data.message))
        }
   }

  /////// 5 //////


  /////// 6 //////

   const handleShowListing = async () => {
     try {
      setShowListingError(false)
        const res = await fetch(`/api/user/listings/${currentUser._id}`)
        const data = await res.json()

        if(data.success === false){
          setShowListingError(true)
          return
        }
        setUserListing(data)
     } catch (error) {
      setShowListingError(true)
     }
   }

  /////// 6 //////


  /////// 7 //////

  const handleListingDelete = async (listingId) => {
     try {
      const res = await fetch(`/api/listing/delete/${listingId}`,
      {
        method:'DELETE',
      })

      const data = await res.json()
      if(data.success === false){
        console.log(data.message);
        return;
      }
      setUserListing((prev) => prev.filter((listing) => listing._id !== listingId))
     } catch (error) {
       console.log(error.message);
     }
  }

  /////// 7 //////
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-8'>Profile</h1>
      <form  onSubmit={handleSubmit}  className='flex flex-col gap-4'>

        <input onChange={(e) => setFile(e.target.files[0])}
         type='file' 
         ref={fileRef} 
         hidden 
         accept='image/*'></input>

        <img onClick={() => fileRef.current.click()} className='rounded-full h-28 w-28 object-cover cursor-pointer self-center mt-2' src={formData.avatar || currentUser.avatar} alt='Profile'></img>
        <p className='text-sm self-center'>
            {fileUploadError ? (
           <span className="text-red-700">Error Image Upload</span>
           ) : filePerc > 0 && filePerc <100 ?(
            <span className='text-slate-700'>{`Uploading${filePerc}%`}</span>
            ) : filePerc === 100 ? (
             <span className='text-green-700'>Image Successfully Uploaded.!!</span>
             ):("")
          }
        </p>

        <input onChange={handleChange} className='border p-3 rounded-lg' defaultValue={currentUser.username} type='text' placeholder='username' id='username'/>
        <input onChange={handleChange} className='border p-3 rounded-lg' defaultValue={currentUser.email} type='email' placeholder='email' id='email'/>
        <input onChange={handleChange} className='border p-3 rounded-lg' type='password' placeholder='password' id='password'/>

        <button disabled={loading} className='bg-slate-700 text-white p-3 uppercase rounded-lg hover:opacity-95 disabled:opacity-80' >{loading ? 'Loading.!!':'Update'}</button>
        <Link  className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95' to={"/create-listing"}>
             Create Listing
        </Link>
      </form>
         <div className='flex justify-between mt-5'>
             <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer' >Delete Accoutn</span>
             <span onClick={handleSignOut} className='text-red-700 cursor-pointer' >Sign Out</span>
         </div>
         <p className='text-red-700 mt-5'>{error ? error :" "}</p>
         <p className='text-green-700 mt-5'>{updateSuccess ? 'User Updated Successfully..!!!' : ''}</p>

         <button onClick={handleShowListing} type='button' className='text-green-700 w-full'>Show Listing</button>
         <p className='text-red-700 mt-5 '>{showListingError ? 'Error showing Listing':''}</p>
         {userListing && userListing.length > 0 && 
            <div className='flex flex-col gap-4'>
              <h1 className='text-center mt-7 text-2xl font-semibold'>Your Listing</h1>
             { userListing.map((listing) => (
                <div key={listing._id} className='flex border rounded-lg p-3 justify-between items-center gap-4'>
                       <Link to={`/listing/${listing._id}`}>
                          <img src={listing.imageUrls[0]} alt='listing cover' className='h-16 w-16 object-contain'></img>
                       </Link>
                       <Link className='flex-1 text-slate-700 font-semibold  hover:underline truncate' to={`/listing/${listing._id}`}>
                         <p className=''>{listing.name}</p>
                       </Link>
   
                       <div className='flex flex-col items-center'>
                             <button onClick={() => handleListingDelete(listing._id)} className='text-red-700 uppercase'>Delete</button>
                             <Link to={`/update-listing/${listing._id}`}>
                              <button className='text-green-700 uppercase'>edit</button>
                             </Link>
                       </div>
                </div>
              
              ))}

            </div>}
    </div>
  )
}
