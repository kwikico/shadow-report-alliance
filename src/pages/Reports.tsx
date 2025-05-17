
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ReportsList from '@/components/ReportsList';
import { getReports } from '@/api';
import { Report } from '@/components/ReportCard';
import { useToast } from '@/hooks/use-toast';

const Reports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await getReports();
        setReports(response);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to load reports.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <ReportsList reports={reports} loading={isLoading} />
      <Footer />
    </div>
  );
};

export default Reports;
