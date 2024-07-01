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

    const updatedRoom = await Room.findOneAndUpdate(
      { roomNumber },
      { isOccupied: !room.isOccupied }, 
      { new: true }  
    );

    res.json(updatedRoom);  
  } catch (error) {
    console.error('Error updating room status:', error);
    res.status(500).json({ message: 'Failed to update room status' });
  }
};

export const generateOccupancyReport = async (req: Request, res: Response): Promise<void> => {
  const startDate = req.query.startDate as string;
  const endDate = req.query.endDate as string;

  if (!startDate || !endDate) {
     res.status(400).json({ message: 'Missing startDate or endDate parameters' });
     return
    }

  try {
    const rooms = await Room.find({
      isOccupied: true,
      checkInDate: { $gte: new Date(startDate) },
      checkOutDate: { $lte: new Date(endDate) }
    });

    const totalRevenue = rooms.reduce((acc, room) => acc + (room.price || 0), 0);

    res.json({
      report: rooms,
      totalRevenue
    });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ message: 'Failed to generate report' });
  }
};



