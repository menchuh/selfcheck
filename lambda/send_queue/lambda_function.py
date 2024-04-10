import json
import logging
import os
import boto3

#==============================
# ロガーの設定
#==============================
logger = logging.getLogger()
logger.setLevel(logging.INFO)

def get_headers():
    return {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,DELETE,PUT,POST,GET'
    }

#==============================
# 環境変数の取得
#==============================
QUEUE_NAME = os.getenv('QUEUE_NAME')

#==============================
# AWSリソース
#==============================
sqs = boto3.resource('sqs')

def lambda_handler(event, context):
    #==============================
    # キューの指定
    #==============================
    try:
        # キューの名前を指定してインスタンスを取得
        queue = sqs.get_queue_by_name(QueueName=QUEUE_NAME)
    except:
        # 指定したキューがない場合はexceptionが返るので、キューを作成
        queue = sqs.create_queue(QueueName=QUEUE_NAME)

    #==============================
    # リクエストボディの取得
    #==============================
    if 'body' not in event:
        return {
            'statusCode': 400,
            'headers': get_headers(),
            'body': json.dumps({'error_message': 'Bad Request'})
        }

    request_body = [json.loads(event['body'])]

    #==============================
    # キューの送信
    #==============================
    try:
        queue.send_messages(Entries=[{'Id': '1', 'MessageBody': json.dumps(request_body)}])
        return {
            'statusCode': 200,
            'headers': get_headers(),
            'body': json.dumps({'message': 'OK'})
        }
    except:
        return {
            'statusCode': 500,
            'headers': get_headers(),
            'body': json.dumps({'error_message': 'Failure to send messages to the queue.'})
        }
