const database= require('../database/database');
const mysql = require('promise-mysql');

const getCursosAlumno  = async(req,res)=>{
    const connection = await mysql.createConnection(database);
    const {email} = req.params;
    const response = await connection.query(
                                            `SELECT
                                                a.cod_oseccion,
                                                CONCAT(c.cod_curso,b.cod_seccion,': ',d.descripcion) as 'descripcion'
                                            FROM
                                                usuario_seccion a,
                                                oseccion b,
                                                ocurso c,
                                                curso d,
                                                orden_pedido e
                                            WHERE
                                                a.cod_oseccion = b.cod_oseccion AND
                                                b.cod_ocurso = c.cod_ocurso AND
                                                c.cod_curso = d.cod_curso AND
                                                c.cod_op = e.cod_op AND
                                                NOW()>= e.fecha_inicio AND
                                                NOW()<= e.fecha_final AND
                                                a.email='${email}'`
                                            );
    //res.json({'response':response});
    res.json(response);
    connection.destroy();
};

const getAsistenciaHoy  = async(req,res)=>{
    const connection = await mysql.createConnection(database);
    const {email} = req.params;
    const response = await connection.query(
                                            `SELECT
                                                a.id,
                                                f.descripcion 'descripcion_facultad',
                                                d.cod_curso,
                                                g.descripcion 'descripcion_curso',
                                                c.cod_seccion,
                                                h.referencia,
                                                DATE_FORMAT(DATE_ADD(a.fecha_created, INTERVAL 1 HOUR),"%d-%m-%Y %h:%i:%s %p") 'fecha_created'
                                            FROM
                                                asistencia a,
                                                usuario_seccion b,
                                                oseccion c,
                                                ocurso d,
                                                orden_pedido e,
                                                facultad f,
                                                curso g,
                                                aula h,
                                                asistencia_habilitado i,
                                                op_semana j
                                            WHERE
                                                a.email = b.email AND
                                                a.cod_asistencia_habilitado = i.cod_asistencia_habilitado AND
                                                a.cod_oseccion = b.cod_oseccion AND
                                                b.cod_oseccion = c.cod_oseccion AND
                                                c.cod_ocurso = d.cod_ocurso AND
                                                d.cod_op = e.cod_op AND
                                                e.cod_facultad = f.cod_facultad AND
                                                d.cod_curso = g.cod_curso AND
                                                i.cod_aula = h.cod_aula AND
                                                i.cod_op_semana = j.cod_op_semana AND
                                                i.cod_oseccion = b.cod_oseccion AND
                                                j.cod_op = e.cod_op AND
                                                a.email = '${email}' AND
                                                DATE_FORMAT(NOW(),"%d-%m-%Y") = DATE_FORMAT(a.fecha_created,"%d-%m-%Y")`
                                            );
    //res.json({'response':response});
    res.json(response);
    connection.destroy();
};

const getAsistenciaHabilitada  = async(req,res)=>{
    const connection = await mysql.createConnection(database);
    const {email} = req.params;
    const response = await connection.query(
                                            `SELECT
                                                a.cod_asistencia_habilitado,
                                                CONCAT(g.abreviatura,': ',d.cod_curso,e.cod_seccion,' - Semana ',b.num_semana,'.',a.num_solicitud) 'clase_asistencia',
                                                a.distancia_maxima,
                                                a.fecha_created,
                                                a.tiempo_cerrar_num_solicitud,
                                                h.posicion_central,
                                                DATE_FORMAT(DATE_ADD(a.fecha_created,interval a.tiempo_cerrar_num_solicitud minute),"%d-%m-%Y %h:%i:%s %p") 'fecha_cierre'
                                            FROM
                                                asistencia_habilitado a,
                                                op_semana b,
                                                orden_pedido c,
                                                ocurso d,
                                                oseccion e,
                                                usuario_seccion f,
                                                facultad g,
                                                aula h
                                            WHERE
                                                a.cod_op_semana = b.cod_op_semana AND a.cod_oseccion=f.cod_oseccion AND
                                                b.cod_op = c.cod_op AND
                                                c.cod_op = d.cod_op AND c.cod_facultad = g.cod_facultad AND
                                                d.cod_ocurso = e.cod_ocurso AND
                                                e.cod_oseccion = f.cod_oseccion AND
                                                e.cod_aula = h.cod_aula
                                                a.habilitado = 0 AND
                                                f.email='${email}' AND
                                                NOT EXISTS (
                                                    select 1 from 
                                                    asistencia h 
                                                    where h.email = f.email AND
                                                    h.cod_oseccion = f.cod_oseccion AND
                                                    h.cod_asistencia_habilitado = a.cod_asistencia_habilitado)
                                                ORDER BY a.fecha_created desc`
                                            );
    //const users = response.json();
    res.json(response);
    connection.destroy();
};

