const express = require('express');
const bodyParser = require('body-parser');
const mongojs = require('mongojs');
const db = mongojs('catalog',['products']);

const app = express();

const port = 3000;

app.use(bodyParser.json());

//Enable cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/',(req,res,next) => {
	res.send('please use /api/products');
});

//Fetch all products
app.get('/api/products',(req,res,next)=>{
	db.products.find((err,docs)=>{
		if(err){
			res.send(err);
		}
		console.log('Products found..');
		res.json(docs);
	})
});

//Fetch single product
app.get('/api/products/:id',(req,res,next)=>{
	db.products.findOne({_id: mongojs.ObjectId(req.params.id)},(err,docs)=>{
		if(err){
			res.send(err);
		}
		console.log('Product found..');
		res.json(docs);
	})
});

//add single product
app.post('/api/products',(req,res,next)=>{
	db.products.insert(req.body, (err,doc)=>{
		if(err){
			res.send(err);
		}
		console.log('adding..');
		res.json(doc);
	});
});

//update single product
app.put('/api/products/:id',(req,res,next)=>{
	db.products.findAndModify({query:{_id: mongojs.ObjectId(req.params.id)},
		update:{
			$set:{
				name: req.body.name,
				category: req.body.category,
				details: req.body.details
			}},
			new:true}, (err,doc)=>{
				if(err){
					res.send(err);
				}
				console.log('updating product');
				res.json(doc);
			})
});

//delete single product
app.delete('/api/products/:id',(req,res,next)=>{
	db.products.remove({_id: mongojs.ObjectId(req.params.id)}, (err,doc)=>{
				if(err){
					res.send(err);
				}
				console.log('deleting product');
				res.json(doc);
			})
});


app.listen(port, () => {
	console.log('server started on port 3000');
})