import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  matcher: [
    "/",
    "/(en|es|fr|de|it|ja|zh|pt|ru|ko|nl|sv|da|no|fi|pl|tr|ar|hi|bn|vi|th|el|cs|hu|ro|uk|id|ms|hr|sk|sl|bg|sr|he)/:path*",
  ],
};
