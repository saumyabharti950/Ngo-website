export const ok = (res, data = {}, message = "Operation successful", status = 200) =>
  res.status(status).json({ success: true, message, data });

export const fail = (res, message = "Request failed", status = 400, errors = {}) =>
  res.status(status).json({ success: false, message, errors });

export class ApiError extends Error {
  constructor(status, message, errors = {}) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
