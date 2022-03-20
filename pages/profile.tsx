import { FormEvent, useContext, useRef, useState } from "react";
import { LoginContext } from "../store/LoginContext";
import axios from 'axios';

const ProfilePage = () => {
    const [uploadProgress, setUploadProgress] = useState<string>('');
    const [uploadMessage, setUploadMessage] = useState<string>('');
    const context = useContext(LoginContext);

    const fileRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);

    const submitHandler = async (e:FormEvent) => {
        let user = {...context.user}
        e.preventDefault();
        
        const body = new FormData();
        console.log('Submitting form..')
        if(!fileRef.current?.files || !fileRef.current?.files[0]) {
            setUploadMessage('Please choose an image!');
            return;
        };

        body.append('image', fileRef.current.files[0])
        body.append('email', emailRef.current?.value || 'email');
        console.log('sending request..')
        setUploadProgress('0%');
        try{
            const response = await axios.post('/api/file-upload', body, {
                onUploadProgress: (progressEvent: ProgressEvent)=>{
                    setUploadProgress(Math.round(progressEvent.loaded / progressEvent.total * 100) + '%');
                }
            });
            console.log('request sent')
            const data = response.data;

            if(data && data.status == 'success') {
                context.verify();
                setUploadProgress('');
                setUploadMessage('Profile picture updated successfuly!');
            }
        }catch(e){
            setUploadMessage('Something went wrong please try again!');
        }

    }

    return <div>
        <h1>Update profile picture</h1>
        <form onSubmit={submitHandler} encType="multipart/form-data">
            <input type="file" accept="image/*" ref={fileRef}/>
            <input type="email" ref={emailRef}></input>
            <input type="submit" value="upload"/>
        </form>
        {uploadProgress && <p>Upload progress: {uploadProgress}</p>}
        {uploadMessage && <p>{uploadMessage}</p>}
    </div>
}

export default ProfilePage;