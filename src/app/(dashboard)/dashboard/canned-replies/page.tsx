import { requireAuth } from "@/lib/auth-guard";
import { db } from "@/lib/db";
import { CannedRepliesManager } from "@/components/tickets/canned-replies-manager";

export default async function CannedRepliesPage() {
  const session = await requireAuth();

  const replies = await db.cannedReply.findMany({
    where: { workspaceId: session.user.workspaceId },
    include: { agent: { select: { name: true } } },
    orderBy: { title: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Canned Replies</h1>
      <p className="mt-1 text-gray-600">
        Create reusable response templates to speed up your replies.
      </p>
      <div className="mt-6">
        <CannedRepliesManager replies={replies} />
      </div>
    </div>
  );
}
