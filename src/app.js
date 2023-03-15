import express from 'express';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import {__dirname} from './utils/dirname.js';

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/public',express.static(__dirname));

app.use('/api/products', productsRouter);

app.use('/api/carts', cartsRouter);


app.listen(8080, () => {
    console.log('Servidor iniciado en el puerto 8080');
});
