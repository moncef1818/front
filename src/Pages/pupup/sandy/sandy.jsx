
import React, { useState } from 'react';
import FlagPopupsandy from './FlagPopupsandy';
import './sandy.css'

const Sandy = () => {
  const [isPopupOpensandy, setIsPopupOpensandy] = useState(false);
  
  const handleOpenPopupsandy = () => {
    setIsPopupOpensandy(true);
  };

  const handleClosePopupsandy = () => {
    setIsPopupOpensandy(false);
  };

  const handleSubmitFlagsandy = async (flag) => {
  
    flag = flag.trim()
    console.log("flag:", flag);
    console.log("Flag length:", flag.length);
    if(flag.length > 128){
      setError("Flag must contain 128 characters or less")
      return;
    }

    if(!flag){
      setError("Flag must not be empty")
      return;
    }

    try {
      const res = await api.post("/game/flags/submit/",
        {
          flag_code: flag,
        },
        {
          headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      )

      if(res.data.success){
        navigate("/")
        console.log('Flag submitted:', flag);
        alert(`Success! ${res.data.points_earned} points earned at ${res.data.stand}`);
      }else{
        setError(res.data.message)
        console.log("submittion failed: ", res.data.message)
      }
    } catch (error) {
      setError(error.response?.data?.message || "something went wrong")
      console.error("Submission failed:", error);
      console.log("Error response:", error.response.data);
    }

    setIsPopupOpensandy(false); 
  };
  
  return (
    <div className="app">
      <button id='sandybtn' onClick={handleOpenPopupsandy}>
      </button  >
      <FlagPopupsandy
        isOpen={isPopupOpensandy}
        onClose={handleClosePopupsandy}
        onSubmit={handleSubmitFlagsandy}
      />
    </div>
  );
}

export default Sandy;

