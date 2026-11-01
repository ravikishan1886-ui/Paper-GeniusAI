import { jsPDF } from 'jspdf';
import { QuestionPaper, WatermarkConfig } from '../types';

interface PDFExportOptions {
  type: 'question_paper' | 'answer_key' | 'detailed_solutions';
  watermarkOverride?: WatermarkConfig;
}

export function exportPaperToPDF(paper: QuestionPaper, options: PDFExportOptions): boolean {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
    const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
    const margin = 18;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    const watermark = options.watermarkOverride || paper.watermark || {
      text: 'Ravi Kishan',
      enabled: true,
      opacity: 0.12,
      rotation: -35,
      color: '#64748b',
      fontSize: 48,
    };

    const isAnswerKey = options.type === 'answer_key';
    const isDetailed = options.type === 'detailed_solutions';

    // Helper to check page break
    const checkPageBreak = (neededHeight: number) => {
      if (y + neededHeight > pageHeight - margin - 12) {
        doc.addPage();
        y = margin;
        return true;
      }
      return false;
    };

    // --- Header Section ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(30, 41, 59); // slate-800
    doc.text((paper.instituteName || 'PAPER GENIUS ACADEMY').toUpperCase(), pageWidth / 2, y, { align: 'center' });
    y += 7;

    doc.setFontSize(12);
    doc.setTextColor(71, 85, 105);
    const subTitle = isAnswerKey
      ? `${paper.title} - OFFICIAL ANSWER KEY`
      : isDetailed
      ? `${paper.title} - DETAILED STEP-BY-STEP SOLUTIONS`
      : paper.title;
    doc.text(subTitle, pageWidth / 2, y, { align: 'center' });
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`${paper.board} • ${paper.classLevel} • ${paper.academicYear}`, pageWidth / 2, y, { align: 'center' });
    y += 7;

    // Header Meta Bar (Subject, Duration, Marks)
    doc.setDrawColor(203, 213, 225); // slate-300
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`Subject: ${paper.subject}`, margin, y);
    doc.text(`Time Allowed: ${paper.durationMinutes} Minutes`, pageWidth / 2, y, { align: 'center' });
    doc.text(`Maximum Marks: ${paper.maxMarks}`, pageWidth - margin, y, { align: 'right' });
    y += 3;

    doc.line(margin, y, pageWidth - margin, y);
    y += 7;

    // --- General Instructions (For Question Paper) ---
    if (!isAnswerKey && !isDetailed && paper.generalInstructions && paper.generalInstructions.length > 0) {
      checkPageBreak(30);

      doc.setFillColor(248, 250, 252); // slate-50
      doc.rect(margin, y, contentWidth, 7, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(30, 41, 59);
      doc.text('GENERAL INSTRUCTIONS:', margin + 3, y + 5);
      y += 9;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);

      paper.generalInstructions.forEach((inst, idx) => {
        const bulletText = `${idx + 1}. ${inst}`;
        const lines = doc.splitTextToSize(bulletText, contentWidth - 4);
        checkPageBreak(lines.length * 4.5);
        doc.text(lines, margin + 3, y);
        y += lines.length * 4.2;
      });
      y += 6;
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;
    }

    // --- CONTENT RENDERING ---

    if (!isAnswerKey && !isDetailed) {
      // 1. QUESTION PAPER
      paper.sections.forEach((sec, sIdx) => {
        checkPageBreak(18);

        // Section Banner
        doc.setFillColor(241, 245, 249);
        doc.roundedRect(margin, y, contentWidth, 8, 1.5, 1.5, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(30, 41, 59);
        doc.text(`${sec.name}: ${sec.title}`.toUpperCase(), margin + 4, y + 5.5);
        
        const secMarksText = `(${sec.questionCount} Questions × ${sec.marksPerQuestion} Marks = ${sec.totalMarks} Marks)`;
        doc.setFontSize(8.5);
        doc.setTextColor(71, 85, 105);
        doc.text(secMarksText, pageWidth - margin - 4, y + 5.5, { align: 'right' });
        y += 12;

        if (sec.instructions) {
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(8.5);
          doc.setTextColor(100, 116, 139);
          doc.text(sec.instructions, margin + 2, y);
          y += 5.5;
        }

        // Questions
        sec.questions.forEach((q) => {
          checkPageBreak(20);

          const qNumText = `Q${q.number}.`;
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9.5);
          doc.setTextColor(15, 23, 42);
          doc.text(qNumText, margin, y);

          // Right aligned marks badge
          const marksText = `[${q.marks} Mark${q.marks > 1 ? 's' : ''}]`;
          doc.text(marksText, pageWidth - margin, y, { align: 'right' });

          // Question Text
          doc.setFont('helvetica', 'normal');
          const qTextX = margin + 11;
          const qTextWidth = contentWidth - 11 - 18;
          const lines = doc.splitTextToSize(q.text, qTextWidth);
          doc.text(lines, qTextX, y);
          y += lines.length * 4.6 + 2;

          // Options for MCQ
          if (q.options && q.options.length > 0) {
            checkPageBreak(q.options.length * 5.5);
            doc.setFontSize(9);
            q.options.forEach((opt) => {
              const optLines = doc.splitTextToSize(opt, qTextWidth - 4);
              doc.text(optLines, qTextX + 4, y);
              y += optLines.length * 4.4;
            });
            y += 2;
          }

          // Case passage
          if (q.casePassage) {
            checkPageBreak(15);
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(8.5);
            doc.setTextColor(71, 85, 105);
            const passLines = doc.splitTextToSize(`Context / Case: ${q.casePassage}`, qTextWidth);
            doc.text(passLines, qTextX, y);
            y += passLines.length * 4.2 + 2;
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(15, 23, 42);
          }

          // Internal Choice OR Question
          if (q.hasInternalChoice && q.orQuestion) {
            checkPageBreak(20);
            y += 2;
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            doc.setTextColor(99, 102, 241); // indigo
            doc.text('— OR —', pageWidth / 2, y, { align: 'center' });
            y += 5.5;

            doc.setFont('helvetica', 'normal');
            doc.setTextColor(15, 23, 42);
            const orLines = doc.splitTextToSize(q.orQuestion.text, qTextWidth);
            doc.text(orLines, qTextX, y);
            y += orLines.length * 4.6 + 2;

            if (q.orQuestion.options && q.orQuestion.options.length > 0) {
              q.orQuestion.options.forEach((opt) => {
                const optLines = doc.splitTextToSize(opt, qTextWidth - 4);
                doc.text(optLines, qTextX + 4, y);
                y += optLines.length * 4.4;
              });
            }
          }

          y += 4.5;
        });

        y += 4;
      });
    } else {
      // 2. ANSWER KEY OR DETAILED SOLUTIONS
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(margin, y, contentWidth, 8, 1.5, 1.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(30, 41, 59);
      doc.text(
        isDetailed ? 'DETAILED STEP-BY-STEP MARKING SCHEME & MODEL SOLUTIONS' : 'STANDARD EVALUATION ANSWER KEY',
        margin + 4,
        y + 5.5
      );
      y += 12;

      paper.answerKey.forEach((ans) => {
        checkPageBreak(25);

        // Header for Answer Item
        doc.setFillColor(248, 250, 252);
        doc.rect(margin, y, contentWidth, 6, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(15, 23, 42);
        doc.text(`Answer Q${ans.questionNumber} (${ans.type.toUpperCase()})`, margin + 3, y + 4.2);
        y += 8;

        // Correct Answer Summary
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(79, 70, 229); // indigo-600
        doc.text('Correct Answer / Key:', margin + 3, y);
        y += 4.5;

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(15, 23, 42);
        const ansLines = doc.splitTextToSize(ans.correctAnswer, contentWidth - 6);
        doc.text(ansLines, margin + 3, y);
        y += ansLines.length * 4.4 + 2;

        // Step-by-step solutions
        if (ans.solutionSteps && ans.solutionSteps.length > 0) {
          checkPageBreak(ans.solutionSteps.length * 5);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8.5);
          doc.setTextColor(71, 85, 105);
          doc.text('Step-by-Step Working:', margin + 3, y);
          y += 4.5;

          doc.setFont('helvetica', 'normal');
          doc.setTextColor(51, 65, 85);
          ans.solutionSteps.forEach((step, sIdx) => {
            const stepLines = doc.splitTextToSize(`• ${step}`, contentWidth - 8);
            checkPageBreak(stepLines.length * 4.5);
            doc.text(stepLines, margin + 5, y);
            y += stepLines.length * 4.2;
          });
          y += 2;
        }

        // Marking Scheme Steps
        if (isDetailed && ans.markingScheme && ans.markingScheme.length > 0) {
          checkPageBreak(ans.markingScheme.length * 5);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8.5);
          doc.setTextColor(16, 185, 129); // emerald
          doc.text('Teacher Marking Scheme Allocation:', margin + 3, y);
          y += 4.5;

          doc.setFont('helvetica', 'normal');
          doc.setTextColor(51, 65, 85);
          ans.markingScheme.forEach((ms) => {
            const msText = `✓ ${ms.step} — [${ms.marks} Mark${ms.marks > 1 ? 's' : ''}]`;
            const msLines = doc.splitTextToSize(msText, contentWidth - 8);
            checkPageBreak(msLines.length * 4.5);
            doc.text(msLines, margin + 5, y);
            y += msLines.length * 4.2;
          });
          y += 2;
        }

        // Key formulas or equations
        if (ans.keyFormulasOrEquations && ans.keyFormulasOrEquations.length > 0) {
          checkPageBreak(12);
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(8.5);
          doc.setTextColor(120, 53, 15);
          const formulaLines = doc.splitTextToSize(`Formula / Equation: ${ans.keyFormulasOrEquations.join(' | ')}`, contentWidth - 6);
          doc.text(formulaLines, margin + 3, y);
          y += formulaLines.length * 4.2 + 2;
        }

        y += 4;
        doc.setDrawColor(226, 232, 240);
        doc.line(margin, y, pageWidth - margin, y);
        y += 5;
      });
    }

    // --- SECOND PASS: WATERMARK & PAGE NUMBERS ON EVERY PAGE ---
    const totalPages = doc.getNumberOfPages();

    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);

      // 1. Ravi Kishan Watermark on Every Page
      if (watermark && watermark.enabled) {
        doc.saveGraphicsState();
        // Light gray RGB
        doc.setTextColor(170, 180, 195);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(watermark.fontSize || 54);

        // Apply opacity via GState if supported in jsPDF
        try {
          const GState = (doc as any).GState;
          if (GState) {
            doc.setGState(new GState({ opacity: watermark.opacity || 0.12 }));
          }
        } catch {
          // Fallback gracefully
        }

        // Draw rotated watermark in the center of the page
        const textToDraw = watermark.text || 'Ravi Kishan';
        doc.text(textToDraw, pageWidth / 2, pageHeight / 2, {
          align: 'center',
          angle: watermark.rotation !== undefined ? watermark.rotation : -35,
        });

        doc.restoreGraphicsState();
      }

      // 2. Footer on Every Page
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184); // slate-400

      // Left footer
      doc.text('Paper Genius AI • Smart Question Paper Generator', margin, pageHeight - 8);

      // Center footer watermark indicator
      if (watermark && watermark.enabled) {
        doc.text(`Watermark: ${watermark.text || 'Ravi Kishan'}`, pageWidth / 2, pageHeight - 8, { align: 'center' });
      }

      // Right footer page count
      doc.text(`Page ${p} of ${totalPages}`, pageWidth - margin, pageHeight - 8, { align: 'right' });

      // Subtle footer divider line
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
    }

    // Determine filename
    const sanitizedTitle = (paper.title || 'Question_Paper').replace(/[^a-zA-Z0-9_-]/g, '_');
    const suffix = isAnswerKey ? '_Answer_Key' : isDetailed ? '_Solutions' : '_Question_Paper';
    const filename = `${sanitizedTitle}${suffix}.pdf`;

    // Trigger download
    doc.save(filename);
    return true;
  } catch (err) {
    console.error('Error generating PDF:', err);
    return false;
  }
}
