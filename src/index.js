import express from 'express';
import { engine } from 'express-handlebars';
import morgan from 'morgan';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { resolve } from 'path';
import usersRoutes from './routes/users.routes.js'

// Inicialización de la aplicación
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Configuración de la aplicación
app.set('port', process.env.PORT || 4000);

// Asegura que la ruta absoluta esté bien resuelta
const viewsPath = resolve(__dirname, 'views');
console.log(viewsPath);
app.set('views', viewsPath);

app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir: join(app.get('views'), 'layouts'),
    partialsDir: join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
console.log('Ruta de layouts:', join(app.get('views'), 'layouts'));
console.log('Ruta de partials:', join(app.get('views'), 'partials'));
app.set('view engine', '.hbs');

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Rutas
app.get('/', (req, res) => {
    console.log('Renderizando vista...');
    res.render("index"); // 'index' se refiere a 'index.hbs' en la carpeta 'views'
    //res.json({"message": "Hola"})
});

app.use(usersRoutes);

// Archivos estáticos
app.use(express.static(join(__dirname, 'public')));

// Iniciar el servidor
app.listen(app.get('port'), () => {
    console.log('Servidor escuchando en el puerto', app.get('port'));
});
