import Room from '../models/Room';
import { Request, Response } from 'express';
import { RoomDocument } from '../types/types';

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

    let update: Partial<RoomDocument> = {
      isOccupied: !room.isOccupied
    };

    if (!room.isOccupied) {
      const checkInDate = new Date();
      const checkOutDate = new Date(checkInDate.getTime() + 24 * 60 * 60 * 1000);

      update.checkInDate = checkInDate;
      update.checkOutDate = checkOutDate;
    }

    const updatedRoom = await Room.findOneAndUpdate(
      { roomNumber },
      update, 
      { new: true }
    );

    res.json(updatedRoom);
  } catch (error) {
    console.error('Error updating room status:', error);
    res.status(500).json({ message: 'Failed to update room status' });
  }
};

export const getOccupiedRoomsByDate = async (req: Request, res: Response): Promise<void> => {
  const startDate = req.query.startDate as string;
  const endDate = req.query.endDate as string;


  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate) || !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
    res.status(400).json({ message: 'Invalid date format. Please use YYYY-MM-DD.' });
    return;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    res.status(400).json({ message: 'Invalid dates provided.' });
    return;
  }

  try {
    const rooms = await Room.find({
      isOccupied: true,
      checkInDate: { $gte: start },
      checkOutDate: { $lte: end }
    });

    const totalRevenue = rooms.reduce((acc, room) => acc + room.price, 0);

    res.json({
      occupiedRooms: rooms,
      totalRevenue,
      count: rooms.length
    });
  } catch (error) {
    console.error('Error fetching occupied rooms:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



