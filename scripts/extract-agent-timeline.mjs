#!/usr/bin/env node
// scripts/extract-agent-timeline.mjs
// 从 OpenProfile/docs/meetings/ 解析会议纪要，提取各 Agent 的参会记录
// 输出：src/data/agent-meetings.ts
//
// 用法：node scripts/extract-agent-timeline.mjs [meetings-dir]
// 默认 meetings-dir：../../OpenProfile/docs/meetings

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 会议目录（可通过命令行参数覆盖）
const meetingsDir = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.resolve(__dirname, "../../OpenProfile/docs/meetings");

// 输出文件
const outputFile = path.resolve(__dirname, "../src/data/agent-meetings.ts");

// 展示名 → Agent ID 映射表（不区分大小写，支持中英文）
const DISPLAY_TO_ID = {
  "brain":           "brain",
  "pm":              "pm",
  "dev":             "dev",
  "researcher":      "researcher",
  "code reviewer":   "code-reviewer",
  "code-reviewer":   "code-reviewer",
  "code_reviewer":   "code-reviewer",
  "profile designer":"profile-designer",
  "profile-designer":"profile-designer",
  "profile_designer":"profile-designer",
  "brand":           "brand",
};

const ALL_AGENT_IDS = new Set(["brain", "pm", "dev", "researcher", "code-reviewer", "profile-designer", "brand"]);

/** 将参会字段文本（例如 "Brain · PM · Dev · Researcher · Code Reviewer · Profile Designer · Brand · Ray（用户）"）
 *  解析为 Agent ID 数组 */
function parseParticipants(raw) {
  // 支持 · 和逗号/顿号分隔
  const parts = raw.split(/[·,，、]/).map(s => s.trim().toLowerCase());
  const ids = [];
  for (const part of parts) {
    // 直接命中
    if (DISPLAY_TO_ID[part]) {
      ids.push(DISPLAY_TO_ID[part]);
      continue;
    }
    // 尝试部分匹配
    for (const [key, id] of Object.entries(DISPLAY_TO_ID)) {
      if (part.includes(key)) {
        ids.push(id);
        break;
      }
    }
  }
  // 去重
  return [...new Set(ids)];
}

/** 解析单个会议纪要文件 */
function parseMeetingFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");

  // 会议标题：第一个 # 行
  const titleLine = lines.find(l => l.startsWith("# "));
  const title = titleLine ? titleLine.replace(/^#\s+/, "").trim() : path.basename(filePath, ".md");

  // 日期：从文件名提取（格式 YYYY-MM-DD-...）或从文件内容
  const fileBase = path.basename(filePath, ".md");
  const dateFromName = fileBase.match(/^(\d{4}-\d{2}-\d{2})/)?.[1];
  let date = dateFromName;
  if (!date) {
    const dateLine = lines.find(l => /\*\*日期[：:]/.test(l));
    if (dateLine) {
      date = dateLine.match(/(\d{4}-\d{2}-\d{2})/)?.[1] ?? "unknown";
    }
  }
  if (!date) return null;

  // 参会者：从 `**参会：**` 或 `**参会角色：**` 行提取
  let participants = [];
  for (const line of lines) {
    if (/\*\*参会[角色]*[：:]/.test(line)) {
      const raw = line.replace(/\*\*参会[角色]*[：:]\*\*/, "").trim();
      participants = parseParticipants(raw);
      break;
    }
  }

  // 如果没解析到参会者，尝试从各节标题推断（如 ## 一段（Brain））
  if (participants.length === 0) {
    const sectionPattern = /^#{1,3} .+[（(](brain|pm|dev|researcher|code.?reviewer|profile.?designer|brand)[）)]/i;
    for (const line of lines) {
      const m = line.toLowerCase().match(/[（(](brain|pm|dev|researcher|code.?reviewer|profile.?designer|brand)[）)]/);
      if (m) {
        const mapped = DISPLAY_TO_ID[m[1].replace(/[\s-]+/g, "-").toLowerCase()];
        if (mapped && !participants.includes(mapped)) participants.push(mapped);
      }
    }
  }

  // 会议类型（从文件名或标题推断）
  let type = "meeting";
  if (/retrospective|retro|复盘/.test(fileBase + title)) type = "retrospective";
  else if (/planning|规划/.test(fileBase + title)) type = "planning";
  else if (/kickoff|启动/.test(fileBase + title)) type = "kickoff";
  else if (/brainstorm|头脑/.test(fileBase + title)) type = "brainstorm";
  else if (/all.hands|全体/.test(fileBase + title)) type = "all-hands";
  else if (/research|research|调研|研究/.test(fileBase + title)) type = "research";

  return { date, title, file: fileBase, type, participants };
}

// ── 主流程 ──────────────────────────────────────────────────────────────────

if (!fs.existsSync(meetingsDir)) {
  console.error(`❌ Meetings directory not found: ${meetingsDir}`);
  console.error("   Pass custom path: node scripts/extract-agent-timeline.mjs <path>");
  process.exit(1);
}

const files = fs.readdirSync(meetingsDir)
  .filter(f => f.endsWith(".md"))
  .sort(); // 文件名本身按日期排序

const meetings = [];
for (const file of files) {
  const parsed = parseMeetingFile(path.join(meetingsDir, file));
  if (parsed && parsed.participants.length > 0) {
    meetings.push(parsed);
  }
}

console.log(`✅ Parsed ${meetings.length} meeting files (with identified participants)`);

// 按 Agent ID 建立索引
/** @type {Record<string, Array<{date,title,file,type}>>} */
const byAgent = {};
for (const id of ALL_AGENT_IDS) byAgent[id] = [];

for (const m of meetings) {
  for (const agentId of m.participants) {
    if (ALL_AGENT_IDS.has(agentId)) {
      byAgent[agentId].push({
        date:  m.date,
        title: m.title,
        file:  m.file,
        type:  m.type,
      });
    }
  }
}

// 每个 Agent 按日期降序排列
for (const id of ALL_AGENT_IDS) {
  byAgent[id].sort((a, b) => b.date.localeCompare(a.date));
}

// 输出统计
for (const [id, evts] of Object.entries(byAgent)) {
  console.log(`  ${id}: ${evts.length} meetings`);
}

// 生成 TypeScript 文件
const ts = `// auto-generated by scripts/extract-agent-timeline.mjs
// DO NOT EDIT — re-run the script to update
// Source: docs/meetings/ in OpenProfile repo
// Generated: ${new Date().toISOString().split("T")[0]}

export interface MeetingEvent {
  date: string;   // YYYY-MM-DD
  title: string;
  file: string;   // meeting file basename (without .md)
  type: 'meeting' | 'planning' | 'retrospective' | 'kickoff' | 'brainstorm' | 'all-hands' | 'research';
}

export const AGENT_MEETINGS: Record<string, MeetingEvent[]> = ${JSON.stringify(byAgent, null, 2)};

/** 各 Agent 参会总数 */
export const MEETING_COUNTS: Record<string, number> = {
${Object.entries(byAgent).map(([id, evts]) => `  "${id}": ${evts.length},`).join("\n")}
};
`;

fs.writeFileSync(outputFile, ts, "utf-8");
console.log(`\n✅ Written to ${outputFile}`);
