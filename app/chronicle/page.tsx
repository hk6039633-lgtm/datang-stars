import { getCharacters, getBookTimeline } from "../lib/data";
import ChronicleClient from "../components/ChronicleClient";

export default async function ChroniclePage() {
  const [characters, events] = await Promise.all([getCharacters(), getBookTimeline()]);

  // 人物姓名 -> id 映射，用于相关人物跳转
  const nameToId = new Map<string, string>();
  characters.forEach((c) => {
    if (!nameToId.has(c.name)) {
      nameToId.set(c.name, c.id);
    }
  });

  const stages = Array.from(new Set(events.map((e) => e.stage)));
  const types = Array.from(new Set(events.flatMap((e) => e.type))).sort();

  return (
    <ChronicleClient
      events={events}
      nameToId={nameToId}
      stages={stages}
      types={types}
    />
  );
}
