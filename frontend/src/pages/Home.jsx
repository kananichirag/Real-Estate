import { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from 'swiper/modules';
import SwiperCore from "swiper";
import "swiper/css/bundle";
import Listingitems from '../components/Listingitems';

export default function Home() {
  const [offerListings,setOfferListings] = useState([]);
  const [saleListings,setSaleListings] = useState([]);
  const [rentListing,setRentListing] = useState([]);
  SwiperCore.use([Navigation]);
  console.log(saleListings);
   useEffect( () => {
          const fetchOfferListings = async () => {
               try {
                 const res =  await fetch('/api/listing/get?offer=true&limit=4');
                 const data = await res.json();
                 setOfferListings(data);
                 fetchRentListings();
               } catch (error) {
                console.log(error);
               }
          }

          const fetchRentListings = async() => {
            try {
              const res =  await fetch('/api/listing/get?type=rent&limit=4');
              const data = await res.json();
              setRentListing(data);
              fetchSaleListings();
            } catch (error) {
             console.log(error);
            }
          }

          const fetchSaleListings = async() => {
            try {
              const res =  await fetch('/api/listing/get?type=sale&limit=4');
              const data = await res.json();
              setSaleListings(data);
            } catch (error) {
             console.log(error);
            }
          }
          fetchOfferListings();
   },[]);
  return (
    <div>
      {/*  Top */}
      
       <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
                 <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>Find your next <span className='text-slate-500'>Perfect</span>
                    <br />place with ease
                 </h1>

                 <div className='text-gray-800 text-xs sm:text-sm'>
                         Royal Estate is the best place to find your next perfect place to live.
                         <br/>
                         We have a wide range of properties for you to choose from.
                 </div>
                 <Link to={'/search'} className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'>Let's Start Now...</Link>
       </div>



      {/*  swiper */}

      <Swiper navigation>
       {
        offerListings && offerListings.length > 0 && offerListings.map((listing) => (
          <SwiperSlide>
            <div style={{background:`url(${listing.imageUrls[0]}) center no-repeat `, backgroundSize:'cover'}} className='h-[500px] ' key={listing._id}>

            </div>
          </SwiperSlide>
        ) )
       }

      </Swiper>

      {/* Listing result */}
        
           <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8  my-10'>
                 {
                 offerListings && offerListings.length > 0 && (
                    <div className=''>
                         <div className='my-3 '>
                            <h2 className='text-2xl font-semibold text-slate-700'>Recent Offer</h2>
                            <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>Show more Offers</Link>
                         </div>
                          
                          <div className='flex flex-wrap gap-4' >
                            {
                              offerListings.map((listing) => (
                                <Listingitems listing={listing} key={listing._id} />
                              ))
                            }
                          </div>
                    </div>
                 )}

{
                 rentListing && rentListing.length > 0 && (
                    <div className=''>
                         <div className='my-3 '>
                            <h2 className='text-2xl font-semibold text-slate-700'>Recent Places for Rent</h2>
                            <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>Show more places for rent</Link>
                         </div>
                          
                          <div className='flex flex-wrap gap-4' >
                            {
                              rentListing.map((listing) => (
                                <Listingitems listing={listing} key={listing._id} />
                              ))
                            }
                          </div>
                    </div>
                 )}

{
                 saleListings && saleListings.length > 0 && (
                    <div className=''>
                         <div className='my-3 '>
                            <h2 className='text-2xl font-semibold text-slate-700'>Recent places for Sale</h2>
                            <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sale'}>Show more places for Sale</Link>
                         </div>
                          
                          <div className='flex flex-wrap gap-4' >
                            {
                              saleListings.map((listing) => (
                                <Listingitems listing={listing} key={listing._id} />
                              ))
                            }
                          </div>
                    </div>
                 )}
           </div>
           
    </div>
  )
}
