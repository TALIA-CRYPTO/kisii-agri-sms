
const AfricasTalking = require('africastalking');

console.log('Starting SMS test...');

const africastalking = AfricasTalking({
    apiKey: 'atsk_3e1e111ab70258a67226718eac9e66a16379941b8adafd5b6a13886657013c6cc124df20',
    username: 'sandbox'
});

console.log('Africa\'s Talking initialized');

const sms = africastalking.SMS;

console.log('Sending SMS...');

sms.send({
    to: ['+254741694898'],
    message: 'Test from Kisii AgriPrice!'
})
.then(response => {
    console.log('SUCCESS! SMS sent!');
    console.log(response);
})
.catch(error => {
    console.log('ERROR occurred:');
    console.log(error);
});

console.log('SMS request sent, waiting for response...');