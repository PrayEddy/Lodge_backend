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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRoom = exports.deleteRoom = exports.findOccupiedRooms = exports.findRoomById = exports.findAvailableRooms = exports.findAllRooms = exports.findRoomByNumber = exports.createRoom = void 0;
const prisma_1 = require("./prisma");
const prisma = (0, prisma_1.initializePrisma)();
const createRoom = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.room.create({ data });
});
exports.createRoom = createRoom;
const findRoomByNumber = (roomNumber) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.room.findUnique({ where: { roomNumber } });
});
exports.findRoomByNumber = findRoomByNumber;
const findAllRooms = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.room.findMany();
});
exports.findAllRooms = findAllRooms;
const findAvailableRooms = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.room.findMany({
        where: {
            isOccupied: false
        }
    });
});
exports.findAvailableRooms = findAvailableRooms;
const findRoomById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.room.findUnique({ where: { id } });
});
exports.findRoomById = findRoomById;
const findOccupiedRooms = (startDate, endDate) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.room.findMany({
        where: {
            isOccupied: true,
            checkInDate: {
                gte: startDate
            },
            checkOutDate: {
                lte: endDate
            }
        }
    });
});
exports.findOccupiedRooms = findOccupiedRooms;
const deleteRoom = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.room.delete({ where: { id } });
});
exports.deleteRoom = deleteRoom;
const updateRoom = (roomNumber, data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.room.update({
        where: { roomNumber },
        data,
    });
});
exports.updateRoom = updateRoom;
