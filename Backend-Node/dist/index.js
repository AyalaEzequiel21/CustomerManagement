"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const connect_1 = require("./db/connect");
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const error_middleware_1 = require("./middlewares/error.middleware");
// initialize the app
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: "http://localhost:3000", credentials: true }));
app.use('/praderaAPI', routes_1.default);
app.use(error_middleware_1.errorHandler);
// connect to Data Base
(0, connect_1.connectDB)().then(() => {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log("App listening in port: ", PORT);
    });
});
