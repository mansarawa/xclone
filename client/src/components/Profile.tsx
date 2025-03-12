import React, { useEffect, useState } from 'react'
import LeftMenu from './LeftMenu'
import RightMenu from './RightMenu'

import '../style/Profile.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

import pmore from '../assets/svg/pmore.svg'
import decryptData from '../helper/decryptData'
import Anlytics from '../assets/svg/anlytics.svg';
import Bookmark from '../assets/svg/bookmark.svg';
import Share from '../assets/svg/share.svg';
import Repost from '../assets/svg/repost.svg';
import Heart from '../assets/svg/heart.svg';
import Comment from '../assets/svg/comment.svg'
import encryptData from '../helper/encryptData'
// import demo from '../assets/demo.jpg'

interface FormData {
    name: string;
    username: string;
    photo?: File;
    bphoto?: File;
    bio: string;
    phone: number;
    userid?: string;
}

/*interface Month {
    name: string;
    days: number;
}*/

const Profile: React.FC = () => {
    const [post, setPost] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    //const user = localStorage.getItem("user");
   // const parsedUser = user && user !== "undefined" ? JSON.parse(user) : null;
    const data = JSON.parse(localStorage.getItem("data") || "{}");
    const userId = data?.userid || "";
    const [detail, setDetail] = useState<Record<string, any>>({});
    const token = localStorage.getItem("token") || "";

    const [pFormData, setPFormData] = useState<FormData>({
        name: "",
        username: "",
        photo: undefined,
        bphoto: undefined,
        bio: "",
        phone: 0,
        userid: userId,
    });

    const BASE_URL = "http://localhost:5000";
    /* const [selectedMonth, setSelectedMonth] = useState<string>("January");
    // const [selectedDay, setSelectedDay] = useState<number>(1);
    const [selectedYear, setSelectedYear] = useState<number>(
        new Date().getFullYear()
    );

    const months: Month[] = [
        { name: "January", days: 31 },
        { name: "February", days: 28 },
        { name: "March", days: 31 },
        { name: "April", days: 30 },
        { name: "May", days: 31 },
        { name: "June", days: 30 },
        { name: "July", days: 31 },
        { name: "August", days: 31 },
        { name: "September", days: 30 },
        { name: "October", days: 31 },
        { name: "November", days: 30 },
        { name: "December", days: 31 },
    ];
*/
    // const [days, setDays] = useState<number[]>(
    //     Array.from({ length: 31 }, (_, i) => i + 1)
    // );
    // const years: number[] = Array.from(
    //     { length: 100 },
    //     (_, i) => new Date().getFullYear() - i
    // );

    // Update days when month changes (handle leap year for February)
    // const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    //     const selected = event.target.value;
    //     setSelectedMonth(selected);
    //     const monthData = months.find((m) => m.name === selected);
    //     if (monthData) {
    //         const isLeapYear =
    //             selected === "February" && selectedYear % 4 === 0 ? 29 : monthData.days;
    //         setDays(Array.from({ length: isLeapYear }, (_, i) => i + 1));
    //     }
    // };

    // File input references
    // const fileInputRef = useRef<HTMLInputElement | null>(null);
    //const backgroundInputRef = useRef<HTMLInputElement | null>(null);
    // const twittePhotoInputRef = useRef<HTMLInputElement | null>(null);

    // const handleFileClick = () => {
    //     fileInputRef.current?.click();
    // };

    // const handleBackgroundClick = () => {
    //     backgroundInputRef.current?.click();
    // };

    // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = e.target.files?.[0];
    //     if (file) {
    //         setPFormData((prevData) => ({ ...prevData, photo: file }));
    //     }
    // };

    // const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = e.target.files?.[0];
    //     if (file) {
    //         setPFormData((prevData) => ({ ...prevData, bphoto: file }));
    //     }
    // };

    const handlePDetailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();

        if (pFormData.photo) {
            formData.append("photo", pFormData.photo);
        }
        if (pFormData.bphoto) {
            formData.append("bphoto", pFormData.bphoto);
        }

        try {
            // Encrypt text fields separately
            const encryptedData = await encryptData({
                name: pFormData.name,
                username: pFormData.username,
                bio: pFormData.bio,
                phone: pFormData.phone,
                userid: pFormData.userid,
            });

            formData.append("encryptedData", encryptedData);

            const res = await fetch(`${BASE_URL}/add-detail`, {
                method: "POST",
                headers: {
                    Token: token,
                },
                body: formData,
            });

            const getData = await res.json();
            console.log("Server Response:", getData);

            const decryptedData = await decryptData(getData.data);
            console.log("Decrypted Data:", decryptedData);

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
            <div className="pleft-menu">
                <LeftMenu />
            </div>
            <div className="pmain">
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
                           
                            <div className='edit-heading'>
                                <button className="eclose-button" onClick={() => setIsModalOpen(false)}>✖</button>
                                <h1>Edit Profile</h1>
                                <button className="e-button" type='submit'>Save</button>
                            </div>
                            <div className="image">

                    <img src={`${BASE_URL}/${detail.bphoto}`} alt="" className="background" />
                    <div className="profile">
                        <img src={`${BASE_URL}/${detail.photo}`} alt="" />
                        
                    </div>
                </div>
                            <div className="e-details">
                                <div className="e-field">
                                    <p>Name</p>
                                    <input type="text" value={detail.name}  className="e-input" onChange={(e) => setPFormData({ ...pFormData, name: e.target.value })} />
                                </div>
                                <div className="e-field">
                                    <p>Username</p>
                                    <input type="text" value="test@123" className="e-input" onChange={(e) => setPFormData({ ...pFormData, username: e.target.value })} />
                                </div>
                                <div className="e-field">
                                    <p>Bio</p>
                                    <input type="text" value={detail.bio} className="e-input" onChange={(e) => setPFormData({ ...pFormData, bio: e.target.value })} />
                                </div>
                                <div className="e-field">
                                    <p>Phone</p>
                                    <input type="text" value={detail.phone} className="e-input" onChange={(e) => setPFormData({ ...pFormData, phone: parseInt(e.target.value) || 0 })} />
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