import jwt from 'jsonwebtoken';
import { identifier } from '../../middlewares/identification';

jest.mock('jsonwebtoken');

describe('identifier middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = { headers: { authorization: 'Bearer valid.token' } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

//   it('should call next() if token is valid', () => {
//     jwt.verify.mockReturnValue({ userId: 1 });

//     identifier(req, res, next);

//     expect(jwt.verify).toBeCalledWith('token', process.env.TOKEN_SECRET);
//     expect(req.user).toEqual({ userId: 1 });
//     expect(next).toBeCalled();
//   });

  it('should return 403 if no token is provided', () => {
    req.headers.authorization = null;

    identifier(req, res, next);

    expect(res.status).toBeCalledWith(403);
    expect(res.json).toBeCalledWith({ success: false, message: "Unauthorized" });
    expect(next).not.toBeCalled();
  });

//   it('should return an error if token verification fails', () => {
//     jwt.verify.mockImplementation(() => { throw new Error('Invalid token'); });

//     identifier(req, res, next);

//     expect(res.status).toBeCalledWith(403);
//     expect(res.json).toBeCalledWith({ success: false, message: "Unauthorized" });
//     expect(next).not.toBeCalled();
//   });
});
