const database= require('../database/database');
const mysql = require('promise-mysql');

const getAllClasesCiclo  = async(req,res)=>{
    const connection = await mysql.createConnection(database);
    const response = await connection.query(
                                            `select 
                                                a.descripcion 'Ciclo',
                                                b.semanas 'Semanas_ciclo',
                                                c.abreviatura 'Facultad',
                                                #d.cod_ocurso,
                                                d.cod_curso,
                                                e.descripcion 'Nombre_Curso',
                                                f.cod_seccion
                                            FROM
                                                orden_pedido a,
                                                tipo_ciclo b,
                                                facultad c,
                                                ocurso d,
                                                curso e,
                                                oseccion f,
                                                seccion g
                                            WHERE
                                                a.cod_tipo_ciclo = b.cod_tipo_ciclo AND
                                                a.cod_facultad = c.cod_facultad AND
                                                d.cod_curso =e.cod_curso AND
                                                d.cod_op = a.cod_op AND
                                                f.cod_ocurso = d.cod_ocurso AND
                                                f.cod_seccion = g.cod_seccion`
                                            );
    //const users = response.json();
    res.json(response);
    connection.destroy();
};
const getClasesDocenteSemana  = async(req,res)=>{
    const connection = await mysql.createConnection(database);
    const {email} = req.params;
    const response = await connection.query(
                                            `select
                                                a.cod_op 'Codigo_op',
                                                a.descripcion 'Ciclo',
                                                b.semanas 'Semanas_ciclo',
                                                c.cod_facultad,
                                                c.abreviatura 'Facultad',
                                                d.cod_ocurso,
                                                d.cod_curso,
                                                e.descripcion 'Nombre_Curso',
                                                f.cod_oseccion,
                                                f.cod_seccion,
                                                h.email,
                                                j.cod_op_semana 'Codigo_semana_habilitado',
                                                j.num_semana
                                            FROM
                                                orden_pedido a,
                                                tipo_ciclo b,
                                                facultad c,
                                                ocurso d,
                                                curso e,
                                                oseccion f,
                                                seccion g,
                                                usuario_seccion h,
                                                perfil i,
                                                op_semana j
                                            WHERE
                                                a.cod_tipo_ciclo = b.cod_tipo_ciclo AND
                                                a.cod_facultad = c.cod_facultad AND
                                                d.cod_curso =e.cod_curso AND
                                                d.cod_op = a.cod_op AND
                                                f.cod_ocurso = d.cod_ocurso AND
                                                f.cod_seccion = g.cod_seccion AND
                                                f.cod_oseccion = h.cod_oseccion AND
                                                h.email = i.email AND
                                                i.tipo = 2 AND
                                                a.cod_op=j.cod_op AND
                                                h.email='${email}' AND
                                                j.fecha_inicio<=NOW() AND j.fecha_final>=NOW()`
                                            );
    res.json({'response':response});
    connection.destroy();
};
const getClasesDocenteSemanaReporte  = async(req,res)=>{
    const connection = await mysql.createConnection(database);
    const {email} = req.params;
    const response = await connection.query(
                                            `select
                                                a.cod_op 'Codigo_op',
                                                a.descripcion 'Ciclo',
                                                b.semanas 'Semanas_ciclo',
                                                c.cod_facultad,
                                                c.abreviatura 'Facultad',
                                                d.cod_ocurso,
                                                d.cod_curso,
                                                e.descripcion 'Nombre_Curso',
                                                f.cod_oseccion,
                                                f.cod_seccion,
                                                h.email,
                                                j.cod_op_semana 'Codigo_semana_habilitado',
                                                j.num_semana
                                            FROM
                                                orden_pedido a,
                                                tipo_ciclo b,
                                                facultad c,
                                                ocurso d,
                                                curso e,
                                                oseccion f,
                                                seccion g,
                                                usuario_seccion h,
                                                perfil i,
                                                op_semana j
                                            WHERE
                                                a.cod_tipo_ciclo = b.cod_tipo_ciclo AND
                                                a.cod_facultad = c.cod_facultad AND
                                                d.cod_curso =e.cod_curso AND
                                                d.cod_op = a.cod_op AND
                                                f.cod_ocurso = d.cod_ocurso AND
                                                f.cod_seccion = g.cod_seccion AND
                                                f.cod_oseccion = h.cod_oseccion AND
                                                h.email = i.email AND
                                                i.tipo = 2 AND
                                                a.cod_op=j.cod_op AND
                                                h.email='${email}' AND
                                                j.fecha_inicio<=NOW()`
                                            );
    res.json(response);
    connection.destroy();
};
const postHabilitarClaseSemana = async(req,res)=>{
    const connection = await mysql.createConnection(database);
    const {cod_op_semana,cod_oseccion,cod_aula,distancia_maxima,tiempo_cerrar_num_solicitud} = req.body;
    const num_solicitud = await connection.query(
                                            `SELECT
                                                count(*)+1 'num_solicitud'
                                            FROM
                                                asistencia_habilitado
                                            WHERE
                                                cod_op_semana=${cod_op_semana} AND
                                                cod_oseccion = ${cod_oseccion}`
                                            );
    const habilitado = await connection.query(
                                            `SELECT
                                                1
                                            FROM
                                                asistencia_habilitado
                                            WHERE
                                                cod_op_semana=${cod_op_semana} AND
                                                cod_oseccion = ${cod_oseccion} AND
                                                habilitado = 0`
                                            );
    const semana_disponible = await connection.query(
                                                `SELECT
                                                    1
                                                FROM
                                                    op_semana a
                                                WHERE
                                                    a.fecha_inicio<= NOW() AND
                                                    a.fecha_final>= NOW() AND
                                                    a.cod_op_semana = ${cod_op_semana}`
                                                );
    if(semana_disponible.length!=0){
        //FUNCIONA CON JOBS AL SEGUNDO
        /*if (habilitado.length===0){
            const response = await connection.query(
                                                    `INSERT INTO asistencia_habilitado 
                                                    (cod_op_semana,cod_oseccion,cod_aula,num_solicitud,distancia_maxima,tiempo_cerrar_num_solicitud) VALUES 
                                                    (${cod_op_semana},${cod_oseccion},${cod_aula},${num_solicitud[0].num_solicitud},'${distancia_maxima}','${tiempo_cerrar_num_solicitud}')`
                                                    );
            res.json(response);
        }else{
            res.json({'response':'Hay semanas que aun no estan cerradas'});
            
        }*/
        const response = await connection.query(
                                            `INSERT INTO asistencia_habilitado 
                                            (cod_op_semana,cod_oseccion,cod_aula,num_solicitud,distancia_maxima,tiempo_cerrar_num_solicitud,fecha_created) VALUES 
                                            (${cod_op_semana},${cod_oseccion},'${cod_aula}',${num_solicitud[0].num_solicitud},'${distancia_maxima}','${tiempo_cerrar_num_solicitud}',DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 1 HOUR))`
                                            );
        res.json(response);
    }else{
        res.json({'response':'Esta semana ya no acepta crear asistencia, pase a la siguiente semana'});
    }
    connection.destroy();
    
    // num_solicitud es un numero correlativo mayor :contador + 1 a los registros para este email,cod_oseccion y cod_op_semana
    //todos las asistencias_habilitados para el pofe y seccion deben estar desahbilitadas con 1
}
const getExisteAsistenciaSemanaHabilitado  = async(req,res)=>{
    const connection = await mysql.createConnection(database);
    const {cod_facultad,cod_curso,cod_seccion,cod_op_semana} = req.params;
    const response = await connection.query(
                                            `SELECT
                                                b.habilitado 'Habilitado'
                                            FROM
                                                op_semana a,
                                                asistencia_habilitado b,
                                                orden_pedido c,
                                                ocurso d,
                                                oseccion e
                                            WHERE
                                                a.cod_op_semana = b.cod_op_semana AND
                                                a.cod_op = c.cod_op AND
                                                a.cod_op = d.cod_op AND
                                                d.cod_ocurso = e.cod_ocurso AND
                                                b.cod_op_semana = ${cod_op_semana} AND
                                                c.cod_facultad = ${cod_facultad} AND
                                                d.cod_curso = '${cod_curso}' AND
                                                e.cod_seccion = '${cod_seccion}'`
                                            );
    res.json(response);
    connection.destroy();
};

