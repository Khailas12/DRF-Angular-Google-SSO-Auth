from dotenv import load_dotenv
from rest_framework.views import APIView
from rest_framework.response import Response
from google.auth.transport import requests
from google.oauth2 import id_token
import os

load_dotenv()


class GoogleView(APIView):
    def post(self, request):
        id_token_value = request.data.get('id_token')

        if not id_token_value:
            return Response({'message': 'id_token is required'}, status=400)

        try:
            id_info = id_token.verify_oauth2_token(id_token_value, requests.Request(), os.environ.get('GOOGLE_CLIENT_ID'))

            if not self.is_valid_issuer(id_info):
                raise ValueError('Wrong issuer.')

            return Response(id_info)
        except ValueError as err:
            # Invalid token
            print(err)
            return Response({'message': 'Invalid token'}, status=400)

    def is_valid_issuer(self, id_info):
        valid_issuers = ['accounts.google.com', 'https://accounts.google.com']
        return id_info.get('iss') in valid_issuers if id_info else False
    
    
# class GoogleView(APIView):
#     def post(self, request):
#         token = {'id_token': request.data.get('id_token')}
#         print(token)

#         try:
#             id_info = id_token.verify_oauth2_token(token['id_token'], requests.Request(), os.environ.get('GOOGLE_CLIENT_ID'))
#             print(id_info)

#             if id_info['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
#                 raise ValueError('Wrong issuer.')

#             return Response(id_info)
#         except ValueError as err:
#             # Invalid token
#             print(err)
#             content = {'message': 'Invalid token'}
#             return Response(content)


