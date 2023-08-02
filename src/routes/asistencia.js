const {Router} = require('express');
const router = Router();
const methods = require('../controllers/asistenciaController');

router.get('/asistencia/cursos/:email',methods.getCursosAlumno);
router.get('/asistencia/hoy/:email',methods.getAsistenciaHoy);
router.get('/asistencia/opciones/:email&:cod_oseccion',methods.getOpcionesAsistencia);
router.post('/asistencia',methods.postAsistenciaAlumno);


//EXTRAS SIN USO
//router.get('/asistencia/:email',methods.getAsistenciaHabilitada);
//router.post('/asistencia',methods.postAsistencia);
//router.get('/asistenciapersonal/:email',methods.getLastAsistencia);
//router.post('/asistenciahabilitada',methods.postAsistenciaHabilitada);


module.exports = router;