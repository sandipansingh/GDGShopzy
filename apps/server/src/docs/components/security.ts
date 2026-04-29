export const securitySchemes = {
  bearerAuth: {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
    description: "Access token returned by login/register/refresh endpoints",
  },
  refreshCookie: {
    type: "apiKey",
    in: "cookie",
    name: "refreshToken",
    description: "HTTP-only refresh token cookie used by refresh/logout endpoints",
  },
};
