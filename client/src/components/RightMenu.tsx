import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import '../style/Right.css'
function RightMenu() {
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
                <h2>What’s happening</h2>
            </div>
        </div>
        <div className="to-follow">
            <h3>Who to Follow</h3>
        </div>
    </div>
  )
}

export default RightMenu