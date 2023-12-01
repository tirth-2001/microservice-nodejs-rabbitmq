// This is based on Request-Reply approach.
// Where the client will wait for the response from the queue before completing the request
// Based on a co-relation Id server (message queue) will wait for response from consumer

const express = require('express')
const bodyParser = require('body-parser')
const amqp = require('amqplib')

const app = express()
const port = 3002

app.use(bodyParser.json())

// Connect to RabbitMQ and listen for requests
connectToRabbitMQ('order_queue', async (message) => {
	const { correlationId, userId, product, quantity } = JSON.parse(
		message.content.toString()
	)

	// Logic to create an order
	const orderResponse = {
		correlationId,
		productId: generateProductId(),
		productName: `Product for User ${userId}`,
	}

	// Send the response back to userService
	await sendMessage('response_queue', orderResponse)
})

app.listen(port, () => {
	console.log(`orderService is running on http://localhost:${port}`)
})

async function connectToRabbitMQ(queue, callback) {
	const connection = await amqp.connect('amqp://localhost')
	const channel = await connection.createChannel()

	channel.assertQueue(queue, { durable: false })
	channel.consume(queue, callback, { noAck: true })
}

async function sendMessage(queue, message) {
	const connection = await amqp.connect('amqp://localhost')
	const channel = await connection.createChannel()

	channel.assertQueue(queue, { durable: false })
	channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)))

	setTimeout(() => {
		connection.close()
	}, 500)
}

function generateProductId() {
	return Math.random().toString(36).slice(2)
}
