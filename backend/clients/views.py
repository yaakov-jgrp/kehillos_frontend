from clients.resources import NetfreeUserExportResource
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from clients.models import NetfreeUser
from clients.serializer import NetfreeUserSerializer
import csv
# Create your views here.
class ClientsList(APIView):
    def get(self, request):
        categories = NetfreeUser.objects.all().order_by('id')
        serializer = NetfreeUserSerializer(categories, many=True)
        return Response(
                {
                    "success": True,
                    "data": serializer.data
                }
            )

    def post(self, request):
        serializer = NetfreeUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                    "success": True,
                    "data": serializer.data
                }, status=status.HTTP_201_CREATED)
        errors = {}
        for field, value in serializer.errors.items():
            errors[field] = value[0] if isinstance(value, list) else value
            break
        return Response({'error': [errors]}, status=status.HTTP_400_BAD_REQUEST)
    

class ClientsDetail(APIView):
    def get_object(self, pk):
        try:
            return NetfreeUser.objects.get(pk=pk)
        except NetfreeUser.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def get(self, request, pk):
        client = self.get_object(pk)
        serializer = NetfreeUserSerializer(client)
        return Response(serializer.data)

    def put(self, request, pk):
        client = self.get_object(pk)
        serializer = NetfreeUserSerializer(client, data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        errors = {}
        for field, value in serializer.errors.items():
            errors[field] = value[0] if isinstance(value, list) else value
            break
        return Response({'error': [errors]}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        client = self.get_object(pk)
        try:
            client = NetfreeUser.objects.get(pk=pk)
        except NetfreeUser.DoesNotExist:
            return Response({
                    "success": False,
                    "message": "Client not found"
                },status=status.HTTP_404_NOT_FOUND)
        client.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

class ClientsExportData(APIView):
    def get(self, request):
        dataset = NetfreeUserExportResource().export()

        response = HttpResponse(dataset.csv, content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="clients.csv"'
        return response

class ClientsImportData(APIView):
    def post(self, request):
        file = request.data.get('file')
        if not file or not file.name.endswith('.csv'):
            return Response({'error': 'Invalid CSV file'}, status=status.HTTP_400_BAD_REQUEST)

        csv_file = file.read().decode('UTF-8')
        csv_reader = csv.DictReader(csv_file.splitlines())
        count = 0
        error_details = []
        for row_number, row in enumerate(csv_reader, start=1):
            serializer = NetfreeUserSerializer(data=row)
            if serializer.is_valid():
                serializer.save()
                count+=1
            else:
                errors = {}
            for field, value in serializer.errors.items():
                errors[field] = value[0] if isinstance(value, list) else value
                break
            error_details.append({'row': row_number, 'data': row, 'error': [errors]})

        if error_details:
            return Response({'errors': error_details, "Total saved":count}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'message': 'CSV file uploaded successfully'}, status=status.HTTP_201_CREATED)
