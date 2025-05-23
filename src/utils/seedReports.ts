import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CATEGORIES } from "@/constants";

interface SeedReport {
  title: string;
  description: string;
  location: string;
  category: string;
  status: string;
  supporters: number;
}

const seedData: SeedReport[] = [
  {
    title: "Environmental Pollution in River Valley",
    description: "Industrial waste being dumped into the river causing fish deaths and water contamination. Several factories in the area have been observed releasing untreated waste during night hours, bypassing environmental regulations. Local wildlife has been severely affected with decreased bird populations and fish kills reported by residents. Water samples collected show high levels of toxic chemicals and heavy metals.",
    location: "River Valley, CA",
    category: "Environmental",
    status: "pending",
    supporters: 15
  },
  {
    title: "Workplace Discrimination Case",
    description: "Multiple employees reporting unfair treatment based on gender and age. There appears to be a pattern of younger employees being promoted over more experienced staff regardless of performance metrics. Several female employees have reported being passed over for leadership positions despite excellent performance reviews. Documentation has been collected showing significant pay disparities between similar roles.",
    location: "Corporate HQ, New York",
    category: "Workplace",
    status: "investigating",
    supporters: 27
  },
  {
    title: "Financial Fraud at Local Bank",
    description: "Suspicious activities noticed in account management and unauthorized transfers. Customer accounts have shown unexplained fees and charges that don't align with stated policies. Internal documents suggest systematic overcharging of certain customer segments. Several employees have witnessed management directing staff to mislead customers about investment products.",
    location: "Downtown Finance District",
    category: "Financial",
    status: "resolved",
    supporters: 42
  },
  {
    title: "Public Health Violation",
    description: "Restaurant operating without proper health permits and with unsanitary conditions. Kitchen inspections reveal food being stored at improper temperatures and cross-contamination between raw and cooked items. Staff have been observed not following handwashing protocols. Management has ignored multiple warnings from employees about pest problems.",
    location: "Main Street Food District",
    category: "Health",
    status: "pending",
    supporters: 8
  },
  {
    title: "Data Privacy Breach",
    description: "Customer data exposed due to inadequate security measures. Sensitive information including names, addresses, and payment details was accessible due to an unsecured database. Technical logs show multiple unauthorized access attempts, some of which were successful. The company failed to notify affected customers within the legally required timeframe.",
    location: "Online Platform",
    category: "Technology",
    status: "investigating",
    supporters: 36
  },
  {
    title: "Government Procurement Irregularities",
    description: "Evidence suggests bidding process was manipulated to favor specific contractors. Documentation shows that tender requirements were modified after initial submissions to match capabilities of preferred vendors. Several officials involved in the selection process have undisclosed financial connections to winning companies. Winning bids consistently came in just under competing offers by small margins.",
    location: "City Hall, Washington",
    category: "Government",
    status: "pending",
    supporters: 19
  },
  {
    title: "Educational Institution Misusing Funds",
    description: "School district allocating grant money intended for student programs to administrative bonuses. Financial records show discrepancies between reported expenditures and actual disbursements. Several program coordinators have reported pressure to falsify attendance records to justify continued funding. Students are using outdated materials while administrative offices undergo expensive renovations.",
    location: "Westside School District",
    category: "Education",
    status: "investigating",
    supporters: 31
  }
];

// Function to add seed data to the database
export const seedReports = async (userId: string): Promise<boolean> => {
  try {
    // Prepare the data with the user ID
    const reportsWithUserId = seedData.map(report => ({
      ...report,
      user_id: userId
    }));

    // Insert the seed data
    const { data, error } = await supabase
      .from("reports")
      .insert(reportsWithUserId)
      .select();

    if (error) {
      console.error("Error seeding reports:", error);
      toast.error("Failed to seed reports: " + error.message);
      return false;
    }

    toast.success(`Successfully added ${data.length} sample reports`);
    return true;
  } catch (error: any) {
    console.error("Error in seedReports:", error);
    toast.error(error.message || "An unexpected error occurred");
    return false;
  }
};
