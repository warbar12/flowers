import { body } from "express-validator";

export const dataValidator = [
    body('username').isEmail(),
    body('password').isLength({ min: 5}),
]