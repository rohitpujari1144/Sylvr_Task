const express = require('express')
const { MongoClient, ObjectId } = require('mongodb')
const mongodb = require('mongodb')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
const dbUrl = 'mongodb+srv://rohit10231:rohitkaranpujari@cluster0.kjynvxt.mongodb.net/?retryWrites=true&w=majority'
const client = new MongoClient(dbUrl)
const port = 8500
const bcrypt = require('bcrypt')

// getting all users
app.get('/', async (req, res) => {
    const client = await MongoClient.connect(dbUrl)
    try {
        const db = await client.db('Sylvr')
        let allUsers = await db.collection('All_Users').find().toArray()
        if (allUsers.length !== 0) {
            res.status(200).send(allUsers)
        }
        else {
            res.send({ message: "No Users Found" })
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error', error })
    }
    finally {
        client.close()
    }
})

// creating new user
app.post('/signup', async (req, res) => {
    const client = await MongoClient.connect(dbUrl)
    try {
        const db = await client.db('Sylvr')
        let user = await db.collection('All_Users').aggregate([{ $match: { email: req.body.email } }]).toArray()
        if (user.length === 0) {
            const salt = await bcrypt.genSalt(10)
            const secPassword = await bcrypt.hash(req.body.password, salt)
            req.body = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: secPassword,
            }
            await db.collection('All_Users').insertOne(req.body)
            res.status(201).send({ message: 'signup successful', data: req.body })
        }
        else {
            res.send({ message: 'email id already exist' })
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error', error })
    }
    finally {
        client.close()
    }
})

// update user info
app.put('/updateUser/:email', async (req, res) => {
    const client = await MongoClient.connect(dbUrl)
    try {
        const db = await client.db('Sylvr')
        await db.collection('All_Users').updateOne({ email: req.params.email }, { $set: req.body })
        res.status(200).send({ message: 'Password updated successfully' })
    }
    catch (error) {
        res.status(400).send({ message: 'Internal server error', error })
    }
    finally {
        client.close()
    }
})

// user login
app.get('/login/:email/:password', async (req, res) => {
    const client = await MongoClient.connect(dbUrl)
    try {
        const db = await client.db('Sylvr')
        let user = await db.collection('All_Users').aggregate([{ $match: { email: req.params.email } }]).toArray()
        console.log(user);
        if (user.length !== 0) {
            const correctPassword = await bcrypt.compare(req.params.password, user[0].password)
            if (correctPassword) {
                res.status(200).send({ message: 'Login Successful', data: user })
            }
            else {
                res.send({ message: 'Invalid credentials' })
            }
        }
        else {
            res.send({ message: 'Invalid credentials' })
        }
    }
    catch (error) {
        res.status(400).send({ message: 'Internal server error', error })
    }
    finally {
        client.close()
    }
})

// delete user
app.delete('/deleteUser/:email', async (req, res) => {
    const client = await MongoClient.connect(dbUrl)
    try {
        const db = await client.db('Sylvr')
        await db.collection('All_Users').deleteOne({ email: req.params.email })
        await db.collection('Orders').deleteMany({ email: req.params.email })
        res.status(200).send({ message: 'user deleted' })
    }
    catch (error) {
        res.status(400).send({ message: 'Internal server error', error })
    }
    finally {
        client.close()
    }
})

app.listen(port, () => { console.log(`App listening on ${port}`) })
