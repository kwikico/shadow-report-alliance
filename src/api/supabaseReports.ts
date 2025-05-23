
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ReportData {
  title: string;
  description: string;
  location: string | null;
  category: string;
  evidence?: string[];
}

export interface ReportResponse {
  id: string;
  title: string;
  description: string;
  location: string | null;
  category: string;
  timestamp: string;
  supporters: number;
  status: string;
  evidence: string[];
  updates: any[];
}

// Submit a new report to Supabase
export const submitReport = async (reportData: ReportData): Promise<ReportResponse | null> => {
  try {
    const { data, error } = await supabase
      .from("reports")
      .insert({
        ...reportData,
        evidence: reportData.evidence || []
      })
      .select()
      .single();

    if (error) {
      console.error("Error submitting report:", error);
      toast.error("Failed to submit report: " + error.message);
      return null;
    }

    toast.success("Report submitted successfully");
    return data;
  } catch (error: any) {
    console.error("Error in submitReport:", error);
    toast.error(error.message || "An unexpected error occurred");
    return null;
  }
};

// Get all reports
export const getReports = async (): Promise<ReportResponse[]> => {
  try {
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .order("timestamp", { ascending: false });

    if (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to fetch reports: " + error.message);
      return [];
    }

    return data || [];
  } catch (error: any) {
    console.error("Error in getReports:", error);
    toast.error(error.message || "An unexpected error occurred");
    return [];
  }
};

// Get a single report by ID
export const getReportById = async (id: string): Promise<ReportResponse | null> => {
  try {
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching report:", error);
      toast.error("Failed to fetch report: " + error.message);
      return null;
    }

    return data;
  } catch (error: any) {
    console.error("Error in getReportById:", error);
    toast.error(error.message || "An unexpected error occurred");
    return null;
  }
};

// Support a report
export const supportReport = async (reportId: string): Promise<{ supporters: number } | null> => {
  try {
    const { data, error } = await supabase.rpc("support_report", {
      report_id: reportId
    });

    if (error) {
      console.error("Error supporting report:", error);
      toast.error("Failed to support report: " + error.message);
      return null;
    }

    // Fetch the updated report to get the new supporters count
    const { data: updatedReport, error: fetchError } = await supabase
      .from("reports")
      .select("supporters")
      .eq("id", reportId)
      .single();

    if (fetchError) {
      console.error("Error fetching updated report:", fetchError);
      return null;
    }

    return { supporters: updatedReport.supporters };
  } catch (error: any) {
    console.error("Error in supportReport:", error);
    toast.error(error.message || "An unexpected error occurred");
    return null;
  }
};

// Upload evidence files
export const uploadEvidence = async (files: File[]): Promise<string[]> => {
  const uploadedUrls: string[] = [];

  try {
    for (const file of files) {
      const filePath = `${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from("report-evidence")
        .upload(filePath, file);

      if (error) {
        console.error("Error uploading file:", error);
        toast.error(`Failed to upload ${file.name}: ${error.message}`);
        continue;
      }

      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from("report-evidence")
        .getPublicUrl(data.path);

      uploadedUrls.push(publicUrl);
    }

    return uploadedUrls;
  } catch (error: any) {
    console.error("Error in uploadEvidence:", error);
    toast.error(error.message || "An unexpected error occurred during file upload");
    return uploadedUrls;
  }
};
