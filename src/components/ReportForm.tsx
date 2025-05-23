
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
import { toast } from 'sonner';
import { stripExifData } from '@/utils/security';
import { CATEGORIES } from '@/constants';
import { submitReport, uploadEvidence } from '@/api/supabaseReports';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

const ReportForm = () => {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
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
    
    if (!user) {
      toast.error("You must be logged in to submit a report");
      navigate("/login");
      return;
    }
    
    setIsLoading(true);

    try {
      // Upload files if any
      let evidence = [];
      if (files.length > 0) {
        evidence = await uploadEvidence(files);
      }

      // Submit the report
      const reportData = {
        ...formData,
        evidence,
      };

      const report = await submitReport(reportData);
      
      if (report) {
        // Clear form
        setFormData({
          title: '',
          description: '',
          location: '',
          category: '',
        });
        setFiles([]);
        
        // Navigate to reports list
        setTimeout(() => {
          navigate('/reports');
        }, 1000);
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error('An unexpected error occurred. Please try again later.');
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
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Report Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Provide a clear title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={handleSelectChange}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location (Optional)</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="City, State, Country"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Detailed Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Provide as much detail as possible"
              className="min-h-[150px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="files">Evidence (Optional)</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
              <Input
                id="files"
                type="file"
                onChange={handleFileChange}
                multiple
                className="hidden"
              />
              <label
                htmlFor="files"
                className="flex flex-col items-center cursor-pointer"
              >
                <Upload className="h-10 w-10 text-gray-400 mb-2" />
                <span className="text-sm font-medium">
                  {files.length
                    ? `${files.length} file${files.length !== 1 ? 's' : ''} selected`
                    : 'Click to upload files'}
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  Images, documents, or other evidence
                </span>
              </label>
            </div>
            {files.length > 0 && (
              <div className="text-sm text-gray-600">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center">
                    <span>{file.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center pt-4">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
            <span className="text-sm text-muted-foreground">
              All reports are confidential and your identity is protected.
            </span>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit Report'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReportForm;
