import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  if (host === "www.whereatlas.com") {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.host = "whereatlas.com";
    url.port = "";
    return NextResponse.redirect(url, { status: 308 });
  }

  return NextResponse.next();
}

export default proxy;