const putCerrarClases = async(req,res)=>{
    const connection = await mysql.createConnection(database);
    const {email} = req.params;
    const {cod_oseccion,cod_op_semana} = req.body;
    const response = await connection.query(
                                        `UPDATE
                                            asistencia_habilitado
                                        SET
                                            habilitado = 1
                                        WHERE
                                            cod_op_semana=${cod_op_semana} AND
                                            cod_oseccion = ${cod_oseccion} AND
                                            email='${email}'`
                                        );
    //const users = response.json();
    res.json('Saved');
    connection.destroy();
}

const getClase = async(req,res)=>{
    const connection = await mysql.createConnection(database);
    const {email,cod_oseccion,cod_op_semana} = req.params;
    const response = await connection.query(
                                            `SELECT
                                                cod_asistencia_habilitado,
                                                num_solicitud,
                                                distancia_maxima,
                                                tiempo_cerrar_num_solicitud,
                                                habilitado
                                            FROM
                                                asistencia_habilitado a
                                            WHERE
                                                a.cod_op_semana=${cod_op_semana} AND
                                                a.cod_oseccion = ${cod_oseccion} AND
                                                a.email='${email}' 
                                            ORDER BY
                                                a.num_solicitud DESC`
                                            );
    if (response.length !=0){
        if (response[0].habilitado === 0){
            res.json(response[0]);
        }else{
            res.json('No hay asistencia habilitada');
        }
    }else{
        res.json('No hay asistencia habilitada');
    }
    connection.destroy();
}
const putClase = async(req,res)=>{
    const connection = await mysql.createConnection(database);
    const {cod_asistencia_habilitado} = req.params;
    const {distancia_maxima,tiempo_cerrar_num_solicitud} = req.body;
    const response = await connection.query(
                                        `UPDATE
                                            asistencia_habilitado
                                        SET
                                            distancia_maxima = ${distancia_maxima},
                                            tiempo_cerrar_num_solicitud = ${tiempo_cerrar_num_solicitud}
                                        WHERE
                                            cod_asistencia_habilitado=${cod_asistencia_habilitado}`
                                        );
    //const users = response.json();
    const response_ = await connection.query(`SELECT cod_asistencia_habilitado,
                                            cod_op_semana,	
                                            num_solicitud,
                                            distancia_maxima,
                                            tiempo_cerrar_num_solicitud,
                                            habilitado,
                                            email,
                                            cod_oseccion,
                                            fecha_created
                                            from asistencia_habilitado where cod_asistencia_habilitado = '${cod_asistencia_habilitado}'`);
    res.json(response_);
    connection.destroy();
}

