const AfricasTalking = require('africastalking');

const africastalking = AfricasTalking({
    apiKey: 'atsk_3e1e111ab70258a67226718eac9e66a16379941b8adafd5b6a13886657013c6cc124df20',
    username: 'sandbox'
});

const sms = africastalking.SMS;

sms.send({
    to: ['+254741694898'],
    message: 'Test from Kisii AgriPrice!'
})
.then(response => {
    console.log('SUCCESS!', response);
})
.catch(error => {
    console.log('ERROR:', error);
});