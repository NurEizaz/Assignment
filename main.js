const MongoClient = require("mongodb").MongoClient;
const User = require("./user");

MongoClient.connect(
	// TODO: Connection 
	"mongodb+srv://m001-student:m001-mongodb-basics@sandbox.xyjdt.mongodb.net/myFirstDatabase",
	{ useNewUrlParser: true },
).catch(err => {
	console.error(err.stack)
	process.exit(1)
}).then(async client => {
	console.log('Connected to MongoDB');
	User.injectDB(client);
})

const express = require('express')
const app = express()
const port = process.env.PORT || 3000

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
//const { Router } = require("express");
const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'MyVMS API',
			version: '1.0.0',
		},
	},
	apis: ['./main.js'], // files containing annotations as above
};
const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
	res.send('Hello World1')
})

app.get('/hello', (req, res) => {
	res.send('Hello BENR2423')
})

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id: 
 *           type: string
 *         id: 
 *           type: string
 *         phone: 
 *           type: string
 */

/**
 * @swagger
 * /login:
 *   post:
 *     description: User Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               id: 
 *                 type: string
 *               password: 
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid id or password
 */
app.post('/login', async (req, res) => {
	console.log(req.body);

	let user = await User.login(req.body.id, req.body.password);

	if (user.status == ('invalid id' || 'invalid password')) {
		res.status(401).send("Invalid id or password");
		return
	}
	
	res.status(200).json({
		_id: user._id,
		id: user.id,
		name: user.name,
		division: user.division,
		token: generateAccessToken({id: user.id})
	});
})
/**
 * @swagger
 * /register:
 *   post:
 *     description: User Register
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               id: 
 *                 type: string
 *               password: 
 *                 type: string
 *               name: 
 *                 type: string
 *               division:
 *                 type: string
 *               rank: 
 *                 type: string
 *               phone: 
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful Register new user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid username or password
 */
app.post('/register', async (req, res) => {
	console.log(req.body);
	const reg = await User.register(req.body.id, req.body.password, req.body.name, req.body.division, req.body.rank, req.body.phone);
	console.log(reg);
	res.json({reg})
})
/**
 * @swagger
 * /update:
 *   patch:
 *     description: User Update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               id: 
 *                 type: string
 *               password: 
 *                 type: string
 *               name: 
 *                 type: string
 *               division:
 *                 type: string
 *               rank: 
 *                 type: string
 *               phone: 
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful Update user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid id or password
 */
app.patch('/update', async (req, res) => {
	const update =await User.update(req.body.id, req.body.name, req.body.division, req.body.rank, req.body.phone);
	res.json({update})
})
/**
 * @swagger
 * /staff/{id}:
 *   get:
 *     description: Get staff by id
 *     parameters:
 *       - in: path
 *         name: id 
 *         schema: 
 *           type: string
 *         required: true
 *         description: Staff id
 *     responses:
 *       200:
 *         description: Search successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid id
 */

app.get('/staff/:id', async (req, res) => {
	console.log(req.params.id);
	const cari = await User.find(req.params.id);
	res.status(200).json({cari})
});

// app.get('/visitor/:id', async(req, res) => {
// 	console.log(req.params.id);
// 	const cari = await User.find((x) => x.username === parseInt(req.params.id));
// 	res.status(200).json(cari);
// });
/**
 * @swagger
 * /delete:
 *   delete:
 *     description: Delete User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               id: 
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful Delete user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid id or password
 */
app.delete('/delete',async (req,res) => {
	console.log(req.body);
	let buang = await User.delete(req.body.id);
	res.json({buang})
})
const jwt = require('jsonwebtoken');
function generateAccessToken(payload){
	return jwt.sign(payload, "my-super-secret",{expiresIn: '30s'});
}
function verifyToken(req,res, next){
	const authHeader = req.headers['authorization']
	const token = authHeader && authHeader.split(' ')[1]

	if(token == null) return res.sendStatus(401)

	jwt.verify(token, "my-super-secret",(err, user) => {
		console.log(err)
		if(err) return res.sendStatus(403)
		req.user = user
		next()
	})
}
app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})