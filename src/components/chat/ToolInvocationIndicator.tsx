"use client";

import { ToolInvocation } from "ai";
import { Loader2 } from "lucide-react";

interface ToolInvocationIndicatorProps {
  toolInvocation: ToolInvocation;
}

function getDisplayMessage(toolInvocation: ToolInvocation, isDone: boolean): string {
  const { toolName, args } = toolInvocation;
  const path = args?.path;
  const command = args?.command;

  if (!path) {
    return toolName;
  }

  if (toolName === "str_replace_editor") {
    switch (command) {
      case "create":
        return isDone ? `Created ${path}` : `Creating ${path}`;
      case "str_replace":
      case "insert":
        return isDone ? `Edited ${path}` : `Editing ${path}`;
      case "view":
        return isDone ? `Viewed ${path}` : `Viewing ${path}`;
      case "undo_edit":
        return isDone ? `Reverted ${path}` : `Reverting ${path}`;
      default:
        return toolName;
    }
  }

  if (toolName === "file_manager") {
    switch (command) {
      case "rename": {
        const newPath = args?.new_path;
        if (!newPath) return toolName;
        return isDone
          ? `Renamed ${path} to ${newPath}`
          : `Renaming ${path} to ${newPath}`;
      }
      case "delete":
        return isDone ? `Deleted ${path}` : `Deleting ${path}`;
      default:
        return toolName;
    }
  }

  return toolName;
}

export function ToolInvocationIndicator({
  toolInvocation,
}: ToolInvocationIndicatorProps) {
  const isDone = toolInvocation.state === "result" && !!toolInvocation.result;
  const message = getDisplayMessage(toolInvocation, isDone);

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {isDone ? (
        <>
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="text-neutral-700">{message}</span>
        </>
      ) : (
        <>
          <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
          <span className="text-neutral-700">{message}</span>
        </>
      )}
    </div>
  );
}
