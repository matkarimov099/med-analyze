import diabetesKnowledgeBase from "../data/diabets_uz.json";

// JSON tuzilishi uchun interfeyslar
interface Condition {
  [key: string]: string | number | string[];
}

interface Rule {
  QoidaID: string;
  Tavsif: string;
  Shart?: Condition;
  Shartlar?: Array<{ [key: string]: string | number | string[] }>;
  Harakat?: string;
}

// Foydalanuvchi ma'lumotlari uchun interfeys
export interface UserData {
  firstName: string;
  lastName: string;
  Yosh: number;
  Simptomlar: string[];
  OchQoringaPlazmaGlyukoza: number;
  HbA1c: number;
  TasodifiyPlazmaGlyukoza: number | null;
  Homiladorlik: "Ha" | "Yo‘q";
  BMI: number;
  XavfOmillari: string[];
  SimptomlarSoni: number;
}

// Natija interfeysi
export interface Result {
  Qoida: string;
  Tavsif: string;
  Harakat: string;
}

// Simptomlarni sanash
export function countSymptoms(
  userSymptoms: string[],
  symptomsList: string[],
): number {
  const count = userSymptoms.reduce((acc, symptom) => {
    return (
      acc +
      (symptomsList.some(
        (s) => s.toLowerCase() === symptom.trim().toLowerCase(),
      )
        ? 1
        : 0)
    );
  }, 0);
  console.debug(`Debug: Hisoblangan simptomlar soni = ${count}`);
  return count;
}

// Shartni baholash
export function evaluateCondition(
  userData: Partial<UserData>,
  condition: Condition,
): boolean {
  // Bo‘sh condition tekshiruvi
  if (Object.keys(condition).length === 0) {
    console.debug("Debug: Condition ob’ekti bo‘sh");
    return false;
  }

  for (const [key, value] of Object.entries(condition)) {
    if (!(key in userData)) {
      console.debug(`Debug: ${key} foydalanuvchi ma’lumotlarida yo‘q`);
      return false;
    }
    const userValue = userData[key as keyof UserData];
    console.debug(
      `Debug: ${key} uchun foydalanuvchi qiymati = ${userValue}, shart = ${value}`,
    );

    if (typeof value === "string") {
      // Birliklarni olib tashlash
      const cleanValue = value.replace("%", "").replace("mg/dL", "").trim();

      // "≥" sharti
      if (cleanValue.startsWith("≥")) {
        const threshold = parseFloat(cleanValue.slice(1).trim());
        if (
          userValue == null ||
          typeof userValue !== "number" ||
          userValue < threshold
        ) {
          console.debug(
            `Debug: ${userValue} < ${threshold} sharti bajarilmadi`,
          );
          return false;
        }
        console.debug(`Debug: ${userValue} >= ${threshold} sharti qondirildi`);
        return true;
      }

      // "–" diapazon sharti
      else if (cleanValue.includes("–")) {
        const [low, high] = cleanValue.split("–").map((v) => parseFloat(v));
        if (
          userValue == null ||
          typeof userValue !== "number" ||
          userValue < low ||
          userValue > high
        ) {
          console.debug(`Debug: ${userValue} ${low}–${high} oralig‘ida emas`);
          return false;
        }
        console.debug(`Debug: ${userValue} ${low}–${high} oralig‘ida`);
        return true;
      }

      // "<" sharti
      else if (cleanValue.startsWith("<")) {
        const threshold = parseFloat(cleanValue.slice(1).trim());
        if (
          userValue == null ||
          typeof userValue !== "number" ||
          userValue >= threshold
        ) {
          console.debug(
            `Debug: ${userValue} < ${threshold} sharti bajarilmadi`,
          );
          return false;
        }
        console.debug(`Debug: ${userValue} < ${threshold} sharti qondirildi`);
        return true;
      }

      // To‘g‘ridan-to‘g‘ri tenglik (satr yoki ro‘yxat uchun)
      else if (key === "Simptomlar") {
        if (!Array.isArray(userValue) || !userValue.includes(value)) {
          console.debug(`Debug: ${userValue} ichida ${value} yo‘q`);
          return false;
        }
        console.debug(`Debug: ${userValue} ichida ${value} topildi`);
        return true;
      } else if (userValue !== value) {
        console.debug(`Debug: ${userValue} != ${value}`);
        return false;
      }
      console.debug(`Debug: ${userValue} == ${value} sharti qondirildi`);
      return true;
    } else if (Array.isArray(value)) {
      if (
        !Array.isArray(userValue) ||
        !value.every((v) => userValue.includes(v))
      ) {
        console.debug(`Debug: ${userValue} ichida ${value} to‘liq yo‘q`);
        return false;
      }
      console.debug(`Debug: ${userValue} ichida ${value} topildi`);
      return true;
    } else {
      {
        if (userValue !== value) {
          console.debug(`Debug: ${userValue} != ${value}`);
          return false;
        }
        {
          console.debug(`Debug: ${userValue} == ${value} sharti qondirildi`);
          return true;
        }
      }
    }
  }
  return false;
}

