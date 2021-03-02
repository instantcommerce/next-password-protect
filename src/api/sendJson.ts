import { Response } from 'express';

export const sendJson = (res: Response, status: number, data: any = {}) => {
  res.status(status).json(data);
};
