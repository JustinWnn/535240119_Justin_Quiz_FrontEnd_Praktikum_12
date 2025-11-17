import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const games = await prisma.game.findMany({
      orderBy: { id: 'desc' }
    });
    return NextResponse.json(games);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching games" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newGame = await prisma.game.create({
      data: {
        title: body.title,
        genre: body.genre,
        platform: body.platform,
        description: body.description,
        coverImageUrl: body.coverImageUrl,
      },
    });
    return NextResponse.json(newGame);
  } catch (error) {
    return NextResponse.json({ error: "Error creating game" }, { status: 500 });
  }
}