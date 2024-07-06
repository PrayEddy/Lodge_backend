"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const roomController_1 = require("../controllers/roomController");
const authsMiddleware_1 = __importDefault(require("../Middleware/authsMiddleware"));
const router = express_1.default.Router();
router.post('/rooms', authsMiddleware_1.default, roomController_1.createRoom);
// router.get('/rooms/:roomNumber',isAuthenticated, getRoom);
router.get('/rooms', authsMiddleware_1.default, roomController_1.getAllRooms);
router.put('/rooms/:roomNumber/status', authsMiddleware_1.default, roomController_1.updateRoomStatus);
router.get('/rooms/report', authsMiddleware_1.default, roomController_1.generateOccupancyReport);
// router.put('/rooms/:roomNumber', isAuthenticated, updateRoom);
// router.delete('/rooms/:roomNumber', isAdmin, deleteRoom);
exports.default = router;
