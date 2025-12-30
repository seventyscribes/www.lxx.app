import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// Sample Bible days data (first 3 days - expand with full 365 days later)
const bibleDays = [
  {
    dayNumber: 1,
    title: "In the Beginning",
    passageReference: "Genesis 1–2",
    verses: [
      { book: "Genesis", chapter: 1, verse: 1, text: "In the beginning God created the heaven and the earth." },
      { book: "Genesis", chapter: 1, verse: 2, text: "And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters." },
      { book: "Genesis", chapter: 1, verse: 3, text: "And God said, Let there be light: and there was light." },
      { book: "Genesis", chapter: 1, verse: 4, text: "And God saw the light, that it was good: and God divided the light from the darkness." },
      { book: "Genesis", chapter: 1, verse: 5, text: "And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day." },
      { book: "Genesis", chapter: 2, verse: 1, text: "Thus the heavens and the earth were finished, and all the host of them." },
      { book: "Genesis", chapter: 2, verse: 2, text: "And on the seventh day God ended his work which he had made; and he rested on the seventh day from all his work which he had made." },
      { book: "Genesis", chapter: 2, verse: 3, text: "And God blessed the seventh day, and sanctified it: because that in it he had rested from all his work which God created and made." },
    ],
    modernSummary: "The opening of Genesis establishes God as the sovereign Creator of all that exists. From chaos and darkness, He brings forth order, life, and light. This isn't just a historical account; it's a declaration of divine authority and purpose, setting the stage for everything that follows in human history.",
    reflectionPrompts: [
      "What does 'formless and void' reveal about God's power to create order?",
      "How does the phrase 'God said' change your perspective on the power of words?",
      "Where in your life do you see a need for God's light to break through darkness?",
    ],
  },
  {
    dayNumber: 2,
    title: "The Fall of Man",
    passageReference: "Genesis 3–4",
    verses: [
      { book: "Genesis", chapter: 3, verse: 1, text: "Now the serpent was more subtil than any beast of the field which the LORD God had made. And he said unto the woman, Yea, hath God said, Ye shall not eat of every tree of the garden?" },
      { book: "Genesis", chapter: 3, verse: 6, text: "And when the woman saw that the tree was good for food, and that it was pleasant to the eyes, and a tree to be desired to make one wise, she took of the fruit thereof, and did eat, and gave also unto her husband with her; and he did eat." },
      { book: "Genesis", chapter: 3, verse: 7, text: "And the eyes of them both were opened, and they knew that they were naked; and they sewed fig leaves together, and made themselves aprons." },
    ],
    modernSummary: "The serpent's subtle deception leads humanity into disobedience, breaking the perfect fellowship with God. This chapter reveals the origin of sin and its consequences—shame, blame, and separation. Yet even in judgment, God provides a promise of redemption through the offspring of the woman.",
    reflectionPrompts: [
      "How does the serpent's question 'Did God really say?' apply to doubts you face today?",
      "What 'fig leaves' do you use to hide your vulnerabilities from God and others?",
      "Where do you see God's mercy even in the midst of consequences?",
    ],
  },
  {
    dayNumber: 3,
    title: "Noah and the Flood",
    passageReference: "Genesis 6–9",
    verses: [
      { book: "Genesis", chapter: 6, verse: 5, text: "And GOD saw that the wickedness of man was great in the earth, and that every imagination of the thoughts of his heart was only evil continually." },
      { book: "Genesis", chapter: 6, verse: 8, text: "But Noah found grace in the eyes of the LORD." },
      { book: "Genesis", chapter: 6, verse: 9, text: "These are the generations of Noah: Noah was a just man and perfect in his generations, and Noah walked with God." },
    ],
    modernSummary: "As human wickedness reaches its peak, God determines to cleanse the earth through a great flood. Noah, a righteous man who walked with God, is chosen to preserve life. The ark becomes a symbol of salvation through obedience, and the rainbow serves as God's covenant promise to never again destroy the earth by water.",
    reflectionPrompts: [
      "What does it mean to 'walk with God' in a world that has turned away from Him?",
      "How does Noah's obedience in building the ark inspire you to trust God's unusual instructions?",
      "What 'rainbows' or signs of God's faithfulness have you experienced?",
    ],
  },
];

async function main() {
  console.log("🌱 Starting database seed...");

  // Seed Bible days
  console.log("📖 Seeding Bible days...");
  for (const day of bibleDays) {
    await prisma.bibleDay.upsert({
      where: { dayNumber: day.dayNumber },
      update: day,
      create: day,
    });
  }
  console.log(`✅ Seeded ${bibleDays.length} Bible days`);

  // Create a sample dev user
  console.log("👤 Creating sample user...");
  const trialEndDate = new Date();
  trialEndDate.setDate(trialEndDate.getDate() + 7);

  const passwordHash = await bcrypt.hash("password123", 12);

  const user = await prisma.user.upsert({
    where: { email: "dev@lxx.app" },
    update: {},
    create: {
      email: "dev@lxx.app",
      name: "Dev User",
      passwordHash,
      trialEndDate,
    },
  });

  // Create user progress
  await prisma.userProgress.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      currentDay: 1,
      completedDayIds: [],
      streakCount: 0,
      longestStreak: 0,
    },
  });

  // Create user settings
  await prisma.userSettings.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      fontSize: "base",
      fontFamily: "serif",
      showSummaries: true,
    },
  });

  console.log("✅ Sample user created: dev@lxx.app / password123");
  console.log("🎉 Seed completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