const getOpcionesAsistencia  = async(req,res)=>{
    const connection = await mysql.createConnection(database);
    const {email,cod_oseccion} = req.params;
    const response = await connection.query(
                                            `SELECT
                                                a.cod_oseccion,
                                                b.cod_op_semana,
                                                b.cod_asistencia_habilitado,
                                                b.distancia_maxima,
                                                b.tiempo_cerrar_num_solicitud,
                                                d.latitud,
                                                d.longitud,
                                                b.habilitado,
                                                CASE
                                                    WHEN b.tiempo_cerrar_num_solicitud > 0 THEN DATE_FORMAT(DATE_ADD(b.fecha_created,interval b.tiempo_cerrar_num_solicitud minute),"%d-%m-%Y %h:%i:%s %p")
                                                    ELSE 0
                                                END 'fecha_cierre'
                                            FROM
                                                usuario_seccion a,
                                                asistencia_habilitado b,
                                                oseccion c,
                                                aula d
                                            WHERE
                                                a.cod_oseccion = b.cod_oseccion AND
                                                b.habilitado = 0 AND
                                                c.cod_oseccion = a.cod_oseccion AND
                                                b.cod_aula = d.cod_aula AND
                                                a.email='${email}' AND
                                                a.cod_oseccion = ${cod_oseccion}  AND
                                                NOT EXISTS
                                                	(
                                                        SELECT
                                                        	1
                                                        FROM
                                                        	asistencia e
                                                        where
                                                        	e.email = a.email AND
                                                        	e.cod_oseccion = a.cod_oseccion AND
                                                        	e.cod_asistencia_habilitado = b.cod_asistencia_habilitado
                                                    ) ORDER BY b.cod_asistencia_habilitado DESC LIMIT 1`
                                            );
    res.json(response);
    connection.destroy();
};



