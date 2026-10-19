import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

const source = readFileSync(new URL("../src/data/terms.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { splitByTerms, lookupTerm, terms } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);
const hints = (text) => splitByTerms(text)
  .filter((part) => part.type === "term")
  .map((part) => [part.value, part.def.term]);

test("スレッドダンプの項目・状態・コマンドにヒントが付く", () => {
  for (const [text, term] of [
    ["CPU", "CPU"], ["CPU 時間", "CPU 時間"], ["CPU時間", "CPU 時間"], ["JVM", "JVM"],
    ["ソケット", "ソケット"], ["16 進", "16 進数"], ["16 進数", "16 進数"],
    ["cpu=83.44ms", "CPU 時間"], ["elapsed=23.61s", "elapsed="],
    ["nid=0x34", "nid="], ["tid=0x000078874d1c7ab0", "tid="],
    ["RUNNABLE", "RUNNABLE"], ["BLOCKED", "BLOCKED"],
    ["WAITING", "WAITING"], ["TIMED_WAITING", "TIMED_WAITING"],
    ["parking", "parking"], ["synchronized", "synchronized"],
    ["ReentrantLock", "ReentrantLock"],
    ["Locked ownable synchronizers", "Locked ownable synchronizers"],
    ["jstack -l PID", "jstack"], ["jcmd PID Thread.print -l", "jcmd"],
    ["top -H -p PID", "top -H"], ["ps -L -o tid,pcpu,comm -p PID", "ps -L"],
  ]) {
    assert.ok(hints(text).some(([, actual]) => actual === term), `${text}: ${term}`);
  }
});

test("短い識別子や別の語の一部をスレッドダンプの用語として拾わない", () => {
  for (const text of [
    "top: 0;", "margin-top: 1rem;", "top", "ps", "tid", "cpu", "elapsed",
    "SELECT tid FROM t_request", "pid=1 pcpu=90.9 elapsed_time=5",
    "my_jstack", "jcmdExample", "RUNNABLE_TASK", "NOT_BLOCKED", "AWAITING",
    "TIMED_WAITING_EXTRA", "parkingLot", "ReentrantLockFactory",
    "JVMOptions", "CPU_COUNT", "ソケットファイル",
  ]) {
    // SQL の SELECT など、既存のヒントが付くことは妨げない。
    assert.ok(!hints(text).some(([, term]) => addedTerms.has(term)), text);
  }
});

const addedTerms = new Set([
  "CPU", "CPU 時間", "JVM", "ソケット", "16 進数", "jstack", "jcmd",
  "top -H", "ps -L", "elapsed=", "nid=", "tid=", "RUNNABLE", "BLOCKED",
  "WAITING", "TIMED_WAITING", "parking", "synchronized", "ReentrantLock",
  "Locked ownable synchronizers",
]);

test("長い用語と状態名を優先し、既存のヒントを維持する", () => {
  assert.deepEqual(hints("CPU 時間"), [["CPU 時間", "CPU 時間"]]);
  assert.deepEqual(hints("Unix ソケット"), [["Unix ソケット", "Unix ソケット"]]);
  assert.deepEqual(hints("TIMED_WAITING (parking)"), [
    ["TIMED_WAITING", "TIMED_WAITING"], ["parking", "parking"],
  ]);
  assert.deepEqual(hints("docker ps"), [["docker ps", "docker ps"]]);
  assert.deepEqual(hints("docker compose stop"), [["docker compose stop", "docker compose stop"]]);
});

test("別の用語とエイリアスが重複せず、検索と本文が同じ用語を参照する", () => {
  const seen = new Map();
  const names = new Set();
  for (const term of terms) {
    assert.ok(!names.has(term.term), `用語の定義が重複: ${term.term}`);
    names.add(term.term);
    for (const alias of term.aliases) {
      assert.ok(!seen.has(alias.toLowerCase()) || seen.get(alias.toLowerCase()) === term,
        `別の用語と重複: ${alias}`);
      seen.set(alias.toLowerCase(), term);
      assert.equal(lookupTerm(alias), term);
    }
  }
});
