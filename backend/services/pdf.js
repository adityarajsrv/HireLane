import pdfParse from "pdf-parse-debugging-disabled";

const extractTextFromPDF = async (buffer) => {
  const data = await pdfParse(buffer);

  const cleaned = data.text
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (!cleaned || cleaned.length < 100) {
    throw new Error(
      "Could not extract text from PDF. Make sure your resume is a text-based PDF, not a scanned image."
    );
  }

  return cleaned;
};

export { extractTextFromPDF };