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
        messages: {
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

    return NextResponse.json({
      messages: user.messages.map((m) => ({
        id: m.id,
        subject: m.subject,
        body: m.body,
        sender: m.sender,
        read: m.read,
        starred: m.starred,
        createdAt: m.createdAt.toISOString(),
        project: m.project ? { name: m.project.name } : null,
      })),
    });
  } catch (error) {
    console.error("Messages fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
