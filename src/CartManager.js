import fs from 'fs';
import ProductManager from './ProductManager.js';

const productManager = new ProductManager('./productos.json');

class CartManager {
    constructor(path) {
        this.path = path;
    }
    // método para agregar producto al carrito solo con el id
    async addCart() {
        const carts = await this.#getCarts();

        const lastCart = carts[carts.length - 1];
        const newId = lastCart ? lastCart.id + 1 : 1;
        const newCart = {
            products: [],
            id: newId
        };
        carts.push(newCart);
        await this.#saveCarts(carts);
        return newCart;
    }

    // método para obtener un carrito por su id de la lista de carritos del archivo JSON
    async getCartById(id) {
        const carts = await this.#getCarts();
        const cart = carts.find((cart) => cart.id === id);
        if (!cart) {
            return null;
        }
        return cart;
    }

    // método para agregar un producto a un carrito de la lista de carritos del archivo JSON, sumandose uno a uno.
    async addProductToCart(cid, pid) {
        const carts = await this.#getCarts();
        const cart = carts.find((cart) => cart.id === cid);
        if (!cart) {
            return null;
        }

        const prod = await productManager.getProductById(pid);
        if (!prod) {
            return null;
        }

        const product = cart.products.find((product) => product.pid === pid);
        if (!product) {
            cart.products.push({ pid, quantity: 1 });
        } else {
            product.quantity++;
        }
        await this.#saveCarts(carts);
        return cart;
    }

    // método para obtener la lista de carritos del archivo JSON
    async #getCarts() {
        try {
            const carts = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(carts);
        } catch (err) {
            if (err.code === 'ENOENT') {
                await this.#saveCarts([]);
                return [];
            }
            throw err;
        }
    }

    // método para guardar la lista de carritos  en el archivo JSON
    async #saveCarts(carts) {
        await fs.promises.writeFile(this.path, JSON.stringify(carts));
    }
}

export default CartManager;