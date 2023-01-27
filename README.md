# newman-parallel-apitest
It's a tool that allows you to test your api with multiple parallel calls.  
Export some collections json files from Postman and put them in the folder "PostmanJsonCollections" 
then choose and run one of the batch files, depending on how many times you want to run the tests. 
Wait until it's finished and you will get the results on your browser.

-step 1

Create a Collection with some tests in Postman.
Right click on the collection and choose "Export"

![pstexp](https://user-images.githubusercontent.com/123102700/215066534-22cde278-b8b9-4631-bbdf-400ccb5f2148.png)


-step 2

In the pop up window choose "Collection v2.1" 
and click "Export"

![pstexp2](https://user-images.githubusercontent.com/123102700/215066941-4bc3eed6-14cb-4e39-b91c-6fa1f16f3803.png)


-step 3

Save the exported .json file into the project's folder named "PostmanJsonCollections"
(note: you can add multiple files in that folder and all will be executed)

![pstexp3](https://user-images.githubusercontent.com/123102700/215067396-33bd42ce-a779-4534-ae68-17b7b166043d.png)


-step 4

Choose and run one of the batch files in the starting folder, 
depending on how many times you want to repeat the tests. example: for 50 times run the "TestsX50.bat"

![pstexp4](https://user-images.githubusercontent.com/123102700/215067845-e833e877-c5b7-4bbc-aa8b-4cd3583964a4.png)


-step 5

Wait for the run to finish and a browser tab will open with the results.

![pstexp5](https://user-images.githubusercontent.com/123102700/215068513-96c5170c-d9a2-4f1f-948f-54d61eb2ec41.png)
