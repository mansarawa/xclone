import { faXTwitter } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import React from 'react'

function Loading() {
  return (
    <div style={{width:'100vw',height:'100vh',backgroundColor:'black',textAlign:'center'}}>
        <FontAwesomeIcon icon={faXTwitter} className='twitter-icon' style={{fontSize:'100px',marginTop:'20%'}} />
    </div>
  )
}

export default Loading