const postAsistencia = async(req,res)=>{
    const connection = await mysql.createConnection(database);
    const {email,cod_oseccion,cod_asistencia_habilitado,distancia,cod_op_semana} = req.body;
    const asistencia_habilitado = await connection.query(
                                                        `SELECT
                                                            cod_asistencia_habilitado,
                                                            cod_op_semana,
                                                            cod_oseccion,
                                                            num_solicitud,
                                                            distancia_maxima,
                                                            tiempo_cerrar_num_solicitud,
                                                            habilitado,
                                                            email,
                                                            fecha_created
                                                        FROM
                                                            asistencia_habilitado
                                                        WHERE
                                                            cod_asistencia_habilitado = ${cod_asistencia_habilitado} AND
                                                            cod_op_semana=${cod_op_semana} AND
                                                            cod_oseccion = ${cod_oseccion} AND
                                                            habilitado = 0`
                                                        );
    const asistencia_existe = await connection.query(
                                                    `SELECT
                                                        1
                                                    FROM
                                                        asistencia
                                                    WHERE
                                                        email = '${email}' AND
                                                        cod_asistencia_habilitado = ${cod_asistencia_habilitado} AND
                                                        cod_oseccion = ${cod_oseccion}`
                                                    );
    
    if (asistencia_habilitado.length!=0){
        const hoy = new Date(Date.now());
        console.log(hoy.toLocaleString("es-PE"));
        const fecha_ext = new Date (asistencia_habilitado[0].fecha_created);
        fecha_ext.setMinutes(fecha_ext.getMinutes()+asistencia_habilitado[0].tiempo_cerrar_num_solicitud);

        console.log(fecha_ext.toLocaleString("es-PE"));
        if (hoy<=fecha_ext || asistencia_habilitado[0].tiempo_cerrar_num_solicitud === 0){
            if(distancia<=asistencia_habilitado[0].distancia_maxima || asistencia_habilitado[0].distancia_maxima===0){
                if (asistencia_existe.length===0){
                    const response = await connection.query(
                                                        `INSERT INTO asistencia
                                                        (email,cod_oseccion,cod_asistencia_habilitado,distancia) VALUES 
                                                        ('${email}','${cod_oseccion}',${cod_asistencia_habilitado},${distancia})`
                                                        );
                    const response_ = await connection.query(
                                                        `SELECT
                                                            a.cod_asistencia_habilitado,
                                                            CONCAT(g.abreviatura,': ',d.cod_curso,e.cod_seccion,' - Semana ',b.num_semana,'.',a.num_solicitud) 'clase_asistencia',
                                                            a.distancia_maxima,
                                                            a.fecha_created,
                                                            a.tiempo_cerrar_num_solicitud,
                                                            DATE_FORMAT(DATE_ADD(a.fecha_created,interval a.tiempo_cerrar_num_solicitud minute),"%d-%m-%Y %h:%i:%s %p") 'fecha_cierre'
                                                        FROM
                                                            asistencia_habilitado a,
                                                            op_semana b,
                                                            orden_pedido c,
                                                            ocurso d,
                                                            oseccion e,
                                                            usuario_seccion f,
                                                            facultad g
                                                        WHERE
                                                            a.cod_op_semana = b.cod_op_semana AND a.cod_oseccion=f.cod_oseccion AND
                                                            b.cod_op = c.cod_op AND
                                                            c.cod_op = d.cod_op AND c.cod_facultad = g.cod_facultad AND
                                                            d.cod_ocurso = e.cod_ocurso AND
                                                            e.cod_oseccion = f.cod_oseccion AND
                                                            a.habilitado = 0 AND
                                                            f.email='${email}'
                                                        ORDER BY 
                                                            a.fecha_created desc`
                                                    );
                    res.json(response_[0]);
                }else{
                    res.json('Ya marcaste asistencia para este curso');
                }
                
            }else{
                res.json(`La distancia debe ser menor a ${asistencia_habilitado[0].distancia_maxima} mtrs`)
            }
            
        }else{
            res.json('Se supero la fecha para marcar asistencia');
        }
        
    }else{
        res.json('Ya no se encuentra habilitado para marcar asistencia');     
    }
    connection.destroy();
}

const getLastAsistencia  = async(req,res)=>{
    const connection = await mysql.createConnection(database);
    const {email} = req.params;
    const response = await connection.query(
                                            `SELECT
                                                a.id,
                                                a.email,
                                                CONCAT(f.abreviatura,': ',d.cod_curso,c.cod_seccion,' - ',DATE_FORMAT(a.fecha_created,"%d/%m/%Y %h:%i:%s %p"),' a ',a.distancia,' mtrs.') 'clase_asistencia'
                                            FROM
                                                asistencia a,
                                                usuario_seccion b,
                                                oseccion c,
                                                ocurso d,
                                                orden_pedido e,
                                                facultad f
                                            WHERE
                                                a.email = b.email AND
                                                a.cod_oseccion = b.cod_oseccion AND
                                                b.cod_oseccion = c.cod_oseccion AND
                                                c.cod_ocurso = d.cod_ocurso AND
                                                d.cod_op = e.cod_op AND
                                                e.cod_facultad = f.cod_facultad AND
                                                a.email='${email}' AND
                                                DATE_FORMAT(NOW(),"%d/%m/%Y")=DATE_FORMAT(a.fecha_created,"%d/%m/%Y")
                                            ORDER BY
                                                a.fecha_created desc;`
                                            );
    //const users = response.json();
    res.json(response);
    connection.destroy();
};

