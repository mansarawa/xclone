import React, { useEffect, useState } from 'react';
import xlogo from '../assets/xlogo.svg';
import '../style/Welcome.css';  
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXTwitter, faApple, faGoogle } from '@fortawesome/free-brands-svg-icons';
import encryptData from '../helper/encryptData';
import decryptData from '../helper/decryptData';
import { useNavigate } from 'react-router-dom';

const WelcomePage: React.FC = () => {
    const navigate=useNavigate()
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [LogModalOpen, setLogModalOpen] = useState<boolean>(false);
    const [dob, setDob] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [email, setEmail] = useState<string>("");
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

    useEffect(() => {
        setDob(` ${selectedYear},${selectedMonth}, ${selectedDay}`);
    }, [selectedMonth, selectedDay, selectedYear]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const userData={email,password,dob}
        console.log("Submitting:", { email, password, dob });
        const encryptedData=await encryptData(userData)
        const res = await fetch('http://localhost:5000/create-account', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({encryptedData })
        });
        const getData=await res.json()
        console.log(getData)
        const decryptedData=await decryptData(getData.data)
        console.log(decryptedData)
        const result=decryptedData
        if(result.success){
            
            navigate('/home')
        }
        else{
            alert(result.message)
        }
    };
    const handleLogSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const userData={email,password,dob}
        console.log("Submitting:", { email, password });
        const encryptedData=await encryptData(userData)
        const res = await fetch('http://localhost:5000/login', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({encryptedData })
        });
        const getData=await res.json()
        console.log(getData)
        const decryptedData=await decryptData(getData.data)
        console.log(decryptedData)
        const result=decryptedData
        if(result.success){
            console.log(result)
            localStorage.clear()
            localStorage.setItem('data',JSON.stringify(result))

            localStorage.setItem('token',result.token)
            if(result.user){

                localStorage.setItem('user',JSON.stringify(result.user))
            }
            navigate('/home')
        }
        else{
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
                    <button className='welcome-button google-signin'> Sign up with Google</button>
                    <button className='welcome-button apple-signup'> 
                        <FontAwesomeIcon icon={faApple} /> Sign up with Apple
                    </button>
                    <h6>or</h6>
                    <button className='welcome-button create-account' onClick={() => setIsModalOpen(true)}>
                        Create account
                    </button>
                    <p className='terms-text'>
                        By signing up, you agree to the <a href='#' style={{color:'#1d9bf0'}}>Terms of Service</a> 
                        and <a href='#' style={{color:'#1d9bf0'}}>Privacy Policy</a>, including Cookie Use.
                    </p>
                    <h2>Already have an account?</h2>
                    <button className='welcome-button signin-btn' onClick={() => setLogModalOpen(true)}>Sign In</button>
                </div>
            </div>

            {/* MODAL */}
           {isModalOpen && (
                <div className="modal-overlay">
                    <form className="modal-content" onSubmit={handleSubmit}>
                        <button className="close-button" onClick={() => setIsModalOpen(false)}>✖</button>
                        <h1>Create your account</h1>
                        
                        <input type="email" placeholder="Email" className="modal-input" onChange={(e) => setEmail(e.target.value)} />
                        <input type="password" placeholder="Password" className="modal-input" onChange={(e) => setPassword(e.target.value)} />
                        
                        <h3>Date of Birth</h3>
                        <p>This will not be shown publicly.</p>

                        <div className="dob-section">
                            <select className="modal-input" onChange={handleMonthChange} value={selectedMonth}>
                                {months.map((month, index) => (
                                    <option key={index} value={month.name}>{month.name}</option>
                                ))}
                            </select>
                            <select className="modal-input" onChange={(e) => setSelectedDay(Number(e.target.value))} value={selectedDay}>
                                {days.map((day) => (
                                    <option key={day} value={day}>{day}</option>
                                ))}
                            </select>
                            <select className="modal-input" onChange={(e) => setSelectedYear(Number(e.target.value))} value={selectedYear}>
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
                <div className="modal-overlay">
                    <form className="modal-content" onSubmit={handleLogSubmit}>
                        <button className="close-button" onClick={() => setLogModalOpen(false)}>✖</button>
                        <h1>Sign in to X</h1>
                        <button className='welcome-button google-signin' style={{width:'100%',fontWeight:'100'}}> Sign up with Google</button>
                    <button className='welcome-button apple-signup' style={{width:'100%',fontWeight:'100'}}> 
                        <FontAwesomeIcon icon={faApple} /> Sign up with Apple
                    </button>
                    <h5 style={{width:'100%',textAlign:'center'}}>or</h5>
                        <input type="email" placeholder="Email" className="modal-input" onChange={(e) => setEmail(e.target.value)} />
                        <input type="password" placeholder="Password" className="modal-input" onChange={(e) => setPassword(e.target.value)} />
                        


                        <button className="modal-button" style={{backgroundColor:'white',color:'black'}} type='submit'>Next</button>
                        <button className="welcome-button signin-btn" style={{width:'100%',color:'white'}} type='submit'>Forgot Password</button>
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
