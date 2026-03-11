"""
generate_report.py
Backend script to generate a professional PDF student report.
Call from Flask: from generate_report import generate_pdf
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.platypus import Flowable
import io
from datetime import datetime

# ── BRAND COLOURS ──────────────────────────────────────────────────────────────
DARK       = colors.HexColor("#1e293b")
BLUE       = colors.HexColor("#2563eb")
INDIGO     = colors.HexColor("#6366f1")
GREEN      = colors.HexColor("#16a34a")
PURPLE     = colors.HexColor("#9333ea")
ORANGE     = colors.HexColor("#ea580c")
LIGHT_BLUE = colors.HexColor("#eff6ff")
LIGHT_GREY = colors.HexColor("#f8fafc")
MID_GREY   = colors.HexColor("#94a3b8")
BORDER     = colors.HexColor("#e2e8f0")

STREAM_COLORS = {
    "Science Stream":                   BLUE,
    "Commerce Stream":                  GREEN,
    "Humanities Stream":                PURPLE,
    "Engineering / Technical Stream":   ORANGE,
}

STREAM_SUBJECTS = {
    "Science Stream":                 ["Mathematics", "Physical Sciences", "Life Sciences", "Geography / Agricultural Sciences"],
    "Commerce Stream":                ["Mathematics", "Accounting", "Business Studies", "Economics"],
    "Humanities Stream":              ["Mathematical Literacy", "History", "Tourism", "Geography", "Consumer Studies"],
    "Engineering / Technical Stream": ["Technical Mathematics", "Technical Sciences", "Civil Technology / Electrical Technology", "Engineering Graphics and Design"],
}

STREAM_CAREERS = {
    "Science Stream":                 ["Doctor", "Engineer", "Pharmacist", "Environmental Scientist", "Veterinarian", "Biotechnologist"],
    "Commerce Stream":                ["Accountant", "Financial Analyst", "Entrepreneur", "Economist", "Auditor", "Investment Banker"],
    "Humanities Stream":              ["Journalist", "Social Worker", "Teacher", "Tourism Manager", "Historian", "Psychologist"],
    "Engineering / Technical Stream": ["Civil Engineer", "Electrician", "Draughtsperson", "Mechanical Technician", "Construction Manager", "IT Technician"],
}

# ── HORIZONTAL BAR FLOWABLE ────────────────────────────────────────────────────
class ScoreBar(Flowable):
    def __init__(self, label, pct, color, width=430):
        Flowable.__init__(self)
        self.label  = label
        self.pct    = pct
        self.color  = color
        self.width  = width
        self.height = 22

    def draw(self):
        # Label
        self.canv.setFont("Helvetica", 10)
        self.canv.setFillColor(DARK)
        self.canv.drawString(0, 6, self.label)
        # Track
        bar_x = 210
        bar_w = self.width - bar_x - 40
        self.canv.setFillColor(BORDER)
        self.canv.roundRect(bar_x, 4, bar_w, 12, 4, fill=1, stroke=0)
        # Fill
        fill_w = max(6, bar_w * self.pct / 100)
        self.canv.setFillColor(self.color)
        self.canv.roundRect(bar_x, 4, fill_w, 12, 4, fill=1, stroke=0)
        # Percentage
        self.canv.setFillColor(DARK)
        self.canv.setFont("Helvetica-Bold", 9)
        self.canv.drawRightString(self.width, 6, f"{self.pct}%")


# ── MAIN GENERATOR ─────────────────────────────────────────────────────────────
def generate_pdf(student: dict, stream_scores: dict, math_results: dict = None) -> bytes:
    """
    student = {
        name, surname, school, grade, province, aps, hasMaths,
        mathsLevel, marks: { english: 72, maths: 65, ... }
    }
    stream_scores = { "Science Stream": 74, "Commerce Stream": 52, ... }
    math_results  = { correct: 5, total: 7, pct: 71 }  (optional)
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer, pagesize=A4,
        leftMargin=2*cm, rightMargin=2*cm,
        topMargin=2*cm,  bottomMargin=2*cm,
        title=f"Stablym Report – {student.get('name','')} {student.get('surname','')}",
    )

    styles = getSampleStyleSheet()
    story  = []

    # ── Helpers ──────────────────────────────────────────────────────────────
    def H(text, size=14, color=DARK, bold=True, align=TA_LEFT, space_before=6, space_after=4):
        f = "Helvetica-Bold" if bold else "Helvetica"
        return Paragraph(text, ParagraphStyle("h", fontName=f, fontSize=size,
            textColor=color, alignment=align, spaceBefore=space_before, spaceAfter=space_after))

    def P(text, size=10, color=DARK, align=TA_LEFT, italic=False, space_after=4):
        f = "Helvetica-Oblique" if italic else "Helvetica"
        return Paragraph(text, ParagraphStyle("p", fontName=f, fontSize=size,
            textColor=color, alignment=align, spaceAfter=space_after, leading=15))

    def HR(color=BORDER, thickness=1, space=8):
        return HRFlowable(width="100%", thickness=thickness, color=color,
                          spaceAfter=space, spaceBefore=space)

    def SP(h=8):
        return Spacer(1, h)

    # ── Sorted streams ───────────────────────────────────────────────────────
    sorted_streams = sorted(stream_scores.items(), key=lambda x: x[1], reverse=True)
    top_stream     = sorted_streams[0][0]
    stream_color   = STREAM_COLORS.get(top_stream, BLUE)

    # ════════════════════════════════════════════════════════════════════════
    # PAGE 1: HEADER + STUDENT INFO + RESULT
    # ════════════════════════════════════════════════════════════════════════

    # Header banner using Table
    date_str = datetime.now().strftime("%d %B %Y")
    header_data = [[
        Paragraph("<font color='white'><b>STABLYM</b></font>",
                  ParagraphStyle("logo", fontName="Helvetica-Bold", fontSize=28, textColor=colors.white, leading=32)),
        Paragraph(f"<font color='white'>Subject Stream Report<br/><font size='9'>{date_str}</font></font>",
                  ParagraphStyle("rt", fontName="Helvetica", fontSize=13, textColor=colors.white, alignment=TA_RIGHT, leading=18)),
    ]]
    header_table = Table(header_data, colWidths=["50%","50%"])
    header_table.setStyle(TableStyle([
        ("BACKGROUND",  (0,0), (-1,-1), DARK),
        ("TOPPADDING",  (0,0), (-1,-1), 16),
        ("BOTTOMPADDING",(0,0),(-1,-1), 16),
        ("LEFTPADDING", (0,0), (0,-1),  16),
        ("RIGHTPADDING",(-1,0),(-1,-1), 16),
        ("VALIGN",      (0,0), (-1,-1), "MIDDLE"),
    ]))
    story.append(header_table)
    story.append(SP(16))

    # ── Student info table ───────────────────────────────────────────────────
    story.append(H("Student Information", size=13, color=DARK))
    story.append(HR())

    info_items = [
        ["Full Name",  f"{student.get('name','')} {student.get('surname','')}"],
        ["School",     student.get("school","—")],
        ["Grade",      f"Grade {student.get('grade','—')}"],
        ["Province",   student.get("province","—")],
        ["APS Score",  f"{student.get('aps',0)} / 42"],
        ["Maths Level",student.get("mathsLevel","—")],
    ]
    info_table = Table(info_items, colWidths=[120, 320])
    info_table.setStyle(TableStyle([
        ("FONTNAME",     (0,0), (0,-1), "Helvetica-Bold"),
        ("FONTNAME",     (1,0), (1,-1), "Helvetica"),
        ("FONTSIZE",     (0,0), (-1,-1), 10),
        ("TEXTCOLOR",    (0,0), (0,-1), MID_GREY),
        ("TEXTCOLOR",    (1,0), (1,-1), DARK),
        ("TOPPADDING",   (0,0), (-1,-1), 5),
        ("BOTTOMPADDING",(0,0), (-1,-1), 5),
        ("ROWBACKGROUNDS",(0,0),(-1,-1),[colors.white, LIGHT_GREY]),
        ("LEFTPADDING",  (0,0), (-1,-1), 8),
    ]))
    story.append(info_table)
    story.append(SP(16))

    # ── Recommended stream banner ─────────────────────────────────────────────
    story.append(H("Recommended Subject Stream", size=13, color=DARK))
    story.append(HR())

    rec_data = [[
        H(top_stream, size=20, color=colors.white, space_before=0, space_after=0),
        P("Your strongest match based on your interests,\naptitude, grades, and learning style.",
          size=10, color=colors.white, align=TA_RIGHT)
    ]]
    rec_table = Table(rec_data, colWidths=["60%","40%"])
    rec_table.setStyle(TableStyle([
        ("BACKGROUND",  (0,0), (-1,-1), stream_color),
        ("TOPPADDING",  (0,0), (-1,-1), 18),
        ("BOTTOMPADDING",(0,0),(-1,-1), 18),
        ("LEFTPADDING", (0,0), (-1,-1), 16),
        ("RIGHTPADDING",(-1,0),(-1,-1), 16),
        ("VALIGN",      (0,0), (-1,-1), "MIDDLE"),
        ("ROUNDEDCORNERS", (0,0), (-1,-1), [8,8,8,8]),
    ]))
    story.append(rec_table)
    story.append(SP(16))

    # ── Stream score bars ─────────────────────────────────────────────────────
    story.append(H("Stream Compatibility Scores", size=12, color=DARK))
    story.append(HR())
    for stream_name, pct in sorted_streams:
        c = STREAM_COLORS.get(stream_name, BLUE)
        story.append(ScoreBar(stream_name, pct, c))
        story.append(SP(6))
    story.append(SP(10))

    # ── Subjects ──────────────────────────────────────────────────────────────
    subjects = STREAM_SUBJECTS.get(top_stream, [])
    careers  = STREAM_CAREERS.get(top_stream, [])

    subj_data  = [[P(f"• {sub}", size=10)] for sub in subjects]
    career_data = [[P(f"• {car}", size=10)] for car in careers]

    cols_data = [[
        [H("Subjects You Will Take", size=11, color=DARK),
         HR(color=BORDER, thickness=0.5),
         Table(subj_data, colWidths=[200],
               style=[("TOPPADDING",(0,0),(-1,-1),3),("BOTTOMPADDING",(0,0),(-1,-1),3)])],
        [H("Possible Career Paths", size=11, color=DARK),
         HR(color=BORDER, thickness=0.5),
         Table(career_data, colWidths=[200],
               style=[("TOPPADDING",(0,0),(-1,-1),3),("BOTTOMPADDING",(0,0),(-1,-1),3)])],
    ]]
    # Flatten the nested list into a proper 2-column table
    left_items  = [H("Subjects You Will Take", size=11, color=stream_color)] + \
                  [P(f"• {sub}", size=10) for sub in subjects]
    right_items = [H("Possible Career Paths", size=11, color=stream_color)] + \
                  [P(f"• {car}", size=10) for car in careers]

    max_rows = max(len(left_items), len(right_items))
    left_items  += [P("") for _ in range(max_rows - len(left_items))]
    right_items += [P("") for _ in range(max_rows - len(right_items))]

    two_col = Table([[l, r] for l, r in zip(left_items, right_items)], colWidths=["50%","50%"])
    two_col.setStyle(TableStyle([
        ("VALIGN",       (0,0), (-1,-1), "TOP"),
        ("TOPPADDING",   (0,0), (-1,-1), 3),
        ("BOTTOMPADDING",(0,0), (-1,-1), 3),
        ("LEFTPADDING",  (0,0), (-1,-1), 4),
    ]))
    story.append(two_col)

    # ════════════════════════════════════════════════════════════════════════
    # PAGE 2: GRADES + MATH CHALLENGE + ADVICE
    # ════════════════════════════════════════════════════════════════════════
    story.append(SP(20))
    story.append(HR(color=DARK, thickness=1.5))
    story.append(SP(12))

    # ── Subject marks ─────────────────────────────────────────────────────────
    marks = student.get("marks", {})
    SUBJECT_LABELS = {
        "english":    "English HL / FAL",
        "maths":      "Mathematics",
        "mathslit":   "Mathematical Literacy",
        "science":    "Physical Sciences",
        "life":       "Life Sciences",
        "accounting": "Accounting",
        "business":   "Business Studies",
        "economics":  "Economics",
        "history":    "History",
        "geography":  "Geography",
        "lifeorien":  "Life Orientation",
        "technical":  "Technical Subject",
    }

    def aps_from_mark(m):
        if m >= 80: return 7
        if m >= 70: return 6
        if m >= 60: return 5
        if m >= 50: return 4
        if m >= 40: return 3
        if m >= 30: return 2
        return 1

    def symbol(m):
        if m >= 80: return "A (7)"
        if m >= 70: return "B (6)"
        if m >= 60: return "C (5)"
        if m >= 50: return "D (4)"
        if m >= 40: return "E (3)"
        if m >= 30: return "F (2)"
        return "G (1)"

    if marks:
        story.append(KeepTogether([
            H("Subject Marks & APS Breakdown", size=13, color=DARK),
            HR(),
        ]))
        mark_rows = [
            [P("<b>Subject</b>", size=9), P("<b>Mark</b>", size=9, align=TA_CENTER),
             P("<b>Symbol</b>", size=9, align=TA_CENTER), P("<b>APS</b>", size=9, align=TA_CENTER)]
        ]
        for sid, lbl in SUBJECT_LABELS.items():
            if sid in marks and marks[sid] > 0:
                m   = marks[sid]
                aps_val = aps_from_mark(m)
                bg  = colors.HexColor("#d1fae5") if m >= 60 else colors.HexColor("#fef9c3") if m >= 40 else colors.HexColor("#fee2e2")
                mark_rows.append([
                    P(lbl, size=9),
                    Paragraph(f"<b>{m}%</b>", ParagraphStyle("mc", fontName="Helvetica-Bold", fontSize=10, alignment=TA_CENTER, textColor=DARK)),
                    P(symbol(m), size=9, align=TA_CENTER),
                    Paragraph(f"<b>{aps_val}</b>", ParagraphStyle("ac", fontName="Helvetica-Bold", fontSize=10, alignment=TA_CENTER,
                              textColor=colors.HexColor("#065f46") if aps_val >= 5 else colors.HexColor("#713f12") if aps_val >= 3 else colors.HexColor("#991b1b"))),
                ])
        mark_table = Table(mark_rows, colWidths=[220, 60, 80, 60])
        mark_table.setStyle(TableStyle([
            ("BACKGROUND",   (0,0), (-1,0),  DARK),
            ("TEXTCOLOR",    (0,0), (-1,0),  colors.white),
            ("FONTNAME",     (0,0), (-1,0),  "Helvetica-Bold"),
            ("FONTSIZE",     (0,0), (-1,-1), 9),
            ("TOPPADDING",   (0,0), (-1,-1), 5),
            ("BOTTOMPADDING",(0,0), (-1,-1), 5),
            ("LEFTPADDING",  (0,0), (-1,-1), 8),
            ("ROWBACKGROUNDS",(0,1),(-1,-1), [colors.white, LIGHT_GREY]),
            ("GRID",         (0,0), (-1,-1), 0.3, BORDER),
            ("ALIGN",        (1,0), (-1,-1), "CENTER"),
        ]))
        story.append(mark_table)

        # APS total row
        aps_total = student.get("aps", 0)
        aps_color = colors.HexColor("#065f46") if aps_total >= 30 else \
                    colors.HexColor("#713f12") if aps_total >= 22 else \
                    colors.HexColor("#991b1b")
        aps_row = Table([[
            P("<b>Estimated APS Total</b>", size=11),
            Paragraph(f"<font color='white'><b>{aps_total} / 42</b></font>",
                      ParagraphStyle("aps", fontName="Helvetica-Bold", fontSize=13, alignment=TA_CENTER, textColor=colors.white))
        ]], colWidths=[300, 120])
        aps_row.setStyle(TableStyle([
            ("BACKGROUND",  (1,0), (1,0),  aps_color),
            ("TOPPADDING",  (0,0), (-1,-1), 6),
            ("BOTTOMPADDING",(0,0),(-1,-1), 6),
            ("LEFTPADDING", (0,0), (-1,-1), 8),
            ("VALIGN",      (0,0), (-1,-1), "MIDDLE"),
        ]))
        story.append(aps_row)
        story.append(SP(14))

    # ── Math challenge ────────────────────────────────────────────────────────
    if math_results:
        story.append(KeepTogether([
            H("Math Challenge Results", size=13, color=DARK),
            HR(),
            P(f"Score: {math_results.get('correct',0)} / {math_results.get('total',0)} "
              f"({math_results.get('pct',0)}%)", size=11),
            P(_math_label(math_results.get("pct",0)), size=10, color=MID_GREY, italic=True),
            SP(8),
        ]))

    # ── Personalised advice ───────────────────────────────────────────────────
    story.append(H("Personalised Advice", size=13, color=DARK))
    story.append(HR())

    advice = _get_advice(top_stream, student.get("aps",0), marks)
    for tip in advice:
        story.append(P(f"• {tip}", size=10, space_after=6))

    story.append(SP(14))

    # ── Footer ────────────────────────────────────────────────────────────────
    footer_data = [[
        P("Generated by Stablym Subject Stream Selector", size=9, color=MID_GREY),
        P(f"Confidential – {student.get('name','')} {student.get('surname','')} – {date_str}",
          size=9, color=MID_GREY, align=TA_RIGHT)
    ]]
    footer = Table(footer_data, colWidths=["50%","50%"])
    footer.setStyle(TableStyle([
        ("TOPPADDING",  (0,0), (-1,-1), 8),
        ("LINEABOVE",   (0,0), (-1,-1), 0.5, MID_GREY),
    ]))
    story.append(footer)

    # ── Build ─────────────────────────────────────────────────────────────────
    doc.build(story)
    return buffer.getvalue()