const postAsistenciaHabilitada = async(req,res)=>{
    const connection = await mysql.createConnection(database);
    //const {email} = req.params;
    const {cod_op_semana,cod_oseccion,distancia_maxima,tiempo_cerrar_num_solicitud,email,cod_aula} = req.body;
    const response_ = await connection.query(`SELECT
                                                habilitado
                                            from
                                                asistencia_habilitado
                                            where
                                                cod_op_semana = ${cod_op_semana} and 
                                                cod_oseccion=${cod_oseccion} and 
                                                email = '${email}' 
                                                and habilitado = 0`);
    if(response_.length ==0){
        const response = await connection.query(
                                                `INSERT INTO
                                                asistencia_habilitado
                                                    (cod_op_semana,cod_oseccion,num_solicitud,distancia_maxima,tiempo_cerrar_num_solicitud,cod_aula)
                                                VALUES
                                                    (
                                                        ${cod_op_semana},
                                                        ${cod_oseccion},
                                                        (
                                                            SELECT
                                                                IFNULL(max(b.num_solicitud),1) 'num_solicitud'
                                                            FROM
                                                                (
                                                                    SELECT a.num_solicitud
                                                                    FROM 
                                                                        (
                                                                            SELECT
                                                                                MAX(num_solicitud)+1 as num_solicitud
                                                                            FROM
                                                                                asistencia_habilitado
                                                                            WHERE
                                                                                cod_op_semana=${cod_op_semana} AND
                                                                                email='${email}' AND
                                                                                cod_oseccion = ${cod_oseccion}
                                                                        ) a 
                                                                    UNION ALL
                                                                    SELECT NULL
                                                                ) b
                                                        ),
                                                        ${distancia_maxima},
                                                        ${tiempo_cerrar_num_solicitud},
                                                        '${cod_aula}',
                                                        DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 1 HOUR))`
                                                );
        res.json({'response':[{'response':'Creado con éxito.'}]});
    }else{
        res.json({'response':[{'response':'Tiene una asistencia sin cerrar, cierrela para continuar'}]});
    };
    connection.destroy();
};

const postAsistenciaAlumno  = async(req,res)=>{
    const connection = await mysql.createConnection(database);
    //const {email} = req.params;
    const {cod_op_semana,email,cod_oseccion,cod_asistencia_habilitado,distancia} = req.body;
    const response_ = await connection.query(`SELECT
                                                b.habilitado
                                            from
                                                op_semana a,
                                                asistencia_habilitado b
                                            where
                                                a.cod_op_semana = b.cod_op_semana AND
                                                a.fecha_inicio<= NOW() AND
                                                a.fecha_final>= NOW() AND
                                                DATE_ADD(b.fecha_created,interval b.tiempo_cerrar_num_solicitud minute) >= (CASE
                                                                                                                                WHEN b.tiempo_cerrar_num_solicitud = 0 THEN 0
                                                                                                                                ELSE NOW()
                                                                                                                            END) AND
                                                b.cod_op_semana = ${cod_op_semana} AND 
                                                b.cod_oseccion = ${cod_oseccion} AND
                                                b.habilitado = 0`);
    if(response_.length !=0){
        const response = await connection.query(
                                                `INSERT INTO
                                                asistencia
                                                    (email,cod_oseccion,cod_asistencia_habilitado,distancia)
                                                VALUES
                                                    (
                                                        '${email}',
                                                        ${cod_oseccion},
                                                        ${cod_asistencia_habilitado},
                                                        ${distancia}
                                                    )`
                                                );
        res.json(response);
    }else{
        res.json({'response':'Ya no puede marcar asistencia, el tiempo para marcar asistencia ya termino.'});
    };
    connection.destroy();
};





const methods = {
    getAsistenciaHabilitada,
    postAsistencia,
    getLastAsistencia,
    postAsistenciaHabilitada,
    getCursosAlumno,
    getOpcionesAsistencia,
    getAsistenciaHoy,
    postAsistenciaAlumno
};

module.exports = methods;