import "next-auth";

declare module "next-auth" {
  interface User {
    role: string;
    workspaceId: string;
  }

  interface Session {
    user: User & {
      id: string;
      email: string;
      name: string;
    };
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role: string;
    workspaceId: string;
  }
}
