
// Funkcja obliczająca estymowany zasięg i AVE.
// Zwiększono wariancję, aby statystyki były bardziej zróżnicowane (od 30% do 1000% normy).

export const calculateMetrics = (source: string, title: string) => {
  const lowerSource = source.toLowerCase();
  
  // 1. Bazowy mnożnik w zależności od popularności portalu
  let tierBase = 5000; 

  if (lowerSource.includes('onet') || lowerSource.includes('wp.pl') || lowerSource.includes('interia') || lowerSource.includes('businessinsider') || lowerSource.includes('wirtualnemedia') || lowerSource.includes('facebook') || lowerSource.includes('instagram')) {
    tierBase = 150000; // Giganci i Social Media
  } else if (lowerSource.includes('portal') || lowerSource.includes('wiadomosci') || lowerSource.includes('gazeta') || lowerSource.includes('money') || lowerSource.includes('marketing') || lowerSource.includes('dlahandlu') || lowerSource.includes('handlowe')) {
    tierBase = 45000; // Średnie/Branżowe serwisy
  } else if (lowerSource.includes('blog') || lowerSource.includes('forum') || lowerSource.includes('strona') || lowerSource.includes('nowosci')) {
    tierBase = 2000; // Małe strony
  }

  // 2. Ekstremalna wariancja losowa (zgodnie z życzeniem: min 30% max 1000%)
  // Generujemy mnożnik od 0.3x do 10.0x
  // Math.random() zwraca 0-1. 
  // 0.3 + (0 * 9.7) = 0.3 (30%)
  // 0.3 + (1 * 9.7) = 10.0 (1000%)
  const extremeVariance = 0.3 + (Math.random() * 9.7);

  // 3. Czynnik "klikalności" tematu
  const topicFactor = (title.length > 40 && title.length < 90) ? 1.2 : 1.0;
  
  // Dodatkowy "szum" aby liczby nie były zbyt okrągłe
  const noise = Math.floor(Math.random() * 123);

  // Obliczenie końcowego zasięgu
  const reach = Math.floor((tierBase * extremeVariance * topicFactor) + noise);
  
  // Obliczenie AVE (Advertising Value Equivalent)
  // Koszt dotarcia również ma wariancję
  const costPerReach = 0.01 + (Math.random() * 0.08); // Bardzo szeroki zakres kosztu za usera
  const ave = Math.floor(reach * costPerReach);

  return {
    reach,
    ave
  };
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('pl-PL').format(num);
};

export const formatCurrency = (num: number): string => {
  return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 }).format(num);
};
