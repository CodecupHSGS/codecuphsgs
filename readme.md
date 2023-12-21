<h1>Codecup HSGS</h1>
A platform to host <b>player-vs-player</b> programming contests. 

Imagine classic games like tic-tac-toe, go, and connect-4 turning into coding battles.
<div></div>
<img width="600" alt="Screen Shot 2023-12-22 at 7 33 31 am" src="https://github.com/CodecupHSGS/codecuphsgs/assets/112223883/9fcee2b9-2b0d-42ca-a586-909628c46f06">
<div></div>

<h2>How it works</h2>

<b>Admins create contests by submitting a PDF statement file and a judge file. You can find a sample judge file for the game Connect-4 <a href="https://github.com/CodecupHSGS/codecuphsgs/blob/main/backend/mock_source_code/judge.cpp">here</a>.</b>
<div></div>
<img style="p:4" width="600" alt="Screen Shot 2023-12-22 at 7 35 58 am" src="https://github.com/CodecupHSGS/codecuphsgs/assets/112223883/52b3259d-474f-43db-8c93-25b402900d3e">
<div></div>

<b>Users submit their programs. You can find a sample source code for the game Connect-4 <a href="https://github.com/CodecupHSGS/codecuphsgs/blob/main/backend/mock_source_code/player1.cpp"> here</a>.</b>
<div></div>
<img width="600" alt="Users submit their programs." src="https://github.com/CodecupHSGS/codecuphsgs/assets/112223883/00f2273c-d601-4048-b2f8-52e5da56444a">
<div></div>
<b>The platform sets up pairwise matches and runs these matches to find the programs with the highest scores </b>
<div></div>

<div></div>
<b>It's not just about solving problems; it's about beating your opponent in these games!</b>
<div></div>

<h2> Features </h2>
<ul>
  <li> User registration and authentication </li>
  
  <img width="600" alt="User registration and authentication" src="https://github.com/CodecupHSGS/codecuphsgs/assets/112223883/ceb9a388-c08a-4cf0-805e-e4a657521de2">

  <li> Support easy contest preparation with a platform for running sample matches </li>
  
  <img width="600" alt="Screen Shot 2023-12-22 at 7 40 28 am" src="https://github.com/CodecupHSGS/codecuphsgs/assets/112223883/f8b9433f-8d3c-4ae3-85fc-b10dff03f8ff">

  <li> Admins can allow users to run their submissions against each other before the final matchup </li>
</ul>

<h2> To be added </h2>
  <li> Other contest modes: round-16 (16 best programs will be selected to compete for slots in the quarter-final), elimination (the worst program in each round will be eliminated) </li>
  <li> Match renderer: admins can choose to submit a renderer file when creating contest to help visualise the matches. </li>

<h1> How to set up </h1>

<h2>Using docker images</h2>
<h3>Pull and run the docker image for the judge server</h3>
Visit <a href=https://github.com/CodecupHSGS/cpp-pvpjudge>CPP-PvP-judge</a> for more details. 

<h3>Pull and run the docker image for the back-end server</h3>

```
docker pull hoanggiapvuvhg/codecuphsgs_backend
docker run -e JUDGE_SERVER_URL={URL of the judge server} -e MONGODB_URI={URI of your MongoDB connection} -p {host port}:8000 --mount source={docker volume},target=/usr/src/app/files -p {host port}:5000 hoanggiapvuvhg/codecuphsgs_backend
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

You can then log in as an administrator: 

```
username: admin
password: a
```
