import Room from '../models/Room';
import { Request, Response } from 'express';
import { RoomDocument } from '../types/types';
import OccupancyLog from '../models/OccupancyLog';
import * as schedule from 'node-schedule';

export const createRoom = async (req: Request, res: Response): Promise<void> => {
  try {
    const data: RoomDocument = req.body;
    const newRoom = await Room.create(data);
    console.log('Room created:', newRoom);
    res.status(201).json(newRoom);
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ message: 'Failed to create room' });
  }
};

export const getAllRooms = async (_req: Request, res: Response): Promise<void> => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ message: 'Failed to fetch rooms' });
  }
};

export const updateRoomStatus = async (req: Request, res: Response): Promise<void> => {
  const { roomNumber } = req.params;

  try {
    const room = await Room.findOne({ roomNumber });

    if (!room) {
      res.status(404).json({ message: 'Room not found' });
      return;
    }

    const currentlyOccupied = room.isOccupied;
    const newOccupationStatus = !currentlyOccupied;

    if (newOccupationStatus) {
      const checkInDate = new Date(); // Current date and time in local time zone
      const checkOutDate = new Date(); // Current date
      
      // Set check-out date to the next day at 10:00 AM local time
      checkOutDate.setDate(checkOutDate.getDate() + 1); 
      checkOutDate.setHours(10, 0, 0, 0); 

      await new OccupancyLog({
        roomNumber: room.roomNumber,
        checkInDate,
        checkOutDate,
        price: room.price
      }).save();

      room.isOccupied = newOccupationStatus;
      room.checkInDate = checkInDate;
      room.checkOutDate = checkOutDate;

      // Schedule room status to be set to false the next day at 10 AM
      const job = schedule.scheduleJob(checkOutDate, async function() {
        room.isOccupied = false;
        room.checkInDate = null;
        room.checkOutDate = null;
        await room.save();
      });
    } else {
      room.isOccupied = newOccupationStatus;
      room.checkInDate = null;
      room.checkOutDate = null;
    }

    const updatedRoom = await room.save();
    res.json(updatedRoom);
  } catch (error) {
    console.error('Error updating room status:', error);
    res.status(500).json({ message: 'Failed to update room status' });
  }
};


export const getOccupiedRoomsByDate = async (req: Request, res: Response): Promise<void> => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate || !/^\d{4}-\d{2}-\d{2}$/.test(startDate as string) || !/^\d{4}-\d{2}-\d{2}$/.test(endDate as string)) {
    res.status(400).json({ message: 'Invalid date format. Please use YYYY-MM-DD.' });
    return;
  }

  const start = new Date(startDate as string);
  const end = new Date(endDate as string);
  end.setHours(23, 59, 59, 999);  // Ensure the end date includes the full day

  try {
    const occupancyLogs = await OccupancyLog.find({
      checkInDate: { $gte: start },
      checkOutDate: { $lte: end }
    });

    const totalRevenue = occupancyLogs.reduce((acc, log) => acc + log.price, 0);

    res.json({
      totalRevenue,
      details: occupancyLogs,
      count: occupancyLogs.length
    });
  } catch (error) {
    console.error('Error fetching occupancy details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};






