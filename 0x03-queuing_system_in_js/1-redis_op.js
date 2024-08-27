import { createClient } from 'redis';
import redis from 'redis';

const client = createClient();
client.on('error', (err) => console.error('Redis client not connected to the server:', err));
client.on('connect', () => console.log('Redis client connected to the server'));

function setNewSchool(schoolName, value) {
    client.set(schoolName, value, redis.print);
}

function displaySchoolValue(schoolName) {
    client.get(schoolName, (err, reply) => {
        if (err) {
            console.error(err);
        } else {
            if (reply == null) {
                console.log('School')
            } else {
                console.log(reply);
            }
        }
    });
}



displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');