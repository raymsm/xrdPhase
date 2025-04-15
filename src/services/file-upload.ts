/**
 * Represents the content of a file.
 */
export interface FileContent {
  /**
   * The name of the file.
   */
  filename: string;
  /**
   * The data contained in the file, as a string.
   */
  data: string;
}

/**
 * Processes a file upload and extracts content.
 *
 * @param file The file to process.
 * @returns A promise that resolves to a FileContent object containing the filename and data.
 */
export async function processFileUpload(file: File): Promise<FileContent> {
  // TODO: Implement the file processing logic here.
  // For now, return a stubbed response.

  const fileContent = await file.text();

  return {
    filename: file.name,
    data: fileContent,
  };
}
