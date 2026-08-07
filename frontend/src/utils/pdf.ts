import jsPDF from "jspdf";

interface Note {
    phrase: string;
    definition: string;
}

interface LectureNotesData {
    summary: string;
    notes: Note[];
    name?: string;
}

export function generatePDF(data: LectureNotesData, transcript: string) {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    const title = data.name || "Lecture Notes";
    doc.text(title, 20, 30);

    // Summary section
    doc.setFontSize(16);
    doc.text("Summary", 20, 50);
    doc.setFontSize(12);
    const summaryLines = doc.splitTextToSize(data.summary || "", 170);
    doc.text(summaryLines, 20, 65);

    let yPosition = 65 + (summaryLines.length || 0) * 5 + 10;

    // Notes section
    doc.setFontSize(16);
    doc.text("Key Notes", 20, yPosition);
    yPosition += 15;

    doc.setFontSize(12);
    const notesList = data.notes || [];
    notesList.forEach((note: any, index: number) => {
        if (yPosition > 270) {
            doc.addPage();
            yPosition = 30;
        }

        doc.setFont("helvetica", "bold");
        const phrase = note.phrase || note.keyword || "";
        const phraseLines = doc.splitTextToSize(`${index + 1}. ${phrase}`, 170);
        doc.text(phraseLines, 20, yPosition);
        yPosition += phraseLines.length * 5 + 2;

        doc.setFont("helvetica", "normal");
        const definition = note.definition || note.defenition || "";
        const definitionLines = doc.splitTextToSize(definition, 165);
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
    const transcriptLines = doc.splitTextToSize(transcript || "", 170);
    doc.text(transcriptLines, 20, yPosition);

    // Dynamic filename based on lecture name
    const rawName = data.name || "lecture";
    const cleanedName = rawName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const fileName = `${cleanedName}-notes.pdf`;

    doc.save(fileName);
}
