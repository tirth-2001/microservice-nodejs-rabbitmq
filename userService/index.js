const express = require('express')
const bodyParser = require('body-parser')
const amqp = require('amqplib')

const app = express()
const port = 3001

app.use(bodyParser.json())

app.post('/user', async (req, res) => {
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
})

app.listen(port, () => {
	console.log(`userService is running on http://localhost:${port}`)
})

async function sendMessage(queue, message) {
	const connection = await amqp.connect('amqp://localhost')
	const channel = await connection.createChannel()

	channel.assertQueue(queue, { durable: false })
	channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)))

	setTimeout(() => {
		connection.close()
	}, 500)
}