const getClaseReporte = async(req,res)=>{
    const connection = await mysql.createConnection(database);
    const {email,cod_oseccion,cod_op_semana,num_solicitud} = req.params;
    const response = await connection.query(
                                            `SELECT
                                                c.codigo,
                                                CONCAT(
                                                        c.apellido_paterno,' ',c.apellido_materno,', ',c.primer_nombre,
                                                        CASE c.segundo_nombre
                                                        WHEN null THEN ''
                                                        ELSE CONCAT(' ',c.segundo_nombre)
                                                        END
                                                        ,
                                                        CASE c.tercer_nombre
                                                        WHEN '' THEN ''
                                                        ELSE CONCAT(' ',c.tercer_nombre)
                                                    END
                                                ) 'nombre_completo',
                                                DATE_FORMAT(a.fecha_created,"%d-%m-%Y %h:%i:%s %p") 'fecha_asistencia'
                                            FROM
                                                asistencia a,
                                                asistencia_habilitado b,
                                                perfil c
                                            WHERE
                                                a.cod_asistencia_habilitado = b.cod_asistencia_habilitado AND
                                                a.cod_oseccion = b.cod_oseccion AND
                                                a.email = c.email AND
                                                a.cod_oseccion = ${cod_oseccion} AND b.email = '${email}' AND b.num_solicitud=${num_solicitud} AND b.cod_op_semana=${cod_op_semana}
                                            ORDER BY
                                                nombre_completo ASC`
                                            );
    if (response.length !=0){
        res.json(response);
    }else{
        res.json('No hay asistencias');
    }
    connection.destroy();
}

