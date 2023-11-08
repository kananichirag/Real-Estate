import React, { useState } from 'react'
import {getDownloadURL, getStorage,ref, uploadBytesResumable } from 'firebase/storage';
import {app} from '../firebase'
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'

export default function createListing() {
    const [files,setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls:[],
        name:'',
        description:'',
        address:'',
        type:'rent',
        bedrooms:1,
        bathrooms:1,
        regularPrice:50,
        discountPrice:0,
        offer:false,
        parking:false,
        furnished:false

    })
    const [imageUploadError,setImageUploadError] = useState(false)
    const [uploading,setUploading] = useState(false)
    const [error,setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const {currentUser} = useSelector(state => state.user)
    const navigate = useNavigate()
    //console.log(files);
    console.log(formData);

    ///// 1 /////

   const handleImageSubmit = (e) => {
       if(files.length > 0 && files.length + formData.imageUrls.length < 7){
            setUploading(true)
            setImageUploadError(false)
            const promises = [];

            for(let i=0; i< files.length; i++){
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises).then((urls) => {
                setFormData({...formData,imageUrls:formData.imageUrls.concat(urls)})
                setImageUploadError(false)
                setUploading(false)
            }).catch((err) => {
                setImageUploadError('Image Upload Failed (2 mb per image)')
            })
       }  else {
        setImageUploadError('You can only upload 6 images per listing.!!')
        setUploading(false)
       }
   }

    const storeImage = async(file) => {
         return new Promise((resolve,reject) => {
            const storage  = getStorage(app)
            const fileName = new Date().getTime() + file.name
            const storageRef = ref(storage,fileName)
            const uploadTask = uploadBytesResumable(storageRef,file);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                  const progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
                  console.log(`Upload is ${progress}% Done.!!`)
                },
                (error) => {
                    reject(error)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL)
                    })
                }
                )
         })
    }

    ///// 1 /////


    ///// 2 /////

    const  handleRemoveImage = (index) =>  {
      setFormData({
        ...formData,
        imageUrls:formData.imageUrls.filter((_,i) => i !== index),
      })
    }

    ///// 2 /////


    ///// 3 /////

     const handleChange = (e) => {
           if(e.target.id === 'sale' || e.target.id === 'rent'){
            setFormData({
                ...formData,
                type:e.target.id
            })
           } 

           if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
            setFormData({
                ...formData,    
                [e.target.id]:e.target.checked
            })
           }

           if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea'){
            setFormData({
                ...formData,
                [e.target.id]:e.target.value,
            })
           }
     } 

    ///// 3 /////


    ///// 4 /////

    const handleSubmit = async(e) => {
         e.preventDefault();

         try {
             if(formData.imageUrls.length < 1) return setError('You must upload at least one image')
             if(formData.regularPrice < formData.discountPrice) return setError('Discount Price must be lower than Regular Price')
            setLoading(true)
            setError(false)

            const res = await fetch('/api/listing/create',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    ...formData,
                    userRef:currentUser._id
                })
            })
            const data = await res.json()
            setLoading(false)

            if(data.success === false){
                setError(data.message)
            }
            navigate(`/listing/${data._id}`)
         } catch (error) {
            setError(error.message)
            setLoading(false)
         }
    }

    ///// 4 /////
  return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>

        <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
              <div className='flex flex-col gap-4 flex-1'>
                 <input onChange={handleChange} value={formData.name} type='text' placeholder='Name'className='border rounded-lg p-3'id='name' maxLength='62' minLength='10' required ></input>
                 <textarea onChange={handleChange} value={formData.description} type='text' placeholder='Description'className='border rounded-lg p-3'id='description'  required ></textarea>
                 <input onChange={handleChange} value={formData.address} type='text' placeholder='Address'className='border rounded-lg p-3'id='address'  required ></input>

                 
              <div className='flex gap-6 flex-wrap'>
                   <div className='flex gap-2'>
                      <input type='checkbox' id='sale' className='w-5' onChange={handleChange} checked={formData.type === "sale"} ></input>
                      <span>Sell</span>
                   </div>
                   <div className='flex gap-2'>
                      <input type='checkbox' id='rent' className='w-5' onChange={handleChange}  checked={formData.type === "rent"} ></input>
                      <span>Rent</span>
                   </div>
                   <div className='flex gap-2'>
                      <input type='checkbox' id='parking' className='w-5' onChange={handleChange} checked={formData.parking} ></input>
                      <span>Parking Spot</span>
                   </div>
                   <div className='flex gap-2'>
                      <input type='checkbox' id='furnished' className='w-5'onChange={handleChange} checked={formData.furnished} ></input>
                      <span>Furnished</span>
                   </div>
                   <div className='flex gap-2'>
                      <input type='checkbox' id='offer' className='w-5'onChange={handleChange} checked={formData.checked} ></input>
                      <span>Offer</span>
                   </div>
              </div>
                     
                    <div className='flex flex-wrap gap-6 rounded-lg'>
                         <div className='flex items-center gap-2'>
                                     <input className='p-3 border border-gray-300 rounded-lg' type='number' id='bedrooms' min='1' max='10' required onChange={handleChange} value={formData.bedrooms}></input>
                                     <p>Beds</p>
                         </div>
                    <div className=''>
                         <div className='flex items-center gap-2'>
                                     <input className='p-3 border border-gray-300 rounded-lg' type='number' id='bathrooms' min='1' max='10' required onChange={handleChange} value={formData.bathrooms}></input>
                                     <p>Baths</p>
                         </div>
                    </div> 
                    <div className='f'>
                         <div className='flex items-center gap-2'>
                                     <input className='p-3 border border-gray-300 rounded-lg' type='number' id='regularPrice' min='50' max='100000' required onChange={handleChange} value={formData.regularPrice} ></input>
                                       <div className='flex flex-col items-center'>
                                                <p> Regular Price</p>
                                                <span className='text-xs'>($/month)</span>
                                       </div>
                         </div>
                    </div> 
                    <div className=''>
                        {formData.offer && (
                         <div className='flex items-center gap-2'>
                         <input className='p-3 border border-gray-300 rounded-lg' type='number' id='discountPrice' min='0' max='100000' required onChange={handleChange} value={formData.discountPrice} ></input>
                           <div className='flex flex-col items-center'>
                                  <p>Discount Price</p>
                                  <span className='text-xs'>($/month)</span>

                           </div>
             </div>
                        )}

                    </div>    
                    </div>
              
            </div>

            <div className='flex flex-col flex-1 gap-4'>
                <p className='font-semibold'>Images:
                    <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
                </p>
                   
                   <div className='flex gap-4'>
                         <input onChange={(e) => setFiles(e.target.files)} className='p-3 border border-gray-300 rounded w-full' type='file' id='images' accept='image/*' multiple></input>
                         <button disabled={uploading} type='button' onClick={handleImageSubmit} className='p-3 text-green-700 border border-green-700 rounded hover:shadow-lg disabled:opacity-80'>{uploading ? 'Uploading..!!':'Upload'}</button>
                   </div>
            <p className='text-red-700 text-sm '>{imageUploadError && imageUploadError}</p>
            {
                formData.imageUrls.length > 0 && formData.imageUrls.map((url,index) => (
                   <div key={url} className='flex justify-between p-3 border items-center'>
                      <img src={url} alt='listing image' className='w-20 h-20 object-contain rounded-lg'></img>
                      <button onClick={() => handleRemoveImage(index)} type='button' className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'>Delete</button>
                   </div>
                ))
            }
            <button disabled={loading || uploading} className='p-3 bg-slate-700 text-white rounded-lg  hover:opacity-95 disabled:opacity-80'>{loading ? 'CREATING..!!':'CREATE'}</button>
            {error && <p className='text-red-700 text-sm'>{error}</p>}
            </div>
        </form>
    </main>
  )
}
