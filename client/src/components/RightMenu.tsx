import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import demo from '../assets/demo.jpg'
import '../style/Right.css'
import decryptData from '../helper/decryptData'
function RightMenu() {
    const token = localStorage.getItem('token') || ''
    const [users, setUsers] = useState([]);
    const getAllUser = async () => {

        const res = await fetch('http://localhost:5000/get-all-user', {
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
            setUsers(result.users)

            // navigate('/home')
        }
        else {
            alert(result.message)
        }
    }
    useEffect(() => {
        getAllUser()
    }, [])
    return (
        <div className='right-container'>
            <div className="search">
                <FontAwesomeIcon icon={faMagnifyingGlass} className='search-icon' />
                <input type="text" name="search" id="" placeholder='Search' />
            </div>
            <div className="premium">
                <h1>Subscribe to Premium</h1>
                <p>Subscribe to unlock new features and if eligible, receive a share of revenue.</p>
                <button className='subscribe'>Subscribe</button>
            </div>
            <div className="trending">

                <div className="items">
                    <h2 style={{color:'#e7e9ea'}}>What’s happening</h2>
                </div>
            </div>
            <div className="to-follow">
                <h2 style={{width:'100%',margin:'10px 0 10px 0',color:'#e7e9ea'}}>Who to Follow</h2>
                {users && users.map((item: any, key) => (

                    <div className="single-content">
                        <div className='single-photo'>
                            <img src={demo} alt="" style={{width:'40px',height:'40px'}}/>
                        </div>
                        <div className="name" style={{flexDirection:'column',marginLeft:'10px',alignItems:'flex-start'}}>
                            <h3>{item.name}</h3>
                            <h4>@{item.username}</h4>
                        </div>
                        <div className="btn" style={{justifyContent:'center'}}>
                            <button>Follow</button>
                        </div>
                    </div>


                ))}
            </div>
        </div>
    )
}

export default RightMenu