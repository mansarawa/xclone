import React, { useEffect, useState } from 'react'
import LeftMenu from './LeftMenu'
import RightMenu from './RightMenu'
import '../style/Profile.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import Profilee from '../assets/profilee.jpg'
import bg from '../assets/bg.jfif'
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
    const user = localStorage.getItem('user');
    const parsedUser = user && user !== 'undefined' ? JSON.parse(user) : '';
    const [detail,setDetail]=useState<Object>([])
    const token = localStorage.getItem('token') || ''
    const data = JSON.parse(localStorage.getItem('data') || '')
    const userId = data.userid
    const BASE_URL='http://localhost:5000'
    console.log(`${BASE_URL}/${detail.photo}`)
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
    useEffect(()=>{
        getAllPost()
    },[])
  return (
    <div className='container'>
        <div className="left-menu">
            <LeftMenu/>
        </div>
        <div className="main">
            <div className="top" style={{justifyContent:'stretch'}}>
                <FontAwesomeIcon icon={faArrowLeft} />
                <h2> {detail.name}</h2>
            </div>
            <div className="image">
                
                <img src={`${BASE_URL}/${detail.bphoto}`} alt="" className="background" />
                <div className="profile">
                    <img src={`${BASE_URL}/${detail.photo}`} alt="" />
                    <button className='edit'>Edit profile</button>
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
                <a href="" style={{color:'white',borderBottom:'5px solid #0d8af0',borderRadius:'5px'}}>Posts</a>
                <a href="">Replies</a>
                <a href="">Highlights</a>
                <a href="">Articles</a>
                <a href="">Media</a>
                <a href="">Likes</a>
            </div>
            <div className="allpost">
                        {post.length>0 ? post.map((item: any, key) => (
                            <div key={key} className='single-post'>
                                <div className="single-content">
                                    <div className='single-photo'>
                                        <img src={`${BASE_URL}/${detail.photo}`} alt="" />
                                    </div>
                                    <div className='single-detail'>
                                        <div className="name">
                                            <h2>{detail.name}</h2>
                                            <h4>@{detail.username}</h4>

                                        </div>
                                        <h5 >{item.text}</h5>
                                    </div>
                                </div>
                                <div className='action'>
                                    <div>
                                        <img src={Comment} className='action-svg'  />
                                    </div>
                                    <div>
                                        <img src={Repost} className='action-svg'  />
                                        <h6>{item.repost || 0}</h6>
                                    </div>
                                    <div>
                                        <img src={Heart} className='action-svg'  />
                                        <h6>{item.like || 0}</h6>
                                    </div>
                                    <div>

                                    <img src={Anlytics} className='action-svg' />
                                    </div>
                                    <div>
                                        <img src={Bookmark} className='action-svg'  />
                                        <h6>{item.bookmark || 0}</h6>
                                    </div>
                                    <div>
                                        <img src={Share} className='action-svg' />
                                    </div>
                                </div>
                            </div>
                        )) : <h2>No post found</h2>}
                    </div>
        </div>
        <div className="right-menu">
            <RightMenu/>
        </div>
    </div>
  )
}

export default Profile