import React, { useEffect, useRef, useState } from 'react'
import LeftMenu from './LeftMenu'
import RightMenu from './RightMenu'
import { faXTwitter, faApple, faGoogle } from '@fortawesome/free-brands-svg-icons';
import '../style/Profile.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faCloudArrowUp } from '@fortawesome/free-solid-svg-icons'
import Profilee from '../assets/profilee.jpg'
import bg from '../assets/bg.jfif'
import pmore from '../assets/svg/pmore.svg'
import decryptData from '../helper/decryptData'
import Anlytics from '../assets/svg/anlytics.svg';
import Bookmark from '../assets/svg/bookmark.svg';
import Share from '../assets/svg/share.svg';
import Repost from '../assets/svg/repost.svg';
import Heart from '../assets/svg/heart.svg';
import Comment from '../assets/svg/comment.svg'
import demo from '../assets/demo.jpg'
function Profile() {
    const [post, setPost] = useState([])
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const user = localStorage.getItem('user');
    const parsedUser = user && user !== 'undefined' ? JSON.parse(user) : '';
    const data = JSON.parse(localStorage.getItem('data') || '')
    const userId = data.userid
    const [detail, setDetail] = useState<Object>([])
    const token = localStorage.getItem('token') || ''
    const [pFormData, setPFormData] = useState({ name: '', username: '', photo: [], bphoto: [], bio: '', phone: 0, userid: userId })
    const BASE_URL = 'http://localhost:5000'
    const [selectedMonth, setSelectedMonth] = useState<string>("January");
    const [selectedDay, setSelectedDay] = useState<number>(1);
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

    const months = [
        { name: "January", days: 31 }, { name: "February", days: 28 }, { name: "March", days: 31 },
        { name: "April", days: 30 }, { name: "May", days: 31 }, { name: "June", days: 30 },
        { name: "July", days: 31 }, { name: "August", days: 31 }, { name: "September", days: 30 },
        { name: "October", days: 31 }, { name: "November", days: 30 }, { name: "December", days: 31 }
    ];

    const [days, setDays] = useState<number[]>(Array.from({ length: 31 }, (_, i) => i + 1));
    const years: number[] = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

    // Update days when month changes (handle leap year for February)
    const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = event.target.value;
        setSelectedMonth(selected);
        const monthData = months.find(m => m.name === selected);
        if (monthData) {
            const isLeapYear = selected === "February" && selectedYear % 4 === 0 ? 29 : monthData.days;
            setDays(Array.from({ length: isLeapYear }, (_, i) => i + 1));
        }
    };
    const fileInputRef = useRef(null);
    const backgroundInputRef = useRef(null)
    const twittePhotoInputRef = useRef(null)

    const handleFileClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    const handleBackgroundClick = () => {
        if (backgroundInputRef.current) {
            backgroundInputRef.current.click();
        }
    };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length > 0) {
            setPFormData({ ...pFormData, photo: e.target.files[0] });
        }
    };
    const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length > 0) {
            setPFormData({ ...pFormData, bphoto: e.target.files[0] });
        }
    };
    const handlePDetailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();

        if (pFormData.photo) {
            formData.append("photo", pFormData.photo);
        }
        if (pFormData.bphoto) {
            formData.append("bphoto", pFormData.bphoto);
        }

        // Encrypt only text fields, not the whole FormData
        const encryptedData = await encryptData({
            name: pFormData.name,
            username: pFormData.username,
            bio: pFormData.bio,
            phone: pFormData.phone,
            userid: pFormData.userid
        });

        formData.append("encryptedData", encryptedData);

        try {
            const res = await fetch("http://localhost:5000/add-detail", {
                method: "POST",
                headers: {
                    "Token": token,
                },
                body: formData,
            });

            const getData = await res.json();
            console.log(getData);

            const decryptedData = await decryptData(getData.data);
            console.log(decryptedData);

            if (decryptedData.success) {
                setIsModalOpen(false);
            } else {
                alert(decryptedData.message);
            }
        } catch (error) {
            console.error("Upload Error:", error);
        }
    };

    const editProfile = () => {
        setIsModalOpen(true)
    }
    const getAllPost = async () => {

        const res = await fetch(`http://localhost:5000/get-twitte/${userId}`, {
            method: 'get',
            headers: {
                'Token': token,
                'Content-Type': 'application/json'
            }
        })
        const getData = await res.json()
        const decryptedData = await decryptData(getData.data)
        const result = decryptedData
        if (result.success) {
            console.log(result)
            setDetail(result.detail)
            setPost(result.twittes)
            console.log(post)
            // navigate('/home')
        }
        else {
            alert(result.message)
        }
    }
    useEffect(() => {
        getAllPost()
    }, [])
    return (
        <div className='container'>
            <div className="left-menu">
                <LeftMenu />
            </div>
            <div className="main">
                <div className="top" style={{ justifyContent: 'space-between' }}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                    <h2> {detail.name}</h2>
                </div>
                <div className="image">

                    <img src={`${BASE_URL}/${detail.bphoto}`} alt="" className="background" />
                    <div className="profile">
                        <img src={`${BASE_URL}/${detail.photo}`} alt="" />
                        <button className='edit' type='button' onClick={editProfile}>Edit profile</button>
                    </div>
                </div>
                <div className="detail">
                    <h2>{detail.name}</h2>
                    <h4 >{detail.username}</h4>
                    <h3>{detail.bio}</h3>
                    <div className='more'>
                        <h5>Sports, Fitness & Recreation</h5>
                        <h5>Rajasthan, India</h5>
                        <h5>Joined Octover 2020</h5>
                    </div>
                    <div className="follow">
                        <h5> <span>29</span>Following</h5>
                        <h5><span>2</span> Followers</h5>
                    </div>

                </div>
                <div className="menu">
                    <a href="" style={{ color: 'white', borderBottom: '5px solid #0d8af0', borderRadius: '5px' }}>Posts</a>
                    <a href="">Replies</a>
                    <a href="">Highlights</a>
                    <a href="">Articles</a>
                    <a href="">Media</a>
                    <a href="">Likes</a>
                </div>
                <div className="allpost">
                    {post.length > 0 ? post.map((item: any, key) => (
                        <div key={key} className='single-post'>
                            <div className="single-content">
                                <div className='single-photo'>
                                    <img src={`${BASE_URL}/${detail.photo}`} alt="" />
                                </div>
                                <div className='single-detail'>
                                    <div className="name">
                                        <h2>{detail.name}</h2>
                                        <h4>@{detail.username}</h4>
                                        <img src={pmore} alt="" className='action-svg' style={{ width: '30px', height: '30px' }} />
                                    </div>
                                    <h5 >{item.text}</h5>
                                </div>
                            </div>
                            <div className='action'>
                                <div>
                                    <img src={Comment} className='action-svg' />
                                    <h6>250</h6>
                                </div>
                                <div>
                                    <img src={Repost} className='action-svg' />
                                    <h6>{item.repost || 0}</h6>
                                </div>
                                <div>
                                    <img src={Heart} className='action-svg' />
                                    <h6>{item.like || 0}</h6>
                                </div>
                                <div>

                                    <img src={Anlytics} className='action-svg' />
                                    <h6>12563</h6>
                                </div>
                                <div>
                                    <img src={Bookmark} className='action-svg' />
                                    <h6>{item.bookmark || 0}</h6>
                                </div>
                                <div>
                                    <img src={Share} className='action-svg' />
                                </div>
                            </div>
                        </div>
                    )) : <h2>No post found</h2>}
                </div>
                {isModalOpen && (
                    <div className="e-overlay">
                        <form className="e-content" onSubmit={handlePDetailSubmit}>
                           
                            <div >
                                <button className="close-button" onClick={() => setIsModalOpen(false)}>✖</button>
                                <h1>Edit Profile</h1>
                                <button className="e-button" type='submit'>Save</button>
                            </div>
                            <div className="e-details">
                                <div className="e-field">
                                    <h3>Name</h3>
                                    <input type="text" placeholder="test" className="p-input" onChange={(e) => setPFormData({ ...pFormData, name: e.target.value })} />
                                </div>
                                <div className="e-field">
                                    <h3>Username</h3>
                                    <input type="text" placeholder="test@123" className="p-input" onChange={(e) => setPFormData({ ...pFormData, username: e.target.value })} />
                                </div>
                                <div className="e-field">
                                    <h3>Bio</h3>
                                    <input type="text" placeholder="i am student" className="p-input" onChange={(e) => setPFormData({ ...pFormData, bio: e.target.value })} />
                                </div>
                                <div className="e-field">
                                    <h3>Phone</h3>
                                    <input type="text" placeholder="7854784589" className="p-input" onChange={(e) => setPFormData({ ...pFormData, phone: parseInt(e.target.value) || 0 })} />
                                </div>
                                <div className="e-field" style={{ textAlign: 'center', display: 'flex', marginTop: '5%' }}>
                                    <h3>Profile Photo</h3>

                                    <FontAwesomeIcon
                                        icon={faCloudArrowUp}

                                        style={{ color: "white", marginLeft: '5%', fontSize: "40px", cursor: "pointer" }}
                                        onClick={handleFileClick}
                                    />
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        style={{ display: "none" }}
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </div>
                                <div className="e-field" style={{ textAlign: 'center', display: 'flex', marginTop: '5%' }}>
                                    <h3>BackGround Photo</h3>

                                    <FontAwesomeIcon
                                        icon={faCloudArrowUp}

                                        style={{ color: "white", marginLeft: '5%', fontSize: "40px", cursor: "pointer" }}
                                        onClick={handleBackgroundClick}
                                    />
                                    <input
                                        type="file"
                                        ref={backgroundInputRef}
                                        style={{ display: "none" }}
                                        accept="image/*"
                                        onChange={handleBackgroundChange}
                                    />
                                </div>
                                <div className="e-field">
                                    <h3>Date of Birth</h3>
                                    <p>This will not be shown publicly.</p>

                                    <div className="e-dob-section">
                                        <select className="modal-input" style={{ marginLeft: '0' }} onChange={handleMonthChange} value={selectedMonth}>
                                            {months.map((month, index) => (
                                                <option key={index} value={month.name}>{month.name}</option>
                                            ))}
                                        </select>
                                        <select className="modal-input" style={{ marginLeft: '0' }} onChange={(e) => setSelectedDay(Number(e.target.value))} value={selectedDay}>
                                            {days.map((day) => (
                                                <option key={day} value={day}>{day}</option>
                                            ))}
                                        </select>
                                        <select className="modal-input" style={{ marginLeft: '0' }} onChange={(e) => setSelectedYear(Number(e.target.value))} value={selectedYear}>
                                            {years.map((year) => (
                                                <option key={year} value={year}>{year}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                
                                </div>
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

export default Profile