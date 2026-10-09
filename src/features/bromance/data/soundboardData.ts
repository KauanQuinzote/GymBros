export type SoundboardCategory = 'pesado' | 'frango' | 'motivacao' | 'classicos';

export interface SoundboardMemeItem {
  id: string;
  name: string;
  url: string;
  category: SoundboardCategory;
  title?: string;
  audio_url?: string;
  nudge_text?: string;
}

export const SOUNDBOARD_CATEGORIES: { id: SoundboardCategory | 'todos'; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'pesado', label: 'Hardcore / Maromba' },
  { id: 'frango', label: 'Zoeira / Frango' },
  { id: 'motivacao', label: 'Motivação / Glória' },
  { id: 'classicos', label: 'Clássicos / Efeitos' },
];

export const MYINSTANTS_AUDIOS: Record<
  string,
  { name: string; url: string; category: SoundboardCategory }
> = {
  "fahhhhhhhhhhhhhhhhhhhbro-363": {
    name: "FAHHHH BRO (Grito)",
    url: "https://www.myinstants.com/media/sounds/fahhhhhhhhhhhhhhhhhhhbro_YWCIQ4H.mp3",
    category: "pesado"
  },
  "aura-ego-8025": {
    name: "Aura + Ego (Phonk)",
    url: "https://www.myinstants.com/media/sounds/aura-ego.mp3",
    category: "pesado"
  },
  "yara-yara-phonk-16631": {
    name: "Yara Yara Phonk",
    url: "https://www.myinstants.com/media/sounds/yara-yara-phonk.mp3",
    category: "pesado"
  },
  "tu-e-um-beta-46252": {
    name: "TU É UM BETA",
    url: "https://www.myinstants.com/media/sounds/tu-e-um-beta.mp3",
    category: "frango"
  },
  "snore-mimimimimimi-76562": {
    name: "Dormindo no Treino (Mimimi)",
    url: "https://www.myinstants.com/media/sounds/snore-mimimimimimi.mp3",
    category: "frango"
  },
  "acaba-pelo-amor-de-deus-4549": {
    name: "Acaba pelo amor de Deus",
    url: "https://www.myinstants.com/media/sounds/aud-20200920-wa0045.mp3",
    category: "frango"
  },
  "acorda-boi-16514": {
    name: "Acorda Boi!",
    url: "https://www.myinstants.com/media/sounds/acorda_boi.mp3",
    category: "frango"
  },
  "ai-cachorro-estourado-24957": {
    name: "AI CACHORRO ESTOURADO",
    url: "https://www.myinstants.com/media/sounds/ai-cachorro-estourado.mp3",
    category: "pesado"
  },
  "ai-chega-chega-estourado-74825": {
    name: "Ai chega chega!",
    url: "https://www.myinstants.com/media/sounds/ai-chega-chega-estourado.mp3",
    category: "frango"
  },
  "vai-na-paz-irmao-91945": {
    name: "Vai na paz irmão",
    url: "https://www.myinstants.com/media/sounds/espera-eu-chegar_KHcHu4q.mp3",
    category: "motivacao"
  },
  "voce-era-o-meu-duo-54756": {
    name: "Você era o meu duo...",
    url: "https://www.myinstants.com/media/sounds/voce-era-o-meu-duo.mp3",
    category: "motivacao"
  },
  "olha-a-mensagem": {
    name: "Olha a mensagem",
    url: "https://www.myinstants.com/media/sounds/olha-a-mensagem.mp3",
    category: "classicos"
  },
  "uma-ameaca-foi-detectada": {
    name: "Ameaça Detectada (Avast)",
    url: "https://www.myinstants.com/media/sounds/avast-ameaca-detectada.mp3",
    category: "classicos"
  },
  "999-social-credit-siren-82729": {
    name: "Sirene Alerta Máximo",
    url: "https://www.myinstants.com/media/sounds/999-social-credit-siren.mp3",
    category: "classicos"
  },
  "punch-sound-86161": {
    name: "Soco Pancada SFX",
    url: "https://www.myinstants.com/media/sounds/punch-gaming-sound-effect-hd_RzlG1GE.mp3",
    category: "classicos"
  },
  "spongebob-fail-11236": {
    name: "SpongeBob Falha Épica",
    url: "https://www.myinstants.com/media/sounds/spongebob-fail.mp3",
    category: "frango"
  },
  "peao-todo-tatuado-16998": {
    name: "PEÃO TODO TATUADO",
    url: "https://www.myinstants.com/media/sounds/peao-todo-tatuado.mp3",
    category: "pesado"
  },
  "risada-quico-chaves-4668": {
    name: "Risada Quico (Chaves)",
    url: "https://www.myinstants.com/media/sounds/risada_quico.mp3",
    category: "classicos"
  },
  "ai-chaves-69169": {
    name: "Ai Chaves!",
    url: "https://www.myinstants.com/media/sounds/ai-chaves_xmlpPuf.mp3",
    category: "classicos"
  },
  "tema-triste-chaves-64362": {
    name: "Tema Triste Chaves",
    url: "https://www.myinstants.com/media/sounds/tema-triste-chaves.mp3",
    category: "frango"
  }
};

export const MEME_SOUNDBOARD: SoundboardMemeItem[] = Object.entries(MYINSTANTS_AUDIOS).map(
  ([id, item]) => ({
    id,
    name: item.name,
    title: item.name,
    url: item.url,
    audio_url: item.url,
    nudge_text: item.name,
    category: item.category,
  })
);