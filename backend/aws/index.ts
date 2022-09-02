import * as AWS from "aws-sdk";
import * as dotenv from 'dotenv';

dotenv.config();

const region = process.env.AWS_REGION || '';
const accessKeyId = process.env.AWS_ACCESS_KEY_ID || '';
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || '';

AWS.config.update({
  region,
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey
});

export const s3 = new AWS.S3();
