import React, { useEffect, useRef, useState } from 'react';

import '../style/Welcome.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXTwitter, faApple } from '@fortawesome/free-brands-svg-icons';
import encryptData from '../helper/encryptData';
import decryptData from '../helper/decryptData';
import { useNavigate } from 'react-router-dom';
import google from '../assets/google.png'
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons';


interface FormData {
    name: string;
    username: string;
    photo?: File;
    bphoto?: File;
    bio: string;
    phone: number;
    userid?: string;
}

const WelcomePage: React.FC = () => {
    const navigate = useNavigate();
    const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
    const [isEmail, setIsEmail] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [LogModalOpen, setLogModalOpen] = useState<boolean>(false);
    const [pFormData, setPFormData] = useState<FormData>({
        name: '',
        username: '',
        photo: undefined,
        bphoto: undefined,
        bio: '',
        phone: 0,
        userid: undefined,
    });
    const [token, setToken] = useState<string>('');
    const [dob, setDob] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [selectedMonth, setSelectedMonth] = useState<string>('January');
    const [selectedDay, setSelectedDay] = useState<number>(1);
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

    // Correctly typed useRef for input elements
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const backgroundInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileClick = () => {
        fileInputRef.current?.click();
    };

    const handleBackgroundClick = () => {
        backgroundInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPFormData((prevData) => ({ ...prevData, photo: file }));
        }
    };

    const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPFormData((prevData) => ({ ...prevData, bphoto: file }));
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
                        setIsDetailModalOpen(false);
                        setIsModalOpen(false)
                        setLogModalOpen(true)
                       
                    } else {
                        alert(decryptedData.message);
                    }
                } catch (error) {
                    console.error("Upload Error:", error);
                }
            };

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

    useEffect(() => {
        setDob(` ${selectedYear},${selectedMonth}, ${selectedDay}`);
    }, [selectedMonth, selectedDay, selectedYear]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const userData = { email, password, dob }
        console.log("Submitting:", { email, password, dob });
        const encryptedData = await encryptData(userData)
        const res = await fetch('http://localhost:5000/create-account', {
            method: 'post',
            headers: {
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
            setPFormData({...pFormData,userid:result.userid})
            setIsDetailModalOpen(true)
        }
        else {
            alert(result.message)
        }
    };
    const handleLogSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const userData = { email, password, dob }
        console.log("Submitting:", { email, password });
        const encryptedData = await encryptData(userData)
        const res = await fetch('http://localhost:5000/login', {
            method: 'post',
            headers: {
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
            console.log(result)
            localStorage.clear()
            localStorage.setItem('data', JSON.stringify(result))
            setPFormData({...pFormData,userid:result.userid})
            setToken(result.token)
            localStorage.setItem('token', result.token)
            if (result.user) {
                localStorage.setItem('user', JSON.stringify(result.user))
                if(result.isDetail){
                    navigate('/home')
                }

            }
            setIsDetailModalOpen(true)
            setLogModalOpen(false)
        }
        else {
            alert(result.message)
        }
    };
    return (
        <div className='welcome-container'>
            <div className='welcome-content'>
                <div className='welcome-left'>
                    <FontAwesomeIcon icon={faXTwitter} className='twitter-icon' />
                </div>
                <div className='welcome-right'>
                    <h1>Happening now</h1>
                    <h3>Join today.</h3>
                    <button className='welcome-button google-signin'><img src={google} style={{ marginRight: '10px', width: '20px', height: '20px' }} alt="" /> Sign up with Google</button>
                    <button className='welcome-button apple-signup'>
                        <FontAwesomeIcon icon={faApple} style={{ marginRight: '10px' }} /> Sign up with Apple
                    </button>
                    <h6>or</h6>
                    <button className='welcome-button create-account' onClick={() => setIsModalOpen(true)}>
                        Create account
                    </button>
                    <p className='terms-text'>
                        By signing up, you agree to the <a href='#' style={{ color: '#1d9bf0' }}>Terms of Service</a>
                        and <a href='#' style={{ color: '#1d9bf0' }}>Privacy Policy</a>, including Cookie Use.
                    </p>
                    <h2>Already have an account?</h2>
                    <button className='welcome-button signin-btn' onClick={() => setLogModalOpen(true)}>Sign In</button>
                </div>
            </div>

            {/* MODAL */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <form className="modal-content" onSubmit={handleSubmit}>
                        
                        <div className='modal-top'>
                        <button className="close-button" onClick={() => setIsModalOpen(false)}>✖</button>
                            <FontAwesomeIcon icon={faXTwitter} style={{ textAlign: 'center', margin: '0px 0 10px 5%', fontSize: '40px' }} />
                        </div>
                        <h1>Create your account</h1>

                        <input type="email" placeholder="Email" className="modal-input" style={{color:'#aaaaaa',width:'100%',height:'70px',margin:'0'}} onChange={(e) => setEmail(e.target.value)} />
                        <input type="password" placeholder="Password" className="modal-input" style={{width:'100%',height:'70px',margin:'20px 0 0 0'}} onChange={(e) => setPassword(e.target.value)} />

                        <h3>Date of Birth</h3>
                        <p>This will not be shown publicly. Confirm your own age, even if this account is for a business, a pet, or something else.</p>

                        <div className="dob-section">
                            <select className="modal-input" style={{marginLeft:'0'}} onChange={handleMonthChange} value={selectedMonth}>
                                {months.map((month, index) => (
                                    <option key={index} value={month.name}>{month.name}</option>
                                ))}
                            </select>
                            <select className="modal-input" style={{marginLeft:'0'}} onChange={(e) => setSelectedDay(Number(e.target.value))} value={selectedDay}>
                                {days.map((day) => (
                                    <option key={day} value={day}>{day}</option>
                                ))}
                            </select>
                            <select className="modal-input" style={{marginLeft:'0'}} onChange={(e) => setSelectedYear(Number(e.target.value))} value={selectedYear}>
                                {years.map((year) => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>

                        <button className="modal-button" type='submit'>Next</button>
                    </form>
                </div>
            )}

            {/* Sign in Modal */}
            {LogModalOpen && (
                <div className="email-overlay">
                    <form className="email-content" onSubmit={(e) => {
                        e.preventDefault();
                        setIsEmail(true);
                    }}>
                        <div className='email-top'>
                            <button className="close-button" onClick={() => setLogModalOpen(false)}>✖</button>
                            <FontAwesomeIcon icon={faXTwitter} style={{textAlign: 'center', margin: '0px 0 10px 5%', fontSize: '40px' }} />
                        </div>
                        <h1 style={{ width: '80%', marginLeft: '10%', fontWeight: '100' }}>Sign in to X</h1>
                        <button className='welcome-button google-signin' style={{ width: '80%', marginBottom: '3%', marginLeft: '10%', fontWeight: '100' }}><img src={google} style={{ marginRight: '10px', width: '20px', height: '20px' }} alt="" /> Sign in with Google</button>
                        <button className='welcome-button apple-signup' style={{ width: '80%', marginLeft: '10%', fontWeight: '100' }}>
                            <FontAwesomeIcon icon={faApple} style={{ marginRight: '10px' }} /> Sign in with Apple
                        </button>
                        <h4 style={{ width: '100%', textAlign: 'center' }}>or</h4>
                        <input type="email" placeholder="Phone,Email or Username" className="email-input" onChange={(e) => setEmail(e.target.value)} />
                        {/* <input type="password" placeholder="Password" className="modal-input" onChange={(e) => setPassword(e.target.value)} />
                         */}


                        <button className="email-button" style={{ backgroundColor: 'white', width: '80%', marginLeft: '10%', color: 'black' }} type='submit'>Next</button>
                        <button className="welcome-button signin-btn" style={{ width: '80%', marginLeft: '10%',marginTop:'5%', color: 'white' }} type='submit'>Forgot Password</button>
                        <div className="not-account">
                            <p>Don't have an account?</p>
                            <button type='button' onClick={()=>setIsModalOpen(true)}>Sign up</button>
                        </div>
                    </form>

                </div>
            )}
            {isEmail && (
                <div className="password-overlay">
                    <form className="password-content" onSubmit={handleLogSubmit}>
                        <div className="password-top">
                            <button className="close-button" onClick={() => setIsEmail(false)}>✖</button>
                            <FontAwesomeIcon icon={faXTwitter} style={{  textAlign: 'center', margin: '0px 0 10px 5%', fontSize: '40px' }} />
                        </div>
                        <h1 >Enter Your Password</h1>

                        <input type="email" placeholder="Phone,Email or Username" className="password-input" value={email} disabled />
                        <input type="password" placeholder="Password" className="password-input" onChange={(e) => setPassword(e.target.value)} />
                        <button  style={{color: '#0d8af0',border:'none',backgroundColor:'black' }} type='submit'>Forgot Password</button>
                        <div className='footer-password-btn'>
                        <button className="password-button"  type='submit'>Log in</button>
                        <div className="password-not-account">
                            <span>Don't have an account?</span>
                            <button type='button' onClick={()=>setIsModalOpen(true)}>Sign up</button>
                        </div>
                        </div>
                    </form>
                </div>
            )}
             {/* MODAL */}
             {isDetailModalOpen && (
                    <div className="p-overlay">
                        <form className="p-content" onSubmit={handlePDetailSubmit}>

                            <h1>Enter Your Personal Detail your account</h1>
                            <div className="details">
                                <div className="field">
                                    <h3>Name</h3>
                                    <input type="text" placeholder="test" className="p-input" onChange={(e) => setPFormData({ ...pFormData, name: e.target.value })} />
                                </div>
                                <div className="field">
                                    <h3>Username</h3>
                                    <input type="text" placeholder="test@123" className="p-input" onChange={(e) => setPFormData({ ...pFormData, username: e.target.value })} />
                                </div>
                                <div className="field">
                                    <h3>Bio</h3>
                                    <input type="text" placeholder="i am student" className="p-input" onChange={(e) => setPFormData({ ...pFormData, bio: e.target.value })} />
                                </div>
                                <div className="field">
                                    <h3>Phone</h3>
                                    <input type="text" placeholder="7854784589" className="p-input" onChange={(e) => setPFormData({ ...pFormData, phone: parseInt(e.target.value) || 0 })} />
                                </div>
                                <div className="field" style={{ textAlign: 'center', display: 'flex', marginTop: '5%' }}>
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
                                <div className="field" style={{ textAlign: 'center', display: 'flex', marginTop: '5%' }}>
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
                            </div>
                            <button className="p-button" type='submit'>Next</button>
                        </form>
                    </div>
                )}
            <div className='footer-links'>
                <button>About</button>
                <button>Download The X app</button>
                <button>Help Center</button>
                <button>Terms of Service</button>
                <button>Privacy Policy</button>
                <button>Cookie Policy</button>
                <button>Accessibility</button>
                <button>Ads info</button>
                <button>Blog</button>
                <button>Careers</button>
                <button>Brand Resources</button>
                <button>Advertising</button>
                <button>Marketing</button>
                <button>X for Business</button>
                <button>Developers</button>
                <button>Directory</button>
                <button>Settings</button>
                <button>2025 X Corp.</button>
            </div>
        </div>
    );
}

export default WelcomePage;
