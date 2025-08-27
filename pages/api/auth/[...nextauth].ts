import type { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { authOptionsBase } from "@/lib/authBase";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return NextAuth(req, res, {
    ...authOptionsBase,
    adapter: PrismaAdapter(prisma),
  });
}
