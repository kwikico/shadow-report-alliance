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
  updates: any;
  user_id: string;
  bounty_amount?: number;
  bounty_currency?: string;
  help_needed?: string;
  is_bounty_active?: boolean;
}

// Submit a new report to Supabase
export const submitReport = async (reportData: ReportData): Promise<ReportResponse | null> => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("You must be logged in to submit a report");
      return null;
    }

    const { data, error } = await supabase
      .from("reports")
      .insert({
        ...reportData,
        evidence: reportData.evidence || [],
        user_id: user.id,
        status: 'pending',
        supporters: 0,
        timestamp: new Date().toISOString()
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

// Check if a report is liked by the current user
export const checkReportLike = async (reportId: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data } = await supabase
      .from('report_likes')
      .select('id')
      .eq('report_id', reportId)
      .eq('user_id', user.id)
      .single();

    return !!data;
  } catch (error) {
    console.error("Error checking report like:", error);
    return false;
  }
};

// Support a report
export const supportReport = async (reportId: string): Promise<{ supporters: number; isLiked: boolean } | null> => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("You must be logged in to support a report");
      return null;
    }

    // First, get the current report to check supporters count
    const { data: currentReport, error: fetchError } = await supabase
      .from('reports')
      .select('supporters')
      .eq('id', reportId)
      .single();

    if (fetchError) {
      console.error("Error fetching report:", fetchError);
      toast.error("Failed to fetch report details");
      return null;
    }

    // Check if the user has already liked this report
    const { data: existingLike, error: checkError } = await supabase
      .from('report_likes')
      .select('id')
      .eq('report_id', reportId)
      .eq('user_id', user.id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error("Error checking existing like:", checkError);
      toast.error("Failed to check support status");
      return null;
    }

    if (existingLike) {
      // User has already liked, so remove the like
      const { error: deleteError } = await supabase
        .from('report_likes')
        .delete()
        .eq('report_id', reportId)
        .eq('user_id', user.id);

      if (deleteError) {
        console.error("Error removing like:", deleteError);
        toast.error("Failed to remove support");
        return null;
      }

      // Update the supporters count
      const { data: updatedReport, error: updateError } = await supabase
        .from('reports')
        .update({ supporters: Math.max(0, (currentReport?.supporters || 0) - 1) })
        .eq('id', reportId)
        .select('supporters')
        .single();

      if (updateError) {
        console.error("Error updating supporters count:", updateError);
        toast.error("Failed to update supporters count");
        return null;
      }

      return { supporters: updatedReport.supporters, isLiked: false };
    } else {
      // User hasn't liked yet, so add like
      const { error: insertError } = await supabase
        .from('report_likes')
        .insert({ report_id: reportId, user_id: user.id });

      if (insertError) {
        console.error("Error adding like:", insertError);
        toast.error("Failed to add support");
        return null;
      }

      // Update the supporters count
      const { data: updatedReport, error: updateError } = await supabase
        .from('reports')
        .update({ supporters: (currentReport?.supporters || 0) + 1 })
        .eq('id', reportId)
        .select('supporters')
        .single();

      if (updateError) {
        console.error("Error updating supporters count:", updateError);
        toast.error("Failed to update supporters count");
        return null;
      }

      return { supporters: updatedReport.supporters, isLiked: true };
    }
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

// Accept a bounty
export const acceptBounty = async (reportId: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("You must be logged in to accept a bounty");
      return false;
    }

    // Create bounty acceptance record
    const { error: acceptanceError } = await supabase
      .from('bounty_acceptances')
      .insert({
        report_id: reportId,
        helper_id: user.id,
        agreement_signed: true,
        status: 'pending'
      });

    if (acceptanceError) {
      console.error("Error accepting bounty:", acceptanceError);
      toast.error("Failed to accept bounty");
      return false;
    }

    // Get report owner to send notification
    const { data: report } = await supabase
      .from('reports')
      .select('user_id, title')
      .eq('id', reportId)
      .single();

    if (report) {
      // Create notification for report owner
      await createNotification({
        user_id: report.user_id,
        type: 'bounty_accepted',
        title: 'New Bounty Application',
        message: `Someone has applied to help with your report: ${report.title}`,
        data: { report_id: reportId, helper_id: user.id }
      });
    }

    toast.success("Bounty application submitted!");
    return true;
  } catch (error: any) {
    console.error("Error in acceptBounty:", error);
    toast.error(error.message || "An unexpected error occurred");
    return false;
  }
};

