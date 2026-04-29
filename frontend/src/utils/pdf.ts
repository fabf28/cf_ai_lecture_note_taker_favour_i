import jsPDF from "jspdf";

interface Note {
    phrase: string;
    definition: string;
}

interface LectureNotesData {
    summary: string;
    notes: Note[];
}

export function generatePDF(data: LectureNotesData, transcript: string) {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.text("Lecture Notes", 20, 30);

    // Summary section
    doc.setFontSize(16);
    doc.text("Summary", 20, 50);
    doc.setFontSize(12);
    const summaryLines = doc.splitTextToSize(data.summary, 170);
    doc.text(summaryLines, 20, 65);

    let yPosition = 65 + summaryLines.length * 5 + 10;

    // Notes section
    doc.setFontSize(16);
    doc.text("Key Notes", 20, yPosition);
    yPosition += 15;

    doc.setFontSize(12);
    data.notes.forEach((note: Note, index: number) => {
        if (yPosition > 270) {
            doc.addPage();
            yPosition = 30;
        }

        doc.setFont("helvetica", "bold");
        const phraseLines = doc.splitTextToSize(`${index + 1}. ${note.phrase}`, 170);
        doc.text(phraseLines, 20, yPosition);
        yPosition += phraseLines.length * 5 + 2;

        doc.setFont("helvetica", "normal");
        const definitionLines = doc.splitTextToSize(note.definition, 165);
        doc.text(definitionLines, 25, yPosition);
        yPosition += definitionLines.length * 5 + 10;
    });

    if (yPosition > 250) {
        doc.addPage();
        yPosition = 30;
    }

    doc.setFontSize(16);
    doc.text("Transcript", 20, yPosition);
    yPosition += 15;

    doc.setFontSize(12);
    const transcriptLines = doc.splitTextToSize(transcript, 170);
    doc.text(transcriptLines, 20, yPosition);

    doc.save("lecture-notes.pdf");
}
