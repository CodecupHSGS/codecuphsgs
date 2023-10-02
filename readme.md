<h1>Codecup HSGS</h1>
A website to host programming contests. 

<h2>Setting up with docker images</h2>
<h3>Pull and run the docker image for the judge server</h3>
Visit <a href=https://github.com/CodecupHSGS/cpp-pvpjudge>CPP-PvP-judge</a> for more details. 

<h3>Pull and run the docker image for the back-end server</h3>

```
docker pull hoanggiapvuvhg/codecuphsgs_backend
docker run -e JUDGE_SERVER_URL={URL of the judge server} -e MONGODB_URI={URI of your MongoDB connection} -p {host port}:8000 -p {host port}:5000 hoanggiapvuvhg/codecuphsgs_backend
```

<h3>Pull and run the docker image for the front-end server</h3>

```
docker pull hoanggiapvuvhg/codecuphsgs_frontend
docker run -p {host port}:3000 -e BACKEND_URL={URL of your backend server} hoanggiapvuvhg/codecuphsgs_frontend
```
<h2>Build and run a sample server from code</h2>

Build and run the backend server: 

```
cd backend && 
npm run build &&
npm run start
```

Build and run the front-end server: 

```
cd Frontend &&
npm run build &&
npm run start
```
Then go to http://localhost:3000/
<h3>Back end</h3>

<h3>Database</h3>
Set up a local MongoDB database: 
<ul>
<li>Install and run a local MongoDB server: https://www.mongodb.com/docs/manual/installation/ </li>
</ul>
You can import sample user data & contest data or visit the website (http://localhost:3000/) and register users there. 

Import sample user data & contest data: 
<ul>
<li>Download MongoDB compass https://www.mongodb.com/try/download/compass </li>
<li>In MongoDB compass, create a connection to mongodb://localhost:27017 </li>
<li>In the database "codecup", import the data <a href="https://github.com/Ddoraaaaa/codecuphsgs/tree/main/sampledata">here</a> into the corresponding collections. </li>
</ul>

You can log in as an administrator: 

```
username: admin
password: a
```

<h2>Preview</h2>
<img width="1512" alt="Screen Shot 2023-09-23 at 3 44 27 am" src="https://github.com/CodecupHSGS/codecuphsgs/assets/112223883/ceb9a388-c08a-4cf0-805e-e4a657521de2">

<img width="1483" alt="Screen Shot 2023-09-23 at 3 42 50 am" src="https://github.com/CodecupHSGS/codecuphsgs/assets/112223883/7b5d2509-9ca2-4d42-9092-974bfe08e87e">

<img width="1511" alt="Screen Shot 2023-09-23 at 3 43 55 am" src="https://github.com/CodecupHSGS/codecuphsgs/assets/112223883/00f2273c-d601-4048-b2f8-52e5da56444a">
