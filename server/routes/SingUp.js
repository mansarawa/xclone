import express from 'express'
import { signInController, signUpController } from '../controller/SignUpController.js'

const signup=express.Router()
signup.post('/create-account',signUpController)

const signin=express.Router()
signin.post('/login',signInController)

export {signup,signin}