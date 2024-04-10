import json
import logging
import os
import requests

#==============================
# ロガーの設定
#==============================
logger = logging.getLogger()
logger.setLevel(logging.INFO)

#==============================
# 環境変数の取得
#==============================
CLIENT_ID = os.getenv('CLIENT_ID')
CLIENT_SECRET = os.getenv('CLIENT_SECRET')
REFRESH_TOKEN = os.getenv('REFRESH_TOKEN')
SCRIPT_ID = os.getenv('SCRIPT_ID')


def lambda_handler(event, context):
    #==============================
    # URLなどの設定
    #==============================
    gas_url = f'https://script.googleapis.com/v1/scripts/{SCRIPT_ID}:run'
    
    messages = []
    for m in event['Records']:
        messages.append(m)

    #==============================
    # アクセストークンの取得
    #==============================
    token_url = 'https://www.googleapis.com/oauth2/v4/token'
    token_headers = {
        'Content-type': 'application/json',
    }
    token_body = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'grant_type': 'refresh_token',
        'refresh_token': REFRESH_TOKEN
    }

    token_response = requests.post(url=token_url, headers=token_headers, data=json.dumps(token_body)).json()

    if 'access_token' not in token_response:
        logger.fatal(token_response['error'])
        return

    access_token = token_response['access_token']

    #==============================
    # リクエスト送信
    #==============================
    request_headers = {
        'Authorization': f'Bearer {access_token}'
    }
    
    for m in messages:
        gas_request_body = {
            'function': 'doPost',
            'parameters': json.loads(m['body'])[0]
        }
        logger.info(gas_request_body)
        response = requests.post(url=gas_url, headers=request_headers, data=json.dumps(gas_request_body))

    return
