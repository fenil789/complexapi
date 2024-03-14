const tryCatch = (controllerFunction) => async (req, res, next) => {
  try {
    await controllerFunction(req, res, next);
  } catch (error) {
    next(error);
  }
};

module.exports = tryCatch;
