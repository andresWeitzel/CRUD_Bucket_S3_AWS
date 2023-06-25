

![Index app](./doc/assets/CRUD_Bucket_s3.drawio.png)

# CRUD_Bucket_S3_AWS
Modelo CRUD para el manejo de objetos implementado con Systems Manager Parameter Store, Bucket S3, Api-Gateway, Serverless-Framework, Lambda, NodeJs, aws-sdk-v3, entre otros. Los servicios de aws se implementan en local. El código del proyecto y la documentación de este (menos doc técnica), ha sido desarrollado/a en inglés.
* [Playlist prueba de funcionalidad](https://www.youtube.com/playlist?list=PLCl11UFjHurDPyOkEXOR6JO-vUnYqd1FW)


<br>

## Índice 📜

<details>
 <summary> Ver </summary>
 
 <br>
 
### Sección 1)  Descripción, configuración y tecnologías

 - [1.0) Descripción del Proyecto.](#10-descripción-)
 - [1.1) Ejecución del Proyecto.](#11-ejecución-del-proyecto-)
 - [1.2) Configuración del proyecto desde cero](#12-configuración-del-proyecto-desde-cero-)
 - [1.3) Tecnologías.](#13-tecnologías-)


### Sección 2) Endpoints y Ejemplos 
 
 - [2.0) EndPoints y recursos.](#20-endpoints-y-recursos-)

### Sección 3) Prueba de funcionalidad y Referencias
 
 - [3.0) Prueba de funcionalidad.](#30-prueba-de-funcionalidad-)
 - [3.1) Referencias.](#31-referencias-)


<br>

</details>



<br>

## Sección 1)  Descripción, configuración y tecnologías


### 1.0) Descripción [🔝](#índice-) 

<details>
  <summary>Ver</summary>
 <br>

### 1.0.0) Descripción General

  * Esta app está dividida en varias funcionalidades/componentes. El primer componente o capa de conexión (/bucket) es la interacción con aws-sdk y con el bucket. Se modulariza de forma tal qué tenemos archivos .js para la creación de clientes s3, lectura de bucket, escritura de bucket, etc.
  Luego para la capa de aplicación (/helpers) tenemos validaciones de encabezados, cuerpo de solicitudes, formatos de fechas, autenticación, etc.
  Seguidamente la capa controlador/vista (/controllers) está definida por las operaciones CRUD posibles en cada una de las  lambdas definidas.  

 
 ### 1.0.1) Descripción Arquitectura y Funcionamiento
 
 * La imagen de la arquitectura de aws empleada describe el flujo de funcionamiento de la app de forma general. Cualquier petición hacia el bucket parte desde un cliente (Postman, servidor, etc). 
 * `Paso 0` : Dicha solicitud es recibida por el api-gateway y solamente se validará si es que dentro de los encabezados de dicha solicitud se encuentra la x-api-key correcta.
 * `Pasos 1A, 1B, etc` : Todos estos pasos corresponden a un endpoint con su recurso especifico. Por ej. para uploadObject (1A) es http://localhost:4000/dev/upload-object ....revisar dichos endpoints en [sección endpoints](#sección-2-endpoints-y-ejemplos). Cada lambda realiza comprobación de x-api-key y Bearer token, entre otros.
 * `Pasos 2` : Las lambdas realizan las validaciones de las ssm correspondientes con el System Manager Paramater Store.. validan token, valores para el bucket s3, etc.
 * `Pasos 3` : Las lambdas realizan las solicitudes y operaciones necesarias contra el bucket s3 (lectura, actualización, eliminación e inserción de objetos).
 * `Aclaraciones` : Se emula dicho funcionamiento dentro de la misma red y en entorno local con los plugins de serverless correspondientes. 


<br>

</details>


### 1.1) Ejecución del Proyecto [🔝](#índice-)

<details>
  <summary>Ver</summary>
  <br>
 
 
* Una vez creado un entorno de trabajo a través de algún ide, clonamos el proyecto
```git
git clone https://github.com/andresWeitzel/CRUD_Bucket_S3_AWS
```
* Nos posicionamos sobre el proyecto
```git
cd 'projectName'
```
* Instalamos la última versión LTS de [Nodejs(v18)](https://nodejs.org/en/download)
* Instalamos Serverless Framework de forma global si es que aún no lo hemos realizado
```git
npm install -g serverless
```
* Verificamos la versión de Serverless instalada
```git
sls -v
```
* Instalamos todos los paquetes necesarios
```git
npm i
```
* Las variables ssm utilizadas en el proyecto se mantienen para simplificar el proceso de configuración del mismo. Es recomendado agregar el archivo correspondiente (serverless_ssm.yml) al .gitignore.
* El siguiente script configurado en el package.json del proyecto es el encargado de
   * Levantar serverless-offline (serverless-offline)
 ```git
  "scripts": {
    "serverless-offline": "sls offline start",
    "start": "npm run serverless-offline"
  },
```
* Ejecutamos la app desde terminal.
```git
npm start
```
* Si se presenta algún mensaje indicando qué el puerto 4000 ya está en uso, podemos terminar todos los procesos dependientes y volver a ejecutar la app
```git
npx kill-port 4000
npm start
```
 
 
<br>

</details>


### 1.2) Configuración del proyecto desde cero [🔝](#índice-)

<details>
  <summary>Ver</summary>
 <br>
 
  
* Creamos un entorno de trabajo a través de algún ide, luego de crear una carpeta nos posicionamos sobre la misma
```git
cd 'projectName'
```
* Instalamos la última versión LTS de [Nodejs(v18)](https://nodejs.org/en/download)
* Instalamos Serverless Framework de forma global si es que aún no lo hemos realizado
```git
npm install -g serverless
```
* Verificamos la versión de Serverless instalada
```git
sls -v
```
* Inicializamos un template de serverles
```git
serverless create --template aws-nodejs
```
* Inicializamos un proyecto npm
```git
npm init -y
```
* Instalamos S3 local
```git
npm install serverless-s3-local --save-dev
```
* Instalamos el Cliente s3
```git
npm install @aws-sdk/client-s3
```
* Instalamos serverless offline 
```git
npm i serverless-offline --save-dev
```
* Instalamos serverless ssm 
```git
npm i serverless-offline-ssm --save-dev
```
* Las variables ssm utilizadas en el proyecto se mantienen para simplificar el proceso de configuración del mismo. Es recomendado agregar el archivo correspondiente (serverless_ssm.yml) al .gitignore.
* El siguiente script configurado en el package.json del proyecto es el encargado de
   * Levantar serverless-offline (serverless-offline)
 ```git
  "scripts": {
    "serverless-offline": "sls offline start",
    "start": "npm run serverless-offline"
  },
```
* Ejecutamos la app desde terminal.
```git
npm start
```
* Si se presenta algún mensaje indicando qué el puerto 4000 ya está en uso, podemos terminar todos los procesos dependientes y volver a ejecutar la app
```git
npx kill-port 4000
npm start
```

<br>

</details>


### 1.3) Tecnologías [🔝](#índice-)

<details>
  <summary>Ver</summary>
 <br>

| **Tecnologías** | **Versión** | **Finalidad** |               
| ------------- | ------------- | ------------- |
| [SDK](https://www.serverless.com/framework/docs/guides/sdk/) | 4.3.2  | Inyección Automática de Módulos para Lambdas |
| [Serverless Framework Core v3](https://www.serverless.com//blog/serverless-framework-v3-is-live) | 3.23.0 | Core Servicios AWS |
| [Systems Manager Parameter Store (SSM)](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html) | 3.0 | Manejo de Variables de Entorno |
| [Amazon Api Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html) | 2.0 | Gestor, Autenticación, Control y Procesamiento de la Api | 
| [Amazon S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingBucket.html) | 3.0 | Contenedor de Objetos | 
| [NodeJS](https://nodejs.org/en/) | 14.18.1  | Librería JS |
| [VSC](https://code.visualstudio.com/docs) | 1.72.2  | IDE |
| [Postman](https://www.postman.com/downloads/) | 10.11  | Cliente Http |
| [CMD](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/cmd) | 10 | Símbolo del Sistema para linea de comandos | 
| [Git](https://git-scm.com/downloads) | 2.29.1  | Control de Versiones |

</br>


| **Plugin** | **Descripción** |               
| -------------  | ------------- |
| [Serverless Plugin](https://www.serverless.com/plugins/) | Librerías para la Definición Modular |
| [serverless-offline](https://www.npmjs.com/package/serverless-offline) | Este complemento sin servidor emula AWS λ y API Gateway en entorno local |
| [serverless-offline-ssm](https://www.npmjs.com/package/serverless-offline-ssm) |  busca variables de entorno que cumplen los parámetros de SSM en el momento de la compilación y las sustituye desde un archivo  |
| [serverless-s3-local](https://www.serverless.com/plugins/serverless-s3-local) | complemento sin servidor para ejecutar clones de S3 en local

</br>


| **Extensión** |              
| -------------  | 
| Prettier - Code formatter |
| YAML - Autoformatter .yml (alt+shift+f) |

<br>

</details>


<br>


## Sección 2) Endpoints y Ejemplos. 


### 2.0) Endpoints y recursos [🔝](#índice-) 

<details>
  <summary>Ver</summary>
<br>

### 2.1.0) Variables en Postman

| **Variable** | **Initial value** | **Current value** |               
| ------------- | ------------- | ------------- |
| base_url | http://localhost:4000  | http://localhost:4000 |
| x-api-key | f98d8cd98h73s204e3456998ecl9427j  | f98d8cd98h73s204e3456998ecl9427j |
| bearer_token | Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c  | Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c |

<br>

<br>

### 2.1.1) Subir un objeto al bucket
#### Request
``` postman
- Método : POST

- Url : {{base_url}}/dev/upload-object

- Headers: 
   - Content-Type : application/json
   - Authorization : {{bearer_token}}
   - x-api-key : {{x-api-key}}

- Body : 

    {
        "type":"image",
        "format":"JPG",
        "description":"1000 × 1261 png",
        "url":"https://www.bing.com/images/search?view=detailV2&ccid=Tf4BFI68&id=D66EF5BFB7DA0A645A70240C32CB8664E8F8BF09&thid=OIP.Tf4BFI6846neirVSebC0vAHaEi&mediaurl=https%3a%2f%2flogos-download.com%2fwp-content%2fuploads%2f2016%2f09%2fNode_logo_NodeJS.png&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.4dfe01148ebce3a9de8ab55279b0b4bc%3frik%3dCb%252f46GSGyzIMJA%26pid%3dImgRaw%26r%3d0&exph=3061&expw=5000&q=jpg+nodejs&simid=608055434302923247&FORM=IRPRST&ck=2FF3D39CAEF945F20B996CF6042F88A6&selectedIndex=1&ajaxhist=0&ajaxserp=0"
    }

```

#### Response
``` postman
{
    "message": {
        "type": "image",
        "format": "JPG",
        "description": "1000 × 1261 png",
        "url": "https://www.bing.com/images/search?view=detailV2&ccid=Tf4BFI68&id=D66EF5BFB7DA0A645A70240C32CB8664E8F8BF09&thid=OIP.Tf4BFI6846neirVSebC0vAHaEi&mediaurl=https%3a%2f%2flogos-download.com%2fwp-content%2fuploads%2f2016%2f09%2fNode_logo_NodeJS.png&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.4dfe01148ebce3a9de8ab55279b0b4bc%3frik%3dCb%252f46GSGyzIMJA%26pid%3dImgRaw%26r%3d0&exph=3061&expw=5000&q=jpg+nodejs&simid=608055434302923247&FORM=IRPRST&ck=2FF3D39CAEF945F20B996CF6042F88A6&selectedIndex=1&ajaxhist=0&ajaxserp=0",
        "uuid": 103053674
    }
}
```

<br>

<br>

### 2.1.2) Obtener un objeto del bucket
#### Request
``` postman
- Método : GET

- Url : {{base_url}}/dev/get-object/{uuid}

- Headers: 
  - Content-Type : application/json
  - Authorization : {{bearer_token}}
  - x-api-key : {{x-api-key}}

- Body : 
      
      NULL

```

#### Response
``` postman
{
    "message": {
        "type": "image",
        "format": "jpg",
        "description": "1000 × 1261 png",
        "url": "https://www.bing.com/images/search?view=detailV2&ccid=Tf4BFI68&id=D66EF5BFB7DA0A645A70240C32CB8664E8F8BF09&thid=OIP.Tf4BFI6846neirVSebC0vAHaEi&mediaurl=https%3a%2f%2flogos-download.com%2fwp-content%2fuploads%2f2016%2f09%2fNode_logo_NodeJS.png&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.4dfe01148ebce3a9de8ab55279b0b4bc%3frik%3dCb%252f46GSGyzIMJA%26pid%3dImgRaw%26r%3d0&exph=3061&expw=5000&q=jpg+nodejs&simid=608055434302923247&FORM=IRPRST&ck=2FF3D39CAEF945F20B996CF6042F88A6&selectedIndex=1&ajaxhist=0&ajaxserp=0",
        "uuid": 103053674
    }
}
```

<br>

<br>

### 2.1.3) Actualizar un objeto del bucket
#### Request
``` postman
- Método : PUT

- Url : {{base_url}}/dev/edit-object/{uuid}

- Headers: 
  - Content-Type : application/json
  - Authorization : {{bearer_token}}
  - x-api-key : {{x-api-key}}

- Body : 
  {
    "type":"image",
    "format":"png",
    "description":"EDITED",
    "url":"https://www.bing.com/images/search?view=detailV2&ccid=Tf4BFI68&id=D66EF5BFB7DA0A645A70240C32CB8664E8F8BF09&thid=OIP.Tf4BFI6846neirVSebC0vAHaEi&  mediaurl=https%3a%2f%2flogos-download.com%2fwp-content%2fuploads%2f2016%2f09%2fNode_logo_NodeJS.png&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.4dfe01148ebce3a9de8ab55279b0b4bc%3frik%3dCb%252f46GSGyzIMJA%26pid%3dImgRaw%26r%3d0&exph=3061&expw=5000&q=jpg+nodejs&simid=608055434302923247&FORM=IRPRST&ck=2FF3D39CAEF945F20B996CF6042F88A6&selectedIndex=1&ajaxhist=0&ajaxserp=0"
  }

```

#### Response
``` postman
{
    "message": {
        "type": "image",
        "format": "JPG",
        "description": "1000 × 1261 png",
        "url": "https://www.bing.com/images/search?view=detailV2&ccid=Tf4BFI68&id=D66EF5BFB7DA0A645A70240C32CB8664E8F8BF09&thid=OIP.Tf4BFI6846neirVSebC0vAHaEi&mediaurl=https%3a%2f%2flogos-download.com%2fwp-content%2fuploads%2f2016%2f09%2fNode_logo_NodeJS.png&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.4dfe01148ebce3a9de8ab55279b0b4bc%3frik%3dCb%252f46GSGyzIMJA%26pid%3dImgRaw%26r%3d0&exph=3061&expw=5000&q=jpg+nodejs&simid=608055434302923247&FORM=IRPRST&ck=2FF3D39CAEF945F20B996CF6042F88A6&selectedIndex=1&ajaxhist=0&ajaxserp=0",
        "uuid": 103053674
    }
}
```

<br>

<br>

### 2.1.4) Eliminar un objeto del bucket
#### Request
``` postman
- Método : DELETE

- Url : {{base_url}}/dev/delete-object/{uuid}

- Headers: 
  - Content-Type : application/json
  - Authorization : {{bearer_token}}
  - x-api-key : {{x-api-key}}

- Body : 
      
      NULL

```

#### Response
``` postman
{
    "message": "Removed object with uuid 103053674 successfully."
}
```

<br>

</details>

<br>


## Sección 3) Prueba de funcionalidad y Referencias. 


### 3.0) Prueba de funcionalidad [🔝](#índice-) 

<details>
  <summary>Ver</summary>
<br>

#### Tipos de Operaciones | [Ver](https://www.youtube.com/playlist?list=PLCl11UFjHurDPyOkEXOR6JO-vUnYqd1FW)

![Index app](./doc/assets/pruebaFuncionalBucket.png)

</details>


### 3.1) Referencias [🔝](#índice-)

<details>
  <summary>Ver</summary>
 <br>

#### Configuración buckets
* [s3-example](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-configuring-buckets.html)
* [s3-examples oficial](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-node-examples.html)


#### Herramientas 
 * [Herramienta de Diseño AWS app.diagrams.net](https://app.diagrams.net/?splash=0&libs=aws4)

#### AWS-SDK
* [Doc Oficial](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/index.html) 

#### Api Gateway
 * [Buenas Prácticas Api-Gateway](https://docs.aws.amazon.com/whitepapers/latest/best-practices-api-gateway-private-apis-integration/rest-api.html)
 * [Creación de Api-keys personalizadas](https://towardsaws.com/protect-your-apis-by-creating-api-keys-using-serverless-framework-fe662ad37447)

 #### Librerías
 * [Validación de campos](https://www.npmjs.com/package/node-input-validator)

<br>

</details>
