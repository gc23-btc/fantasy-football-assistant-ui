import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Fetch individual team
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const team = await prisma.fantasyTeam.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
        isActive: true,
      },
    });

    if (!team) {
      return NextResponse.json(
        { error: "Team not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(team);
  } catch (error) {
    console.error("Error fetching team:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update team
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, leagueName, teamName } = body;

    const team = await prisma.fantasyTeam.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
        isActive: true,
      },
    });

    if (!team) {
      return NextResponse.json(
        { error: "Team not found" },
        { status: 404 }
      );
    }

    const updatedTeam = await prisma.fantasyTeam.update({
      where: { id: params.id },
      data: {
        name: name || team.name,
        leagueName: leagueName || team.leagueName,
        teamName: teamName || team.teamName,
      },
    });

    return NextResponse.json(updatedTeam);
  } catch (error) {
    console.error("Error updating team:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Remove team (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const team = await prisma.fantasyTeam.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
        isActive: true,
      },
    });

    if (!team) {
      return NextResponse.json(
        { error: "Team not found" },
        { status: 404 }
      );
    }

    // Soft delete by setting isActive to false
    await prisma.fantasyTeam.update({
      where: { id: params.id },
      data: { isActive: false },
    });

    return NextResponse.json({ message: "Team removed successfully" });
  } catch (error) {
    console.error("Error removing team:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
