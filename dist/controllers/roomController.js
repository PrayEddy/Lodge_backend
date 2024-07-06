"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOccupancyReport = exports.updateRoomStatus = exports.getAllRooms = exports.createRoom = void 0;
const Room_1 = __importDefault(require("../models/Room"));
const createRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const newRoom = yield Room_1.default.create(data);
        console.log('Room created:', newRoom);
        res.status(201).json(newRoom);
    }
    catch (error) {
        console.error('Error creating room:', error);
        res.status(500).json({ message: 'Failed to create room' });
    }
});
exports.createRoom = createRoom;
const getAllRooms = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rooms = yield Room_1.default.find();
        res.json(rooms);
    }
    catch (error) {
        console.error('Error fetching rooms:', error);
        res.status(500).json({ message: 'Failed to fetch rooms' });
    }
});
exports.getAllRooms = getAllRooms;
const updateRoomStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomNumber } = req.params;
    try {
        const room = yield Room_1.default.findOne({ roomNumber });
        if (!room) {
            res.status(404).json({ message: 'Room not found' });
            return;
        }
        const updatedRoom = yield Room_1.default.findOneAndUpdate({ roomNumber }, { isOccupied: !room.isOccupied }, { new: true });
        res.json(updatedRoom);
    }
    catch (error) {
        console.error('Error updating room status:', error);
        res.status(500).json({ message: 'Failed to update room status' });
    }
});
exports.updateRoomStatus = updateRoomStatus;
const generateOccupancyReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    if (!startDate || !endDate) {
        res.status(400).json({ message: 'Missing startDate or endDate parameters' });
        return;
    }
    try {
        const rooms = yield Room_1.default.find({
            isOccupied: true,
            checkInDate: { $gte: new Date(startDate) },
            checkOutDate: { $lte: new Date(endDate) }
        });
        const totalRevenue = rooms.reduce((acc, room) => acc + (room.price || 0), 0);
        res.json({
            report: rooms,
            totalRevenue
        });
    }
    catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ message: 'Failed to generate report' });
    }
});
exports.generateOccupancyReport = generateOccupancyReport;
