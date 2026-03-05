import { prisma } from "../lib/prisma";
/**
 * CREATE PRODUCT (Seller Only)
 */
export const createProduct = async (req, res) => {
    try {
        const { title, description, price, image, stock } = req.body;
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const product = await prisma.product.create({
            data: {
                title,
                description,
                image: image,
                price: Number(price),
                stock: Number(stock),
                sellerId: Number(req.user.id)
            }
        });
        res.status(201).json(product);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create product", error });
    }
};
/**
 * GET ALL PRODUCTS (Public)
 */
export const getProducts = async (_req, res) => {
    try {
        const products = await prisma.product.findMany({
            include: {
                seller: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch products", error });
    }
};
/**
 * GET SINGLE PRODUCT
 */
export const getProductById = async (req, res) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id: Number(req.params.id) },
            include: {
                seller: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching product", error });
    }
};
/**
 * UPDATE PRODUCT (Seller Owner Only)
 */
export const updateProduct = async (req, res) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id: Number(req.params.id) }
        });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        if (product.sellerId !== req.user?.id) {
            return res.status(403).json({ message: "Forbidden" });
        }
        const updatedProduct = await prisma.product.update({
            where: { id: product.id },
            data: req.body
        });
        res.json(updatedProduct);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to update product", error });
    }
};
/**
 * DELETE PRODUCT (Seller Owner Only)
 */
export const deleteProduct = async (req, res) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id: Number(req.params.id) }
        });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        if (product.sellerId !== req.user?.id) {
            return res.status(403).json({ message: "Forbidden" });
        }
        await prisma.product.delete({
            where: { id: product.id }
        });
        res.json({ message: "Product deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete product", error });
    }
};
