const express = require ('express');
const app = express();
const cors = require('cors');
//const ngrok = require('ngrok'); #Si se requiere abrir tunel a tu servidor local

const morgan = require('morgan');
//settings
app.set('port',process.env.PORT || 3000);
app.set('json spaces',2);

//todo el mundo
app.use(cors());

//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//routes
app.use(require('./src/routes/index'));
app.use(require('./src/routes/usuario'));
app.use(require('./src/routes/perfil'));
app.use(require('./src/routes/clases'));
app.use(require('./src/routes/asistencia'));

app.listen(app.get('port'),()=>{/*Si se habilito tunel quedaria asi "app.listen(app.get('port'),async ()=>{" */
    console.log(`Server on port ${app.get('port')}`);
    /*try {#Si se abrio tunel a tu servidor local
        const ngrokUrl = await ngrok.connect(app.get('port'));
        console.log(`Tu servidor está disponible en: ${ngrokUrl}`);
    } catch (error) {
        console.error('Error al iniciar ngrok:', error);
    }*/
});


