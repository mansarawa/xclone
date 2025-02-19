import React, { use, useEffect, useRef, useState } from 'react'
import LeftMenu from './LeftMenu'
import RightMenu from './RightMenu'
import Photo from '../assets/svg/photo.svg'
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
    const user = JSON.parse(localStorage.getItem('user') || '')
    const userId = user.userid
    const token = JSON.parse(localStorage.getItem('token') || '')
    const data = JSON.parse(localStorage.getItem('data') || '')
    const [text, setText] = useState('')
    const [post, setPost] = useState([])
    const [pFormData, setPFormData] = useState({ name: '', username: '', bio: '', phone: 0, userid: userId })
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
    return (
        <div className='container'>
            <div className="left-menu">
                <LeftMenu />

            </div>

            <div className="main">
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
                <div className="top">
                    <a href="/">For you</a>
                    <a href="">Following</a>
                </div>
                <div className="post">
                    <FontAwesomeIcon icon={faUser} className='photo' />

                    <form className="content" onSubmit={handlePostSubmit}>
                        <textarea
                            ref={textareaRef}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="What is happening?!"
                            rows={1}
                        ></textarea>
                        <div className="btn">
                            <FontAwesomeIcon icon={faImage} className='svg' />
                            <link rel="icon" type="image/svg+xml" href={Photo} />
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
                            <div className='single-photo'>
                                <img src={demo} alt="" />
                            </div>
                            <div className='single-detail'>
                                <div className="name">
                                    <h2>{user[0].name}</h2>
                                    <h4>@{user[0].username}</h4>

                                </div>
                                <h5 >{item.text}</h5>
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