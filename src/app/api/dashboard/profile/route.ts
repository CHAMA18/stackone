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
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      company: user.company,
      phone: user.phone,
      bio: user.bio,
      role: user.role,
      image: user.image,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, company, phone, bio } = body;

    const user = await db.user.update({
      where: { email: session.user.email },
      data: {
        name: name || undefined,
        company: company !== undefined ? company : undefined,
        phone: phone !== undefined ? phone : undefined,
        bio: bio !== undefined ? bio : undefined,
      },
    });

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      company: user.company,
      phone: user.phone,
      bio: user.bio,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
