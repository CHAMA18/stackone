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
          take: 5,
          orderBy: { createdAt: "desc" },
        },
        messages: {
          take: 5,
          orderBy: { createdAt: "desc" },
          include: {
            project: { select: { name: true } },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const activeProjects = user.projects.filter(
      (p) => p.status === "active"
    ).length;
    const unreadMessages = user.messages.filter((m) => !m.read).length;

    return NextResponse.json({
      projectCount: user.projects.length,
      activeProjects,
      messageCount: user.messages.length,
      unreadMessages,
      recentProjects: user.projects.map((p) => ({
        id: p.id,
        name: p.name,
        status: p.status,
        progress: p.progress,
        category: p.category,
      })),
      recentMessages: user.messages.map((m) => ({
        id: m.id,
        subject: m.subject,
        sender: m.sender,
        read: m.read,
        createdAt: m.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Dashboard overview error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
