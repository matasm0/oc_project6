const { exec } = require('child_process');
const { isAsyncFunction } = require('util/types');
const User = require('../models/user');

function hashpw(password) {
    // hash it.
    return password;
}

async function login(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    // check validity?
    if (!email || !password) {
        req.status(400).send(new Error("Invalid signup request"));
        return;
    }

    const user = await User.findOne({email : email});
    
    if (!user) {
        res.status(400).json({message : "Invalid username/password"});
    }
    else {   
        if (hashpw(password) == user.password){
            res.status(200).json({userId : "193h81in3gfb1f", token : "no13f1"});
        }
        else {
            res.status(400).json({message : "Invalid username/password"});
        }
    }
}

exports.login = (req, res, next) => login(req, res, next);

async function signup(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    // check validity?
    if (!email || !password) {
        req.status(400).send(new Error("Invalid signup request"));
        return;
    }

    if (await User.findOne({email : email})) {
        res.status(400).json({message : "User already exists"});
    }
    else {
        const user = new User({
            email : email,
            password : hashpw(password)
        })
        if (await user.save()) {
            res.status(200).json({message : "User created"});
        }
        else {
            res.status(400).json({message : "Failed to create user"});
        }
    }
}

exports.signup = (req, res, next) => signup(req, res, next);