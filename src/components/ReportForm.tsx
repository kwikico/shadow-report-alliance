import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Shield, Upload, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { stripExifData } from '@/utils/security';
import { postFiles, createReport } from '@/api';
import { CATEGORIES } from '@/constants';

const ReportForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<any>({
    title: '',
    description: '',
    location: '',
    category: '',
  });
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);

      // Process files to strip metadata
      const processedFiles = await Promise.all(
        selectedFiles.map(async (file) => {
          if (file.type.startsWith('image/')) {
            return await stripExifData(file);
          }
          return file;
        })
      );

      setFiles(processedFiles);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let evidence = [];

      if (files.length > 0) {
        const fileFormData = new FormData();
        files.forEach((file) => fileFormData.append('files', file));

        const fileUploadResponse = await postFiles(fileFormData);
        if (!fileUploadResponse.urls) {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'File upload failed',
          });
          return;
        }

        evidence = fileUploadResponse.urls;
      }

      const reportData = {
        ...formData,
        evidence,
      };

      const reportResponse = await createReport(reportData);

      toast({
        title: 'Success',
        description: 'Report submitted successfully',
      });

      // Clear form
      setFormData({
        title: '',
        description: '',
        location: '',
        category: '',
      });
      setFiles([]);

      // Navigate to success page or reports list
      navigate('/reports');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to submit report.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center mb-2">
          <Shield className="h-6 w-6 text-primary mr-2" />
          <CardTitle>Submit Anonymous Report</CardTitle>
        </div>
        <CardDescription>
          Share information safely. All submissions are encrypted and your
          identity is protected.
        </CardDescription>
      </CardHeader>
      