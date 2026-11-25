from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph, SimpleDocTemplate

fonts = Path("/System/Library/Fonts/Supplemental")
pdfmetrics.registerFont(TTFont("Arial", str(fonts / "Arial.ttf")))
pdfmetrics.registerFont(TTFont("ArialBold", str(fonts / "Arial Bold.ttf")))
styles = {
    "title": ParagraphStyle("Title", fontName="ArialBold", fontSize=22, leading=27, spaceAfter=12, textColor=colors.HexColor("#183153")),
    "heading": ParagraphStyle("Heading", fontName="ArialBold", fontSize=13, leading=17, spaceBefore=11, spaceAfter=4, textColor=colors.HexColor("#183153"), keepWithNext=True),
    "body": ParagraphStyle("Body", fontName="Arial", fontSize=11, leading=16, spaceAfter=7, textColor=colors.HexColor("#202939")),
}
out = Path("output/pdf/23120205_HW06_Member2_Technical.pdf")
out.parent.mkdir(parents=True, exist_ok=True)
story = []
for line in Path("reports/main-report.md").read_text().splitlines():
    if line.startswith("## "):
        style, content = "heading", line[3:]
    elif line.startswith("# "):
        style, content = "title", line[2:]
    elif line.strip():
        style, content = "body", line
    else:
        continue
    story.append(Paragraph(escape(content), styles[style]))
SimpleDocTemplate(str(out), pagesize=A4, title="HW06 API Testing - Member 2").build(story)
