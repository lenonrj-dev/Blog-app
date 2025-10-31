// File: backend/routes/newsletter.route.js
import { Router } from "express";
import rateLimit from "express-rate-limit";
import { subscribeNewsletter } from "../controllers/newsletter.controller.js";


const router = Router();


// Optional: basic rate limit to avoid spam
const limiter = rateLimit({
windowMs: 60 * 1000,
max: 5,
standardHeaders: true,
legacyHeaders: false,
message: { message: "Muitas tentativas, tente novamente em instantes." },
});


// Simple email validator middleware
function validateEmail(req, res, next) {
const { email } = req.body || {};
const ok = typeof email === "string" && /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email);
if (!ok) return res.status(400).json({ message: "E-mail inválido" });
return next();
}


// POST /api/newsletter/subscribe
router.post("/subscribe", limiter, validateEmail, subscribeNewsletter);


export default router;