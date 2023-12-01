// This is based on Request-Reply approach.
// Where the client will wait for the response from the queue before completing the request
// Based on a co-relation Id server (message queue) will wait for response from consumer

const express = require('express')
const bodyParser = require('body-parser')
const amqp = require('amqplib')

const app = express()
const port = 3001

app.use(bodyParser.json())

app.post('/user', async (req, res) => {
	const { username, email } = req.body

	// Generate a unique correlationId for the request
	const correlationId = generateCorrelationId()

	// Send a request message to orderService
	await sendMessage('order_queue', {
		correlationId,
		userId: username,
		product: 'DefaultProduct',
		quantity: 1,
	})

	// Wait for the response
	const orderResponse = await waitForResponse(correlationId)

	// Logic to save user data and use orderResponse
	res.json({
		message: 'User created successfully',
		username,
		email,
		orderResponse,
	})
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

async function waitForResponse(correlationId) {
	return new Promise(async (resolve) => {
		const connection = await amqp.connect('amqp://localhost')
		const channel = await connection.createChannel()

		const responseQueue = 'response_queue'

		channel.assertQueue(responseQueue, { durable: false })

		channel.consume(
			responseQueue,
			(msg) => {
				const response = JSON.parse(msg.content.toString())
				if (response.correlationId === correlationId) {
					resolve(response)
				}
			},
			{ noAck: true }
		)

		setTimeout(() => {
			connection.close()
		}, 500)
	})
}

function generateCorrelationId() {
	return Math.random().toString(36).slice(2)
}
