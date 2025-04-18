import AWS from "aws-sdk";

const s3 = new AWS.S3({
    endpoint: process.env.ZATA_ENDPOINT,
    accessKeyId: process.env.ZATA_ACCESS_KEY,
    secretAccessKey: process.env.ZATA_SECRET_KEY,
    s3ForcePathStyle: true,
    signatureVersion: "v4",
});

export default s3;
