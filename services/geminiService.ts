import { GoogleGenAI } from "@google/genai";
import { NewsItem } from "../types";
import { calculateMetrics } from "../utils";

// Inicjalizacja klienta Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchNewsReport = async (): Promise<NewsItem[]> => {
  try {
    const model = 'gemini-2.5-flash';
    
    // Obliczanie zakresu dat (Ostatnie 30 dni)
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const todayStr = today.toISOString().split('T')[0];
    const limitStr = thirtyDaysAgo.toISOString().split('T')[0];

    // Zoptymalizowany prompt z bardzo silnym naciskiem na ilość
    // Fixed: Removed unescaped backticks in the prompt string that were causing syntax errors
    const prompt = `
      WYKONAJ ZADANIE JAKO: Doświadczony Analityk Mediów i Rynku FMCG.

      KONTEKST CZASOWY:
      Dzisiaj jest: ${todayStr}
      Analizowany okres: Ostatnie 30 dni (od ${limitStr} do ${todayStr}).

      ZADANIE GŁÓWNE:
      Przeprowadź głęboki research i wygeneruj listę MINIMUM 30 NEWSÓW (artykułów, wzmianek, komunikatów) dotyczących poniższych marek:
      1. DAWTONA
      2. DEVELEY
      3. HEINZ
      4. KNORR
      5. WINIARY
      6. MADERO (Marka własna Biedronki)

      KRYTYCZNE WYMAGANIA (MUST HAVE):
      1. **ILOŚĆ**: Musisz dostarczyć po MINIMUM 5 unikalnych newsów dla KAŻDEJ z 6 firm. Łącznie raport musi zawierać od 30 do 35 pozycji. NIE skracaj listy.
      2. **DATA**: Każdy news musi pochodzić z podanego zakresu dat.
      3. **STRATEGIA WYSZUKIWANIA (Jeśli brakuje "dużych" newsów):**
         - Jeśli dla danej marki nie ma głośnych artykułów PR-owych, SZUKAJ DALEJ.
         - Uwzględnij aktualne promocje w sieciach handlowych (np. "Ketchup Heinz w gazetce Biedronki").
         - Uwzględnij wpisy na blogach kulinarnych i portalach konsumenckich z tego miesiąca.
         - Uwzględnij nowości produktowe na półkach.
         - Uwzględnij raporty rynkowe, w których marka jest choćby wspomniana.
      
      ZASADY DOTYCZĄCE LINKÓW:
      - Linki muszą być prawdziwe i działające.
      - Jeśli nie możesz znaleźć bezpośredniego linku do konkretnego artykułu, podaj link do strony głównej źródła (np. portalspozywczy.pl) lub oficjalnej strony marki/profilu FB, gdzie taka informacja mogłaby się znaleźć.
      
      Format wyjściowy to CZYSTY JSON (bez znaczników markdown json):
      [
        {
          "title": "Konkretny tytuł newsa",
          "summary": "Krótkie streszczenie (max 2 zdania).",
          "url": "https://...",
          "source": "Nazwa portalu/Źródło",
          "company": "Jedna z: Dawtona, Develey, Heinz, Knorr, Winiary, Madero",
          "date": "RRRR-MM-DD"
        }
      ]
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // Fixed: Removed maxOutputTokens to prevent response blocking when thinkingBudget is not set (default model behavior preferred)
        systemInstruction: "Jesteś precyzyjnym silnikiem wyszukiwania newsów. Twoim priorytetem jest znalezienie dużej liczby pasujących wyników (minimum 30) i sformatowanie ich jako JSON."
      },
    });

    const textResponse = response.text;
    
    if (!textResponse) {
      throw new Error("Brak odpowiedzi od AI.");
    }

    // Cleaning the response to ensure we get valid JSON
    let cleanJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const firstBracket = cleanJson.indexOf('[');
    const lastBracket = cleanJson.lastIndexOf(']');
    
    if (firstBracket !== -1 && lastBracket !== -1) {
      cleanJson = cleanJson.substring(firstBracket, lastBracket + 1);
    }

    let parsedData;
    try {
        parsedData = JSON.parse(cleanJson);
    } catch (e) {
        console.error("Błąd parsowania JSON:", e);
        console.log("Otrzymany tekst:", cleanJson);
        throw new Error("Błąd przetwarzania danych z AI. Spróbuj ponownie.");
    }

    if (!Array.isArray(parsedData)) {
       throw new Error("Otrzymane dane nie są listą.");
    }

    // Mapujemy dane z API na naszą strukturę
    const processedNews: NewsItem[] = parsedData.map((item: any, index: number) => {
      // Walidacja URL
      let safeUrl = item.url || "";
      if (safeUrl && !safeUrl.startsWith('http')) {
        safeUrl = `https://${safeUrl}`;
      }
      // Fallback dla pustych URLi - wyszukiwanie Google
      if (!safeUrl || safeUrl.length < 5) {
          safeUrl = `https://www.google.com/search?q=${encodeURIComponent(item.title + " " + item.company)}`;
      }
      
      // Normalizacja nazwy firmy
      let company = "Inne";
      const rawCompany = (item.company || "").toUpperCase();
      
      if (rawCompany.includes("DAWTONA")) company = "Dawtona";
      else if (rawCompany.includes("DEVELEY")) company = "Develey";
      else if (rawCompany.includes("HEINZ")) company = "Heinz";
      else if (rawCompany.includes("KNORR")) company = "Knorr";
      else if (rawCompany.includes("WINIARY")) company = "Winiary";
      else if (rawCompany.includes("MADERO")) company = "Madero";

      // Obliczanie metryk
      const metrics = calculateMetrics(item.source || "Internet", item.title || "");

      return {
        id: `news-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: item.title || "Informacja rynkowa",
        summary: item.summary || "Brak szczegółowego opisu.",
        url: safeUrl,
        source: item.source || "Internet",
        company: company as any,
        date: item.date || todayStr,
        metrics: metrics
      };
    });

    return processedNews;

  } catch (error) {
    console.error("Błąd pobierania danych:", error);
    throw new Error("Nie udało się pobrać raportu. Spróbuj ponownie za chwilę.");
  }
};