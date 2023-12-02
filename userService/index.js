const express = require('express')
const bodyParser = require('body-parser')
const amqp = require('amqplib')

const app = express()
const port = process.env.PORT || 3001

app.use(bodyParser.json())

app.get('/', (req, res) => {
	res.json({ message: 'root of userService working fine' })
})

app.get('/ping', (req, res) => {
	res.json({ message: 'pong' })
})

app.post('/user', async (req, res) => {
	try {
		const { username, email } = req.body

		// Send a message to orderService
		await sendMessage('order_queue', {
			userId: username,
			product: 'DefaultProduct',
			quantity: 1,
		})

		console.log('[user service] after RabbitMQ message send')

		// Logic to save user data
		res.json({ message: 'User created successfully', username, email })
	} catch (err) {
		console.log('[userService] error in /user', err)
		res.json({
			message: 'Error in user create : ' + err.message,
			err: JSON.stringify(err),
		})
	}
})

app.listen(port, () => {
	console.log(`userService is running on port : ${port}`)
})

async function sendMessage(queue, message) {
	const connection = await amqp.connect('amqp://rabbitmq')
	const channel = await connection.createChannel()

	channel.assertQueue(queue, { durable: false })
	channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)))

	setTimeout(() => {
		connection.close()
	}, 500)
}
