import rateLimit from "express-rate-limit";

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes window
    limit: 600,
    keyGenerator: (req) => {
        return (
            (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
            req.ip ||
            req.socket?.remoteAddress ||
            "127.0.0.1"
        );
    },
    validate: false,
    message: {
        status: 429,
        error: 'Too Many Requests',
        message: 'You have exceeded your request limit. Please try again in 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export {
    apiLimiter
};