const getDocenteFacultad = async(req,res)=>{
    const connection = await mysql.createConnection(database);
    const {email} = req.params;
    const response = await connection.query(`select
                                                c.cod_facultad,
                                                c.descripcion,
                                                c.abreviatura
                                            FROM
                                                orden_pedido a,
                                                tipo_ciclo b,
                                                facultad c,
                                                ocurso d,
                                                curso e,
                                                oseccion f,
                                                seccion g,
                                                usuario_seccion h,
                                                perfil i,
                                                op_semana j
                                            WHERE
                                                a.cod_tipo_ciclo = b.cod_tipo_ciclo AND
                                                a.cod_facultad = c.cod_facultad AND
                                                d.cod_curso =e.cod_curso AND
                                                d.cod_op = a.cod_op AND
                                                f.cod_ocurso = d.cod_ocurso AND
                                                f.cod_seccion = g.cod_seccion AND
                                                f.cod_oseccion = h.cod_oseccion AND
                                                h.email = i.email AND
                                                i.tipo = 2 AND
                                                a.cod_op=j.cod_op AND
                                                h.email='${email}' AND
                                                j.fecha_inicio<=NOW() AND j.fecha_final>=NOW()
											GROUP BY
                                            	c.cod_facultad,
												c.descripcion,
                                                c.abreviatura`);
    //res.json({'response':response});
    res.json(response);
    connection.destroy();
}
const getDocenteCurso = async(req,res)=>{
    const connection = await mysql.createConnection(database);
    const {email,cod_facultad} = req.params;
    const response = await connection.query(`select
                                                e.cod_curso,
                                                e.descripcion
                                            FROM
                                                orden_pedido a,
                                                tipo_ciclo b,
                                                facultad c,
                                                ocurso d,
                                                curso e,
                                                oseccion f,
                                                seccion g,
                                                usuario_seccion h,
                                                perfil i,
                                                op_semana j
                                            WHERE
                                                a.cod_tipo_ciclo = b.cod_tipo_ciclo AND
                                                a.cod_facultad = c.cod_facultad AND
                                                d.cod_curso =e.cod_curso AND
                                                d.cod_op = a.cod_op AND
                                                f.cod_ocurso = d.cod_ocurso AND
                                                f.cod_seccion = g.cod_seccion AND
                                                f.cod_oseccion = h.cod_oseccion AND
                                                h.email = i.email AND
                                                i.tipo = 2 AND
                                                a.cod_op=j.cod_op AND
                                                h.email='${email}' AND
                                                c.cod_facultad = ${cod_facultad} AND
                                                j.fecha_inicio<=NOW() AND j.fecha_final>=NOW()
											GROUP BY
                                            	e.cod_curso,
                                                e.descripcion`);
    //res.json({'response':response});
    res.json(response);
    connection.destroy();
}
const getDocenteSeccion = async(req,res)=>{
    const connection = await mysql.createConnection(database);
    const {email,cod_facultad,cod_curso} = req.params;
    const response = await connection.query(`select
                                                h.cod_oseccion,
                                                g.cod_seccion,
                                                g.descripcion
                                            FROM
                                                orden_pedido a,
                                                tipo_ciclo b,
                                                facultad c,
                                                ocurso d,
                                                curso e,
                                                oseccion f,
                                                seccion g,
                                                usuario_seccion h,
                                                perfil i,
                                                op_semana j
                                            WHERE
                                                a.cod_tipo_ciclo = b.cod_tipo_ciclo AND
                                                a.cod_facultad = c.cod_facultad AND
                                                d.cod_curso =e.cod_curso AND
                                                d.cod_op = a.cod_op AND
                                                f.cod_ocurso = d.cod_ocurso AND
                                                f.cod_seccion = g.cod_seccion AND
                                                f.cod_oseccion = h.cod_oseccion AND
                                                h.email = i.email AND
                                                i.tipo = 2 AND
                                                a.cod_op=j.cod_op AND
                                                h.email='${email}' AND
                                                c.cod_facultad = ${cod_facultad} AND
                                                e.cod_curso = '${cod_curso}' AND
                                                j.fecha_inicio<=NOW() AND j.fecha_final>=NOW()
											GROUP BY
                                                h.cod_oseccion,
                                                g.cod_seccion,
                                                g.descripcion`);
    //res.json({'response':response});
    res.json(response);
    connection.destroy();
}

