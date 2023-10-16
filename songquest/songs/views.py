from rest_framework.parsers import FileUploadParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status, viewsets
from .models import Song
from .serializers import SongSerializer


class SongUploadView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request, *args, **kwargs):
        serializer = SongSerializer(data=request.data)
        print(request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class FileUploadView(APIView):
#     parser_classes = [FileUploadParser]

#     def post(self, request, *args, **kwargs):
#         file_obj = request.FILES.get('audio_file')
#         if file_obj:
#             # Process the file here
#             print(file_obj)
#             serializer = SongSerializer(data={
#                 'audio_file': file_obj,
#                 'title': file_obj.name,
#                 'artist': file_obj.artist,
#                 'duration': file_obj.duration,
#             })
#             if serializer.is_valid():
#                 serializer.save()
#                 return Response(serializer.data, status=status.HTTP_201_CREATED)
#             else:
#                 return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#         else:
#             return Response({'error': 'No file was uploaded'}, status=status.HTTP_400_BAD_REQUEST)


class SongViewSet(viewsets.ModelViewSet):
    queryset = Song.objects.all()
    serializer_class = SongSerializer
