from docx import Document
from io import BytesIO

class OutputExam:
    def __init__(self, content: str):
        self.content = content
        self.word_file = self._create_output_exam()

    def _create_output_exam(self) -> BytesIO:
        doc = Document()

        doc.add_paragraph(self.content)

        word_file = BytesIO()

        doc.save(word_file)

        word_file.seek(0)
        
        return word_file
    
    def get_word_file(self) -> BytesIO:
        return self.word_file