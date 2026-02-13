/**
 * Download file from URL
 * Returns the downloaded content as a string
 */
export async function downloadFile(url: string): Promise<string> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to download file: ${response.statusText}`);
  }

  const content = await response.text();
  return content;
}
