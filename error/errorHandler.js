class ErrorHandler {
  constructor(status, message) {
    this.status = status;
    this.message = message;
  }

  static validationError(message = "please enter valid data") {
    return new ErrorHandler(422, message);
  }
  static databaseError(message = "server error") {
    return new ErrorHandler(500, message);
  }

  static invalidUser(message = "unauthorized user") {
    return new ErrorHandler(401, message);
  }
  static loginRequired(message = "login Requir") {
    return new ErrorHandler(401, message);
  }
  static notFound(message = "not Found") {
    return new ErrorHandler(404, message);
  }
}

module.exports = ErrorHandler;