// Qoidalarni qo‘llash
export function applyRules(userData: UserData, rules: Rule[]): Result[] {
  const results: Result[] = [];
  for (const rule of rules) {
    const ruleId = rule.QoidaID;
    const description = rule.Tavsif;
    console.debug(`Debug: Qoida ${ruleId} tekshirilmoqda`);

    if (rule.Shart) {
      const condition = rule.Shart;
      if (evaluateCondition(userData, condition)) {
        results.push({
          Qoida: ruleId,
          Tavsif: description,
          Harakat: rule.Harakat ?? "Noma'lum harakat",
        });
      }
    } else if (rule.Shartlar) {
      for (const condition of rule.Shartlar) {
        for (const [key, value] of Object.entries(condition)) {
          if (key !== "Harakat") {
            const cleanValue =
              typeof value === "string" ? value.split(" (")[0] : value;
            if (
              evaluateCondition(
                { [key]: userData[key as keyof UserData] ?? 0 },
                { [key]: cleanValue },
              )
            ) {
              results.push({
                Qoida: ruleId,
                Tavsif: description,
                Harakat: (condition.Harakat as string) ?? "Noma'lum harakat",
              });
            }
          }
        }
      }
    }
  }
  return results;
}

// Yakuniy tavsiya
export function getFinalRecommendation(results: Result[]): string {
  if (results.some((r) => r.Harakat.includes("Diabet tashxisi"))) {
    return "Ehtimol 2-turdagi diabet. Tasdiqlash va davolash uchun shifokorga murojaat qiling.";
  } else if (results.some((r) => r.Harakat.includes("Prediabet tashxisi"))) {
    return "Prediabet aniqlandi. Turmush tarzi o‘zgarishlari va keyingi testlardan o‘tishni ko‘rib chiqing.";
  } else if (
    results.some(
      (r) =>
        r.Harakat.includes("Favqulodda") ||
        r.Harakat.toLowerCase().includes("shoshilinch"),
    )
  ) {
    return "Favqulodda holat aniqlandi. Darhol tibbiy yordamga murojaat qiling.";
  } else {
    return "Diabet uchun yetarli dalil yo‘q. Simptomlar va xavf omillarini kuzatib boring.";
  }
}

// JSON’dan qoidalarni olish
export const rules: Rule[] = diabetesKnowledgeBase.DiabetniAniqlashBilimlari
  .Qoidalar as Rule[];
export const symptomsList: string[] =
  diabetesKnowledgeBase.DiabetniAniqlashBilimlari.Faktlar.Simptomlar.Umumiy;
export const riskFactorsList: string[] = [
  ...diabetesKnowledgeBase.DiabetniAniqlashBilimlari.Faktlar.XavfOmillari
    .Demografik,
  ...diabetesKnowledgeBase.DiabetniAniqlashBilimlari.Faktlar.XavfOmillari
    .TurmushTarzi,
  ...diabetesKnowledgeBase.DiabetniAniqlashBilimlari.Faktlar.XavfOmillari
    .Tibbiy,
];