const getSemanas = async(req,res)=>{
    const connection = await mysql.createConnection(database);
    const response = await connection.query(`SELECT
                                                c.cod_op_semana,c.num_semana
                                            FROM 
                                                (
                                                    select
                                                        b.cod_op_semana,
                                                        CONCAT('Semana ',b.num_semana) 'num_semana'
                                                    FROM
                                                        orden_pedido a,
                                                        op_semana b
                                                    WHERE
                                                        a.cod_op = b.cod_op AND
                                                        a.fecha_inicio<=NOW() AND a.fecha_final>=NOW() AND
                                                        b.fecha_inicio<=NOW() AND b.fecha_final>=NOW()
                                                    UNION
                                                        (
                                                            SELECT
                                                                b.cod_op_semana,
                                                                CONCAT('Semana ',b.num_semana) 'num_semana'
                                                            FROM
                                                                orden_pedido a,
                                                                op_semana b,
                                                                asistencia_habilitado c
                                                            WHERE
                                                                a.cod_op = b.cod_op AND
                                                                a.fecha_inicio<=NOW() AND a.fecha_final>=NOW() AND
                                                                b.fecha_inicio<=NOW() AND
                                                                b.cod_op_semana = c.cod_op_semana
                                                        )
                                                ) c
                                                ORDER BY
                                                    c.num_semana DESC`);
    //res.json({'response':response});
    res.json(response);
    connection.destroy();
}

const getSemanaHabilitada = async(req,res)=>{
    const connection = await mysql.createConnection(database);
    const {email,cod_oseccion,cod_op_semana} = req.params;
    const response = await connection.query(`SELECT
                                                a.cod_asistencia_habilitado,
                                                CONCAT('Semana ',b.num_semana,' - Clase ',a.num_solicitud) 'descripcion',
                                                a.tiempo_cerrar_num_solicitud,
                                                a.distancia_maxima,
                                                a.fecha_created,
                                                a.habilitado,
                                                DATE_FORMAT(DATE_ADD(a.fecha_created,interval a.tiempo_cerrar_num_solicitud minute),"%d-%m-%Y %h:%i:%s %p") 'fecha_cierre',
                                                a.cod_aula
                                            FROM
                                                asistencia_habilitado a,
                                                op_semana b,
                                                usuario_seccion c
                                            WHERE
                                                a.cod_op_semana = b.cod_op_semana AND
                                                a.cod_oseccion = c.cod_oseccion AND
                                                a.cod_op_semana = ${cod_op_semana} AND
                                                a.cod_oseccion = ${cod_oseccion} AND
                                                c.email = '${email}'
                                            ORDER BY
                                                a.num_solicitud DESC
                                            LIMIT 1`);
    //res.json({'response':response});
    res.json(response);
    connection.destroy();
}

const getSolicitud = async(req,res)=>{
    const connection = await mysql.createConnection(database);
    const {email,cod_oseccion,cod_op_semana} = req.params;
    await connection.query(`SET lc_time_names = 'es_PE'`);
    const response = await connection.query(`SELECT
                                                a.cod_asistencia_habilitado,
                                                CONCAT('Semana ',b.num_semana,' - Clase ',a.num_solicitud) 'descripcion',
                                                a.num_solicitud,
                                                DATE_FORMAT(a.fecha_created,"%d-%m-%Y %h:%i:%s %p - %W %d de %M") 'fecha_created',
                                                a.habilitado
                                            FROM
                                                asistencia_habilitado a,
                                                op_semana b
                                            WHERE
                                                a.cod_op_semana = b.cod_op_semana AND
                                                a.cod_op_semana = ${cod_op_semana} AND
                                                a.cod_oseccion = ${cod_oseccion} AND
                                                EXISTS (
                                                    SELECT
                                                        1
                                                    FROM
                                                        usuario_seccion c
                                                    WHERE
                                                        c.cod_oseccion = ${cod_oseccion} AND
                                                        c.email = '${email}')
                                            ORDER BY
                                                a.num_solicitud DESC`);
    //res.json({'response':response});
    res.json(response);
    connection.destroy();
}

const getAsistenciaClase  = async(req,res)=>{
    const connection = await mysql.createConnection(database);
    const {cod_oseccion,cod_asistencia_habilitado} = req.params;
    const response = await connection.query(
                                            `SELECT
                                                a.id,
                                                b.codigo,
                                                CONCAT(
                                                    b.apellido_paterno,' ',b.apellido_materno,', ',b.primer_nombre,
                                                    CASE b.segundo_nombre
                                                        WHEN null THEN ''
                                                        ELSE CONCAT(' ',b.segundo_nombre)
                                                    END,
                                                    CASE b.tercer_nombre
                                                        WHEN '' THEN ''
                                                        ELSE CONCAT(' ',b.tercer_nombre)
                                                    END
                                                ) 'nombre_completo',
                                                a.fecha_created 'fecha_created_alumno',
                                                a.distancia,
                                                a.email,
                                                c.distancia_maxima,
                                                c.tiempo_cerrar_num_solicitud,
                                                c.fecha_created
                                            FROM
                                                asistencia a,
                                                perfil b,
                                                asistencia_habilitado c
                                            WHERE
                                                a.email = b.email AND
                                                a.cod_asistencia_habilitado=c.cod_asistencia_habilitado AND
                                                a.cod_oseccion = c.cod_oseccion AND
                                                a.cod_oseccion = ${cod_oseccion} AND
                                                a.cod_asistencia_habilitado = ${cod_asistencia_habilitado}`
                                            );
    //res.json({'response':response});
    res.json(response);
    connection.destroy();
};

