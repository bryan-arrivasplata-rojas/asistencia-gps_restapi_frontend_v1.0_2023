const {Router} = require('express');
const router = Router();
const methods = require('../controllers/clasesController');


router.get('/clases/facultad/:email',methods.getDocenteFacultad);
router.get('/clases/aula/:cod_facultad',methods.getAula);
router.get('/clases/curso/:email&:cod_facultad',methods.getDocenteCurso);
router.get('/clases/seccion/:email&:cod_facultad&:cod_curso',methods.getDocenteSeccion);
router.get('/clases/semanas',methods.getSemanas);
router.get('/clases/semanahabilitada/:email&:cod_oseccion&:cod_op_semana',methods.getSemanaHabilitada);
router.get('/clases/solicitudes/:email&:cod_oseccion&:cod_op_semana',methods.getSolicitud);

router.get('/clases/asistencia/:cod_oseccion&:cod_asistencia_habilitado',methods.getAsistenciaClase);
router.put('/clases/asistencia/:email',methods.putAsistencia);
router.put('/clases/asistencia/cerrada/:email',methods.putCerrarAsistencia);
router.post('/clases/asistencia',methods.postHabilitarClaseSemana);




//EXTRAS SIN USO
/*router.get('/allclases',methods.getAllClasesCiclo);
router.get('/clases/:email',methods.getClasesDocenteSemana);
router.get('/existeasistencia/:cod_facultad&:cod_curso&:cod_seccion&:cod_op_semana',methods.getClasesDocenteSemana);
router.put('/clases/:email',methods.putCerrarClases);
router.get('/clase/:email&:cod_oseccion&:cod_op_semana',methods.getClase);
router.put('/clase/:cod_asistencia_habilitado',methods.putClase);
router.get('/reporte/:email&:cod_oseccion&:cod_op_semana&:num_solicitud',methods.getClaseReporte);
router.get('/reportesemanal/:email',methods.getClasesDocenteSemanaReporte);
router.get('/docentesemana/:email&:cod_facultad&:cod_curso&:cod_seccion',methods.getDocenteSemana);
router.get('/docentesemanahabilitada/:email&:cod_oseccion&:cod_op_semana',methods.getDocenteSemanaHabilitada);
*/

module.exports = router;