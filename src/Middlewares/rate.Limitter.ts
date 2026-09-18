import rateLimit from "express-rate-limit";

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes window
    limit: 600, // Limit each IP to 100 requests per `windowMs`
    message: {
        status: 429,
        error: 'Too Many Requests',
        message: 'You have exceeded your request limit. Please try again in 15 minutes.'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the old `X-RateLimit-*` headers
});

export {
    apiLimiter
}