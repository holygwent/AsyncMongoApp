const express = require('express')
const app = express()
app.listen(3000)

app.set('view engine','ejs')
app.use(express.static('public'))
app.use('/css',express.static(__dirname + 'public/css'))

var bodyParser = require('body-parser')
app.use( bodyParser.urlencoded({extended:true}) );

var MongoClient = require('mongodb').MongoClient
const { ObjectId } = require('mongodb')
//connect string
const dbURL= 'mongodb+srv://user:user123@users.to2em.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const CollectionName = 'Collection';

//routes
app.get('/',async (req,res)=>
{
    var result = await GiveAll();
    console.log("main")
    res.render('main.ejs',{data:result});//,{data:kolekcja}
})
app.post("/add",async(req,res)=>{
    var user_name = req.body.name;
    var user_wiek = req.body.wiek;
   
   await AddUser(user_name,user_wiek);
   console.log("add user");
    res.redirect("/");
});
app.post("/delete",async(req,res)=>{
    var user_id = req.body._id;
    
   await DeleteUser(user_id);
    console.log("deleted user");
    res.redirect("/");
});
app.all('*', function(req, res) {
    res.redirect("/");
  });

//funkcje  pamietaj o async bo inaczej nie bedzie czekac na serwer :(
async function DeleteUser(user_id)
{   
    
    if(user_id!=="")
    {
    var client = await MongoClient.connect(dbURL);
    var db = client.db(CollectionName);
    var result = await db.collection('users').deleteOne({_id:ObjectId(user_id)})
    await client.close();

    
    }
}
async function GiveAll()
{
    var client = await MongoClient.connect(dbURL);
    var db = client.db(CollectionName);
    var result = await db.collection('users').find().toArray();
    await client.close();
  
    return result;


}
async function AddUser(user_name,user_wiek)
{
    var client = await MongoClient.connect(dbURL);
    var db = client.db(CollectionName);
    var result = await db.collection('users').insertOne({
        name:user_name,
        age: user_wiek
    });
    await client.close();
  
   
}
