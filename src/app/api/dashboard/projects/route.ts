import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: {
        projects: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      projects: user.projects.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        status: p.status,
        category: p.category,
        budget: p.budget,
        progress: p.progress,
        deadline: p.deadline?.toISOString() || null,
        createdAt: p.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Projects fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, category, budget } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const project = await db.project.create({
      data: {
        name,
        description: description || null,
        category: category || null,
        budget: budget || null,
        status: "active",
        progress: 0,
        userId: user.id,
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error("Project creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
