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
import { faImage, faUser } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import decryptData from '../helper/decryptData'
import encryptData from '../helper/encryptData'
import demo from '../assets/demo.jpg'

function Home() {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(true);
    const navigate = useNavigate()
    const user = localStorage.getItem('user');
    const parsedUser = user && user !== 'undefined' ? JSON.parse(user) : '';

    const token = localStorage.getItem('token') || ''
    const data = JSON.parse(localStorage.getItem('data') || '')
    const userId = data.userid

    const [text, setText] = useState('')
    const [post, setPost] = useState([])
    const [pFormData, setPFormData] = useState({ name: '', username: '', bio: '', phone: 0, userid: userId })
    const [aFormData, setAFormData] = useState({ like:0,repost:0,bookmark:0,comment:'', userid: userId,twiteeid:0 })
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const handlePostSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const postData = { text, userId }
        console.log("Submitting:", { text });
        const encryptedData = await encryptData(postData)
        const res = await fetch('http://localhost:5000/create-twitte', {
            method: 'post',
            headers: {
                'Token': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ encryptedData })
        });
        const getData = await res.json()
        console.log(getData)
        const decryptedData = await decryptData(getData.data)
        console.log(decryptedData)
        const result = decryptedData
        if (result.success) {
            setText('')
            // navigate('/home')
        }
        else {
            alert(result.message)
        }
    };
    const getAllPost = async () => {

        console.log("called")
        const res = await fetch('http://localhost:5000/get-all-twitte', {
            method: 'get',
            headers: {
                'Token': token,
                'Content-Type': 'application/json'
            }
        })
        const getData = await res.json()
        console.log(getData)
        const decryptedData = await decryptData(getData.data)
        console.log(decryptedData)
        const result = decryptedData
        if (result.success) {
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
        console.log(data)
        if (data.isDetail) {
            setIsModalOpen(false)
        }
    }, [])
    const handlePDetailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const encryptedData = await encryptData(pFormData)
        const res = await fetch('http://localhost:5000/add-detail', {
            method: 'post',
            headers: {
                'Token': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ encryptedData })
        });
        const getData = await res.json()
        console.log(getData)
        const decryptedData = await decryptData(getData.data)
        console.log(decryptedData)
        const result = decryptedData
        if (result.success) {
            setIsModalOpen(false)
            // navigate('/home')
        }
        else {
            alert(result.message)
        }
    };

        const handleActivity = async (type: string,twitteid:Number) => {
            const updatedFormData={type,twitteid,userId}
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
                            <img src={demo} alt="" />
                        </div>

                        <form className="content" onSubmit={handlePostSubmit}>
                            <textarea
                                ref={textareaRef}
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="What is happening?!"
                                rows={1}
                            ></textarea>
                            <div className="btn">
                                {/* <FontAwesomeIcon icon={faImage} className='svg' /> */}
                                <div>
                                    <img src={Photo} className='svg' />
                                    <img src={Gif} className='svg' />
                                    <img src={Grok} className='svg' />
                                    <img src={Bullet} className='svg' />
                                    <img src={Emoji} className='svg' />
                                    <img src={Calender} className='svg' />
                                    <img src={Location} className='svg' />
                                </div>
                                <button type='submit'>Post</button>
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
                                        <img src={demo} alt="" />
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
                                        <img src={Comment} className='action-svg' onClick={() => handleActivity("comment",item.twitteid)} />
                                    </div>
                                    <div>
                                        <img src={Repost} className='action-svg' onClick={() => handleActivity("repost",item.twitteid)} />
                                        <h6>{item.repost || 0}</h6>
                                    </div>
                                    <div>
                                        <img src={Heart} className='action-svg' onClick={() => handleActivity("like",item.twitteid)} />
                                        <h6>{item.like || 0}</h6>
                                    </div>
                                    <div>

                                    <img src={Anlytics} className='action-svg' />
                                    </div>
                                    <div>
                                        <img src={Bookmark} className='action-svg' onClick={() => handleActivity("bookmark",item.twitteid)} />
                                        <h6>{item.bookmark || 0}</h6>
                                    </div>
                                    <div>
                                        <img src={Share} className='action-svg' />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* MODAL */}
                    {isModalOpen && (
                        <div className="p-overlay">
                            <form className="p-content" onSubmit={handlePDetailSubmit}>

                                <h1>Enter Your Personal Detail your account</h1>
                                <div className="details">
                                    <div className="detail">
                                        <h3>Name</h3>
                                        <input type="text" placeholder="test" className="p-input" onChange={(e) => setPFormData({ ...pFormData, name: e.target.value })} />
                                    </div>
                                    <div className="detail">
                                        <h3>Username</h3>
                                        <input type="text" placeholder="test@123" className="p-input" onChange={(e) => setPFormData({ ...pFormData, username: e.target.value })} />
                                    </div>
                                    <div className="detail">
                                        <h3>Bio</h3>
                                        <input type="text" placeholder="i am student" className="p-input" onChange={(e) => setPFormData({ ...pFormData, bio: e.target.value })} />
                                    </div>
                                    <div className="detail">
                                        <h3>Phone</h3>
                                        <input type="text" placeholder="7854784589" className="p-input" onChange={(e) => setPFormData({ ...pFormData, phone: parseInt(e.target.value) || 0 })} />
                                    </div>
                                </div>





                                <button className="p-button" type='submit'>Next</button>
                            </form>
                        </div>
                    )}
                </div>
                <div className="right-menu">
                    <RightMenu />
                </div>
            </div>
        )
    }

    export default Home