// proxy.ts
import { fetchQuery } from "convex/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { api } from "./convex/_generated/api";

export async function proxy(request: NextRequest) {
    if (request.nextUrl.pathname === "/dashboard") {

        const boards = await fetchQuery(
            api.queries.boards.getAll
        );

        if (boards.length === 0) {
            return NextResponse.redirect(
                new URL(`/dashboard/${boards[0]._id}`, request.url)
            );
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard"],
};
