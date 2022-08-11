require('dotenv/config')
const morgan = require('morgan')
const express = require('express')
const app = express()
const port = 5000

const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN)

app.get('/send-code/:phoneNumber', async (req, res) => {
    try {
        const data = await client
        .verify
        .services(process.env.SERVICE_ID)
        .verifications
        .create({
            to: `+216${req.params.phoneNumber}`,
            channel: 'sms' 
        })
        res.status(200).json({
            message: "Code verification is sent!!",
            phoneNumber: req.params.phoneNumber,
            data
        })
    } catch (error) {
        console.log(error)
    }
})

app.get('/verify-code/:phoneNumber/:code', async (req, res) => {
    try {
        const data = await client
        .verify
        .services(process.env.SERVICE_ID)
        .verificationChecks
        .create({
            to: `+216${req.params.phoneNumber}`,
            code: req.params.code
        })
        if (data.status === "approved") {
            res.status(200).json({
                message: "User is Verified!!",
                data
            })
        } else {
            res.status(400).json("Wrong phone number or code")
        }
    } catch (error) {
        console.log(error)
    }
})

app.use(express.json())
app.use(morgan("dev"));

// listen to the server at 3000 port
app.listen(port, () => {
    console.log(`Server is running at ${port}`)
})