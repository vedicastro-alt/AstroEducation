import type { PlanetKey } from "../astro/constants";

export interface DashaTheme {
  title: string;
  body: (name: string) => string;
}

export const DASHA_LEARNING_THEMES: Record<PlanetKey, DashaTheme> = {
  Sun: {
    title: "A chapter of confidence and self-direction",
    body: (name) =>
      `This period tends to bring out ${name}'s sense of identity and self-belief. It's a good time to give them ownership over a project or subject, and let their confidence lead the way.`,
  },
  Moon: {
    title: "A chapter of emotional growth and imagination",
    body: (name) =>
      `This period is closely tied to ${name}'s inner world — moods, comfort, and imagination. Learning tends to go best when it feels emotionally safe, unhurried, and connected to home.`,
  },
  Mars: {
    title: "A chapter of energy and hands-on drive",
    body: (name) =>
      `This period tends to bring plenty of physical and mental energy for ${name}. Channelling it into active, hands-on learning — building, sport, competition — tends to work better than long, still tasks.`,
  },
  Mercury: {
    title: "A chapter of curiosity and quick learning",
    body: (name) =>
      `This is traditionally a wonderful period for ${name}'s intellect — communication, analysis, and quick learning are favoured. A great window for languages, reading, and new academic skills.`,
  },
  Jupiter: {
    title: "A chapter of growth, wisdom, and good guidance",
    body: (name) =>
      `This period tends to expand ${name}'s horizons — a good time for mentors, new subjects, and bigger-picture thinking. Optimism and a love of learning are especially supported now.`,
  },
  Venus: {
    title: "A chapter of creativity and connection",
    body: (name) =>
      `Harmony, beauty, and relationships tend to come to the fore for ${name} in this period. Art, music, and collaborative or social learning are especially well supported now.`,
  },
  Saturn: {
    title: "A chapter of discipline and quiet mastery",
    body: (name) =>
      `This period asks for patience, but rewards it well — it's traditionally excellent for ${name} building real, lasting discipline and depth. Progress may feel slower, but it tends to stick.`,
  },
  Rahu: {
    title: "A chapter of ambition and unconventional interests",
    body: (name) =>
      `${name} may find themselves drawn to novel, modern, or unconventional interests during this period — technology, big ambitions, or unusual subjects. Channel the restlessness into exploration rather than pressure.`,
  },
  Ketu: {
    title: "A chapter of focus and quiet introspection",
    body: (name) =>
      `This period often brings a more inward, focused energy for ${name} — less interested in the crowd, more capable of deep, independent concentration on whatever genuinely interests them.`,
  },
};
