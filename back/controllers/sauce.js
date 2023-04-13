const { exec } = require('child_process');
const {MongoClient} = require('mongodb');
const { retry } = require('rxjs');
const { isAsyncFunction } = require('util/types');

function initDB() {
    const uri = "mongodb+srv://E:7G3jiEQyD6jQY28A@cluster0.coywjvi.mongodb.net/?retryWrites=true&w=majority"
    return new MongoClient(uri);
}

let sauceStruct = {
    userId : "",
    name : "",
    manufacturer : "",
    description : "",
    mainPepper : "",
    imageUrl : "",
    heat : "",
    likes : "",
    dislikes : "",
    usersLiked : "",
    usersDisliked : ""
} 

async function getSauces(req, res, next) {
    const client = initDB();
    try {await client.connect();}
    catch(e) {console.log(e); client.close(); res.status(404).send(); return}

    const saucesDB = client.db("saucy").collection("sauces");
    const sauces = saucesDB.find();

    let sauceList = [];

    await sauces.forEach(sauce => {
        sauceList.push(sauce);
    })
    
    await res.status(200).json(sauceList);

    await client.close();
}

exports.getSauces = (req, res, next) => getSauces(req, res, next);

async function getOneSauce(req, res, next) {
    const client = initDB();
    try {await client.connect();}
    catch(e) {console.log(e); client.close(); res.status(404).send(); return}

    const saucesDB = client.db("saucy").collection("sauces");
    // const sauce = saucesDB.findOne({_id : req.params.id});
}

exports.getOneSauce = (req, res, next) => getOneSauce(req, res, next);

async function postSauce(req, res, next) {
    const client = initDB();
    try {await client.connect();}
    catch(e) {console.log(e); client.close(); res.status(404).send(); return}

    const saucesDB = client.db("saucy").collection("sauces");
    const imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;

    let newSauce;

    try {
        newSauce = {...sauceStruct, ...JSON.parse(req.body.sauce), imageUrl};
    }
    catch(e) {
        res.status(400).send(new Error({message : "Invalid sauce parameters"}));
        await client.close();
        return;
    }

    await saucesDB.insertOne(newSauce);

    await client.close();

    res.status(200).json({message : "New sauce created"});
}

exports.postSauce = (req, res, next) => postSauce(req, res, next);

