const { exec } = require('child_process');
const {MongoClient} = require('mongodb');
const { isAsyncFunction } = require('util/types');

function initDB() {
    const uri = "mongodb+srv://E:7G3jiEQyD6jQY28A@cluster0.coywjvi.mongodb.net/?retryWrites=true&w=majority"
    return new MongoClient(uri);
}

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

    const client = initDB();
    try {await client.connect();}
    catch(e) {console.log(e); client.close(); res.status(404).send(); return;} // 404 and return error as message?
    
    const usersDB = client.db("saucy").collection("users");
    const user = await usersDB.findOne({_id : email});
    
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

    await client.close(); 

    res.send();
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

    const client = initDB();
    try {await client.connect();}
    catch(e) {console.log(e); client.close(); res.status(404).send(); return;} // 404 and return error as message?
    
    const usersDB = client.db("saucy").collection("users");
    if (await usersDB.findOne({_id : email})) {
        res.status(400).json({message : "User already exists"});
    }
    else {
        if (await usersDB.insertOne({_id : email, password : hashpw(password)})) {
            res.status(200).json({message : "User created"});
        }
        else {
            res.status(400).json({message : "Failed to create user"});
        }
    }

    await client.close();

    res.send();
}

exports.signup = (req, res, next) => signup(req, res, next);