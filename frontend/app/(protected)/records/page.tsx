"use client";

import { useState, useEffect } from "react";
import { medicalRecords as mockRecords } from "@/data/mock";
import { medicalRecordApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FileText, Download, Eye, Upload, Plus } from "lucide-react";

export default function RecordsPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");

  const fetchRecords = async () => {
    try {
      const { data } = await medicalRecordApi.list();
      const formattedRecords = data.map((r: any) => ({
        id: r.id,
        date: new Date(r.date).toLocaleDateString(),
        diagnosis: r.title, // 'title' in backend corresponds to diagnosis/title
        doctorName: "Dr. Smith", // Placeholder if not in response
        hospitalName: "City Hospital", // Placeholder
        url: r.fileUrl,
      }));
      setRecords(formattedRecords.length > 0 ? formattedRecords : mockRecords);
    } catch (err) {
      console.error("Failed to fetch records", err);
      setRecords(mockRecords);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleUpload = async () => {
    if (!file || !title) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    // patientId is handled by backend from token for PATIENT role
    // For DOCTOR role, we'd need to select a patient. Assuming PATIENT view here.

    try {
      await medicalRecordApi.create(formData);
      setTitle("");
      setFile(null);
      await fetchRecords(); // Refresh list
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div>Loading records...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Medical Records
          </h1>
          <p className="text-muted-foreground">
            View and download your digital health history.
          </p>
        </div>
        <div className="flex gap-2 items-center bg-white p-2 rounded-lg border shadow-sm">
          <Input
            placeholder="Record Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-40 h-9"
          />
          <Input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-56 h-9 text-xs"
          />
          <Button size="sm" onClick={handleUpload} disabled={uploading}>
            {uploading ? "Uploading..." : <Upload className="h-4 w-4" />}
          </Button>
        </div>
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
                    Title / Diagnosis
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
                {records.map((record) => (
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
                        {record.url && (
                          <a
                            href={record.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </a>
                        )}
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
