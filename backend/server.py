from io import BytesIO
from flask import (
    Flask, 
    request, 
    jsonify, 
    send_file, 
    Response
)
from file_handling.file_parser import Parser
from file_handling.output_file import OutputExam


app = Flask(__name__)

@app.route('/upload', methods=['POST'])
def upload_file() -> tuple[Response, int] | Response:
    if 'uploaded_file' not in request.files:
        return jsonify({'success': False, 'error': 'No file uploaded'}), 400
    
    file = request.files['uploaded_file']
    
    if file.filename.endswith('.pdf'):
        pdf_bytes = BytesIO(file.read())
        parser = Parser(pdf_bytes)
        extracted_text = parser.get_full_content()

        output_exam = OutputExam(extracted_text)
        word_file = output_exam.get_word_file()

        return send_file(
            word_file,
            mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            as_attachment=True,
            download_name='output.docx'
        )
    else:
        return jsonify({'success': False, 'error': 'Only PDF files are allowed'}), 400



if __name__ == '__main__':
    app.run(debug=True)