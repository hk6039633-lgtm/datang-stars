import { Metadata } from "next";
import { getCharacters, getEvents, getBookTimeline } from "../lib/data";
import GalaxyExplorer from "../components/GalaxyExplorer";

export const metadata: Metadata = {
  title: "大唐星河探索 | 唐局",
  description: "以黑金星河为底，探索大唐 890 位历史人物的星系总览、主星展开与关系网络。",
};

export default async function GalaxyPage() {
  const [characters, events, bookEvents] = await Promise.all([
    getCharacters(),
    getEvents(),
    getBookTimeline(),
  ]);

  return (
    <main className="min-h-screen bg-black text-amber-50">
      <GalaxyExplorer characters={characters} events={events} bookEvents={bookEvents} />
    </main>
  );
}
