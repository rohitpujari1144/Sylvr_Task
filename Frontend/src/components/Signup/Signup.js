import './signup.css'
import axios from 'axios'
import { Helmet } from 'react-helmet'
import React, { useState } from 'react'
import Snackbar from '@mui/material/Snackbar'
import { useNavigate } from 'react-router-dom'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

function Signup() {
    var count = 0
    let navigate = useNavigate()
    let [open, setOpen] = useState(false)


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

    function passwordValidate() {
        const password = document.getElementById('password')
        const passwordError = document.getElementById('passwordError')
        if (password.value === '') {
            passwordError.innerText = "*Required"
        }
        else {
            passwordError.innerText = ''
        }
    }

    function registerClick() {
        const firstName = document.getElementById('firstName')
        const firstNameError = document.getElementById('firstNameError')
        const lastName = document.getElementById('lastName')
        const lastNameError = document.getElementById('lastNameError')
        const email = document.getElementById('email')
        const emailError = document.getElementById('emailError')
        const password = document.getElementById('password')
        const passwordError = document.getElementById('passwordError')
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
                emailError.innerText = ''
            }
            else {
                emailError.innerText = '*Invalid'
            }
        }
        if (password.value === '') {
            passwordError.innerText = "*Required"
        }
        else {
            if (password.value.length < 5 || password.value.length > 15) {
                passwordError.innerText = '*Password length should be between 5 to 15'
            }
            else {
                passwordError.innerText = ''
            }
        }
        if (firstNameError.innerText === '' && lastNameError.innerText === '' && emailError.innerText === '' && passwordError.innerText === '') {
            const userDetails = {
                firstName: firstName.value,
                lastName: lastName.value,
                email: email.value,
                password: password.value,
            }
            axios.post(`https://sylvr-task-backend.onrender.com/signup`, userDetails)
                .then((response) => {
                    if (response.data.message === "signup successful") {
                        setOpen(true)
                        setTimeout(() => {
                            navigate('/')
                        }, 2500)
                    }
                    else {
                        emailError.innerText = '*Email address already exist'
                        setTimeout(() => {
                            emailError.innerText = ''
                        }, 3000);
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
        }
    }

    function showPasswordClick() {
        const password = document.getElementById('password')
        count++
        if (count % 2 === 0) {
            password.setAttribute('type', 'password')
        }
        else {
            password.removeAttribute('type')
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
    return (
        <>
            <Helmet>
                <title>User | Signup</title>
            </Helmet>
            <div className="shadow col-3 rounded position-absolute top-50 start-50 translate-middle p-4">
                <div>
                    <h4 className='text-center' style={{fontFamily:'Arial'}}>Signup</h4>
                    <div>
                        <label htmlFor="firstName" className="form-label">First Name</label>
                        <input type="text" className="form-control" id="firstName" aria-describedby="emailHelp" onKeyUp={() => { firstNameValidate() }} />
                        <span id='firstNameError' className='text-danger'></span>
                    </div>
                    <div className='mt-3'>
                        <label htmlFor="lastName" className="form-label">Last Name</label>
                        <input type="text" className="form-control" id="lastName" aria-describedby="emailHelp" onKeyUp={() => { lastNameValidate() }} />
                        <span id='lastNameError' className='text-danger'></span>
                    </div>
                    <div className='mt-3'>
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input type="email" className="form-control" id="email" aria-describedby="emailHelp" onKeyUp={() => { emailValidate() }} />
                        <span id='emailError' className='text-danger'></span>
                    </div>
                    <div className='mt-3'>
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className="form-control" id="password" aria-describedby="emailHelp" onKeyUp={() => { passwordValidate() }} />
                        <span id='passwordError' className='text-danger'></span>
                    </div>
                    <div className='text-center mt-3'>
                        <span id='emailSecurityCodeError' className='text-danger'></span>
                    </div>
                    <div className='mt-2'>
                        <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" onClick={() => { showPasswordClick() }} /> Show password
                    </div>
                    <div className='text-center mt-4'>
                        <button type="button" className="btn btn-outline-primary" onClick={() => { registerClick() }}>Register</button>
                        <h6 className='mt-3 mb-0 text-primary hoverText' onClick={() => { navigate('/') }}>back to login</h6>
                    </div>
                </div>
            </div>
            {
                open ? <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} message="Registration successful" action={action} /> : ''
            }
        </>
    )
}

export default Signup