const putCerrarAsistencia = async(req,res)=>{
    const connection = await mysql.createConnection(database);
    const {email} = req.params;
    const {cod_asistencia_habilitado,cod_oseccion,habilitado} = req.body;
    const response = await connection.query(
                                        `UPDATE
                                            asistencia_habilitado
                                        SET
                                            habilitado=${habilitado}
                                        WHERE
                                            cod_asistencia_habilitado = ${cod_asistencia_habilitado} AND
                                            EXISTS (
                                                SELECT
                                                    1
                                                FROM
                                                    usuario_seccion a
                                                WHERE
                                                    a.cod_oseccion = ${cod_oseccion} AND
                                                    a.email = '${email}')`
                                        );
    //const users = response.json();
    //res.json({'response':[{'response':'Cerrado con éxito'}]});
    res.json(response);
    connection.destroy();
};

const putAsistencia = async(req,res)=>{
    const connection = await mysql.createConnection(database);
    const {email} = req.params;
    const {cod_asistencia_habilitado,cod_oseccion,cod_aula,distancia_maxima,tiempo_cerrar_num_solicitud} = req.body;
    const response = await connection.query(
                                        `UPDATE
                                            asistencia_habilitado
                                        SET
                                            distancia_maxima=${distancia_maxima},
                                            tiempo_cerrar_num_solicitud=${tiempo_cerrar_num_solicitud},
                                            cod_aula='${cod_aula}'
                                        WHERE
                                            cod_asistencia_habilitado = ${cod_asistencia_habilitado} AND
                                            EXISTS (
                                                SELECT
                                                    1
                                                FROM
                                                    usuario_seccion a
                                                WHERE
                                                    a.cod_oseccion = ${cod_oseccion} AND
                                                    a.email = '${email}')`
                                        );
    //const users = response.json();
    res.json(response);
    connection.destroy();
};

