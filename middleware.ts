import { NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const lang = request.headers.get("accept-language") || ""

  const locale = lang.toLowerCase().includes("en") ? "en" : "pt"

  const response = NextResponse.next()
  response.cookies.set("locale", locale)

  return response
}
