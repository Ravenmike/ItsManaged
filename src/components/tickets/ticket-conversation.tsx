interface Message {
  id: string;
  body: string;
  senderType: string;
  isInternalNote: boolean;
  createdAt: Date;
  agent: { name: string } | null;
  attachments: {
    id: string;
    fileName: string;
    fileUrl: string;
  }[];
}

interface TicketConversationProps {
  messages: Message[];
  submitterName: string;
}

export function TicketConversation({
  messages,
  submitterName,
}: TicketConversationProps) {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`rounded-lg border p-4 ${
            message.isInternalNote
              ? "border-yellow-200 bg-yellow-50"
              : message.senderType === "USER"
                ? "border-gray-200 bg-white"
                : message.senderType === "AGENT"
                  ? "border-blue-200 bg-blue-50"
                  : "border-gray-100 bg-gray-50 text-center"
          }`}
        >
          {message.senderType === "SYSTEM" ? (
            <p className="text-sm text-gray-500 italic">{message.body}</p>
          ) : (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-900">
                  {message.senderType === "USER"
                    ? submitterName
                    : message.agent?.name || "Agent"}
                  {message.isInternalNote && (
                    <span className="ml-2 rounded bg-yellow-200 px-1.5 py-0.5 text-xs font-medium text-yellow-800">
                      Internal Note
                    </span>
                  )}
                </span>
                <span className="text-gray-500">
                  {message.createdAt.toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">
                {message.body}
              </p>
              {message.attachments.length > 0 && (
                <div className="mt-3 space-y-1">
                  {message.attachments.map((att) => (
                    <a
                      key={att.id}
                      href={att.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-blue-600 hover:underline"
                    >
                      {att.fileName}
                    </a>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
