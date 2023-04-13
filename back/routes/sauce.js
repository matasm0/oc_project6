const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauce');

router.get('/', sauceCtrl.getSauces);
// router.get('/:id', sauceCtrl.getOneSauce);
// router.post('/sauces', sauceCtrl.postSauce);
// router.put('/sauces', sauceCtrl.updateSauce);
// router.delete('/sauces', sauceCtrl.deleteSauce);
// router.post('/sauces', sauceCtrl.likeDislike);

module.exports = router;