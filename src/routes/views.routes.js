import { Router } from "express";

const router = Router();

let nextProductId = 1
let products = [
    { id: nextProductId++, name: 'Producto 1 default' },
    { id: nextProductId++, name: 'Producto 2 default' },
];

// Exporto una función de manejo de eventos con io como parámetro.
export const handleSocketEvents = (io) => {
    io.on('connection', (socket) => {
        // Logica para agregar producto
        socket.on('addProduct', (product) => {
            // Defino el newProduct con id autoincrementable, lo pusheo al array y lo emito con el array de products para actualizar la list.
            const newProduct = {
                id: nextProductId++,
                name: product.name,
            };
            products.push(newProduct);

            io.emit('updateProductList', products);
        });

        //Logica para borrar producto de la lista
        socket.on('deleteProduct', (productId) => {
            // Utilizo la logica del findIndex para buscar con el ID enviado y luego con un if actualizar el array y emitir para actualizar la list.
            const index = products.findIndex((product) => product.id === parseInt(productId));
            if (index !== -1) {
                const deletedProduct = products.splice(index, 1)[0];;
                io.emit('updateProductList', products);
            } else {
                console.error('A product with the specified ID was not found.');
            }
        });
    });
};

router.get('/', (req, res) => {
    res.render('index', { products });
});

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { products });
});

export default router;
