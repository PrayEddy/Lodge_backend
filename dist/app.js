"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const roomRoutes_1 = __importDefault(require("./routes/roomRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const usersRoutes_1 = __importDefault(require("./routes/usersRoutes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("./swagger"));
dotenv_1.default.config();
// Connect to the database
(0, db_1.default)();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// CORS Middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use(express_1.default.json());
// Routes Setup
app.use('/api', authRoutes_1.default);
app.use('/api', usersRoutes_1.default);
// Uncomment or add additional routes as needed
// app.use('/api', feedBackRoutes);
app.use('/api', roomRoutes_1.default);
// Error Handling Middleware
app.use((err, req, res, next) => {
    res.status(500).json({ error: err.message });
});
// Swagger Documentation
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
// Start Server
app.listen(PORT, () => {
    console.log(`Your Server is running on port ${PORT}`);
});
exports.default = app;
