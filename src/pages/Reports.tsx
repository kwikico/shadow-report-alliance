
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ReportsList from '@/components/ReportsList';
import { getReports } from '@/api/supabaseReports';
import { Report } from '@/components/ReportCard';
import { toast } from 'sonner';

const Reports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        const response = await getReports();
        
        // Transform to the Report format expected by ReportsList
        const formattedReports = response.map(report => ({
          id: report.id,
          title: report.title,
          excerpt: report.description.substring(0, 150) + (report.description.length > 150 ? '...' : ''),
          category: report.category,
          status: report.status,
          location: report.location || 'Unknown location',
          timestamp: report.timestamp,
          supporters: report.supporters,
          evidence: report.evidence
        }));
        
        setReports(formattedReports);
      } catch (error) {
        console.error("Error fetching reports:", error);
        toast.error('Failed to load reports. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Reports</h1>
          <ReportsList reports={reports} loading={isLoading} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Reports;
