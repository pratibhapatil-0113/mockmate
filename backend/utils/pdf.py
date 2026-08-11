import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def generate_pdf_report(candidate_name, role, date, overall_score, metrics, summary, recommendations, questions, output_path):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    
    # Custom Palette
    NAVY = colors.HexColor("#0B0F19")
    PURPLE = colors.HexColor("#6366F1")
    CYAN = colors.HexColor("#06B6D4")
    TEXT_DARK = colors.HexColor("#1E293B")
    BG_LIGHT = colors.HexColor("#F8FAFC")

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        textColor=NAVY,
        spaceAfter=4
    )
    subtitle_style = ParagraphStyle(
        'SubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        textColor=PURPLE,
        spaceAfter=15
    )
    heading_style = ParagraphStyle(
        'SectionHeader',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=14,
        textColor=NAVY,
        spaceBefore=10,
        spaceAfter=6
    )
    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        textColor=TEXT_DARK,
        leading=14
    )
    score_style = ParagraphStyle(
        'BigScore',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=32,
        textColor=PURPLE,
        alignment=1
    )

    story = []

    # Header
    story.append(Paragraph("MockMate Interview Report", title_style))
    story.append(Paragraph("AI-Powered Interview Simulation & Evaluation", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=PURPLE, spaceAfter=15))

    # Candidate Meta Table
    meta_data = [
        [Paragraph(f"<b>Candidate:</b> {candidate_name}", body_style), Paragraph(f"<b>Role:</b> {role}", body_style)],
        [Paragraph(f"<b>Date:</b> {date}", body_style), Paragraph(f"<b>Platform:</b> MockMate AI Cockpit 1.0", body_style)]
    ]
    t_meta = Table(meta_data, colWidths=[270, 270])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), BG_LIGHT),
        ('PADDING', (0, 0), (-1, -1), 8),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#CBD5E1")),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 15))

    # Score & Metrics Section
    score_data = [
        [
            Paragraph(f"<b>OVERALL SCORE</b><br/><br/><font color='#6366F1' size=28><b>{overall_score} / 100</b></font>", ParagraphStyle('CenterText', alignment=1, fontName='Helvetica', leading=20)),
            Paragraph(
                f"<b>Technical Score:</b> {metrics.get('technical', 86)}%<br/>"
                f"<b>Communication:</b> {metrics.get('communication', 79)}%<br/>"
                f"<b>Problem Solving:</b> {metrics.get('problem_solving', 90)}%<br/>"
                f"<b>Confidence:</b> {metrics.get('confidence', 76)}%",
                body_style
            )
        ]
    ]
    t_score = Table(score_data, colWidths=[200, 340])
    t_score.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F1F5F9")),
        ('PADDING', (0, 0), (-1, -1), 12),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#94A3B8")),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(t_score)
    story.append(Spacer(1, 15))

    # AI Summary
    story.append(Paragraph("AI Executive Summary", heading_style))
    story.append(Paragraph(summary, body_style))
    story.append(Spacer(1, 12))

    # Recommendations
    story.append(Paragraph("Actionable Recommendations", heading_style))
    rec_text = ""
    for r in recommendations:
        rec_text += f"• {r}<br/>"
    story.append(Paragraph(rec_text, body_style))
    story.append(Spacer(1, 15))

    # Question breakdown
    if questions:
        story.append(Paragraph("Detailed Question Breakdown", heading_style))
        q_rows = [["#", "Question & Answer Snippet", "Score"]]
        for idx, q in enumerate(questions, 1):
            q_text = f"<b>Q:</b> {q.get('question_text', '')}<br/><font color='#475569'><b>A:</b> {q.get('user_answer', 'N/A')}</font>"
            score_val = f"{q.get('score', 8.0)}/10"
            q_rows.append([str(idx), Paragraph(q_text, body_style), score_val])

        t_q = Table(q_rows, colWidths=[25, 445, 70])
        t_q.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), NAVY),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
            ('PADDING', (0, 0), (-1, -1), 6),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ]))
        story.append(t_q)

    doc.build(story)
    return output_path
