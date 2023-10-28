import csv

from clients.models import Block, BlockField, Client, NetfreeUser
from clients.resources import NetfreeUserExportResource
from clients.serializer import ClientAttributeSerializer, NetfreeUserSerializer,ClientAttributeSerializerCustom,ClientListSerializer, get_blocks
from django.http import HttpResponse
from eav.models import Attribute
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


# Create your views here.
class ClientsList(APIView):
    def get(self, request):
        clients = Client.objects.all().order_by('id')
        data = []
        blocks = Block.objects.all()
        fields = []
        for block in blocks:
            block_info = BlockField.objects.filter(block=block,display=True).order_by('display_order')
            for block_field in block_info:
                fields.append(block_field.attribute.name)

        client_data1 = {}
        for field in fields:
            client_data1[field]=''
        for client in clients:
            client_data = client_data1.copy()
            client_data['id']=client.id
            for client_eav in client.eav_values.all():
                if client_eav.attribute.name in fields:
                    client_data[client_eav.attribute.name] = client_eav._get_value()
            data.append(client_data)

        return Response({
            "success": True,
            'field':fields,
            "data": data
        })

    def post(self, request):
        data = self.request.data
        fields = data.get('fields',[])
        aa = {}
        client = Client()
        seleizer_data = get_blocks()
        for field in fields:
            for key, item in field.items():
                key_data = seleizer_data.get(key)
                print(key_data)
                if not key_data:
                    return Response({"error": "fields are invaild"}, status=status.HTTP_400_BAD_REQUEST)
                if key_data.get('required') and not key_data.get('defaultvalue'):
                    if item == "" or not item:
                        return Response({"error": "Field is required"}, status=status.HTTP_400_BAD_REQUEST)
                if key_data.get('unique'):
                    dicts = {f'eav__{key}':item}
                    obj = Client.objects.filter(**dicts).first()
                    if obj:
                        return Response({"error": f"{key} is already exist"}, status=status.HTTP_400_BAD_REQUEST)
                if key_data.get('defaultvalue'):
                    if item == "" or not item:
                        item = key_data.get('defaultvalue')

                attr_name = f'{key}'
                aa[attr_name]=item
                setattr(client.eav,attr_name,item)
        client.save()
        return Response({
                    "success": True,
                    "data": data
                }, status=status.HTTP_201_CREATED)


class ClientsDetail(APIView):
    def get_object(self, pk):
        try:
            return Client.objects.get(pk=pk)
        except Client.DoesNotExist:
            return Client(status=status.HTTP_404_NOT_FOUND)

    def get(self, request, pk):
        client = self.get_object(pk)
        serializer = ClientListSerializer(client)
        return Response(serializer.data)
    def put(self, request,pk):
        data = self.request.data
        fields = data.get('fields',[])
        id = pk
        client = Client.objects.filter(id=id).first()
        for field in fields:
            for key, item in field.items():
                attr_name = f'{key}'
                setattr(client.eav,attr_name,item)
        client.save()

        return Response({
                    "success": True,
                    "data": data
                }, status=status.HTTP_206_PARTIAL_CONTENT)

    def delete(self, request, pk):
        client = self.get_object(pk)
        try:
            client = Client.objects.get(pk=pk)
        except Client.DoesNotExist:
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
    
class ClientsFields(APIView):
    def check_datatype(self,option):
        type_dict = {
                'text' : "TYPE_TEXT" ,
                'email' : "TYPE_TEXT" ,
                'float': 'TYPE_FLOAT',
                'number': 'TYPE_INT',
                'int': 'TYPE_INT',
                'phone': 'TYPE_INT',
                'date': 'TYPE_DATE',
                'checkbox': 'TYPE_BOOLEAN',
                'object': 'TYPE_OBJECT',
                'enum': 'TYPE_ENUM',
                'json': 'TYPE_JSON',
                'csv': 'TYPE_CSV',
            }
        return type_dict.get(option)
    def get(self, request):
        data = []
        blocks = Block.objects.all()
        for i in blocks:
            bb = {}
            attr = []
            block_info = BlockField.objects.filter(block=i)
            for i1 in block_info:
                client_data = ClientAttributeSerializer(i1).data
                attr.append(client_data)
            bb['block_id'] = i.id
            bb['block'] = i.name
            bb['field'] = attr
            data.append(bb)
        return Response({'result': data}, status=status.HTTP_200_OK)

    def post(self, request):
        data = self.request.data
        is_block_created = data.get('is_block_created')
        if is_block_created:
            block = Block.objects.create(name=data.get('name'))
            return Response({'data': data}, status=status.HTTP_201_CREATED)
        if not self.check_datatype(data.get('data_type')):
            return Response({'errors': [{'data_type':"Data Type not valid"}]}, status=status.HTTP_400_BAD_REQUEST)
        block = Block.objects.filter(id=data.get('block_id')).first()
        if not block:
            return Response({'errors': [{'block':"block not valid"}]}, status=status.HTTP_400_BAD_REQUEST)
        
        datatype = getattr(Attribute,self.check_datatype(data.get('data_type'))) 
        attr_check = Attribute.objects.filter(name=data.get('name').capitalize(), datatype=datatype).first()
        if not attr_check:
            att,created = Attribute.objects.get_or_create(name=data.get('name'), datatype=datatype)
            BlockField.objects.create(block=block,attribute=att,datatype=data.get('data_type'))
            return Response({'data': "created"}, status=status.HTTP_201_CREATED)
        return Response({'data': 'already exist'}, status=status.HTTP_400_BAD_REQUEST)



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
