

![Index app](./doc/assets/CRUD_Bucket_s3.drawio.png)

# CRUD_Bucket_S3_AWS
CRUD Modelo para el manejo de archivos implementado con Systems Manager Parameter Store, Bucket S3, Api-Gateway, Serverless-Framework, Lambda, NodeJs, entre otros. Los servicios de aws se implementan en local. El código del proyecto y la documentación de este (menos doc técnica), ha sido desarrollado/a en inglés.

<br>

## Índice 📜

<details>
 <summary> Ver </summary>
 
 <br>
 
### Sección 1) Descripción, Tecnologías y Referencias

 - [1.0) Descripción del Proyecto.](#10-descripción-)
 - [1.1) Ejecución del Proyecto.](#11-ejecución-del-proyecto-)
 - [1.2) Configuración del proyecto desde cero](#12-configuración-del-proyecto-desde-cero-)
 - [1.3) Tecnologías.](#13-tecnologías-)
 - [1.4) Referencias.](#14-referencias-)

<br>

</details>



<br>

## Sección 1) Descripción, Tecnologías y Dependencias 


### 1.0) Descripción [🔝](#índice-) 

<details>
  <summary>Ver</summary>
 
 <br>

<br>

</details>


### 1.1) Ejecución del Proyecto [🔝](#índice-)

<details>
  <summary>Ver</summary>
 
 
* Una vez creado un entorno de trabajo a través de algún ide, clonamos el proyecto
```git
git clone https://github.com/andresWeitzel/Microservice_Mercadolibre_Users_AWS
```
* Nos posicionamos sobre el proyecto
```git
cd 'projectName'
```
* Instalamos todos los paquetes necesarios
```git
npm i
```
* Creamos un archivo para almacenar las variables ssm utilizadas en el proyecto (Más allá que sea un proyecto con fines no comerciales es una buena práctica utilizar variables de entorno).
  * Click der sobre la raíz del proyecto
  * New file
  * Creamos el archivo con el name `serverless_ssm.yml`. Este deberá estar a la misma altura que el serverless.yml
  * Añadimos las ssm necesarias dentro del archivo.
  ```git

  ```  
* Ejecutamos el proyecto
```git
sls offline start
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
* Instalamos serverless offline 
```git
npm i serverless-offline --save-dev
```
* Instalamos serverless ssm 
```git
npm i serverless-offline-ssm --save-dev
```
* Ejecutamos el proyecto
```git
sls offline start
```




<br>

</details>

### 1.3) Tecnologías [🔝](#índice-)

<details>
  <summary>Ver</summary>


  #### Plugins
  * Prettier
  * YAML
 
 <br>


<br>

</details>


### 1.4) Referencias [🔝](#índice-)

<details>
  <summary>Ver</summary>
 
 <br>


<br>

</details>
