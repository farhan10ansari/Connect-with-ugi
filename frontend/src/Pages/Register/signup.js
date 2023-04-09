import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import "./signup.css";
import { signup } from '../../Component/ReduxContainer/apiCall';
import app from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
export default function Signup() {
  const dispatch = useDispatch();
  const {isFetching  , error} = useSelector((state)=>state.user);
  const user = useSelector((state)=>state.user);
  const [email , setEmail] = useState('');
  const [phonenumber , setphonenumber] = useState('');
  const [username , setusername] = useState('');
  const [password , setpassword] = useState('');
  const [file , setfile] = useState(null);
  const userDetails = user.user;
  const navigator = useNavigate();
  const handleClick = (e)=>{
    e.preventDefault();
    const fileName = new Date().getTime() + file?.name;
    const storage = getStorage(app);
    const StorageRef = ref(storage , fileName);
    
    const uploadTask = uploadBytesResumable(StorageRef, file);
    uploadTask.on('state_changed', 
  (snapshot) => {
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
    }
  }, 
  (error) => {
    // Handle unsuccessful uploads
  }, 
  () => {
    // Handle successful uploads on complete
    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      signup(dispatch ,{email , password , username , phonenumber , profile:downloadURL});
      console.log(email , password , username , phonenumber , downloadURL)
      })
    });

  }

  if(userDetails?.Status==='Pending'){
      // alert("Admin will verify first");

  }

  
  return (
    <div className='mainContainerForsignup'>
      <div className='submainContainer'>
        <div style={{flex:1 , marginLeft:150  , marginBottom:"170px"}}>
        <p className='logoText' style={{paddingBottom:"10px"}}>Connect with <span className='part main'>UGI</span></p>
          <p className='introtext'>Connect with <span className='part'>seniors and friends </span></p>
        </div>
        <div style={{flex:3}}>
          <p className='createaccountTxt'>Create New Account</p>
          <input type="file" name="file" id="file" onChange={(e)=>setfile(e.target.files[0])} />
          <input type="text" placeholder='Username' onChange={(e)=>setusername(e.target.value)} className='inputText' />
          <input type="text" placeholder='Phonenumber' onChange={(e)=>setphonenumber(e.target.value)} className='inputText' />
          <input type="email" name="" id="" placeholder='email' onChange={(e)=>setEmail(e.target.value)} className='inputText' />
          <input type="password" placeholder='******' name="" onChange={(e)=>setpassword(e.target.value)} id="" className='inputText' />
          <button className='btnforsignup' onClick={handleClick}>Signup</button>
          <Link to={"/"}>
          <p style={{textAlign:'start' , marginLeft:"30.6%" ,color:"#5790ed", underline:"none" }}>Already have a account?</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
