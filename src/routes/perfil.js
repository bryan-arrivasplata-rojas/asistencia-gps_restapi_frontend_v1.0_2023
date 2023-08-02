const {Router} = require('express');
const router = Router();
const methods = require('../controllers/perfilController');


router.get('/perfil/all',methods.getAllPerfil);
router.get('/perfil/:email',methods.getPerfil);
router.put('/perfil/:email',methods.putPerfil);

module.exports = router;