"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const roomController_1 = require("../controllers/roomController");
const authsMiddleware_1 = require("../Middleware/authsMiddleware");
const router = express_1.default.Router();
router.post('/rooms', authsMiddleware_1.isAuthenticated, authsMiddleware_1.isAdmin, roomController_1.postRoom);
router.get('/rooms/report', roomController_1.generateWeeklyReport);
router.get('/rooms/:roomNumber', roomController_1.getRoom);
router.get('/rooms', roomController_1.getRooms);
router.delete('/rooms/:id', authsMiddleware_1.isAuthenticated, authsMiddleware_1.isAdmin, roomController_1.removeRoom);
router.put('/rooms/:roomNumber/occupy/:numberOfDays', authsMiddleware_1.isAuthenticated, authsMiddleware_1.isAdmin, roomController_1.setRoomAsOccupied);
router.put('/rooms/:roomNumber/free', authsMiddleware_1.isAuthenticated, authsMiddleware_1.isAdmin, roomController_1.setRoomAsFree);
router.delete('/rooms', authsMiddleware_1.isAuthenticated, authsMiddleware_1.isAdmin, roomController_1.removeAllRooms);
exports.default = router;
