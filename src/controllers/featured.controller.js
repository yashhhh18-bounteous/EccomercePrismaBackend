import { prisma } from "../lib/prisma";
/**
 * ADD PRODUCT TO FEATURED (Seller Only)
 */
export const addFeatured = async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await prisma.product.findUnique({
            where: { id: Number(productId) }
        });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        // if you later add sellerId in schema, check ownership here
        // if (product.sellerId !== req.user?.id) ...
        const featured = await prisma.featuredProduct.create({
            data: {
                productId: Number(productId)
            }
        });
        res.status(201).json(featured);
    }
    catch (error) {
        if (error.code === "P2002") {
            return res.status(400).json({
                message: "Product already featured"
            });
        }
        res.status(500).json({
            message: "Failed to add featured product",
            error
        });
    }
};
/**
 * GET ALL FEATURED PRODUCTS (Public)
 */
export const getFeatured = async (_req, res) => {
    try {
        const featured = await prisma.featuredProduct.findMany({
            include: {
                product: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        res.json(featured);
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to fetch featured products",
            error
        });
    }
};
/**
 * REMOVE FROM FEATURED
 */
export const removeFeatured = async (req, res) => {
    try {
        const { productId } = req.params;
        const featured = await prisma.featuredProduct.findUnique({
            where: {
                productId: Number(productId)
            },
            include: {
                product: true
            }
        });
        if (!featured) {
            return res.status(404).json({
                message: "Not featured"
            });
        }
        await prisma.featuredProduct.delete({
            where: {
                productId: Number(productId)
            }
        });
        res.json({ message: "Removed from featured" });
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to remove featured",
            error
        });
    }
};
/**
 * BULK ADD FEATURED PRODUCTS
 */
export const addFeaturedBulk = async (req, res) => {
    try {
        const { productIds } = req.body;
        if (!Array.isArray(productIds) || productIds.length === 0) {
            return res.status(400).json({
                message: "productIds must be a non-empty array"
            });
        }
        const data = productIds.map((id) => ({
            productId: Number(id)
        }));
        const inserted = await prisma.featuredProduct.createMany({
            data,
            skipDuplicates: true
        });
        res.status(201).json({
            message: "Featured products added",
            inserted
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to add featured products",
            error: error.message
        });
    }
};
