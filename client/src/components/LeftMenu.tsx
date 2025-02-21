import React from 'react'
import '../style/Left.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faXTwitter, faApple, faGoogle, faXing 
} from '@fortawesome/free-brands-svg-icons';
import { 
    faBell, faCommentDots, faEnvelope, faHouse, 
    faMagnifyingGlass, faUser, faUserGroup, faEllipsisH 
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function LeftMenu() {
    const navigate=useNavigate()
    const user = localStorage.getItem('user');
    const parsedUser = user && user !== 'undefined' ? JSON.parse(user) : '';

    //console.log(user[0].username)
    const handleLogout=()=>{
        localStorage.clear();
        navigate('/')
    }
  return (
    <div className='containers'>
        {/* Twitter Logo */}
        <div className="item">
            <FontAwesomeIcon icon={faXTwitter} className='twitter-icon' />
        </div>

        {/* Sidebar Items */}
        <div className="item">
            <FontAwesomeIcon icon={faHouse} className='menu-icon' />
            <a href='/'>Home</a>
        </div>
        <div className="item">
            <FontAwesomeIcon icon={faMagnifyingGlass} className='menu-icon' />
            <a href='/'>Explore</a>
        </div>
        <div className="item">
            <FontAwesomeIcon icon={faBell} className='menu-icon' />
            <a href='/'>Notifications</a>
        </div>
        <div className="item">
            <FontAwesomeIcon icon={faEnvelope} className='menu-icon' />
            <a href='/'>Messages</a>
        </div>
        <div className="item">
            <FontAwesomeIcon icon={faXing} className='menu-icon' />
            <a href='/'>Grok</a>
        </div>
        <div className="item">
            <FontAwesomeIcon icon={faUserGroup} className='menu-icon' />
            <a href='/'>Communities</a>
        </div>
        <div className="item">
            <a href='/'>Premium</a>
        </div>
        <div className="item">
            <a href='/'>Verified Orgs</a>
        </div>
        <div className="item">
            <FontAwesomeIcon icon={faUser} className='menu-icon' />
            <a href='/'>Profile</a>
        </div>
        <div className="item">
            <FontAwesomeIcon icon={faEllipsisH} className='menu-icon' />
            <a href='/'>More</a>
        </div>

        
        <div className="item">
            <button className="lpost-button">Post</button>
        </div>

        <div className="item">
            <button className='logout' onClick={handleLogout}>Logout</button>
        </div>
    </div>
  )
}

export default LeftMenu
