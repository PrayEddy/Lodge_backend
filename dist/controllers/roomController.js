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
exports.generateWeeklyReport = exports.setRoomAsFree = exports.setRoomAsOccupied = exports.removeAllRooms = exports.removeRoom = exports.getRooms = exports.getRoom = exports.postRoom = void 0;
const Room_1 = require("../models/Room");
const puppeteer_1 = __importDefault(require("puppeteer"));
const postRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const room = req.body;
    const existingRoom = yield (0, Room_1.findRoomByNumber)(room.roomNumber);
    if (existingRoom) {
        res.status(409).json({ error: 'Room already exists' });
        return;
    }
    const newRoom = yield (0, Room_1.createRoom)(room);
    res.status(201).json(newRoom);
});
exports.postRoom = postRoom;
const getRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomNumber } = req.params;
    const roomNum = Number(roomNumber);
    if (isNaN(roomNum)) {
        res.status(400).json({ error: 'Invalid room number' });
        return;
    }
    const room = yield (0, Room_1.findRoomByNumber)(roomNum);
    if (!room) {
        res.status(404).json({ error: 'Room not found' });
        return;
    }
    res.json(room);
});
exports.getRoom = getRoom;
const getRooms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rooms = yield (0, Room_1.findAllRooms)();
    res.json(rooms);
});
exports.getRooms = getRooms;
const removeRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield (0, Room_1.deleteRoom)(Number(id));
    res.json({ message: 'Room deleted successfully' });
});
exports.removeRoom = removeRoom;
const removeAllRooms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rooms = yield (0, Room_1.findAllRooms)();
    rooms.forEach((room) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, Room_1.deleteRoom)(room.id);
    }));
    res.json({ message: 'All rooms deleted successfully' });
});
exports.removeAllRooms = removeAllRooms;
const setRoomAsOccupied = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomNumber, numberOfDays } = req.params;
    const roomNum = Number(roomNumber);
    const days = Number(numberOfDays);
    const isOccupied = yield (0, Room_1.findOccupiedRooms)();
    if (isOccupied) {
        res.status(400).json({ error: 'Room is already occupied' });
        return;
    }
    if (isNaN(roomNum) || isNaN(days)) {
        res.status(400).json({ error: 'Invalid room number or number of days' });
        return;
    }
    const room = yield (0, Room_1.findRoomByNumber)(roomNum);
    if (!room) {
        res.status(404).json({ error: 'Room not found' });
        return;
    }
    const totalPrice = room.price * days;
    const updatedRoom = yield (0, Room_1.updateRoom)(roomNum, { isOccupied: true, price: totalPrice });
    if (!updatedRoom) {
        res.status(500).json({ error: 'Failed to update room' });
        return;
    }
    res.json(updatedRoom);
});
exports.setRoomAsOccupied = setRoomAsOccupied;
const setRoomAsFree = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomNumber } = req.params;
    const roomNum = Number(roomNumber);
    if (isNaN(roomNum)) {
        res.status(400).json({ error: 'Invalid room number' });
        return;
    }
    const updatedRoom = yield (0, Room_1.updateRoom)(roomNum, { isOccupied: false });
    if (!updatedRoom) {
        res.status(404).json({ error: 'Room not found' });
        return;
    }
    res.json(updatedRoom);
});
exports.setRoomAsFree = setRoomAsFree;
const generateWeeklyReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch the date range from the request body
    const { startDate, endDate } = req.body;
    // Fetch all rooms that are occupied within the given date range
    const occupiedRooms = yield (0, Room_1.findOccupiedRooms)(new Date(startDate), new Date(endDate));
    // Calculate the total price for each room and the total amount
    let totalAmount = 0;
    const roomReports = occupiedRooms.map((room) => {
        const roomDoc = room;
        if (roomDoc.checkInDate && roomDoc.checkOutDate) {
            const daysOccupied = Math.ceil((new Date(roomDoc.checkOutDate).getTime() - new Date(roomDoc.checkInDate).getTime()) / (1000 * 60 * 60 * 24));
            const totalPrice = roomDoc.price * daysOccupied;
            totalAmount += totalPrice;
            return {
                roomNumber: roomDoc.roomNumber,
                price: roomDoc.price,
                daysOccupied,
                totalPrice,
            };
        }
    }).filter(Boolean);
    // Define the HTML content
    const htmlContent = `
    <h1>Weekly Report</h1>
    ${roomReports.map(room => `
      <h2>Room Number: ${room.roomNumber}</h2>
      <p>Price per day: ${room.price}</p>
      <p>Days Occupied: ${room.daysOccupied}</p>
      <p>Total Price: ${room.totalPrice}</p>
    `).join('')}
    <h2>Total Amount: ${totalAmount}</h2>
  `;
    // Generate the PDF
    const browser = yield puppeteer_1.default.launch();
    const page = yield browser.newPage();
    yield page.setContent(htmlContent);
    const pdf = yield page.pdf({ format: 'A4' });
    yield browser.close();
    // Now you can send this PDF to the client or save it in your server
    res.json({
        roomReports,
        totalAmount,
        pdf
    });
});
exports.generateWeeklyReport = generateWeeklyReport;
