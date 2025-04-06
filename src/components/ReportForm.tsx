
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
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
  SelectValue 
} from '@/components/ui/select';
import { Shield, Upload, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { stripExifData } from '@/utils/security';

const categories = [
  "Environmental Violations",
  "Corruption",
  "Human Rights Abuse",
  "Corporate Misconduct",
  "Government Overreach",
  "Public Health Risk",
  "Financial Fraud",
  "Other"
];

const ReportForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    category: '',
  });
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
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
    setIsSubmitting(true);
    
    try {
      // Simulating submission - in a real app, you'd send to your backend
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast.success("Report submitted successfully!", {
        description: "Thank you for your contribution to transparency.",
        duration: 5000,
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
      toast.error("Failed to submit report", {
        description: "Please try again later or contact support.",
      });
    } finally {
      setIsSubmitting(false);
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
          Share information safely. All submissions are encrypted and your identity is protected.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Report Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter a clear, concise title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Detailed Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Provide as much factual detail as possible. Avoid including personal identifiers."
              rows={6}
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                placeholder="City, Region, Country"
                value={formData.location}
                onChange={handleInputChange}
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
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="evidence">Supporting Evidence</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop files or click to browse
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Images, documents, audio files (max 10MB each)
              </p>
              <Input
                id="evidence"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('evidence')?.click()}
              >
                Select Files
              </Button>
              
              {files.length > 0 && (
                <div className="mt-4 text-left">
                  <p className="text-sm font-medium mb-2">Selected files:</p>
                  <ul className="text-xs space-y-1">
                    {files.map((file, index) => (
                      <li key={index} className="text-muted-foreground">
                        {file.name} ({(file.size / 1024).toFixed(1)} KB)
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-secondary/50 rounded-lg p-4 text-sm flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-foreground/80">
              For your safety, avoid including personally identifiable information in your report. Our system automatically strips metadata from uploaded files, but use caution when sharing sensitive content.
            </p>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Report Securely"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ReportForm;
