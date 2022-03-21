import { FormEvent, useContext, useRef, useState } from "react";
import { LoginContext } from "../store/LoginContext";
import axios from 'axios';
import withAuth from "../Auth/withAuth";
import { GetServerSidePropsContext, NextPage } from "next";
import LoginUser from "../types/LoginUser";

const ProfilePage: NextPage<{loginUser: LoginUser}> = (props) => {
    const [uploadProgress, setUploadProgress] = useState<string>('');
    const [uploadMessage, setUploadMessage] = useState<string>('');
    const context = useContext(LoginContext);
    const [loginuser, setLoginUser] = useState<LoginUser>(props.loginUser);
    const [choosenImage, setChooseImage] = useState<string | null>(null);

    const fileRef = useRef<HTMLInputElement>(null);
    const [name, setName] = useState(context.user?.name || loginuser?.name);
    const [email, setEmail] = useState(context.user?.email || loginuser?.email);
    const [phone, setPhone] = useState(context.user?.phone || loginuser?.phone);

    const chooseFileHandler = (e: FormEvent) =>{
        if(fileRef.current?.files && fileRef.current.files[0]){
            setChooseImage((window.URL ? URL : webkitURL).createObjectURL(fileRef.current.files[0]));
        }
    }



    const submitHandler = async (e:FormEvent) => {
        let user = {...context.user}
        e.preventDefault();
        
        setUploadMessage('');
        const body = new FormData();

        if(fileRef.current?.files && fileRef.current?.files[0]) 
            body.append('image', fileRef.current.files[0])
        if(email?.trim() && email?.trim() != user.email)
            body.append('email', email?.trim()  || '');
        if(name?.trim() && name?.trim() != user.name)
            body.append('name', name?.trim() || '');
        if(phone?.trim() && phone?.trim() != user.phone)
            body.append('phone', phone?.trim() || '');
        
        try{
            const response = await axios.post('/api/update-profile/', body, {
                onUploadProgress: (progressEvent: ProgressEvent)=>{
                    console.log(Math.round((progressEvent.loaded * 100) / progressEvent.total) + '%');
                    if(!fileRef.current?.files || !fileRef.current?.files[0]) setUploadMessage('...loading');
                    else setUploadProgress( Math.round((progressEvent.loaded * 100) / progressEvent.total) + '%');
                }
            });
            console.log('request sent')
            const data = response.data;

            if(data && data.status == 'success') {
                setUploadProgress('');
                setUploadMessage('Profile updated successfuly!');
            }else {
                setUploadMessage(data.message);
            }
            context.verify();
            setUploadProgress('');
        }catch(e){
            setUploadMessage('Something went wrong please try again!');
        }

    }

    const imageSrc = (choosenImage) ? choosenImage : context.user?.image || loginuser?.image;
    console.log(choosenImage)

    return <div>
        <h1>Profile</h1>
        <form className='profile_form' onSubmit={submitHandler} encType="multipart/form-data">
            <div>
                <img src={imageSrc}/>
            </div>
            <button onClick={(e)=>{e.preventDefault();fileRef.current?.click()}}>Choose new image</button>
            <input type="file" accept="image/*" ref={fileRef} onClick={chooseFileHandler} onChange ={chooseFileHandler} style={{display: "none"}}/>

            <div>
                <label>Name : </label><input type="text" value={name} onChange={(e)=>{setName(e.target.value)}}></input>
            </div>

            <div>
                <label>Phone : </label><input type="phone" value={phone} onChange={(e)=>{setPhone(e.target.value)}}></input>
            </div>

            <div>
                <label>Email : </label><input type="email" value={email} onChange={(e)=>{setEmail(e.target.value)}}></input>
            </div>

            <input type="submit" value="Update"/>
        </form>
        {uploadProgress && !uploadMessage && <p>Upload progress: {uploadProgress}</p>}
        {uploadMessage && <p>{uploadMessage}</p>}
    </div>
}

export default ProfilePage;

export const getServerSideProps = withAuth(async (ctx: GetServerSidePropsContext, loginUser: LoginUser)=>{
    return {
        props: {loginUser: {...loginUser, _id: loginUser?._id.toString()}}
    }
});