const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const sauceCtrl = require('../controllers/sauce');

const multer = require('../middleware/multer-config');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

router.get('/', sauceCtrl.getSauces);
router.get('/:id', sauceCtrl.getOneSauce);
router.post('/', multer, sauceCtrl.postSauce);
router.put('/:id', multer, sauceCtrl.updateSauce);
router.delete('/:id', sauceCtrl.deleteSauce);
router.post('/:id/like', sauceCtrl.likeDislike);


module.exports = router;