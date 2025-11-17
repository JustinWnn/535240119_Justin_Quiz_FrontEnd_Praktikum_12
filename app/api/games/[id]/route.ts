import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const game = await prisma.game.findUnique({
        where: { id: Number(id) },
    });

    if (!game) {
        return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }
    return NextResponse.json(game);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const body = await request.json();
    
    try {
        const updatedGame = await prisma.game.update({
            where: { id: Number(id) },
            data: {
                title: body.title,
                genre: body.genre,
                platform: body.platform,
                description: body.description,
                coverImageUrl: body.coverImageUrl,
            },
        });
        return NextResponse.json(updatedGame);
    } catch (error) {
        return NextResponse.json({ error: "Error updating game" }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        await prisma.game.delete({
            where: { id: Number(id) },
        });
        return NextResponse.json({ message: "Game deleted" });
    } catch (error) {
        return NextResponse.json({ error: "Error deleting game" }, { status: 500 });
    }
}