def _math_label(pct):
    if pct >= 70: return "Strong performance — Pure Mathematics recommended."
    if pct >= 40: return "Moderate performance — Technical Mathematics may suit you."
    return "Consider Mathematical Literacy to build your foundation."


def _get_advice(stream, aps, marks):
    tips = []
    eng = marks.get("english", 0)
    mth = marks.get("maths", 0) or marks.get("mathslit", 0)

    if stream == "Science Stream":
        tips.append("Focus on achieving at least 60% in Mathematics and Physical Sciences to qualify for science degrees.")
        if mth < 60: tips.append("Your Mathematics mark needs improvement. Consider extra lessons or online platforms like Khan Academy.")
        tips.append("Start researching bursaries from NRF, Sasol, and NSFAS. Apply from Grade 11.")
    elif stream == "Commerce Stream":
        tips.append("Aim for at least 60% in Accounting and Mathematics to qualify for BCom programmes.")
        tips.append("The SAICA CA(SA) pathway requires strong Accounting results — start preparing early.")
        if aps < 28: tips.append("Work on improving your APS score to 28+ to access top Commerce programmes at Wits and UCT.")
    elif stream == "Humanities Stream":
        tips.append("Strong Language and communication skills are essential — read widely and practise essay writing.")
        if eng < 60: tips.append("Improving your English mark is critical for Law, Journalism, and Social Work degrees.")
        tips.append("Apply to NSFAS and the Department of Social Development bursary for Social Work funding.")
    elif stream == "Engineering / Technical Stream":
        tips.append("Technical Mathematics and Technical Sciences are your gateway subjects — aim above 60%.")
        tips.append("TVET Colleges offer N1–N6 engineering programmes if you want a practical, cost-effective path.")
        tips.append("Eskom, Transnet, and Anglo American offer bursaries specifically for engineering students — apply early.")

    if eng < 50:
        tips.append("Your English mark is below 50%. Most universities require at least 50% in English — prioritise this subject.")
    if aps >= 30:
        tips.append(f"Your APS of {aps} is strong and opens doors to most university programmes. Keep it up!")
    elif aps > 0:
        tips.append(f"Your APS of {aps} is a good start. Aim to improve it before applying to university.")

    tips.append("Visit your school's career counsellor and attend university open days in Grade 11.")
    return tips


# ── Flask route example ───────────────────────────────────────────────────────
# Add this to your app.py:
#
# from generate_report import generate_pdf
# from flask import send_file
# import io
#
# @app.route("/api/generate-report", methods=["POST"])
# def report_route():
#     data   = request.json
#     pdf_bytes = generate_pdf(data["student"], data["streamScores"], data.get("mathResults"))
#     return send_file(io.BytesIO(pdf_bytes), mimetype="application/pdf",
#                      as_attachment=True, download_name="stablym_report.pdf")