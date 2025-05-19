import { useContext, useState } from "react";
import { AuthContext } from "@/providers/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  countSymptoms,
  applyRules,
  getFinalRecommendation,
  rules,
  symptomsList,
  riskFactorsList,
  type UserData,
} from "@/services/diabet-logic";
import { toast } from "sonner";
import { useDisclosure } from "@/hooks/use-disclosure";
import { DiabetResult } from "@/components/analyze/DiabetResult.tsx";
import jsPDF from "jspdf";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export interface Result {
  Qoida: string;
  Tavsif: string;
  Harakat: string;
  Yosh?: number;
  OchQoringaPlazmaGlyukoza?: number;
  HbA1c?: number;
  BMI?: number;
  Homiladorlik?: string;
  SimptomlarSoni?: number;
  Simptomlar?: string[];
  XavfOmillari?: string[];
}

// Forma sxemasi
const formSchema = z.object({
  firstName: z
    .string()
    .min(2, "Ism kamida 2 harfdan iborat bo‘lishi kerak")
    .max(50, "Ism juda uzun"),
  lastName: z
    .string()
    .min(2, "Familiya kamida 2 harfdan iborat bo‘lishi kerak")
    .max(50, "Familiya juda uzun"),
  age: z
    .number()
    .min(0, "Yosh 0 yoki undan katta bo‘lishi kerak")
    .max(120, "Yosh real bo‘lishi kerak"),
  symptoms: z
    .array(z.string())
    .min(0, "Kamida bitta simptom tanlangan bo‘lishi mumkin"),
  fastingGlucose: z
    .number()
    .min(0, "Glyukoza darajasi 0 yoki undan katta bo‘lishi kerak"),
  hba1c: z
    .number()
    .min(0, "HbA1c 0 yoki undan katta bo‘lishi kerak")
    .max(20, "HbA1c real bo‘lishi kerak"),
  randomGlucose: z
    .number()
    .min(0, "Glyukoza darajasi 0 yoki undan katta bo‘lishi kerak")
    .optional(),
  pregnancy: z.enum(["Ha", "Yo‘q"]),
  bmi: z.number().min(0, "BMI 0 yoki undan katta bo‘lishi kerak"),
  riskFactors: z
    .array(z.string())
    .min(0, "Kamida bitta xavf omili tanlangan bo‘lishi mumkin"),
});

type FormData = z.infer<typeof formSchema>;

