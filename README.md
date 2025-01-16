<div align="center">
 
![Index app](./doc/assets/CRUD_Bucket_s3.drawio.png)

</div>

<br>

<div align="right">
 <a href="./translation/README.es.md" target="_blank">
 <img src="./doc/assets/translation/arg-flag.jpg" width="10%" height="10%" />
 </a>
 <a href="https://github.com/andresWeitzel/CRUD_Amazon_S3_AWS" target="_blank">
 <img src="./doc/assets/translation/eeuu-flag.jpg" width="10%" height="10%" />
 </a>
</div>


<div align="center">

# CRUD\_Bucket\_S3\_AWS

</div>

<br>

CRUD model for object handling implemented with Systems Manager Parameter Store, S3 Bucket, Api-Gateway, Serverless-Framework, Lambda, NodeJs, aws-sdk-v3, among others others. AWS services are deployed locally. The project code and documentation (except technical docs) have been developed in English.

* [Functionality test playlist](https://www.youtube.com/playlist?list=PLCl11UFjHurDPyOkEXOR6JO-vUnYqd1FW)

<br>

<br>

<!------Start Index----->

## Table of Contents 📜

<details>
<summary> View </summary>

<br>

### Section 1) Description, Configuration, and Technologies

* [1.0) Project Description.](#10-description-)
* [1.1) Project Execution .](#11-project-execution-)
* [1.2) Project setup from scratch](#12-project-setup-from-scratch-)
* [1.3) Technologies.](#13-technologies-)

### Section 2) Endpoints and Examples

* [2.0) Endpoints and resources.](#20-endpoints-and-resources-)

### Section 3) Functionality Testing and References

* [3.0) Functionality Testing.](#30-functionality-testing-) 
* [3.1) References.](#31-references-)

<br>

</details>

<!------Stop Index----->

<br>

<br>

## Section 1) Description, configuration and technologies

### 1.0) Description [🔝](#index-)

<details>
<summary>View</summary>
<br>

### 1.0.0) General Description

* This app is divided into several functionalities/components. The first component or connection layer (/bucket) is the interaction with aws-sdk and the bucket. It is modularized in such a way that we have .js files for creating s3 clients, bucket reading, bucket writing, etc.
Then for the application layer (/helpers) we have header validations, request body, date formats, authentication, etc.
Next, the controller/view layer (/controllers) is defined by the CRUD operations possible in each of the defined lambdas.

### 1.0.1) Architecture and Operation Description

* The image of the aws architecture used describes the general flow of the app. Any request to the bucket starts from a client (Postman, server, etc.).
* `Step 0` : This request is received by the api-gateway and will only be validated if the correct x-api-key is found within the headers of said request.
* `Steps 1A, 1B, etc.` : All these steps correspond to an endpoint with its specific resource. For example, for uploadObject (1A) it is http://localhost:4000/dev/upload-object .... check these endpoints in [endpoints section](#section-2-endpoints-and-examples). Each lambda performs x-api-key and Bearer token verification, among others.
* `Steps 2` : The lambdas perform the corresponding ssm validations with the System Manager Parameter Store.. they validate tokens, values ​​for the s3 bucket, etc.
* `Steps 3` : The lambdas perform the necessary requests and operations against the s3 bucket (reading, updating, deleting and inserting objects).
* `Clarifications` : This operation is emulated within the same network and in a local environment with the corresponding serverless plugins.

<br>

</details>

### 1.1) Project Execution [🔝](#index-)

<details>
<summary>View</summary>
<br>

* Once a work environment has been created through an ide, we clone the project

```git
git clone https://github.com/andresWeitzel/CRUD_Bucket_S3_AWS
```

* We position ourselves on the project

```git
cd 'projectName'
```

* We install the latest LTS version of [Nodejs(v18)](https://nodejs.org/en/download)
* We install Serverless Framework globally if we have not done so already

```git
npm install -g serverless
```

* We check the installed version of Serverless

```git
sls -v
```

* We install all the necessary packages

```git
npm i
```

* The ssm variables used in the project are kept to simplify the configuration process of the project. It is recommended to add the corresponding file (serverless\_ssm.yml) to the .gitignore.
* The following script configured in the package.json of the project is in charge of
* Starting serverless-offline (serverless-offline)

```git
"scripts": {
"serverless-offline": "sls offline start",
"start": "npm run serverless-offline"
},
```

* We run the app from the terminal.

```git
npm start
```

* If a message appears indicating that port 4000 is already in use, we can terminate all dependent processes and re-run the app

```git
npx kill-port 4000
npm start
```

<br>

</details>

### 1.2) Setting up the project from scratch [🔝](#índice-)

<details>
<summary>View</summary>
<br>

* We create a work environment through an IDE, after creating a folder we position ourselves on it

```git
cd 'projectName'
```

* We install the latest LTS version of [Nodejs(v18)](https://nodejs.org/en/download)
* We install Serverless Framework globally if we have not done so yet

```git
npm install -g serverless
```

* Check the installed Serverless version

```git
sls -v
```

* Initialize a serverless template

```git
serverless create --template aws-nodejs
```

* Initialize an npm project

```git
npm init -y
```

* Install local S3

```git
npm install serverless-s3-local --save-dev
```

* Install the s3 Client

```git
npm install @aws-sdk/client-s3
```

* Install serverless offline

```git
npm i serverless-offline --save-dev
```

* Install serverless ssm

```git
npm i serverless-offline-ssm --save-dev
```

* The ssm variables used in the project are kept to simplify the configuration process of the project. It is recommended to add the corresponding file (serverless\_ssm.yml) to the .gitignore.
* The following script configured in the package.json of the project is in charge of
* Starting serverless-offline (serverless-offline)

```git
"scripts": {
"serverless-offline": "sls offline start",
"start": "npm run serverless-offline"
},
```

* We run the app from the terminal.

```git
npm start
```

* If any message appears indicating that the port 4000 is already in use, we can kill all dependent processes and re-run the app

```git
npx kill-port 4000
npm start
```

<br>

</details>

### 1.3) Technologies [🔝](#index-)

<details>
<summary>View</summary>
<br>

| **Technologies** | **Version** | **Purpose** |\
| ------------- | ------------- | ------------- |
| [SDK](https://www.serverless.com/framework/docs/guides/sdk/) | 4.3.2 | Automatic Module Injection for Lambdas |
| [Serverless Framework Core v3](https://www.serverless.com//blog/serverless-framework-v3-is-live) | 3.23.0 | AWS Core Services |
| [Systems Manager Parameter Store (SSM)](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html) | 3.0 | Management of Environment Variables |
| [Amazon Api Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html) | 2.0 | API Manager, Authentication, Control and Processing |
| [Amazon S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingBucket.html) | 3.0 | Object Container |
| [NodeJS](https://nodejs.org/en/) | 14.18.1 | JS Library |
| [VSC](https://code.visualstudio.com/docs) | 1.72.2 | IDE |
| [Postman](https://www.postman.com/downloads/) | 10.11 | Http Client |
| [CMD](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/cmd) | 10 | Command Prompt |
| [Git](https://git-scm.com/downloads) | 2.29.1 | Version Control |

</br>

| **Plugin** | **Description** |\
| ------------- | ------------- |
| [Serverless Plugin](https://www.serverless.com/plugins/) | Libraries for Modular Definition |
| [serverless-offline](https://www.npmjs.com/package/serverless-offline) | This serverless plugin emulates AWS λ and API Gateway on-premises |
| [serverless-offline-ssm](https://www.npmjs.com/package/serverless-offline-ssm) | finds environment variables that match SSM parameters at build time and replaces them from a file |
| [serverless-s3-local](https://www.serverless.com/plugins/serverless-s3-local) | serverless plugin to run S3 clones locally

</br>

| **Extension** |\
| ------------- |
| Prettier - Code formatter |
| YAML - Autoformatter .yml (alt+shift+f) |

<br>

</details>

<br>

## Section 2) Endpoints and Examples.

### 2.0) Endpoints and Resources [🔝](#index-)

<details>
<summary>View</summary>
<br>

### 2.1.0) Variables in Postman

| **Variable** | **Initial value** | **Current value** |\
| ------------- | ------------- | ------------- |
| base\_url | http://localhost:4000 | http://localhost:4000 |
| x-api-key | f98d8cd98h73s204e3456998ecl9427j | f98d8cd98h73s204e3456998ecl9427j |
| bearer\_token | Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ikpva G4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV\_adQssw5c | Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ikpva G4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV\_adQssw5c |

<br>

<br>

### 2.1.1) Upload an object to the s3 bucket

#### Request | code snippet

``postman
curl --location 'http://localhost:4000/dev/upload-object' \
--header 'x-api-key: f98d8cd98h73s204e3456998ecl9427j' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ikpva G4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
--header 'Content-Type: application/json' \
--data '{
 "type":"image",
 "format":"png",
 "description":"5000 × 3061 png",
 "url":"https://www.bing.com/images/search?view=detailV2&ccid=Tf4BFI68&id=D66EF5BFB7DA0A645A70240C32CB8664E8F8BF09&thid=OIP.Tf4BFI6846n eirVSebC0vAHaEi&mediaurl=https%3a%2f%2flogos-download.com%2fwp-content%2fuploads%2f2016%2f09%2fNode_logo_NodeJS.png&cdnurl=https%3a%2f %2fth.bing.com%2fth%2fid%2fR.4dfe01148ebce3a9de8ab55279b0b4bc%3frik%3dCb%252f46GSGyzIMJA%26pid%3dImgRaw%26r%3d0&exph=3061&expw=5 000&q=jpg+nodejs&simid=608055434302923247&FORM=IRPRST&ck=2FF3D39CAEF945F20B996CF6042F88A6&selectedIndex=1&ajaxhist=0&ajaxserp=0"
}'
```

#### Response

``postman
{
 "message": {
 "type": "image",
 "format": "png",
 "description": "5000 × 3061 png",
 "url": "https://www.bing.com/images/search?view=detailV2&ccid=Tf4BFI68&id=D66EF5BFB7DA0A645A70240C32CB8664E8F8BF09&thid=OIP.Tf4BFI6846nei rVSebC0vAHaEi&mediaurl=https%3a%2f%2flogos-download.com%2fwp-content%2fuploads%2f2016%2f09%2fNode_logo_NodeJS.png&cdnurl=https%3a% 2f%2fth.bing.com%2fth%2fid%2fR.4dfe01148ebce3a9de8ab55279b0b4bc%3frik%3dCb%252f46GSGyzIMJA%26pid%3dImgRaw%26r%3d0&exph=3061&expw= 5000&q=jpg+nodejs&simid=608055434302923247&FORM=IRPRST&ck=2FF3D39CAEF945F20B996CF6042F88A6&selectedIndex=1&ajaxhist=0&ajaxserp=0",
 "uuid": 104851112
 }
}
```

<br>

<br>

### 2.1.2) Get an object from the bucket based on its uuuid

#### Request | code snippet

``postman
curl --location 'http://localhost:4000/dev/get-object/103053674' \
--header 'x-api-key: f98d8cd98h73s204e3456998ecl9427j' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI'
--header 'Content-Type: application/json' \
--data ''
```

#### Response

``postman
{
 "message": {
 "type": "image",
 "format": "jpg",
 "description": "1000 × 1261 png",
 "url": "https://www.bing.com/images/search?view=detailV2&ccid=Tf4BFI68&id=D66EF5BFB7DA0A645A70240C32CB8664E8F8BF09&thid=OIP.Tf4BFI6846nei rVSebC0vAHaEi&mediaurl=https%3a%2f%2flogos-download.com%2fwp-content%2fuploads%2f2016%2f09%2fNode_logo_NodeJS.png&cdnurl=https%3a% 2f%2fth.bing.com%2fth%2fid%2fR.4dfe01148ebce3a9de8ab55279b0b4bc%3frik%3dCb%252f46GSGyzIMJA%26pid%3dImgRaw%26r%3d0&exph=3061&expw= 5000&q=jpg+nodejs&simid=608055434302923247&FORM=IRPRST&ck=2FF3D39CAEF945F20B996CF6042F88A6&selectedIndex=1&ajaxhist=0&ajaxserp=0",
 "uuid": 103053674
 }
}
```

<br>

<br>

### 2.1.3) Update an object in the s3 bucket

#### Request | code snippet

``postman
curl --location --request PUT 'http://localhost:4000/dev/edit-object/104851112' \
--header 'x-api-key: f98d8cd98h73s204e3456998ecl9427j' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ikpva G4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
--header 'Content-Type: application/json' \
--data '{
 "type":"image",
 "format":"jpg",
 "description":"1200 × 1201 png",
 "url":"https://www.bing.com/images/search?view=detailV2&ccid=Tf4BFI68&id=D66EF5BFB7DA0A645A70240C32CB8664E8F8BF09&thid=OIP.Tf4BFI6846neirVSebC0vAHaEi& mediaurl=https%3a%2f%2flogos-download.com%2fwp-content%2fuploads%2f2016%2f09%2fNode_logo_NodeJS.p ng&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.4dfe01148ebce3a9de8ab55279b0b4bc%3frik%3dCb%252 f46GSGyzIMJA%26pid%3dImgRaw%26r%3d0&exph=3061&expw=5000&q=jpg+nodejs&simid=608055434302923 247&FORM=IRPRST&ck=2FF3D39CAEF945F20B996CF6042F88A6&selectedIndex=1&ajaxhist=0&ajaxserp=0"
}'

```

#### Response

``postman
{
 "message": {
 "type": "image",
 "format": "jpg",
 "description": "1200 × 1201 png",
 "url": "https://www.bing.com/images/search?view=detailV2&ccid=Tf4BFI68&id=D66EF5BFB7DA0A645A70240C32CB8664E8F8BF09&thid=OIP.Tf4BFI6846neirVSebC0vAHaEi& mediaurl=https%3a%2f%2flogos-download.com%2fwp-content%2fuploads%2f2016%2f09%2fNode_logo_NodeJ S.png&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.4dfe01148ebce3a9de8ab55279b0b4bc%3frik%3d Cb%252f46GSGyzIMJA%26pid%3dImgRaw%26r%3d0&exph=3061&expw=5000&q=jpg+nodejs&simid=608055434302 923247&FORM=IRPRST&ck=2FF3D39CAEF945F20B996CF6042F88A6&selectedIndex=1&ajaxhist=0&ajaxserp=0",
 "uuid": 104851112
 }
}
```

<br>

<br>

### 2.1.4) Delete an object from the bucket

#### Request | code snippet

``postman
curl --location --request DELETE 'http://localhost:4000/dev/delete-object/104851112' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ikpva G4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' \
--header 'x-api-key: f98d8cd98h73s204e3456998ecl9427j' \
--header 'Content-Type: application/json'
```

#### Response

```postman
{
"message": "Removed object with uuid 104851112 successfully."
}
```

<br>

</ details>

<br>

## Section 3) Functionality Testing and References.

### 3.0) Functionality Testing [🔝](#index-)

<details>
<summary>View</summary>
<br>

#### Types of Operations | [Watch](https://www.youtube.com/playlist?list=PLCl11UFjHurDPyOkEXOR6JO-vUnYqd1FW)

![Index app](./doc/assets/functionalBuckettest.png)

</details>

### 3.1) References [🔝](#index-)

<details>
 <summary>View</summary>
 <br>

#### Bucket configuration

* [s3-example](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-configuring-buckets.html)
* [s3-examples official](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-node-examples.html)

#### Tools

* [AWS Design Tool app.diagrams.net](https://app.diagrams.net/?splash=0\&libs=aws4)

#### AWS-SDK

* [Official Doc](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/index.html)

#### API Gateway

* [Best Api-Gateway Practices](https://docs.aws.amazon.com/whitepapers/latest/best-practices-api-gateway-private-apis-integration/rest-api.html)
* [Api-key creation custom](https://towardsaws.com/protect-your-apis-by-creating-api-keys-using-serverless-framework-fe662ad37447)

#### Bookstores

* [Field validation](https://www.npmjs.com/package/node-input-validator)

<br>

</details>
