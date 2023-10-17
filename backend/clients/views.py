from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from clients.models import NetfreeUser
from clients.serializer import NetfreeUserSerializer

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
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

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
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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