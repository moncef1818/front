
import React, { useState } from 'react';
import FlagPopupbimo from './FlagPopupbimo';
import './bimo.css'

const Bimo = () => {
  const [isPopupOpenbimo, setIsPopupOpenbimo] = useState(false);
  
  const handleOpenPopupbimo = () => {
    setIsPopupOpenbimo(true);
  };

  const handleClosePopupbimo = () => {
    setIsPopupOpenbimo(false);
  };

  const handleSubmitFlagbimo = async (flag) => {

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

    setIsPopupOpenbimo(false); 
  };
  
  return (
    <div className="app">
      <button id='bimobtn' onClick={handleOpenPopupbimo}>
      </button>
      <FlagPopupbimo
        isOpen={isPopupOpenbimo}
        onClose={handleClosePopupbimo}
        onSubmit={handleSubmitFlagbimo}
      />
    </div>
  );
}

export default Bimo;

