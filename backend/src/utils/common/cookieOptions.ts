type CookieOptions = {
  httpOnly?: boolean;
  secure?: boolean;
  path?: string;
  sameSite?: boolean | "lax" | "none" | "strict" | undefined;
  maxAge?: number;
};

let cookieOption = (mode: "access" | "refresh" = "refresh"): CookieOptions => ({
  httpOnly: true,
  secure: true,
  path: "/",
  sameSite: "none",
  maxAge: mode === "refresh" ? 7 * 24 * 60 * 60 * 1000 : 1 * 24 * 60 * 60 * 1000,
});

export default cookieOption;
