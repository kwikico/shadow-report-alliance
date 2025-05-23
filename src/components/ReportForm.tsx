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
import { Shield, Upload, AlertTriangle, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { stripExifData } from '@/utils/security';
import { CATEGORIES } from '@/constants';
import { submitReport, uploadEvidence } from '@/api/supabaseReports';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { useMutation } from '@tanstack/react-query';

interface ReportData {
  title: string;
  description: string;
  location: string | null;
  category: string;
  evidence?: string[];
  bounty_amount?: number;
  bounty_currency?: string;
  help_needed?: string;
  is_bounty_active?: boolean;
}

const formSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  location: z.string().min(3, "Location must be at least 3 characters"),
  category: z.string().min(1, "Please select a category"),
  evidence: z.any().optional(),
  // Bounty fields
  includeBounty: z.boolean().default(false),
  bountyAmount: z.number().min(0).default(0),
  bountyCurrency: z.string().default("USD"),
  helpNeeded: z.string().optional(),
  legalAgreement: z.boolean().default(false)
});

const ReportForm = () => {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      category: "",
      evidence: [],
      includeBounty: false,
      bountyAmount: 0,
      bountyCurrency: "USD",
      helpNeeded: "",
      legalAgreement: false
    },
  });
  const [files, setFiles] = useState<File[]>([]);
  const { isPending, mutate: submitReportMutation } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      // Check legal agreement if bounty is included
      if (values.includeBounty && !values.legalAgreement) {
        toast.error("You must agree to the legal terms to post a bounty");
        return;
      }

      let evidenceUrls: string[] = [];
      
      if (values.evidence && values.evidence.length > 0) {
        evidenceUrls = await uploadEvidence(values.evidence);
      }

      const reportData: ReportData = {
        title: values.title,
        description: values.description,
        location: values.location,
        category: values.category,
        evidence: evidenceUrls,
        // Include bounty data if applicable
        ...(values.includeBounty && {
          bounty_amount: values.bountyAmount,
          bounty_currency: values.bountyCurrency,
          help_needed: values.helpNeeded,
          is_bounty_active: true
        })
      };

      return submitReport(reportData);
    },
    onSuccess: () => {
      form.reset();
      toast.success("Report submitted successfully!");
      navigate('/reports');
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to submit report");
    },
  });

  const watchIncludeBounty = form.watch("includeBounty");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    form.setValue(name as any, value);
  };

  const handleSelectChange = (value: string) => {
    form.setValue('category', value);
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
      form.setValue('evidence', processedFiles);
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit((values) => submitReportMutation(values))} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Report Title</Label>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        id="title"
                        placeholder="Provide a clear title"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          handleInputChange(e);
                        }}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleSelectChange(value);
                        }}
                        required
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location (Optional)</Label>
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        id="location"
                        placeholder="City, State, Country"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          handleInputChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description</Label>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        id="description"
                        placeholder="Provide as much detail as possible"
                        className="min-h-[150px]"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          handleInputChange(e);
                        }}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="files">Evidence (Optional)</Label>
              <FormField
                control={form.control}
                name="evidence"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                        <Input
                          id="files"
                          type="file"
                          accept="image/*,video/*,application/pdf"
                          onChange={(e) => {
                            field.onChange(Array.from(e.target.files || []));
                            handleFileChange(e);
                          }}
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
                    </FormControl>
                    {files.length > 0 && (
                      <div className="text-sm text-gray-600">
                        {files.map((file, index) => (
                          <div key={index} className="flex items-center">
                            <span>{file.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Bounty Section */}
            <div className="space-y-4 border-t pt-4">
              <FormField
                control={form.control}
                name="includeBounty"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Include a bounty for help
                      </FormLabel>
                      <FormDescription>
                        Offer a reward for someone who can help resolve this issue
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {watchIncludeBounty && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="bountyAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bounty Amount</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                type="number"
                                placeholder="0"
                                className="pl-9"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Enter 0 for free help
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bountyCurrency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Currency</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select currency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="EUR">EUR</SelectItem>
                              <SelectItem value="GBP">GBP</SelectItem>
                              <SelectItem value="INR">INR</SelectItem>
                              <SelectItem value="CAD">CAD</SelectItem>
                              <SelectItem value="AUD">AUD</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="helpNeeded"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What help do you need?</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe what kind of help you're looking for..."
                            className="resize-none"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              handleInputChange(e);
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Be specific about the assistance you need
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <div className="flex gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
                      <div className="space-y-2">
                        <h4 className="font-medium">Legal Disclaimer</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• All actions must comply with local, state, and federal laws</li>
                          <li>• You are solely responsible for the content and consequences of your report</li>
                          <li>• The platform is not responsible for any actions taken by you or helpers</li>
                          <li>• Any bounty agreements are between you and the helper directly</li>
                        </ul>
                      </div>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="legalAgreement"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I understand and agree to the legal terms
                            </FormLabel>
                            <FormDescription>
                              I acknowledge that I am responsible for ensuring all actions comply with the law
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center pt-4">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
              <span className="text-sm text-muted-foreground">
                All reports are confidential and your identity is protected.
              </span>
            </div>

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Submitting..." : "Submit Report"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ReportForm;
