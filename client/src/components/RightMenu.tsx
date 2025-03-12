import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import demo from '../assets/demo.jpg';
import '../style/Right.css';
import decryptData from '../helper/decryptData';

// Define user type for TypeScript safety
interface User {
    name: string;
    username: string;
    photo?: string;
}

const RightMenu: React.FC = () => {
    const token: string = localStorage.getItem('token') || '';
    const [users, setUsers] = useState<User[]>([]);
    const BASE_URL = 'http://localhost:5000';

    const getAllUser = async () => {
        try {
            const res = await fetch(`${BASE_URL}/get-all-user`, {
                method: 'GET',
                headers: {
                    'Token': token,
                    'Content-Type': 'application/json',
                },
            });

            const getData = await res.json();
            const decryptedData = await decryptData(getData.data);
            const result = decryptedData;

            if (result.success) {
                setUsers(result.users);
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        getAllUser();
    }, []);

    return (
        <div className="right-container">
            {/* Search Bar */}
            <div className="search">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
                <input type="text" name="search" placeholder="Search" />
            </div>

            {/* Premium Section */}
            <div className="premium">
                <h1>Subscribe to Premium</h1>
                <p>Subscribe to unlock new features and if eligible, receive a share of revenue.</p>
                <button className="subscribe">Subscribe</button>
            </div>

            {/* Trending Section */}
            <div className="trending">
                <h2 style={{ color: '#e7e9ea', width: '100%', paddingLeft: '3%' }}>What’s happening</h2>
                <div className="happen">
                    <p>Trending in India</p>
                    <h3>#ShoaibAkhtar</h3>
                </div>
                <div className="happen">
                    <p>Trending in India</p>
                    <h3>#RJMahvash</h3>
                </div>
                <div className="happen">
                    <p>Trending in India</p>
                    <h3>#IndianCricket</h3>
                </div>
            </div>

            {/* Who to Follow Section */}
            <div className="to-follow">
                <h2 style={{ width: '100%', margin: '10px 0', color: '#e7e9ea' }}>Who to Follow</h2>
                {users.map((user, index) => (
                    <div className="single-content" key={index}>
                        <div className="single-photo">
                            <img
                                src={user.photo ? `${BASE_URL}/${user.photo}` : demo}
                                alt={user.name}
                                style={{ width: '40px', height: '40px' }}
                            />
                        </div>
                        <div className="name" style={{ flexDirection: 'column', marginLeft: '10px', alignItems: 'flex-start' }}>
                            <h3>{user.name}</h3>
                            <h4>@{user.username}</h4>
                        </div>
                        <div className="btn" style={{ justifyContent: 'center' }}>
                            <button>Follow</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RightMenu;
