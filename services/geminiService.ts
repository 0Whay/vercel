import { GoogleGenAI } from "@google/genai";
import { NewsItem, TARGET_BRANDS } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateMarketReport = async (): Promise<NewsItem[]> => {
  const model = "gemini-2.5-flash";
  
  const brandList = TARGET_BRANDS.join(", ");
  
  const prompt = `
    Jesteś ekspertem od monitoringu mediów i PR w Polsce.
    
    Twoim zadaniem jest znalezienie najnowszych artykułów i wzmianek (biznes, marketing, produkty, testy konsumenckie) z OSTATNIEGO MIESIACA (30 dni) dla marek:
    ${brandList}.

    Użyj narzędzia Google Search, aby znaleźć aktualne i działające linki.

    WYMAGANIA KRYTYCZNE:
    1. ZASIEG CZASOWY: Bądź rygorystyczny. Szukaj newsów TYLKO z ostatnich 30 dni. Sprawdź dokładnie datę publikacji.
    2. POKRYCIE MAREK: Znajdź MINIMUM 1 news dla KAŻDEJ z wymienionych marek. To priorytet. Jeśli marka jest mało aktywna, szukaj mniejszych wzmianek w portalach branżowych (wiadomoscihandlowe, portalspozywczy) lub blogach kulinarnych. Każda marka musi mieć reprezentację.
    3. LICZBY I SZACUNKI: 
       - "estimatedReach": Zasięg musi być REALISTYCZNY i KONSERWATYWNY. Zmniejsz typowe szacunki marketingowe o 50%.
       - PRECYZJA LICZB: Nie zaokrąglaj mocno liczb. Podawaj dokładne szacunki (np. 41 235 użytkowników zamiast 40 000; 1 245 PLN zamiast 1 200 PLN).
    4. LINKI: Upewnij się, że linki są poprawne i nie zwracają błędu 404.

    FORMATOWANIE:
    Zwróć TYLKO czysty JSON w bloku kodu markdown (json).
    
    Struktura JSON (tablica obiektów):
    [
      {
        "id": "unikalny_string",
        "brand": "Nazwa Marki",
        "title": "Tytuł Artykułu",
        "date": "RRRR-MM-DD",
        "url": "link_do_artykulu",
        "summary": "Krótkie podsumowanie",
        "estimatedReach": 41235,
        "adEquivalentValue": 1245,
        "isTopNews": boolean (oznacz true dla 5 najważniejszych newsów z całego zbioru)
      }
    ]

    Nie dodawaj żadnego tekstu przed ani po bloku JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    
    // Extract JSON from markdown code block
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    
    if (jsonMatch && jsonMatch[1]) {
      const parsedData: NewsItem[] = JSON.parse(jsonMatch[1]);
      return parsedData;
    } else {
      console.error("Failed to parse JSON from Gemini response", text);
      // Fallback: try to parse the whole text if it missed code blocks
      try {
        return JSON.parse(text) as NewsItem[];
      } catch (e) {
        throw new Error("Otrzymano nieprawidłowy format danych od AI.");
      }
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};