export function Analyzing() {
  const authContext = useContext(AuthContext);
  const {
    isOpen: isOpenResult,
    open: openResult,
    close: closeResult,
  } = useDisclosure();
  const [results, setResults] = useState<Result[]>([]);
  const [recommendation, setRecommendation] = useState<string>("");
  const [symptomSearch, setSymptomSearch] = useState("");
  const [riskFactorSearch, setRiskFactorSearch] = useState("");
  const [userData, setUserData] = useState<UserData>({
    firstName: "",
    lastName: "",
    age: 0,
    symptoms: [],
    fastingGlucose: 0,
    hba1c: 0,
    randomGlucose: 0,
    pregnancy: "Yo‘q",
    bmi: 0,
    riskFactors: [],
  });
  if (!authContext) {
    throw new Error("Analyzing must be used within an AuthContextProvider");
  }

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      age: 0,
      symptoms: [],
      fastingGlucose: 0,
      hba1c: 0,
      randomGlucose: 0,
      pregnancy: "Yo‘q",
      bmi: 0,
      riskFactors: [],
    },
  });

  const filteredSymptoms = symptomsList.filter((s) =>
    s.toLowerCase().includes(symptomSearch.toLowerCase()),
  );
  const filteredRiskFactors = riskFactorsList.filter((f) =>
    f.toLowerCase().includes(riskFactorSearch.toLowerCase()),
  );

  const onSubmit = (data: FormData) => {
    const userData = {
      firstName: data.firstName,
      lastName: data.lastName,
      Yosh: data.age,
      Simptomlar: data.symptoms,
      OchQoringaPlazmaGlyukoza: data.fastingGlucose,
      HbA1c: data.hba1c,
      TasodifiyPlazmaGlyukoza: data.randomGlucose ?? 0,
      Homiladorlik: data.pregnancy,
      BMI: data.bmi,
      XavfOmillari: data.riskFactors,
      SimptomlarSoni: countSymptoms(data.symptoms, symptomsList),
    };

    const analysisResults = applyRules(userData, rules);
    const finalRecommendation = getFinalRecommendation(analysisResults);

    setUserData(userData);
    setResults(analysisResults);
    setRecommendation(finalRecommendation);
    openResult();

    if (analysisResults.length > 0) {
      toast.success("Tahlil yakunlandi!", {
        description: finalRecommendation,
      });
    } else {
      toast.info("Aniq tashxis qo‘yilmadi", {
        description: finalRecommendation,
      });
    }
  };

  const handlePrint = () => {
    const doc = new jsPDF();
    const fontSize = 12;
    let yPos = 20;

    doc.setFontSize(16);
    doc.text("Tahlil Natijalari", 20, yPos);
    yPos += 10;

    doc.setFontSize(fontSize);
    doc.text(
      `Foydalanuvchi: ${form.getValues("firstName")} ${form.getValues("lastName")}`,
      20,
      yPos,
    );
    yPos += 10;
    doc.text(`Yosh: ${form.getValues("age")}`, 20, yPos);
    yPos += 10;
    doc.text(
      `Och qoringa glyukoza: ${form.getValues("fastingGlucose")} mg/dL`,
      20,
      yPos,
    );
    yPos += 10;
    doc.text(`HbA1c: ${form.getValues("hba1c")}%`, 20, yPos);
    yPos += 10;
    doc.text(`BMI: ${form.getValues("bmi")}`, 20, yPos);
    yPos += 10;
    doc.text(`Homiladorlik: ${form.getValues("pregnancy")}`, 20, yPos);
    yPos += 10;

    if (results.length > 0) {
      doc.text("Natijalar:", 20, yPos);
      yPos += 10;
      results.forEach((result) => {
        doc.text(
          `Qoida ${result.Qoida}: ${result.Tavsif} — ${result.Harakat}`,
          20,
          yPos,
        );
        yPos += 10;
      });
    }

    doc.text(`Tavsiya: ${recommendation}`, 20, yPos);
    doc.save("tahlil_natijalari.pdf");
  };

  return (
    <div className="p-6 relative overflow-auto h-[calc(100vh-19.5rem)] md:h-[calc(100vh-11rem)] max-w-screen">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Shaxsiy ma'lumotlar */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Shaxsiy ma'lumotlar</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ism</FormLabel>
                    <FormControl>
                      <Input placeholder="Masalan, Ali" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Familiya</FormLabel>
                    <FormControl>
                      <Input placeholder="Masalan, Valiev" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Yosh</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Masalan, 52"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Tibbiy ma'lumotlar */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tibbiy ma'lumotlar</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="fastingGlucose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Och qoringa plazma glyukoza (mg/dL)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="Masalan, 130"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <p className="text-sm text-muted-foreground">
                      Normal: &lt; 100 mg/dL
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hba1c"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>HbA1c (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="Masalan, 6.7"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <p className="text-sm text-muted-foreground">
                      Normal: &lt; 5.7%
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="randomGlucose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Tasodifiy plazma glyukoza (mg/dL, ixtiyoriy)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="Masalan, 0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <p className="text-sm text-muted-foreground">
                      0 bo‘lsa, hisobga olinmaydi
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bmi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>BMI (Tana massa indeksi)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="Masalan, 28"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <p className="text-sm text-muted-foreground">
                      Normal: 18.5–24.9
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Homiladorlik */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Homiladorlik</h3>
            <FormField
              control={form.control}
              name="pregnancy"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex space-x-2"
                    >
                      <RadioGroupItem value="Ha" id="pregnancy-yes" />
                      <Label htmlFor="pregnancy-yes">Ha</Label>
                      <RadioGroupItem value="Yo‘q" id="pregnancy-no" />
                      <Label htmlFor="pregnancy-no">Yo‘q</Label>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Simptomlar */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Simptomlar</h3>
              <Input
                placeholder="Simptomlarni qidirish..."
                value={symptomSearch}
                onChange={(e) => setSymptomSearch(e.target.value)}
                className="mb-2"
              />
              <FormField
                control={form.control}
                name="symptoms"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 max-h-60 overflow-y-auto">
                        {filteredSymptoms.length > 0 ? (
                          filteredSymptoms.map((symptom) => (
                            <div
                              key={symptom}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={symptom}
                                checked={field.value.includes(symptom)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...field.value, symptom]);
                                  } else {
                                    field.onChange(
                                      field.value.filter((s) => s !== symptom),
                                    );
                                  }
                                }}
                              />
                              <Label htmlFor={symptom}>{symptom}</Label>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Simptom topilmadi
                          </p>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Xavf omillari */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Xavf omillari</h3>
              <Input
                placeholder="Xavf omillarini qidirish..."
                value={riskFactorSearch}
                onChange={(e) => setRiskFactorSearch(e.target.value)}
                className="mb-2"
              />
              <FormField
                control={form.control}
                name="riskFactors"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="grid grid-cols-1 md:grid-cols-2 mt-4 gap-4 max-h-60 overflow-y-auto">
                        {filteredRiskFactors.length > 0 ? (
                          filteredRiskFactors.map((factor) => (
                            <div
                              key={factor}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={factor}
                                checked={field.value.includes(factor)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange([...field.value, factor]);
                                  } else {
                                    field.onChange(
                                      field.value.filter((f) => f !== factor),
                                    );
                                  }
                                }}
                              />
                              <Label htmlFor={factor}>{factor}</Label>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Xavf omili topilmadi
                          </p>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* Submit */}
          <Button
            type="submit"
            className=" bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
          >
            Tahlil qilish
          </Button>
        </form>
      </Form>

      {/* Result */}
      <DiabetResult
        userData={userData}
        results={results}
        isOpen={isOpenResult}
        close={closeResult}
        recommendation={recommendation}
        handlePrint={handlePrint}
      />
    </div>
  );
}
