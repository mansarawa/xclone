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
import Loading from './Loading';


interface Post {
    _id: string;
    text: string;
    image?: string;
    userid: string;
  }
  
  const Home: React.FC = () => {
    const BASE_URL = "http://localhost:5000";
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState<boolean>(true);
    const [postData, setPostData] = useState<{ text: string; image: File | null; userid: string }>({
      text: "",
      image: null,
      userid: "",
    });
    const [post, setPost] = useState<Post[]>([]);
  
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const twittePhotoInputRef = useRef<HTMLInputElement>(null);
  
    // Safely retrieve and parse local storage data
    const user = localStorage.getItem("user");
    const parsedUser = user ? JSON.parse(user) : null;
    const token = localStorage.getItem("token") || "";
    const data = localStorage.getItem("data");
    const parsedData = data ? JSON.parse(data) : null;
    const userId = parsedData?.userid || "";
  
    // Ensure userId is set in state
    useEffect(() => {
      setPostData((prev) => ({ ...prev, userid: userId }));
    }, [userId]);
  
    const handleTwittePhotoClick = () => {
      twittePhotoInputRef.current?.click();
    };
  
    // const handleTwittePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //   if (e.target.files?.length > 0) {
    //     setPostData((prev) => ({ ...prev, image: e.target.files![0] }));
    //   }
    // };
    const handleTwittePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        
        if (files && files.length > 0) {  
            setPostData((prev) => ({ ...prev, image: files[0] }));
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
        userId: postData.userid,
      });
  
      formData.append("encryptedData", encryptedData);
  
      try {
        const res = await fetch(`${BASE_URL}/create-twitte`, {
          method: "POST",
          headers: { Token: token },
          body: formData,
        });
  
        const getData = await res.json();
        const decryptedData = await decryptData(getData.data);
  
        if (decryptedData.success) {
          setPostData({ text: "", image: null, userid: userId });
          getAllPost();
        } else {
          alert(decryptedData.message);
        }
      } catch (error) {
        console.error("Error submitting post:", error);
      }
    };
  
    const getAllPost = async () => {
      setLoading(true); // Set loading before fetching
  
      try {
        const res = await fetch(`${BASE_URL}/get-all-twitte`, {
          method: "GET",
          headers: { Token: token },
        });
  
        const getData = await res.json();
        const decryptedData = await decryptData(getData.data);
  
        if (decryptedData.success) {
          setPost(decryptedData.twittes);
        } else {
          alert(decryptedData.message);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };
  
    useEffect(() => {
      getAllPost();
    }, []);
  
    const handleActivity = async (type: string, twitteid: number) => {
      const updatedFormData = { type, twitteid, userId };
      const encryptedData = await encryptData(updatedFormData);
  
      try {
        const res = await fetch(`${BASE_URL}/add-twitte-activity`, {
          method: "POST",
          headers: {
            Token: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ encryptedData }),
        });
  
        const getData = await res.json();
        const decryptedData = await decryptData(getData.data);
  
        if (decryptedData.success) {
          getAllPost();
          console.log(`${type} action recorded`);
        } else {
          alert(decryptedData.message);
        }
      } catch (error) {
        console.error(`Error performing ${type} action:`, error);
      }
    };
  

    return (
        <div className='container'>
            {loading ? <Loading/>:(
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
                                style={{ display: "none"}}
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
            )}
        </div>
    )
}

export default Home