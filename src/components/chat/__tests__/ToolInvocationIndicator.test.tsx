import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationIndicator } from "../ToolInvocationIndicator";
import type { ToolInvocation } from "ai";

afterEach(() => {
  cleanup();
});

test("shows 'Creating' while a create call is running", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "create", path: "Card.tsx" },
    state: "call",
  };

  const { container } = render(
    <ToolInvocationIndicator toolInvocation={toolInvocation} />
  );

  expect(screen.getByText("Creating Card.tsx")).toBeDefined();
  expect(container.querySelector(".animate-spin")).not.toBeNull();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});

test("shows 'Created' once a create call has a result", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "create", path: "Card.tsx" },
    state: "result",
    result: "File created",
  };

  const { container } = render(
    <ToolInvocationIndicator toolInvocation={toolInvocation} />
  );

  expect(screen.getByText("Created Card.tsx")).toBeDefined();
  expect(container.querySelector(".bg-emerald-500")).not.toBeNull();
  expect(container.querySelector(".animate-spin")).toBeNull();
});

test("shows 'Editing' / 'Edited' for str_replace command", () => {
  const running: ToolInvocation = {
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "str_replace", path: "App.tsx" },
    state: "call",
  };
  const { rerender } = render(
    <ToolInvocationIndicator toolInvocation={running} />
  );
  expect(screen.getByText("Editing App.tsx")).toBeDefined();

  const done: ToolInvocation = {
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "str_replace", path: "App.tsx" },
    state: "result",
    result: "Success",
  };
  rerender(<ToolInvocationIndicator toolInvocation={done} />);
  expect(screen.getByText("Edited App.tsx")).toBeDefined();
});

test("shows 'Editing' / 'Edited' for insert command", () => {
  const running: ToolInvocation = {
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "insert", path: "App.tsx", insert_line: 3 },
    state: "call",
  };
  render(<ToolInvocationIndicator toolInvocation={running} />);
  expect(screen.getByText("Editing App.tsx")).toBeDefined();
});

test("shows 'Viewing' / 'Viewed' for view command", () => {
  const done: ToolInvocation = {
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "view", path: "App.tsx" },
    state: "result",
    result: "file contents",
  };
  render(<ToolInvocationIndicator toolInvocation={done} />);
  expect(screen.getByText("Viewed App.tsx")).toBeDefined();
});

test("shows 'Renaming' / 'Renamed' for file_manager rename command", () => {
  const running: ToolInvocation = {
    toolCallId: "1",
    toolName: "file_manager",
    args: { command: "rename", path: "old.tsx", new_path: "new.tsx" },
    state: "call",
  };
  const { rerender } = render(
    <ToolInvocationIndicator toolInvocation={running} />
  );
  expect(screen.getByText("Renaming old.tsx to new.tsx")).toBeDefined();

  const done: ToolInvocation = {
    toolCallId: "1",
    toolName: "file_manager",
    args: { command: "rename", path: "old.tsx", new_path: "new.tsx" },
    state: "result",
    result: { success: true, message: "Successfully renamed old.tsx to new.tsx" },
  };
  rerender(<ToolInvocationIndicator toolInvocation={done} />);
  expect(screen.getByText("Renamed old.tsx to new.tsx")).toBeDefined();
});

test("shows 'Deleting' / 'Deleted' for file_manager delete command", () => {
  const running: ToolInvocation = {
    toolCallId: "1",
    toolName: "file_manager",
    args: { command: "delete", path: "old.tsx" },
    state: "call",
  };
  const { rerender } = render(
    <ToolInvocationIndicator toolInvocation={running} />
  );
  expect(screen.getByText("Deleting old.tsx")).toBeDefined();

  const done: ToolInvocation = {
    toolCallId: "1",
    toolName: "file_manager",
    args: { command: "delete", path: "old.tsx" },
    state: "result",
    result: { success: true, message: "Successfully deleted old.tsx" },
  };
  rerender(<ToolInvocationIndicator toolInvocation={done} />);
  expect(screen.getByText("Deleted old.tsx")).toBeDefined();
});

test("falls back to the raw tool name when args are empty", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "asdf",
    toolName: "str_replace_editor",
    args: {},
    state: "result",
    result: "Success",
  };

  render(<ToolInvocationIndicator toolInvocation={toolInvocation} />);

  expect(screen.getByText("str_replace_editor")).toBeDefined();
});

test("falls back to the raw tool name for an unrecognized tool", () => {
  const toolInvocation = {
    toolCallId: "1",
    toolName: "some_other_tool",
    args: { command: "create", path: "App.tsx" },
    state: "call",
  } as unknown as ToolInvocation;

  render(<ToolInvocationIndicator toolInvocation={toolInvocation} />);

  expect(screen.getByText("some_other_tool")).toBeDefined();
});

test("falls back to the raw tool name when rename is missing new_path", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "1",
    toolName: "file_manager",
    args: { command: "rename", path: "old.tsx" },
    state: "call",
  };

  render(<ToolInvocationIndicator toolInvocation={toolInvocation} />);

  expect(screen.getByText("file_manager")).toBeDefined();
});

test("treats a result state with a falsy result as still running", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "create", path: "Card.tsx" },
    state: "result",
    result: "",
  };

  const { container } = render(
    <ToolInvocationIndicator toolInvocation={toolInvocation} />
  );

  expect(screen.getByText("Creating Card.tsx")).toBeDefined();
  expect(container.querySelector(".animate-spin")).not.toBeNull();
});
