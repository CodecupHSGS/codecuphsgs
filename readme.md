<h1>Codecup HSGS</h1>
A website to host programming contests. 
<h2>Build and run a demo webpage</h2>
<h3>Front end</h3>
Build and run the front end server: 

```
cd frontend_giap &&
npm run build &&
npm run dev
```
Then go to http://localhost:3000/
<h3>Back end</h3>
Build and run the backend server: 

```
cd backend && 
npm i &&
npm run dev
```
<h3>Database</h3>
Set up a local MongoDB database: 
<ul>
<li>Install and run a local MongoDB server: https://www.mongodb.com/docs/manual/installation/ </li>
</ul>
You can import sample user data & contest data or visit the website (http://localhost:3000/) and register users there. Temporarily we do not support creating contests as the admin functions are under development. 

Import sample user data & contest data: 
<ul>
<li>Download MongoDB compass https://www.mongodb.com/try/download/compass </li>
<li>In MongoDB compass, create a connection to mongodb://localhost:27017 </li>
<li>In the database "codecup", import the data <a href="https://github.com/Ddoraaaaa/codecuphsgs/tree/main/sampledata">here</a> into the corresponding collections. </li>
</ul>

You can log in as an administrator: 

```
username: admin
password: admin
```

<h2>Preview</h2>
<img width="1512" alt="Screen Shot 2023-09-23 at 3 44 27 am" src="https://github.com/CodecupHSGS/codecuphsgs/assets/112223883/ceb9a388-c08a-4cf0-805e-e4a657521de2">


<img width="1483" alt="Screen Shot 2023-09-23 at 3 42 50 am" src="https://github.com/CodecupHSGS/codecuphsgs/assets/112223883/7b5d2509-9ca2-4d42-9092-974bfe08e87e">

<img width="1511" alt="Screen Shot 2023-09-23 at 3 43 55 am" src="https://github.com/CodecupHSGS/codecuphsgs/assets/112223883/00f2273c-d601-4048-b2f8-52e5da56444a">
