import { medicalRecords } from "@/data/mock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FileText, Download, Eye } from "lucide-react";

export default function RecordsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Medical Records
        </h1>
        <p className="text-muted-foreground">
          View and download your digital health history.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm text-left">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground">
                    Date
                  </th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground">
                    Diagnosis / Type
                  </th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground">
                    Doctor / Hospital
                  </th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {medicalRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="border-b transition-colors hover:bg-muted/50"
                  >
                    <td className="p-4 align-middle font-medium">
                      {record.date}
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        {record.diagnosis}
                      </div>
                    </td>
                    <td className="p-4 align-middle text-muted-foreground">
                      {record.doctorName}
                      <br />
                      <span className="text-xs">{record.hospitalName}</span>
                    </td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
