import { NextRequest, NextResponse } from 'next/server';
import { geminiModel } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { countryA, countryB, language } = await req.json();

    if (!countryA || !countryB) {
      return NextResponse.json({ error: 'Missing countries' }, { status: 400 });
    }

    const langCode = language || 'fr';

    /* const prompt = `
   You are a geopolitical simulator based on real recent events.
   User Selection: **${countryA}** vs **${countryB}**.
   Language: **${langCode}**.

   Goal: Generate a step-by-step war timeline.

   Special Effects Tags:
   - Insert "[##EXPLOSION##]" in the text where a bombing, missile strike, or major attack occurs.
   - Insert "[##ALERT##]" where a critical warning or massive mobilization occurs.
   - Insert "[##GLITCH##]" for cyber attacks or communication breakdown.
   - Insert "[##STATIC##]" for radio interference or jamming.

   1. **Inciting Event**: What specific event caused the war? (Date, Headline, Brief Article).
   2. **Timeline**: 4 distinct phases/days of the conflict.
      - For each phase, provide the "Conflict Day" (e.g., Day 1, Day 45, etc.).
      - Provide a short narrative for the **Aggressor** (Orange).
      - Provide a short narrative for the **Defender** (Blue).
   3. **Global Impact**: Final result.

   Output JSON only:
   {
     "inciting_event": {
       "date": "YYYY-MM-DD",
       "headline": "...",
       "content": "Short article text..."
     },
     "aggressor_name": "Aggressor Country Name",
     "defender_name": "Defender Country Name",
     "timeline": [
       { 
         "day": "Day 1", 
         "aggressor_text": "...", 
         "defender_text": "..." 
       },
       { 
         "day": "Day 12", 
         "aggressor_text": "...", 
         "defender_text": "..." 
       },
       { 
         "day": "Day 45", 
         "aggressor_text": "...", 
         "defender_text": "..." 
       },
       { 
         "day": "Day 113", 
         "aggressor_text": "...", 
         "defender_text": "..." 
       }
     ],
     "bilan_mondial": "..."
   }
 `;*/


    const prompt = `
    You are a high-level geopolitical AI simulator. It is currently January 2026.
      
      CONTEXT FOR 2026: 
      - USA: New administration (Trump 2.0) focusing on "America First", tensions over Greenland, and interventionism in South America.
      - Venezuela: Major crisis following the capture of Maduro and US military operations.
      - Middle East: Israel-Lebanon tensions remain high despite disarmament efforts.
      - Europe/Arctic: Dispute over Arctic resources and the sovereignty of Greenland.
      - Asia: Permanent naval tension between China and Taiwan.

      User Selection: **${countryA}** vs **${countryB}**.
      Language: **${langCode}**.

      Goal: Generate a credible war timeline based on these 2026 real-world tensions.

      1. **Inciting Event**: Identify a REAL tension existing in Jan 2026 between these countries. Create a "Breaking News" headline and a brief factual article that triggers the escalation.
      
      2. **Dynamic Timeline**: 
         - Generate 4 phases. 
         - The "Day" must be dynamic (e.g., Day 1, Day 14, Day 32, Day 60).
         - For each day, provide two distinct viewpoints:
           - **Aggressor (Orange)**: Tactical, aggressive, focused on national pride.
           - **Defender (Blue)**: Defensive, focused on survival and international appeal.
         - **Special Effects Tags**: Use [##EXPLOSION##], [##ALERT##], [##GLITCH##], [##STATIC##] to punctuate the text.

      3. **Global Impact**: A chilling summary of the human and economic cost.

      Output JSON only:
      {
        "inciting_event": {
          "date": "2026-01-15",
          "headline": "...",
          "content": "..."
        },
        "aggressor_name": "${countryA}",
        "defender_name": "${countryB}",
        "timeline": [
          { "day": "Day 1", "aggressor_text": "...", "defender_text": "..." },
          { "day": "Day X", "aggressor_text": "...", "defender_text": "..." },
          { "day": "Day Y", "aggressor_text": "...", "defender_text": "..." },
          { "day": "Day Z", "aggressor_text": "...", "defender_text": "..." }
        ],
        "bilan_mondial": "..."
      }
    `;



    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
      const json = JSON.parse(cleanedText);
      return NextResponse.json(json);
    } catch (e) {
      console.error("Failed to parse JSON from AI", text);
      return NextResponse.json({ error: "Failed to parse simulation result" }, { status: 500 });
    }

  } catch (error) {
    console.error("Simulation error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
