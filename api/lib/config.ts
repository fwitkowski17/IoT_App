require('dotenv').config();
export const config = {
    port: process.env.PORT || 3100,
    supportedDevicesNum: 17,
    databaseUrl: process.env.MONGODB_URI || "",
    JwtSecret: process.env.JWT_SECRET || "secret"
};