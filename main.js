const MongoClient = require("mongodb").MongoClient;
const User = require("./user");
const Document = require("./document");
const Project = require("./user");

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

app.get('/',verifyToken, (req, res) => {
	res.send('Hello World')
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
 * tags:
 *   name: Admin
 */

/**
 * @swagger
 * tags:
 *   name: Staff
 */

/**
 * @swagger
 * tags:
 *   name: Document Server
 */

/**
 * @swagger
 * tags:
 *   name: Project
 */

/**
 * @swagger
 * /register/document:
 *   post:
 *     description: File Register
 *     tags: [Document Server]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               id1: 
 *                 type: string
 *               FileName: 
 *                 type: string
*     responses:
 *       200:
 *         description: Successful Register new user
 *       401:
 *         description: Invalid username or password
 */
 app.post('/register/document', async (req, res) => {
	console.log(req.body);
	const reg = await Document.register(
		req.body.id, 
		req.body.FileName, 
	);
	console.log(reg);
	res.json({reg})
})

/**
 * @swagger
 * /document/{id}:
 *   get:
 *     description: Get document by id
 *     tags: [Document Server]
 *     parameters:
 *       - in: path
 *         name: id 
 *         schema: 
 *           type: string
 *         required: true
 *         description: Document id
  *     responses:
 *       200:
 *         description: Search successful
 *       401:
 *         description: Invalid id 
 */

 app.get('/document/:id', async (req, res) => {
	console.log(req.user);
	const cari = await Document.find(req.params.id);
	if (cari)
		res.status(200).json(cari)
	else 
		res.status(404).send("Invalid File Id")
});

/**
 * @swagger
 * /register/project:
 *   post:
 *     description: Project Register
 *     tags: [Project]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               id: 
 *                 type: string
 *               ProjectName: 
 *                 type: string
 *               staff:
 *                 type: string
 */
 app.post('/register/project', async (req, res) => {
	console.log(req.body);
	const reg = await Project.register(
		req.body.id, 
		req.body.ProjectName,
		req.body.staff, 
	);
	console.log(reg);
	res.json({reg})
})

/**
 * @swagger
 * /project/{id}:
 *   get:
 *     description: Get project by id
 *     tags: [Project]
 *     parameters:
 *       - in: path
 *         name: id 
 *         schema: 
 *           type: string
 *         required: true
 *         description: Project id
  *     responses:
 *       200:
 *         description: Search successful
 *       401:
 *         description: Invalid id
 */

 app.get('/project/:id', async (req, res) => {
	console.log(req.user);
	const cari = await Project.find(req.params.id);
	if (cari)
		res.status(200).json(cari)
	else 
		res.status(404).send("Invalid Project Id")
});

/**
 * @swagger
 * /login/admin:
 *   post:
 *     description: User Login
 *     tags: [Admin]
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
 *       401:
 *         description: Invalid id or password
 */
app.post('/login/admin', async (req, res) => {
	console.log(req.body);

	let user = await User.login(req.body.id, req.body.password);

	if (user.status == ('invalid id' || 'invalid password')) {
		res.status(401).send("Invalid id or password");
		return
	}
	if (user.status == ('invalid password')) {
		res.status(401).send("Invalid id or password");
		return
	}	
	res.status(200).json({
		_id: user._id,
		id: user.id,
		name: user.name,
		division: user.division,
		token: generateAccessToken({id: user.id,role: user.role}),

	});
})
/**
 * @swagger
 * /login/staff:
 *   post:
 *     description: User Login
 *     tags: [Staff]
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
 *       401:
 *         description: Invalid id or password
 */
 app.post('/login/staff', async (req, res) => {
	console.log(req.body);

	let user = await User.login(req.body.id, req.body.password);

	if (user.status == ('invalid id')) {
		res.status(401).send("Invalid id or password");
		return
	}
	if (user.status == ('invalid password')) {
		res.status(401).send("Invalid id or password");
		return
	}
	res.status(200).json({
		_id: user._id,
		id: user.id,
		name: user.name,
		division: user.division,
	});
})
/**
 * @swagger
 * /register/admin:
 *   post:
 *     description: User Register
 *     tags: [Admin]
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
 *               role:
 *                 type: string
 */
app.post('/register/admin', async (req, res) => {
	console.log(req.body);
	const reg = await User.register(
		req.body.id, 
		req.body.password, 
		req.body.name, 
		req.body.division, 
		req.body.rank, 
		req.body.phone, 
		req.body.role,
	);
	console.log(reg);
	res.json({reg})
})
/**
 * @swagger
 * /register/staff:
 *   post:
 *     description: User Register
 *     tags: [Staff]
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
 */
 app.post('/register/staff', async (req, res) => {
	console.log(req.body);
	const reg = await User.register(
		req.body.id, 
		req.body.password, 
		req.body.name, 
		req.body.division, 
		req.body.rank, 
		req.body.phone,
	);
	console.log(reg);
	res.json({reg})
})

/**
 * @swagger
 * /update:
 *   patch:
 *     description: User Update
 *     tags: [Staff]
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
 *       401:
 *         description: Invalid id or password
 */
app.patch('/update', async (req, res) => {
	console.log(req.body);

	let user = await User.login(req.body.id, req.body.password);

	if (user.status == ('invalid id' || 'invalid password')) {
		res.status(401).send("Invalid id or password");
		return
	}
	const update =await User.update(
		req.body.id,
		req.body.name, 
		req.body.division, 
		req.body.rank, 
		req.body.phone
	);
	res.json({update})
})

//app.use(verifyToken);

/**
 * @swagger
 * /staff/{id}:
 *   get:
 *     description: Get staff by id
 *     tags: [Admin]
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
 *       401:
 *         description: Invalid id
 */

app.get('/staff/:id', async (req, res) => {
	//console.log(req.params.id);
	console.log(req.user);
	const cari = await User.find(req.params.id);
	if (cari)
		res.status(200).json(cari)
	else 
		res.status(404).send("Invalid Staff Id")
});
/**
 * @swagger
 * /delete:
 *   delete:
 *     description: Delete User
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               id: 
 *                 type: string
 */
app.delete('/delete',async (req,res) => {
	console.log(req.body);
	let buang = await User.delete(req.body.id);
	res.json({buang})
})

/**
 * @swagger
 * /document/delete:
 *   delete:
 *     description: Delete File
 *     tags: [Document Server]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: 
 *             type: object
 *             properties:
 *               id: 
 *                 type: string
 */
 app.delete('/document/delete',async (req,res) => {
	console.log(req.body);
	let buang = await Document.delete(req.body.id);
	res.json({buang})
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})
app.get('/admin/only', async (req, res) => {
	console.log(req.user);

	if (req.user.role == 'admin')
		res.status(200).send('Admin only')
	else
		res.status(403).send('Unauthorized')
})
const jwt = require('jsonwebtoken');
function generateAccessToken(payload){
	return jwt.sign(payload, "my-super-secret",{expiresIn: '60s'});
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