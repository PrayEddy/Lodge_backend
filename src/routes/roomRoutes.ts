import express from 'express';
import { createRoom, getAllRooms, updateRoomStatus, generateOccupancyReport } from '../controllers/roomController';
import isAuthenticated from '../Middleware/authsMiddleware';

const router = express.Router();

router.post('/rooms', isAuthenticated, createRoom);
// router.get('/rooms/:roomNumber',isAuthenticated, getRoom);
router.get('/rooms', isAuthenticated, getAllRooms);
router.put('/rooms/:roomNumber/status', isAuthenticated, updateRoomStatus);
router.get('/rooms/report', isAuthenticated, generateOccupancyReport);
// router.put('/rooms/:roomNumber', isAuthenticated, updateRoom);
// router.delete('/rooms/:roomNumber', isAdmin, deleteRoom);

export default router;
