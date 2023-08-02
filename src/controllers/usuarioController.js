const database= require('../database/database');
const mysql = require('promise-mysql');

const getAllUsuario  = async(req,res)=>{
    const connection = await mysql.createConnection(database);
    const response = await connection.query(`SELECT email,password,token from usuario`);
    res.json(response);
    connection.destroy();
};
const getUsuario  = async(req,res)=>{
    const connection = await mysql.createConnection(database);
    const {email} = req.params;
    const response = await connection.query(`SELECT 
                                                a.email,a.password,a.token,b.tipo,
                                                CONCAT(
                                                    b.apellido_paterno,' ',
                                                    b.apellido_materno,', ',b.primer_nombre,
                                                    CASE(b.segundo_nombre)
                                                        WHEN '' THEN ''
                                                        ELSE CONCAT(' ',b.segundo_nombre) END,
                                                    CASE(b.tercer_nombre)
                                                        WHEN '' THEN ''
                                                        ELSE CONCAT(' ',b.tercer_nombre) END
                                                    ) 'nombre_completo',
                                                c.descripcion
                                            from
                                                usuario a,
                                                perfil b,
                                                tipo c
                                            where
                                                a.email = b.email and
                                                b.tipo = c.tipo and
                                                a.email = '${email}'`);
    res.json(response);
    connection.destroy();
};

const methods = {
    getAllUsuario,
    getUsuario
};

module.exports = methods;

