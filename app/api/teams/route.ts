import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const teamSchema = z.object({
  name: z.string().min(1, "Team name is required"),
  leagueId: z.string().min(1, "League ID is required"),
  teamId: z.string().min(1, "Team ID is required"),
  leagueName: z.string().optional(),
  teamName: z.string().optional(),
  season: z.number().default(2024),
});

// GET - Fetch user's teams
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const teams = await prisma.fantasyTeam.findMany({
      where: {
        userId: session.user.id,
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Add new team
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, leagueId, teamId, leagueName, teamName, season } = teamSchema.parse(body);

    // Check if team already exists for this user
    const existingTeam = await prisma.fantasyTeam.findFirst({
      where: {
        userId: session.user.id,
        leagueId,
        teamId,
        season,
      },
    });

    if (existingTeam) {
      return NextResponse.json(
        { error: "Team already exists for this league and season" },
        { status: 400 }
      );
    }

    // Create new team
    const team = await prisma.fantasyTeam.create({
      data: {
        name,
        leagueId,
        teamId,
        leagueName,
        teamName,
        season,
        userId: session.user.id,
      },
    });

    return NextResponse.json(team, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating team:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
