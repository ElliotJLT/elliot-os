import { execSync } from "child_process";

export type LogEntry = {
  hash: string;
  date: string;
  author: string;
  subject: string;
};

/** ISO date of the repo's first commit — the site's "epoch". */
export function getFirstCommit(): { hash: string; iso: string } {
  try {
    const out = execSync(`git log --reverse --pretty=format:%h%x09%aI`, {
      cwd: process.cwd(),
      encoding: "utf-8",
    });
    const [hash, iso] = out.split("\n")[0].split("\t");
    return { hash, iso };
  } catch {
    return { hash: "", iso: new Date().toISOString() };
  }
}

export function getLog(limit = 100): LogEntry[] {
  try {
    const out = execSync(
      `git log --pretty=format:%h%x09%ad%x09%an%x09%s --date=short -n ${limit}`,
      { cwd: process.cwd(), encoding: "utf-8" },
    );
    return out
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const [hash, date, author, ...rest] = line.split("\t");
        return { hash, date, author, subject: rest.join("\t") };
      });
  } catch {
    return [];
  }
}
