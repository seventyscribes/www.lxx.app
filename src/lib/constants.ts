import { DayStudy } from "./types";

export const MOCK_DAYS: DayStudy[] = [
  {
    id: 1,
    title: "In the Beginning",
    passageRange: "Genesis 1–2",
    chapters: [
      {
        chapter: "Genesis 1",
        verses: [
          {
            number: 1,
            text: "In the beginning God created the heaven and the earth.",
          },
          {
            number: 2,
            text: "And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.",
          },
          {
            number: 3,
            text: "And God said, Let there be light: and there was light.",
          },
          {
            number: 4,
            text: "And God saw the light, that it was good: and God divided the light from the darkness.",
          },
          {
            number: 5,
            text: "And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day.",
          },
        ],
      },
      {
        chapter: "Genesis 2",
        verses: [
          {
            number: 1,
            text: "Thus the heavens and the earth were finished, and all the host of them.",
          },
          {
            number: 2,
            text: "And on the seventh day God ended his work which he had made; and he rested on the seventh day from all his work which he had made.",
          },
          {
            number: 3,
            text: "And God blessed the seventh day, and sanctified it: because that in it he had rested from all his work which God created and made.",
          },
        ],
      },
    ],
    summary:
      "The opening of Genesis establishes God as the sovereign Creator of all that exists. From chaos and darkness, He brings forth order, life, and light. This isn't just a historical account; it's a declaration of divine authority and purpose, setting the stage for everything that follows in human history.",
    reflectionPrompts: [
      "What does 'formless and void' reveal about God's power to create order?",
      "How does the phrase 'God said' change your perspective on the power of words?",
      "Where in your life do you see a need for God's light to break through darkness?",
    ],
  },
  {
    id: 2,
    title: "The Fall of Man",
    passageRange: "Genesis 3–4",
    chapters: [
      {
        chapter: "Genesis 3",
        verses: [
          {
            number: 1,
            text: "Now the serpent was more subtil than any beast of the field which the LORD God had made. And he said unto the woman, Yea, hath God said, Ye shall not eat of every tree of the garden?",
          },
          {
            number: 6,
            text: "And when the woman saw that the tree was good for food, and that it was pleasant to the eyes, and a tree to be desired to make one wise, she took of the fruit thereof, and did eat, and gave also unto her husband with her; and he did eat.",
          },
          {
            number: 7,
            text: "And the eyes of them both were opened, and they knew that they were naked; and they sewed fig leaves together, and made themselves aprons.",
          },
        ],
      },
    ],
    summary:
      "The serpent's subtle deception leads humanity into disobedience, breaking the perfect fellowship with God. This chapter reveals the origin of sin and its consequences—shame, blame, and separation. Yet even in judgment, God provides a promise of redemption through the offspring of the woman.",
    reflectionPrompts: [
      "How does the serpent's question 'Did God really say?' apply to doubts you face today?",
      "What 'fig leaves' do you use to hide your vulnerabilities from God and others?",
      "Where do you see God's mercy even in the midst of consequences?",
    ],
  },
  {
    id: 3,
    title: "Noah and the Flood",
    passageRange: "Genesis 6–9",
    chapters: [
      {
        chapter: "Genesis 6",
        verses: [
          {
            number: 5,
            text: "And GOD saw that the wickedness of man was great in the earth, and that every imagination of the thoughts of his heart was only evil continually.",
          },
          {
            number: 8,
            text: "But Noah found grace in the eyes of the LORD.",
          },
          {
            number: 9,
            text: "These are the generations of Noah: Noah was a just man and perfect in his generations, and Noah walked with God.",
          },
        ],
      },
    ],
    summary:
      "As human wickedness reaches its peak, God determines to cleanse the earth through a great flood. Noah, a righteous man who walked with God, is chosen to preserve life. The ark becomes a symbol of salvation through obedience, and the rainbow serves as God's covenant promise to never again destroy the earth by water.",
    reflectionPrompts: [
      "What does it mean to 'walk with God' in a world that has turned away from Him?",
      "How does Noah's obedience in building the ark inspire you to trust God's unusual instructions?",
      "What 'rainbows' or signs of God's faithfulness have you experienced?",
    ],
  },
];

export const FONT_SIZE_CLASSES = {
  sm: "text-sm",
  base: "text-[17px]",
  lg: "text-xl",
  xl: "text-2xl",
} as const;
