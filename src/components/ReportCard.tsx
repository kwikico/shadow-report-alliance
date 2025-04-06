
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, ThumbsUp, Users, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export interface Report {
  id: string;
  title: string;
  excerpt: string;
  location: string;
  coordinates?: [number, number];
  category: string;
  timestamp: Date;
  supporters: number;
  status: 'verified' | 'investigating' | 'pending';
}

interface ReportCardProps {
  report: Report;
  onJoinHands: (reportId: string) => void;
}

const statusColors = {
  verified: 'bg-green-500',
  investigating: 'bg-yellow-500',
  pending: 'bg-blue-500'
};

const ReportCard: React.FC<ReportCardProps> = ({ report, onJoinHands }) => {
  return (
    <Card className="card-hover overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-medium">{report.title}</CardTitle>
          <Badge variant="secondary" className={statusColors[report.status]}>
            {report.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-muted-foreground text-sm mb-3">{report.excerpt}</p>
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-3">
          <div className="flex items-center">
            <MapPin className="h-3 w-3 mr-1" />
            {report.location}
          </div>
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {formatDistanceToNow(report.timestamp, { addSuffix: true })}
          </div>
          <Badge variant="outline" className="ml-auto">
            {report.category}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2 border-t border-border/50">
        <Button 
          variant="ghost" 
          size="sm" 
          className="join-hands-button"
          onClick={() => onJoinHands(report.id)}
        >
          <ThumbsUp className="h-4 w-4 mr-1" />
          Join Hands
          <span className="ml-1 font-mono text-xs">({report.supporters})</span>
        </Button>
        <Link to={`/reports/${report.id}`} className="inline-flex items-center text-sm text-primary hover:underline">
          Read Full Report
          <ExternalLink className="h-3 w-3 ml-1" />
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ReportCard;
