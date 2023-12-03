const express = require('express')
const bodyParser = require('body-parser')
const amqp = require('amqplib')

const app = express()
const port = process.env.PORT || 3002

const rabbitMQHost = '35.202.146.163' // External IP
const rabbitMQPort = 5672 // AMQP port
const rabbitMQUrl = `amqp://${rabbitMQHost}:${rabbitMQPort}`

console.log('[rabbitMq URL]', rabbitMQUrl)

app.use(bodyParser.json())

app.get('/', (req, res) => {
	res.json({ message: 'root of orderService working fine' })
})

app.get('/ping', (req, res) => {
	res.json({ message: 'pong' })
})

// Connect to RabbitMQ and listen for messages
connectToRabbitMQ('order_queue', (message) => {
	try {
		const { userId, product, quantity } = JSON.parse(message.content.toString())
		// Logic to create an order

		console.log('getting message in order_queue', message.content.toString())

		// setTimeout(() => {
		console.log(
			`Order created for user ${userId} - Product: ${product}, Quantity: ${quantity}`
		)
		// }, 3000)
	} catch (err) {
		console.log('[orderService] error in connectToRabbitMQ callback', err)
	}
})

app.listen(port, () => {
	console.log(`orderService is running on port : ${port}`)
})

async function connectToRabbitMQ(queue, callback) {
	try {
		const connection = await amqp.connect(rabbitMQUrl)
		const channel = await connection.createChannel()

		console.log('[connectRabbitMq] queue', queue)
		console.log('[connectRabbitMq] callback', callback)

		channel.assertQueue(queue, { durable: false })
		channel.consume(queue, callback, { noAck: true })
	} catch (err) {
		console.log('[orderService] error in connectToRabbitMQ', err)
	}
}
