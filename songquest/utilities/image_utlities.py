from PIL import Image
from io import BytesIO
from django.core.files.base import ContentFile

def resize_image(image, size=(300, 300)):
    """Resizes an image to the specified size."""
    im = Image.open(image)
    im.thumbnail(size, Image.Resampling.LANCZOS)
    
    output = BytesIO()
    im.save(output, format='JPEG', quality=85)
    output.seek(0)
    
    content_file = ContentFile(output.read())
    file_name = f"{image.name.split('.')[0]}_thumbnail.jpg"
    content_file.name = file_name
    
    return content_file
