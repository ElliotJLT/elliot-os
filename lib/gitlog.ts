import { execSync } from "child_process";

export type LogEntry = { hash: string; date: string; subject: string };

export function getLog(limit = 100): LogEntry[] {
  try {
    const out = execSync(
      `git log --pretty=format:%h%x09%ad%x09%s --date=short -n ${limit}`,
      { cwd: process.cwd(), encoding: "utf-8" },
    );
    return out
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const [hash, date, ...rest] = line.split("\t");
        return { hash, date, subject: rest.join("\t") };
      });
  } catch {
    return [];
  }
}