const getDocenteSemana = async(req,res)=>{
    const connection = await mysql.createConnection(database);
    const {email,cod_facultad,cod_curso,cod_seccion} = req.params;
    const response = await connection.query(`select
                                                j.cod_op_semana,
                                                j.num_semana
                                            FROM
                                                orden_pedido a,
                                                tipo_ciclo b,
                                                facultad c,
                                                ocurso d,
                                                curso e,
                                                oseccion f,
                                                seccion g,
                                                usuario_seccion h,
                                                perfil i,
                                                op_semana j
                                            WHERE
                                                a.cod_tipo_ciclo = b.cod_tipo_ciclo AND
                                                a.cod_facultad = c.cod_facultad AND
                                                d.cod_curso =e.cod_curso AND
                                                d.cod_op = a.cod_op AND
                                                f.cod_ocurso = d.cod_ocurso AND
                                                f.cod_seccion = g.cod_seccion AND
                                                f.cod_oseccion = h.cod_oseccion AND
                                                h.email = i.email AND
                                                i.tipo = 2 AND
                                                a.cod_op=j.cod_op AND
                                                h.email='${email}' AND
                                                c.cod_facultad = ${cod_facultad} AND
                                                e.cod_curso = '${cod_curso}' AND
                                                g.cod_seccion = '${cod_seccion}' AND
                                                j.fecha_inicio<=NOW() AND j.fecha_final>=NOW()
											GROUP BY
                                            	j.cod_op_semana,
                                                j.cod_op`);
    res.json({'response':response});
    connection.destroy();
}
const getDocenteSemanaHabilitada = async(req,res)=>{
    const connection = await mysql.createConnection(database);
    const {email,cod_oseccion,cod_op_semana} = req.params;
    const response = await connection.query(`select
                                                k.cod_asistencia_habilitado,
                                                k.cod_op_semana,
                                                k.cod_oseccion,
                                                k.num_solicitud,
                                                k.distancia_maxima,
                                                k.tiempo_cerrar_num_solicitud,
                                                k.habilitado,
                                                DATE_FORMAT(k.fecha_created,"%d-%m-%Y %h:%i:%s %p") 'fecha_created',
                                                DATE_FORMAT(DATE_ADD(k.fecha_created,interval k.tiempo_cerrar_num_solicitud minute),"%d-%m-%Y %h:%i:%s %p") 'tiempo_limite_solicitud',
                                                NOW()
                                            FROM
                                                orden_pedido a,
                                                tipo_ciclo b,
                                                facultad c,
                                                ocurso d,
                                                curso e,
                                                oseccion f,
                                                seccion g,
                                                usuario_seccion h,
                                                perfil i,
                                                op_semana j,
                                                asistencia_habilitado k
                                            WHERE
                                                a.cod_tipo_ciclo = b.cod_tipo_ciclo AND
                                                a.cod_facultad = c.cod_facultad AND
                                                a.cod_op=j.cod_op AND
                                                a.cod_op = d.cod_op AND
                                                d.cod_curso =e.cod_curso AND
                                                d.cod_ocurso = f.cod_ocurso AND
                                                f.cod_seccion = g.cod_seccion AND
                                                f.cod_oseccion = h.cod_oseccion AND
                                                h.email = i.email AND
                                                h.cod_oseccion = k.cod_oseccion AND
                                                h.email = k.email AND
                                                j.cod_op_semana = k.cod_op_semana AND
                                                k.habilitado = 0 AND
                                                i.tipo = 2 AND
                                                j.fecha_inicio<=NOW() AND j.fecha_final>=NOW() AND
                                                DATE_ADD(k.fecha_created, interval k.tiempo_cerrar_num_solicitud MINUTE) >=NOW() AND
                                                h.email='${email}' AND
                                                h.cod_oseccion = ${cod_oseccion} AND
                                                k.cod_op_semana =  ${cod_op_semana}
                                        	GROUP BY
                                            	k.cod_op_semana,
                                                k.cod_oseccion,
                                                k.num_solicitud`);
    res.json({'response':response});
    connection.destroy();
}


const getAula  = async(req,res)=>{
    const connection = await mysql.createConnection(database);
    const {cod_facultad} = req.params;
    const response = await connection.query(
                                            `SELECT
                                                a.cod_aula,
                                                a.latitud,
                                                a.longitud,
                                                a.referencia,
                                                b.descripcion
                                            FROM
                                                aula a,
                                                facultad b
                                            WHERE
                                                a.cod_facultad = b.cod_facultad AND
                                                a.cod_facultad = ${cod_facultad}`
                                            );
    //res.json({'response':response});
    res.json(response);
    connection.destroy();
};


const methods = {
    getAllClasesCiclo,//PRUEBA PARA OBTENER TODO
    getClasesDocenteSemana,//OBTENER TODAS LAS CLASES QUE DICTA EL DOCENTE
    postHabilitarClaseSemana,//HABILITAR CLASE PERO CUMPLIENDO NO HAYA ALGUNA CON HABILITADO 0 y QUE SI CUMPLE LO ANTERIOR EL NUM_SOLICITUD ES UNO MAYOR
    getExisteAsistenciaSemanaHabilitado,
    putCerrarClases,//CIERRA TODAS LAS CLASES PONIENDOLES EN HABILITADO 1
    getClase,//OBTIENE LOS VALORES ACTUALES DE LA ULTIMA CLASE CREADA PERO DEBE TENER HABILITADO 0 SINO DEBERAS CREAR
    putClase,//SI AL OBTENER CON GETCLASE QUE ES PREVIO SE OBTIENE REGISTRO ACA PODREMOS MODIFICAR DISTANCIA Y TIEMPO DE CIERE AUTOMATICO
    getClaseReporte,//REPORTE PARA ASISTENCIA
    getClasesDocenteSemanaReporte,//RELLENAR COMBOBOX CON SOLICITUD DE SEMANAS DONDE APARECERA DONDE LA FECHA ACTUAL SEA MAYOR A LA FECHA INICIO
    getSemanas,
    getSolicitud,
    getSemanaHabilitada,
    //DOCENTE
    getDocenteFacultad,
    getDocenteCurso,
    getDocenteSeccion,
    getDocenteSemana,
    getDocenteSemanaHabilitada,
    getAsistenciaClase,
    putCerrarAsistencia,
    putAsistencia,
    getAula
};

module.exports = methods;