// Create a notification
export const createNotification = async (notification: {
  user_id: string;
  type: string;
  title: string;
  message: string;
  data?: any;
}): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .insert({
        ...notification,
        read: false
      });

    if (error) {
      console.error("Error creating notification:", error);
      return false;
    }

    return true;
  } catch (error: any) {
    console.error("Error in createNotification:", error);
    return false;
  }
};

// Get bounty applications for a report
export const getBountyApplications = async (reportId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('bounty_acceptances')
      .select(`
        *,
        helper:helper_id (
          id,
          email,
          raw_user_meta_data
        )
      `)
      .eq('report_id', reportId)
      .order('accepted_at', { ascending: false });

    if (error) {
      console.error("Error fetching applications:", error);
      return [];
    }

    return data || [];
  } catch (error: any) {
    console.error("Error in getBountyApplications:", error);
    return [];
  }
};

// Approve or reject bounty application
export const updateBountyApplication = async (
  applicationId: string,
  status: 'approved' | 'rejected',
  rejectionReason?: string
): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("You must be logged in");
      return false;
    }

    const updateData: any = {
      status,
      approved_by: user.id,
      approved_at: new Date().toISOString()
    };

    if (status === 'rejected' && rejectionReason) {
      updateData.rejection_reason = rejectionReason;
    }

    const { data: application, error } = await supabase
      .from('bounty_acceptances')
      .update(updateData)
      .eq('id', applicationId)
      .select('*, report:report_id(title)')
      .single();

    if (error) {
      console.error("Error updating application:", error);
      toast.error("Failed to update application");
      return false;
    }

    // Send notification to helper
    if (application) {
      await createNotification({
        user_id: application.helper_id,
        type: status === 'approved' ? 'bounty_approved' : 'bounty_rejected',
        title: status === 'approved' ? 'Bounty Application Approved!' : 'Bounty Application Update',
        message: status === 'approved' 
          ? `Your application for "${application.report.title}" has been approved!`
          : `Your application for "${application.report.title}" was not selected.`,
        data: { report_id: application.report_id, application_id: applicationId }
      });
    }

    toast.success(status === 'approved' ? "Application approved!" : "Application rejected");
    return true;
  } catch (error: any) {
    console.error("Error in updateBountyApplication:", error);
    toast.error(error.message || "An unexpected error occurred");
    return false;
  }
};

// Get reports by user
export const getReportsByUser = async (userId: string): Promise<ReportResponse[]> => {
  try {
    const { data, error } = await supabase
      .from("reports")
      .select(`
        *,
        bounty_acceptances!report_id (
          id,
          status
        )
      `)
      .eq('user_id', userId)
      .order("timestamp", { ascending: false });

    if (error) {
      console.error("Error fetching user reports:", error);
      return [];
    }

    return data || [];
  } catch (error: any) {
    console.error("Error in getReportsByUser:", error);
    return [];
  }
};

// Add update to report
export const addReportUpdate = async (
  reportId: string,
  content: string,
  updatedByType: 'owner' | 'helper'
): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("You must be logged in to add updates");
      return false;
    }

    const { error } = await supabase
      .from('report_updates')
      .insert({
        report_id: reportId,
        user_id: user.id,
        content,
        updated_by_type: updatedByType
      });

    if (error) {
      console.error("Error adding update:", error);
      toast.error("Failed to add update");
      return false;
    }

    // Get report info for notification
    const { data: report } = await supabase
      .from('reports')
      .select('user_id, title')
      .eq('id', reportId)
      .single();

    if (report && report.user_id !== user.id) {
      // Notify report owner if update is from helper
      await createNotification({
        user_id: report.user_id,
        type: 'report_updated',
        title: 'Report Updated',
        message: `Your report "${report.title}" has a new update`,
        data: { report_id: reportId }
      });
    }

    toast.success("Update added successfully!");
    return true;
  } catch (error: any) {
    console.error("Error in addReportUpdate:", error);
    toast.error(error.message || "An unexpected error occurred");
    return false;
  }
};

// Get notifications for user
export const getNotifications = async (): Promise<any[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return [];

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }

    return data || [];
  } catch (error: any) {
    console.error("Error in getNotifications:", error);
    return [];
  }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) {
      console.error("Error marking notification as read:", error);
      return false;
    }

    return true;
  } catch (error: any) {
    console.error("Error in markNotificationAsRead:", error);
    return false;
  }
};
