
import React from 'react';
import { DayStudy } from './types';

export const MOCK_DAYS: DayStudy[] = [
  {
    id: 1,
    title: "In the Beginning",
    passageRange: "Genesis 1–2",
    chapters: [
      {
        chapter: "Genesis 1",
        verses: [
          { number: 1, text: "In the beginning God created the heaven and the earth." },
          { number: 2, text: "And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters." },
          { number: 3, text: "And God said, Let there be light: and there was light." }
        ]
      }
    ],
    summary: "The opening of Genesis establishes God as the sovereign Creator of all that exists. From chaos and darkness, He brings forth order, life, and light. This isn't just a historical account; it's a declaration of divine authority and purpose, setting the stage for everything that follows in human history.",
    reflectionPrompts: [
      "What does 'formless and void' reveal about God's power to create order?",
      "How does the phrase 'God said' change your perspective on the power of words?",
      "Where in your life do you see a need for God's light to break through darkness?"
    ]
  },
  {
    id: 12,
    title: "Joseph Betrayed",
    passageRange: "Genesis 37–40",
    chapters: [
      {
        chapter: "Genesis 37",
        verses: [
          { number: 3, text: "Now Israel loved Joseph more than all his children, because he was the son of his old age: and he made him a coat of many colours." },
          { number: 4, text: "And when his brethren saw that their father loved him more than all his brethren, they hated him, and could not speak peaceably unto him." }
        ]
      }
    ],
    summary: "Favoritism and jealousy tear a family apart as Joseph's brothers sell him into slavery. Despite the betrayal, the narrative subtly points toward a larger plan. Joseph's journey into Egypt is the beginning of a long and difficult trial that will ultimately lead to salvation for many.",
    reflectionPrompts: [
      "Joseph was favored by his father but hated by his brothers. How do you handle jealousy from others?",
      "Even in the pit, God was working. Can you identify a 'pit' in your life where God was present?",
      "What does it mean to 'speak peaceably' even when we feel hurt?"
    ]
  }
];

export const ICONS = {
  Book: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-0.5-5z"/><path d="M6.5 17.5c-1.38 0-2.5 1.12-2.5 2.5"/><path d="M12 6h5"/><path d="M12 10h5"/><path d="M12 14h5"/></svg>
  ),
  Path: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m20 10-8 8-4-4"/></svg>
  ),
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  ),
  ChevronLeft: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
  ),
  ChevronRight: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
  )
};
