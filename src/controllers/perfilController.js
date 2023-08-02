const database= require('../database/database');
const mysql = require('promise-mysql');

const getAllPerfil  = async(req,res)=>{
    const connection = await mysql.createConnection(database);
    const response = await connection.query(`SELECT codigo,primer_nombre,segundo_nombre,tercer_nombre,apellido_paterno,apellido_materno,tipo,email from perfil`);
    //const users = response.json();
    res.json({response});
    connection.destroy();
};
const getPerfil  = async(req,res)=>{
    const connection = await mysql.createConnection(database);
    const {email} = req.params;
    const response = await connection.query(`SELECT codigo,primer_nombre,segundo_nombre,tercer_nombre,apellido_paterno,apellido_materno,tipo,email from perfil where email = '${email}'`);
    //const users = response.json();
    //res.json({'response':response});
    res.json(response);
    connection.destroy();
};
const putPerfil = async(req,res)=>{
    const connection = await mysql.createConnection(database);
    const {email} = req.params;
    const {password} = req.body;
    const response = await connection.query(`UPDATE usuario
                                                            SET
                                                                password = '${password}'
                                                            where
                                                                email='${email}'`)
    //res.json({'response':[{'response':'Contraseña modificada'}]});
    res.json(response);
    connection.destroy();
}

const methods = {
    getAllPerfil,
    getPerfil,
    putPerfil
};

module.exports = methods;