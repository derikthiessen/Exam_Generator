from io import BytesIO
from docx import Document
import fitz
from flask import (
    Flask, 
    request, 
    jsonify, 
    send_file, 
    Response
)
from file_handling.file_parser import Parser


app = Flask(__name__)

@app.route('/upload', methods=['POST'])
def upload_file() -> tuple[Response, int] | Response:
    if 'uploaded_file' not in request.files:
        return jsonify({'success': False, 'error': 'No file uploaded'}), 400
    
    file = request.files['uploaded_file']
    
    if file.filename.endswith('.pdf'):
        pdf_bytes = BytesIO(file.read())
        parser = Parser(pdf_bytes)
        extracted_text = parser.full_content

        word_file = convert_text_to_word(extracted_text)

        return send_file(
            word_file,
            mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            as_attachment=True,
            download_name='output.docx'
        )
    else:
        return jsonify({'success': False, 'error': 'Only PDF files are allowed'}), 400

def convert_text_to_word(text):
    doc = Document()
    doc.add_paragraph(text)
    word_file = BytesIO()
    doc.save(word_file)
    word_file.seek(0)
    return word_file

if __name__ == '__main__':
    app.run(debug=True)
