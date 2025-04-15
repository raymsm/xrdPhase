'use client';

import {processFileUpload} from '@/services/file-upload';
import {suggestStructures, SuggestStructuresOutput} from '@/ai/flows/suggest-structures';
import {useState} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {FileUploadIcon} from '@radix-ui/react-icons';
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {HelpCircle} from 'lucide-react';
import {Badge} from '@/components/ui/badge';

export default function Home() {
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<SuggestStructuresOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuggestions(null);
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const processedFile = await processFileUpload(file);
      setFilename(processedFile.filename);
      setFileContent(processedFile.data);

      const structureSuggestions = await suggestStructures({file: processedFile});
      setSuggestions(structureSuggestions);
    } catch (e: any) {
      console.error('Error processing file:', e);
      setError(`Error processing file: ${e.message}`);
    }
  };

  return (
    <div className="container mx-auto p-4 flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>XRD Data Analysis</CardTitle>
          <CardDescription>Upload your XRD data file to identify potential crystal structures.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Input id="file-upload" type="file" accept=".raw,.rd,.txt,.csv,.cif" className="hidden" onChange={handleFileChange}/>
            <label htmlFor="file-upload" className="cursor-pointer rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex items-center gap-2">
              <FileUploadIcon className="h-4 w-4"/>
              {filename || 'Upload XRD Data'}
            </label>
            {error && (
              <Alert variant="destructive">
                <HelpCircle className="h-4 w-4"/>
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {suggestions && (
        <Card>
          <CardHeader>
            <CardTitle>Suggested Crystal Structures</CardTitle>
            <CardDescription>Ranked list of potential matches based on the uploaded XRD data.</CardDescription>
          </CardHeader>
          <CardContent>
            {suggestions.matches.length > 0 ? (
              <Table>
                <TableCaption>Potential crystal structure matches</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Structure ID</TableHead>
                    <TableHead>Common Name</TableHead>
                    <TableHead>Formula</TableHead>
                    <TableHead>Confidence Score</TableHead>
                    <TableHead>Crystallographic Information</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suggestions.matches.map((match) => (
                    <TableRow key={match.structureId}>
                      <TableCell>{match.structureId}</TableCell>
                      <TableCell>{match.commonName}</TableCell>
                      <TableCell>{match.formula}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {match.confidenceScore.toFixed(2)}
                        </Badge>
                      </TableCell>
                      <TableCell>{match.crystallographicInformation}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Alert>
                <HelpCircle className="h-4 w-4"/>
                <AlertTitle>No Matches Found</AlertTitle>
                <AlertDescription>No crystal structure matches were found for the provided XRD data.</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
