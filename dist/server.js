"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./database");
const routes_1 = require("./routes");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(routes_1.router);
const port = process.env.PORT;
const HOST = '0.0.0.0';
app.listen(port, () => {
    database_1.sequelize.authenticate().then(() => {
        console.log('DB connection successfull.');
    });
    console.log(`Server started successfuly at port ${port}.`);
}, HOST);
