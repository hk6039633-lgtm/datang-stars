import { getCharacters, getEvents, getBookTimeline } from "../lib/data";
import GraphPageClient from "../components/GraphPageClient";

export default async function GraphPage() {
  const [characters, events, bookEvents] = await Promise.all([
    getCharacters(),
    getEvents(),
    getBookTimeline(),
  ]);

  return <GraphPageClient characters={characters} events={events} bookEvents={bookEvents} />;
}
