const { exec } = require('child_process');
const { retry } = require('rxjs');
const { isAsyncFunction } = require('util/types');
const sauce = require('../models/sauce');
const Sauce = require('../models/sauce');

const sauceDefault = {
    likes : 0,
    dislikes : 0,
    usersLiked : [],
    usersDisliked : []
}

async function getSauces(req, res, next) {
    const sauces = await Sauce.find().exec();

    let sauceList = [];

    sauces.forEach(sauce => {
        sauceList.push(sauce);
    });
    
    await res.status(200).json(sauceList);
}

exports.getSauces = (req, res, next) => getSauces(req, res, next);

async function getOneSauce(req, res, next) {
    const sauce = await Sauce.findOne({_id : req.params['id']});
    res.status(200).json(sauce);
}

exports.getOneSauce = (req, res, next) => getOneSauce(req, res, next);

async function postSauce(req, res, next) {
    const imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;

    let newSauce;

    try {
        newSauce = new Sauce({...sauceDefault, ...JSON.parse(req.body.sauce), imageUrl});
    }
    catch(e) {
        res.status(400).send(new Error({message : "Invalid sauce parameters"}));
        return;
    }

    await newSauce.save();

    res.status(200).json({message : "New sauce created"});
}

exports.postSauce = (req, res, next) => postSauce(req, res, next);

async function updateSauce(req, res, next) {
    // Delete the old image
    let sauce = {};

    if (req.body.sauce) {
        const imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
        sauce = {...sauceDefault, ...JSON.parse(req.body.sauce), imageUrl};
    }
    else {
        sauce = {...sauceDefault, ...req.body};
    };
    
    await Sauce.updateOne({_id : req.params['id']}, sauce);

    res.status(200).json({message : "Sauce updated"});
}

exports.updateSauce = (req, res, next) => updateSauce(req, res, next);

async function deleteSauce(req, res, next) {
    await Sauce.deleteOne({_id : req.params.id});
    
    res.status(200).json({message : "Sauce deleted"});
}

exports.deleteSauce = (req, res, next) => deleteSauce(req, res, next);

async function likeDislike(req, res, next) {
    let sauce = await Sauce.findOne({_id : req.params['id']});
    switch(req.body.like) {
        case 1:
            sauce.usersLiked.push(req.body.userId);
            sauce.likes += 1;
            break;
        case 0:
            let index = sauce.usersLiked.indexOf(req.body.userId);
            if (index != -1) {
                sauce.usersLiked.splice(index, 1);
                sauce.likes -= 1;
                break;
            }
            index = sauce.usersDisliked.indexOf(req.body.userId);
            sauce.usersDisliked.splice(index, 1);
            sauce.dislikes -= 1;
            break;
        case -1:
            sauce.usersDisliked.push(req.body.userId);
            sauce.dislikes -= 1;
            break;
        default:
            res.status(400).json({message : "Invalid like/dislike request"});
            break;
    }

    await Sauce.updateOne({_id : req.params['id']}, sauce);

    res.status(200).json({message : "Sauce updated"});
}

exports.likeDislike = (req, res, next) => likeDislike(req, res, next);