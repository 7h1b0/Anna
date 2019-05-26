import { findByToken } from 'modules/models/user';
import { Request, Response, NextFunction } from 'express';

export default async function authenticationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authFail = () => res.sendStatus(401);

  const token = req.headers['x-access-token'];

  if (token == null) {
    return authFail();
  }

  const apiKey = Array.isArray(token) ? token[0] : token;
  try {
    const user = await findByToken(apiKey);
    if (user) {
      res.locals.user = user;
      return next();
    }
    authFail();
  } catch (error) {
    authFail();
  }
}
