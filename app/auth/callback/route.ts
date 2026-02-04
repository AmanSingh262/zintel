import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");

    if (code) {
        const supabase = createServerClient();
        await supabase.auth.exchangeCodeForSession(code);
    }

    // Redirect to home page
    return NextResponse.redirect(new URL("/", request.url));
}
