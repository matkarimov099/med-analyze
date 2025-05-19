import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Result } from "@/pages/analyzing/Analyzing.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { PrinterIcon, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { formatList, formatValue } from "@/lib/utils";
import type { UserData } from "@/services/diabet-logic.ts";

interface DiabetResultProps {
  results: Result[];
  userData: UserData;
  recommendation: string;
  patient: string;
  isOpen: boolean;
  close: () => void;
  handlePrint: () => void;
}
const getBorderColor = (ruleNumber: string) => {
  const colors = [
    "border-blue-500",
    "border-green-500",
    "border-yellow-500",
    "border-red-500",
    "border-purple-500",
  ];
  return colors[(parseInt(ruleNumber) - 1) % colors.length];
};

export const DiabetResult = ({
  results,
  recommendation,
  isOpen,
  close,
  userData,
  handlePrint,
}: DiabetResultProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="sm:max-w-5xl w-full max-h-[80vh] overflow-y-auto p-6 sm:p-8 mx-auto my-12">
        <DialogHeader>
          <DialogTitle>Tahlil natijalari</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div className="md:col-span-1">
            <PatientInfoCard userData={userData} />
          </div>
          <div className="md:col-span-1 h-full">
            <RecommendationCard recommendation={recommendation} />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-4">
          {results.map((result, index) => (
            <RuleCard key={index} result={result} />
          ))}
        </div>

        <Button
          onClick={handlePrint}
          variant="outline"
          className="mt-6 self-start"
        >
          <PrinterIcon className="w-4 h-4 mr-2" /> Natijani chop etish
        </Button>
      </DialogContent>
    </Dialog>
  );
};

const PatientInfoCard = ({ userData }: { userData: UserData }) => {
  return (
    <Card className="bg-gradient-to-b from-blue-50 to-purple-50 dark:from-gray-800 dark:to-indigo-900 rounded-xl h-full">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <UserIcon className="w-6 h-6 text-blue-500" />
          <CardTitle>Bemor Ma'lumotlari</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <p>
          <span className="font-semibold">Ism:</span>{" "}
          {formatValue(userData.firstName)}
        </p>
        <p>
          <span className="font-semibold">Familiya:</span>{" "}
          {formatValue(userData.lastName)}
        </p>
        <p>
          <span className="font-semibold">Yosh:</span>{" "}
          {formatValue(userData.Yosh.toString(), " yosh")}
        </p>
        <p>
          <span className="font-semibold">Simptomlar:</span>{" "}
          {formatList(userData.Simptomlar)}
        </p>
        <p>
          <span className="font-semibold">Och qoringa glyukoza:</span>{" "}
          {formatValue(userData.OchQoringaPlazmaGlyukoza.toString(), " mg/dL")}
        </p>
        <p>
          <span className="font-semibold">HbA1c:</span>{" "}
          {formatValue(userData.HbA1c.toString(), "%")}
        </p>
        <p>
          <span className="font-semibold">Tasodifiy glyukoza:</span>{" "}
          {formatValue(
            userData.TasodifiyPlazmaGlyukoza?.toString() ?? "0",
            " mg/dL",
          )}
        </p>
        <p>
          <span className="font-semibold">BMI:</span>{" "}
          {formatValue(userData.BMI.toString())}
        </p>
        <p>
          <span className="font-semibold">Homiladorlik:</span>{" "}
          {formatValue(userData.Homiladorlik)}
        </p>
        <p>
          <span className="font-semibold">Xavf omillari:</span>{" "}
          {formatList(userData.XavfOmillari)}
        </p>
      </CardContent>
    </Card>
  );
};

const RuleCard = ({ result }: { result: Result }) => (
  <Card className={`border-t-4 ${getBorderColor(result.Qoida)}`}>
    <CardContent className="p-4 w-full">
      <p className="font-semibold text-lg">
        <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-2">
          {result.Qoida}
        </span>
        {result.Tavsif}
      </p>
      <p className="text-green-600 dark:text-green-400 mt-2 font-medium">
        🔍 Harakat: {result.Harakat}
      </p>
    </CardContent>
  </Card>
);

const RecommendationCard = ({ recommendation }: { recommendation: string }) => (
  <Card className="border-t-4 h-full border-orange-500 bg-orange-50 dark:bg-orange-900/30 animate-pulse">
    <CardContent className="p-5">
      <h3 className="text-xl font-bold text-center text-orange-700 dark:text-orange-300">
        Shifokor tavsiyasi
      </h3>
      <p className="text-lg text-center mt-2">{recommendation}</p>
    </CardContent>
  </Card>
);
