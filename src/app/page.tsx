'use client';

import {processFileUpload} from '@/services/file-upload';
import {suggestStructures, SuggestStructuresOutput} from '@/ai/flows/suggest-structures';
import {useState} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {UploadIcon} from 'lucide-react';
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {HelpCircle} from 'lucide-react';
import {Badge} from '@/components/ui/badge';
import {Textarea} from '@/components/ui/textarea';

export default function Home() {
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<SuggestStructuresOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [elementProfile, setElementProfile] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuggestions(null);
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setFilename(file.name);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const fileContent = e.target?.result as string;
      setFileContent(fileContent);
    };
    reader.readAsText(file);
  };

  const handleAnalyze = async () => {
    if (!filename || !fileContent) {
      setError('Please upload a file first.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setSuggestions(null);

    try {
      const structureSuggestions = await suggestStructures({
        file: {filename: filename, data: fileContent},
        elementProfile: elementProfile,
      });
      setSuggestions(structureSuggestions);
    } catch (e: any) {
      console.error('Error processing file:', e);
      setError(`Error processing file: ${e.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExport = () => {
    if (suggestions) {
      const dataStr = JSON.stringify(suggestions.matches, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

      const exportFileDefaultName = 'structure_suggestions.txt';

      let linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
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
              <UploadIcon className="h-4 w-4"/>
              {filename || 'Upload XRD Data'}
            </label>
            <Textarea
              placeholder="Enter element profile (e.g., Cu, Fe, Ni)"
              value={elementProfile}
              onChange={(e) => setElementProfile(e.target.value)}
            />
            <Button onClick={handleAnalyze} disabled={isAnalyzing}>
              {isAnalyzing ? 'Analyzing...' : 'Analyze'}
            </Button>
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
            <Button onClick={handleExport}>Export Results</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
