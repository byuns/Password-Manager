/**
 * Gemini API를 호출하는 공통 헬퍼 함수.
 * @param {string} prompt - 모델에 전달할 프롬프트.
 * @param {object} responseSchema - 응답으로 받을 JSON 스키마.
 * @returns {Promise<object|null>} - API 응답 JSON 객체 또는 오류 시 null.
 */

// Gemini API 호출을 위한 상수
const GEMINI_API_KEY = "";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent";

const callGeminiApi = async (prompt, responseSchema) => {
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: responseSchema
    }
  };

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (result.candidates && result.candidates.length > 0 && result.candidates[0].content && result.candidates[0].content.parts && result.candidates[0].content.parts.length > 0) {
      const json = result.candidates[0].content.parts[0].text;
      return JSON.parse(json);
    } else {
      console.error("Gemini API: No candidates found or incomplete response.");
      return null;
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return null;
  }
};


export default callGeminiApi;
