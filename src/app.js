import dotenv from "dotenv";
dotenv.config();
import express from "express";
import authRoutes from "./routes/auth.routes";
import protectedRoutes from "./routes/protected.routes";
import productRoutes from "./routes/product.routes";
import cartRoutes from "./routes/cart.routes";
import orderRoutes from "./routes/order.routes";
import featuredRoutes from "./routes/featured.routes";
const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.use(express.json());
app.get("/", (_req, res) => {
    res.json({ message: "Ecommerce API is running" });
});
app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/featured", featuredRoutes);
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});
