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
import Grok from '../assets/svg/grok.svg'
import Premium from '../assets/svg/premium.svg'
import Lverify from '../assets/svg/lverify.svg'
import More from '../assets/svg/more.svg'
import Home from '../assets/svg/home.svg'
import Notification from '../assets/svg/notification.svg'
import Message from '../assets/svg/message.svg'
import Communities from '../assets/svg/communitites.svg'
import Search from '../assets/svg/search.svg'
import Profile from '../assets/svg/profile.svg'

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
        <div className="item mob">
            <FontAwesomeIcon icon={faXTwitter} className='ltwitter-icon' />
        </div>

        {/* Sidebar Items */}
        <div className="item">
        <img src={Home} className='lsvg' onClick={()=>navigate('/home')} />
            <a href='/home'>Home</a>
        </div>
        <div className="item">
        <img src={Search} className='lsvg' onClick={()=>navigate('/')}/>
            <a href='/'>Explore</a>
        </div>
        <div className="item">
        <img src={Notification} className='lsvg' onClick={()=>navigate('/')}/>
            <a href='/'>Notifications</a>
        </div>
        <div className="item">
        <img src={Message} className='lsvg'onClick={()=>navigate('/')} />
            <a href='/'>Messages</a>
        </div>
        <div className="item">
        <img src={Grok} className='lsvg' onClick={()=>navigate('/')}/>
            <a href='/'>Grok</a>
        </div>
        <div className="item">
        <img src={Communities} className='lsvg' onClick={()=>navigate('/')}/>
            <a href='/'>Communities</a>
        </div>
        <div className="item mob">
        <img src={Premium} className='lsvg'onClick={()=>navigate('/')} />
            <a href='/'>Premium</a>
        </div>
        <div className="item mob">
        <img src={Lverify} className='lsvg ' onClick={()=>navigate('/')}/>
            <a href='/'>Verified Orgs</a>
        </div>
        <div className="item mob">
        <img src={Profile} className='lsvg' onClick={()=>navigate('/profile')}/>
            <a href='/profile'>Profile</a>
        </div>
        <div className="item mob">
        <img src={More} className='lsvg' onClick={()=>navigate('/')}/>
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
