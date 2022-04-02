const successResponse = ({ response, message, statusCode = 200 }) => {
  return {
    body: JSON.stringify({
      status: true,
      data: response,
      message: message,
    }),
    statusCode,
  };
};

const errorResponse = ({ response, message, statusCode = 401 }) => {
  return {
    body: JSON.stringify({
      status: false,
      data: response,
      message: message,
    }),
    message: message,
    statusCode,
  };
};
const errorHandler = (error) => {
  return {
    body: JSON.stringify({
      status: false,
      data: error,
      message: error,
    }),
    statusCode: 500,
  };
};

module.exports = {
  successResponse,
  errorResponse,
  errorHandler,
};
