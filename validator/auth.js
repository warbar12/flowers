import { body } from "express-validator";

export const dataValidator = [
    body('username').isLength({ min: 3}),
    body('email').isEmail(),
    body('password').isLength({ min: 5}),
]