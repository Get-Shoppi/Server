import { PrismaClient } from "@prisma/client";

export class Prisma {
  public static client: PrismaClient;
  constructor() {
    Prisma.client = new PrismaClient();
  }
}
