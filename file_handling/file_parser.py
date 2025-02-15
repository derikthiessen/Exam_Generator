from io import BytesIO
import fitz
from typing import Tuple

class Parser:

    def __init__(self, file: BytesIO):
        self.file = file
        self.full_content, self.content_per_page = self._parse_content(self.file)

    def _parse_content(self, file_bytes: BytesIO) -> Tuple[str, dict[int, str]]:
        '''
        Converts the file from a BytesIO object to a pdf so content can be extracted.
        '''
    
        if not isinstance(file_bytes, BytesIO):
            raise TypeError(f'Input file needs to be a BytesIO object. Input type: {type(file_bytes)}')

        full_content = ''
        content_per_page = dict()

        with fitz.open('pdf', file_bytes) as file:
            for page_num, page in enumerate(file, start=1):
                page_text = page.get_text()
                full_content += page_text + '\n'
                content_per_page[page_num] = page_text
        
        return full_content, content_per_page
    
    def get_full_content(self) -> str:
        return self.full_content
    
    def get_content_per_page(self) -> str:
        return self.content_per_page