import axios from "axios";

export const validateWorklogWithAI = async ({
  workSummary,
  blockers,
  hoursWorked,
  meetingsCount,
  tasks,
}) => {
  try {
    const taskText =
      tasks?.length > 0
        ? tasks
            .map(
              (task, index) =>
                `${index + 1}. ${task.title} | Status: ${task.status} | Priority: ${task.priority}`
            )
            .join("\n")
        : "No related tasks provided.";

    const messages = [
      {
        role: "system",
        content: `
You are an AI workplace productivity analyst.

Analyze employee daily worklog honesty and productivity quality.

Return ONLY valid JSON:

{
  "productivityConfidence": number,
  "fakeReportRisk": "low" | "medium" | "high",
  "ailnsight": "short professional insight"
}

Rules:
- productivityConfidence must be 0 to 100.
- fakeReportRisk should be based on mismatch between tasks and work summary.
- Short vague updates should have low confidence.
- Detailed measurable updates should have high confidence.
- High hours with vague summary should increase fakeReportRisk.
- Many meetings should reduce productivity confidence slightly.
- Keep aiInsight under 25 words.
`
      },
      {
        role: "user",
        content: `
Work Summary:
${workSummary}

Blockers:
${blockers || "None"}

Hours Worked:
${hoursWorked}

Meetings Count:
${meetingsCount}

Related Tasks:
${taskText}
`
      }
    ];

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages,
        temperature: 0.2,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiText = response.data.choices[0].message.content;

    const jsonMatch = aiText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("AI did not return JSON");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      productivityConfidence: Number(parsed.productivityConfidence || 0),
      fakeReportRisk: parsed.fakeReportRisk || "medium",
      ailnsight: parsed.ailnsight || "AI could not generate insight.",
    };
  } catch (error) {
    console.log("AI validation failed:", error.message);

    return null;
  }
};