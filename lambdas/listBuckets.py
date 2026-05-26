import boto3

client = boto3.client('s3')

def main(event, context):
    response = client.list_buckets()
    buckets = response['Buckets']
    bucket_names = [bucket['Name'] for bucket in buckets]
    return bucket_names