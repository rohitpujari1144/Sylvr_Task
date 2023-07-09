import axios from 'axios'
import { Helmet } from 'react-helmet'
import Snackbar from '@mui/material/Snackbar'
import React, { useState } from 'react'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { useNavigate } from 'react-router-dom'

function UserProfile() {
  let navigate=useNavigate()
  let [open, setOpen] = useState(false)
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
  const userPassword = sessionStorage.getItem('userPassword')

  function firstNameValidate() {
    const firstName = document.getElementById('firstName')
    const firstNameError = document.getElementById('firstNameError')
    if (firstName.value === '') {
      firstNameError.innerText = "*Required"
    }
    else {
      firstNameError.innerText = ''
    }
  }

  function lastNameValidate() {
    const lastName = document.getElementById('lastName')
    const lastNameError = document.getElementById('lastNameError')
    if (lastName.value === '') {
      lastNameError.innerText = "*Required"
    }
    else {
      lastNameError.innerText = ''
    }
  }

  function emailValidate() {
    const email = document.getElementById('email')
    const emailError = document.getElementById('emailError')
    if (email.value === '') {
      emailError.innerText = "*Required"
    }
    else {
      emailError.innerText = ''
    }
  }

  function submitClick() {
    const firstName = document.getElementById('firstName')
    const firstNameError = document.getElementById('firstNameError')
    const lastName = document.getElementById('lastName')
    const lastNameError = document.getElementById('lastNameError')
    const email = document.getElementById('email')
    const emailError = document.getElementById('emailError')
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/

    if (firstName.value === '') {
      firstNameError.innerText = "*Required"
    }
    else {
      if (!isNaN(firstName.value)) {
        firstNameError.innerText = "*Invalid"
      }
      else {
        firstNameError.innerText = ''
      }
    }
    if (lastName.value === '') {
      lastNameError.innerText = "*Required"
    }
    else {
      if (!isNaN(lastName.value)) {
        lastNameError.innerText = "*Invalid"
      }
      else {
        lastNameError.innerText = ''
      }
    }
    if (email.value === '') {
      emailError.innerText = "*Required"
    }
    else {
      if (email.value.match(emailPattern)) {
        emailError.innerText = ""
      }
      else {
        emailError.innerText = '*Invalid'
      }
    }
    if (firstNameError.innerText === '' && lastNameError.innerText === '' && emailError.innerText === '') {
      const newData = {
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
      }
      console.log(userInfo.email);
      axios.put(`https://sylvr-task-backend.onrender.com/updateUser/${userInfo.email}`, newData)
        .then((response) => {
          sessionStorage.setItem('userInfo', JSON.stringify(newData))
          setOpen(true)
        })
        .catch((error) => {
          console.log(error);
        })
    }
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  }

  const action = (
    <React.Fragment>
      <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  )

  function logoutClick(){
    sessionStorage.clear()
    navigate('/')
  }
  return (
    <>
      <Helmet>
        <title>User | Profile</title>
      </Helmet>
      <div className='text-end mt-3 me-3'>
        <button type="button" className="btn btn-outline-danger" onClick={() => { logoutClick() }}><i className="fa-solid fa-right-from-bracket"></i> Logout</button>
      </div>
      <div className="shadow col-3 rounded p-4 position-absolute top-50 start-50 translate-middle">
        <div>
          <h4 className='text-center'>Profile</h4>
          <div>
            <label htmlFor="firstName" className="form-label">First Name</label>
            <input type="text" className="form-control" id="firstName" aria-describedby="emailHelp" defaultValue={userInfo.firstName} onKeyUp={() => { firstNameValidate() }} />
            <span id='firstNameError' className='text-danger'></span>
          </div>
          <div className='mt-3'>
            <label htmlFor="lastName" className="form-label">Last Name</label>
            <input type="text" className="form-control" id="lastName" aria-describedby="emailHelp" defaultValue={userInfo.lastName} onKeyUp={() => { lastNameValidate() }} />
            <span id='lastNameError' className='text-danger'></span>
          </div>
          <div className='mt-3'>
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control" id="email" aria-describedby="emailHelp" defaultValue={userInfo.email} onKeyUp={() => { emailValidate() }} />
            <span id='emailError' className='text-danger'></span>
          </div>
          <div className='mt-3'>
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" id="password" aria-describedby="emailHelp" defaultValue={userPassword} readOnly />
          </div>
          <div className='text-center mt-3'>
            <span id='emailSecurityCodeError' className='text-danger'></span>
          </div>
          <div className='text-center mt-4'>
            <button type="button" id='sumbitbutton' className="btn btn-outline-success ms-3" onClick={() => { submitClick() }}><i className="fa-solid fa-check"></i> Submit</button>
          </div>
        </div>
      </div>
      {
        open ? <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} message="Profile successfully updated" action={action} /> : ''
      }
    </>
  )
}

export default UserProfile