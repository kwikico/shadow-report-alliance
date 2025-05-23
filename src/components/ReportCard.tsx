import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ThumbsUp, DollarSign } from 'lucide-react';

export interface Report {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  status: string;
  location: string;
  timestamp: string;
  supporters: number;
  evidence?: string[];
  // Bounty fields
  bounty_amount?: number;
  bounty_currency?: string;
  help_needed?: string;
  is_bounty_active?: boolean;
}

interface ReportCardProps {
  report: Report;
  onJoinHands: (reportId: string) => void;
  isLiked?: boolean;
}

const ReportCard: React.FC<ReportCardProps> = ({ report, onJoinHands, isLiked = false }) => {
  const navigate = useNavigate();

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent click from triggering if the Join Hands button is clicked
    if ((e.target as HTMLElement).closest('button')) return;
    navigate(`/reports/${report.id}`);
  };

  return (
    <Card className="card-hover overflow-hidden cursor-pointer" onClick={handleCardClick}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold line-clamp-2">{report.title}</h3>
          <Badge variant={report.status === "resolved" ? "default" : "secondary"}>
            {report.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground line-clamp-2">{report.excerpt}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">
            {report.category}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {report.location}
          </Badge>
          {report.is_bounty_active && (
            <Badge variant="default" className="text-xs">
              <DollarSign className="h-3 w-3 mr-1" />
              {report.bounty_amount === 0 ? 'Free Help' : `${report.bounty_currency || 'USD'} ${report.bounty_amount}`}
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2 border-t border-border/50">
        <Button 
          variant={isLiked ? "default" : "ghost"}
          size="sm" 
          className="join-hands-button"
          onClick={() => onJoinHands(report.id)}
        >
          <ThumbsUp className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
          {isLiked ? 'Joined Hands' : 'Join Hands'}
          <span className="ml-1 font-mono text-xs">({report.supporters})</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReportCard;
