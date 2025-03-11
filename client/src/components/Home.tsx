import React, { use, useEffect, useRef, useState } from 'react'
import LeftMenu from './LeftMenu'
import RightMenu from './RightMenu'
import Photo from '../assets/svg/photo.svg'
import Gif from '../assets/svg/gif.svg';
import Emoji from '../assets/svg/emoji.svg';
import Grok from '../assets/svg/grok.svg';
import Location from '../assets/svg/location.svg';
import Bullet from '../assets/svg/bullet.svg';
import Calender from '../assets/svg/calender.svg'

import Anlytics from '../assets/svg/anlytics.svg';
import Bookmark from '../assets/svg/bookmark.svg';
import Share from '../assets/svg/share.svg';
import Repost from '../assets/svg/repost.svg';
import Heart from '../assets/svg/heart.svg';
import Comment from '../assets/svg/comment.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../style/Home.css'
import { faCloudArrowUp, faImage, faUser } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import decryptData from '../helper/decryptData'
import encryptData from '../helper/encryptData'
import demo from '../assets/demo.jpg'

function Home() {
    const BASE_URL = 'http://localhost:5000'
    
    const navigate = useNavigate()
    const user:any = localStorage.getItem('user') || null;
    const parsedUser = JSON.parse(user)
    console.log(parsedUser[0].photo)
    const token = localStorage.getItem('token') || ''
    const data = JSON.parse(localStorage.getItem('data') || '')
    const userId = data.userid
    // console.log(parsedUser[0])

    const [postData, setPostData] = useState({ text: '', image: [], userid: userId })
    const [post, setPost] = useState([])
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const twittePhotoInputRef = useRef<HTMLInputElement>(null)
    
    const handleTwittePhotoClick = () => {
        if (twittePhotoInputRef.current) {
            twittePhotoInputRef.current.click();
        }
    };

    
    const handleTwittePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length > 0) {
            setPostData({ ...postData, image: e.target.files[0] });
        }
    };
    
    const handlePostSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();

        if (postData.image) {
            formData.append("image", postData.image);
        }
        const encryptedData = await encryptData({
            text: postData.text,
            userId: postData.userid
        });
        formData.append("encryptedData", encryptedData);
        const res = await fetch('http://localhost:5000/create-twitte', {
            method: 'post',
            headers: {
                'Token': token,
                //  'Content-Type': 'multipart/form-data'
            },
            body: formData
        });
        const getData = await res.json()
        console.log(getData)
        const decryptedData = await decryptData(getData.data)
        console.log(decryptedData)
        const result = decryptedData
        if (result.success) {
            setPostData({ text: '', image: null })
            // navigate('/home')
            getAllPost();
        }
        else {
            alert(result.message)
        }
    };
    const getAllPost = async () => {

        const res = await fetch('http://localhost:5000/get-all-twitte', {
            method: 'get',
            headers: {
                'Token': token,
                // 'Content-Type': 'application/json'
            }
        })
        const getData = await res.json()
        const decryptedData = await decryptData(getData.data)
        const result = decryptedData
        if (result.success) {
            console.log(result)
            setPost(result.twittes)
            console.log(post)
            // navigate('/home')
        }
        else {
            alert(result.message)
        }
    }

    useEffect(() => {
        getAllPost();

        
    }, [])
    

    const handleActivity = async (type: string, twitteid: Number) => {
        const updatedFormData = { type, twitteid, userId }
        console.log(updatedFormData)
        const encryptedData = await encryptData(updatedFormData);

        const res = await fetch('http://localhost:5000/add-twitte-activity', {
            method: 'POST',
            headers: {
                'Token': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ encryptedData })
        });

        const getData = await res.json();
        const decryptedData = await decryptData(getData.data);

        console.log(decryptedData);
        if (decryptedData.success) {
            getAllPost();
            console.log(`${type} action recorded`);
        } else {
            alert(decryptedData.message);
        }
    };


    return (
        <div className='container'>
            <div className="left-menu">
                <LeftMenu />

            </div>

            <div className="main">

                <div className="top">
                    <a href="/">For you</a>
                    <a href="">Following</a>
                </div>
                <div className="post">
                    <div className="photo">
                        <img
                            src={`${BASE_URL}/${parsedUser[0].photo}`}
                            alt="profile photo"
                        />
                    </div>

                    <form className="content" onSubmit={handlePostSubmit}>
                        <textarea
                            ref={textareaRef}
                            value={postData.text}
                            onChange={(e) => setPostData({ ...postData, text: e.target.value })}
                            placeholder="What is happening?!"
                            rows={1}
                        ></textarea>
                        <div className="btn">
                            {/* <FontAwesomeIcon icon={faImage} className='svg' /> */}
                            <div>
                                <img src={Photo} className='svg' onClick={handleTwittePhotoClick} />
                                <img src={Gif} className='svg' />
                                <img src={Grok} className='svg' />
                                <img src={Bullet} className='svg' />
                                <img src={Emoji} className='svg' />
                                <img src={Calender} className='svg' />
                                <img src={Location} className='svg' />
                            </div>
                            <input
                                type="file"
                                ref={twittePhotoInputRef}
                                style={{ display: "none" }}
                                accept="image/*"
                                onChange={handleTwittePhotoChange}
                            />
                            <button type='submit' style={{ backgroundColor: postData.text !== '' ? 'white' : 'gray' }}>Post</button>
                        </div>
                    </form>
                </div>

                <div className="welcome">
                    <h1>Welcome back</h1>
                    <h4>Select some topics you're interested in to help personalize your X experience, starting with finding people to follow.</h4>
                    <button className="post-button">Get Started</button>
                </div>
                <div className="allpost">
                    {post && post.map((item: any, key) => (
                        <div key={key} className='single-post'>
                            <div className="single-content">
                                <div className='single-photo'>
                                    <img src={`${BASE_URL}/${item.photo}`} alt="" />
                                </div>
                                <div className='single-detail'>
                                    <div className="name">
                                        <h2>{item.name}</h2>
                                        <h4>@{item.username}</h4>

                                    </div>
                                    <h5 >{item.text}</h5>
                                </div>
                            </div>
                            <div className='action'>
                                <div>
                                    <img src={Comment} className='action-svg' onClick={() => handleActivity("comment", item.twitteid)} />
                                </div>
                                <div>
                                    <img src={Repost} className='action-svg' onClick={() => handleActivity("repost", item.twitteid)} />
                                    <h6>{item.repost || 0}</h6>
                                </div>
                                <div>
                                    <img src={Heart} className='action-svg' onClick={() => handleActivity("like", item.twitteid)} />
                                    <h6>{item.like || 0}</h6>
                                </div>
                                <div>

                                    <img src={Anlytics} className='action-svg' />
                                </div>
                                <div>
                                    <img src={Bookmark} className='action-svg' onClick={() => handleActivity("bookmark", item.twitteid)} />
                                    <h6>{item.bookmark || 0}</h6>
                                </div>
                                <div>
                                    <img src={Share} className='action-svg' />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
               
            </div>
            <div className="right-menu">
                <RightMenu />
            </div>
        </div>
    )
}

export default Home