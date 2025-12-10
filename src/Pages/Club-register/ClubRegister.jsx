import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ClubRegister.css';
import { 
  FaUser, FaSchool, FaGraduationCap, FaPaperPlane 
} from 'react-icons/fa';

const ClubRegister = () => {
  const navigate = useNavigate()

  const REGISTRATION_OPEN = false  // ← toggle this when you want to reopen

  // data object
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    discord: '',
    school: '',
    year: '',
    department_choice_1: '',
    department_choice_2: '',
    department_choice_3: '',
    why_department_1: '',
    why_not_department_1_choose_2: '',
    why_not_department_1_and_2_choose_3: ''
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const CIC_URL = 'https://cyberinnovatorsclub.vercel.app/?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnf2wvAvfbny60MNl4cSxi4MGBpjMrFFOa9ADMfIqkH_Li6EmhxD02p8pU0Hk_aem_B15mgNzOJm0IC0lia2eMBw'

  // ... keep departmentChoices, yearChoices, handleChange, Submit as they are ...

  return (
    <div className="club-register-container">
      <div className="club-register-content">
        <div className="register-header">
          <div className="logo-section">
            <img 
              src="/Original version icon.png" 
              alt="CIC Logo" 
              className="club-logo"
            />
          </div>
          
          <h1>Join Cyber Innovators Club!</h1>
          <p>Complete your registration to become an official member</p>
        </div>

        {REGISTRATION_OPEN ? (
          <>
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {success ? (
              <div className="success-message">
                <h2>Registration Successful!</h2>
                <p>Welcome to the Cyber Innovators Club! You'll receive a confirmation email soon, check your phones!.</p>
              </div>
            ) : (
              // ⬇️ your existing <form> stays unchanged here
              <form onSubmit={Submit} className="register-form">
                {/* ... full form content ... */}
              </form>
            )}
          </>
        ) : (
          <div className="success-message">
            <h2>Registrations are closed</h2>
            <p>Thank you for your interest in Cyber Innovators Club. Registrations are currently closed.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ClubRegister
