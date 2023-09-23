if(process.env.NODE_ENV === 'dev') { 
    process.env.MONGODB_URI='mongodb+srv://codecuphsgs:ec7BsleaV4AnrEnQ@cluster0.vxmdbjv.mongodb.net/codecuphsgs_dev'; 
    process.env.JUDGE_URL='http://127.0.0.1:8080'; 
    process.env.HTTP_PORT=5000; 
    process.env.WORKER_PORT=8000;
}
else if(process.env.NODE_ENV === 'test') {
    process.env.MONGODB_URI='mongodb+srv://codecuphsgs:ec7BsleaV4AnrEnQ@cluster0.vxmdbjv.mongodb.net/codecuphsgs_dev'; 
    process.env.JUDGE_URL='http://127.0.0.1:8080'; 
    process.env.HTTP_PORT=5000; 
    process.env.WORKER_PORT=8000;
}