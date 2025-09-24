import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Download, Eye, FileText } from 'lucide-react';

const LearningPanel = () => {
  const pdfResources = [
    {
      title: "Water and Related Statistics 2021",
      description: "Comprehensive water statistics and analysis for India",
      filename: "water-and-related-statistics-2021.pdf",
      category: "Statistics",
      size: "15.2 MB"
    },
    {
      title: "Complete NWIC Water Database",
      description: "National Water Information Centre complete database",
      filename: "complete-nwic-water-database.pdf",
      category: "Database",
      size: "8.7 MB"
    },
    {
      title: "Complete India Water Database",
      description: "Comprehensive India water resource database",
      filename: "complete-india-water-database.pdf",
      category: "Database",
      size: "12.4 MB"
    },
    {
      title: "AIH Official Report - Volume 4",
      description: "Aquifer Information Hub official documentation",
      filename: "AIH-official-4.pdf",
      category: "Official Report",
      size: "6.8 MB"
    },
    {
      title: "AIH Official Report - Volume 3",
      description: "Aquifer Information Hub technical documentation",
      filename: "AIH-official-3.pdf",
      category: "Official Report",
      size: "5.9 MB"
    },
    {
      title: "AIH Official Report - Volume 2",
      description: "Aquifer Information Hub implementation guide",
      filename: "AIH-official-2.pdf",
      category: "Official Report",
      size: "7.3 MB"
    },
    {
      title: "AIH Official Report - Volume 1",
      description: "Aquifer Information Hub foundation document",
      filename: "AIH-official-1.pdf",
      category: "Official Report",
      size: "4.2 MB"
    }
  ];

  const handleView = (filename: string) => {
    window.open(`/pdfs/${filename}`, '_blank');
  };

  const handleDownload = (filename: string, title: string) => {
    const link = document.createElement('a');
    link.href = `/pdfs/${filename}`;
    link.download = filename;
    link.click();
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Statistics':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Database':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Official Report':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <BookOpen className="w-12 h-12 text-primary mr-3" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Learn with INGRES - AI
          </h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Access comprehensive water resource documentation, statistics, and official reports to enhance your understanding of India's groundwater systems.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pdfResources.map((resource, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200 border-muted/20">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between mb-2">
                <FileText className="w-8 h-8 text-primary flex-shrink-0" />
                <Badge variant="secondary" className={getCategoryColor(resource.category)}>
                  {resource.category}
                </Badge>
              </div>
              <CardTitle className="text-lg leading-tight">{resource.title}</CardTitle>
              <CardDescription className="text-sm line-clamp-2">
                {resource.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">{resource.size}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleView(resource.filename)}
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleDownload(resource.filename, resource.title)}
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/5 to-blue-500/5 border-primary/20">
          <CardContent className="p-6">
            <BookOpen className="w-10 h-10 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Need Help Understanding?</h3>
            <p className="text-muted-foreground mb-4">
              Use INGRES-AI chat to ask questions about any of these documents. Our AI can help explain complex water resource concepts and data.
            </p>
            <Button variant="default" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              Ask INGRES-AI
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LearningPanel;