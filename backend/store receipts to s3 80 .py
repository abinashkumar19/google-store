from flask import Flask, request, jsonify
from flask_cors import CORS
import boto3
from datetime import datetime
import traceback
import uuid

app = Flask(__name__)
CORS(app)

# AWS S3 Config
S3_BUCKET = "google-shop-abinash"
S3_REGION = "ap-northeast-1"
s3 = boto3.client("s3", region_name=S3_REGION)

@app.route('/')
def home():
    return jsonify({"message": "Receipt upload server is running ✅"}), 200


@app.route('/upload_receipt', methods=['POST'])
def upload_receipt():
    try:
        data = request.get_json()
        receipt_text = data.get("receipt_text", "")
        category = data.get("category", "others").lower().strip()

        if not receipt_text.strip():
            return jsonify({"error": "Empty receipt"}), 400

        # Generate a unique file name for each receipt
        timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
        unique_id = str(uuid.uuid4())[:8]  # short unique suffix
        file_name = f"receipt_{category}_{timestamp}_{unique_id}.txt"

        # S3 object path (category folder)
        s3_key = f"receipts/{category}/{file_name}"

        # Build the receipt content
        file_content = (
            f"----- RECEIPT -----\n"
            f"Category: {category}\n"
            f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n"
            f"-------------------\n"
            f"{receipt_text}\n"
            f"-------------------\n"
        )

        # Upload to S3 as a new object
        s3.put_object(
            Bucket=S3_BUCKET,
            Key=s3_key,
            Body=file_content.encode('utf-8'),
            ContentType='text/plain',
            ACL='public-read'
        )

        s3_url = f"https://{S3_BUCKET}.s3.{S3_REGION}.amazonaws.com/{s3_key}"
        print(f"✅ Uploaded new {category} receipt: {s3_url}")

        return jsonify({
            "message": f"New '{category}' receipt uploaded successfully ✅",
            "s3_url": s3_url
        }), 200

    except Exception as e:
        print("❌ Error uploading:")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)
