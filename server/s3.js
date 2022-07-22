const fs = require("fs");
const aws = require("aws-sdk");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("../secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const Bucket = "mano";

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

function s3upload(request, response, next) {
    console.log("s3", request.file.path);
    if (!request.file) {
        console.log("s3 - missing file!");
        // end the request with a 400
        return;
    }

    // log request.file here to extract what you need
    console.log(request.file);
    s3.putObject({
        Bucket,
        ACL: "public-read",
        Key: request.file.filename,

        Body: fs.createReadStream(request.file.path),
        ContentType: request.file.mimetype,
        ContentLength: request.file.size,
    })
        .promise()
        .then(() => {
            console.log("s3 - upload-successful");
            // go next!
            next();
        })
        .catch((error) => {
            console.log("s3 - error uploading", error);
            // end the request with a 500
        });
}

module.exports = {
    Bucket,
    s3upload,
};
