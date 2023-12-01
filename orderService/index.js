const express = require('express')
const bodyParser = require('body-parser')
const amqp = require('amqplib')

const app = express()
const port = 3002

app.use(bodyParser.json())

// Connect to RabbitMQ and listen for messages
connectToRabbitMQ('order_queue', (message) => {
	const { userId, product, quantity } = JSON.parse(message.content.toString())
	// Logic to create an order

	console.log('getting message in order_queue', message.content.toString())

	setTimeout(() => {
		console.log(
			`Order created for user ${userId} - Product: ${product}, Quantity: ${quantity}`
		)
	}, 3000)
})

app.listen(port, () => {
	console.log(`orderService is running on http://localhost:${port}`)
})

async function connectToRabbitMQ(queue, callback) {
	const connection = await amqp.connect('amqp://localhost')
	const channel = await connection.createChannel()

	console.log('[connectRabbitMq] queue', queue)
	console.log('[connectRabbitMq] callback', callback)

	channel.assertQueue(queue, { durable: false })
	channel.consume(queue, callback, { noAck: true })
}
