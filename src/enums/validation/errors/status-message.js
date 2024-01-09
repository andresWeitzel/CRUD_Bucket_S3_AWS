/**
 * @description message for validation headers
 * @returns the message value
 * @example HEADERS_PARAMS_MESSAGE --> "Bad request, check missing or malformed headers"
 */
const validateHeadersMessage = {
  HEADERS_PARAMS_ERROR_MESSAGE:
    'Bad request, check missing or malformed headers',
  HEADERS_AUTH_ERROR_MESSAGE:
    'Not authenticated, check x_api_key and Authorization',
};

module.exports = {
  validateHeadersMessage,
};
