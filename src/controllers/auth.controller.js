const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { registerSchema, loginSchema } = require('../validations/auth.validation');

const register = async (req, res, next) => {
    try {
        const { error, value } = registerSchema.validate(req.body);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
            });
        }

        const { name, email, password, role, } = value;

        const existingUser = await User.findOne({email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Email already registered',
            });
        }

        const hashedPassword = await bcrypt.hash(
            password,
            12
        );

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        const token = generateToken(user);

        return res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token,
            },
        });

    } catch (error) {
        next(error);
    }
};


const login = async (req, res, next) => {
    try {
        const { error, value } = loginSchema.validate(req.body);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
            });
        }

        const { email, password } = value;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'User account is inactive',
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        const token = generateToken(user);

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token,
            },
        });

    } catch (error) {
        next(error);
    }
};


module.exports = {
    register,
    login,
};