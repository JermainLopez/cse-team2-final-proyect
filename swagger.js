const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Wedding API',
        description: 'Wedding API with Swagger by Jermain Lopez'
    },
    host: 'cse-wedding.herokuapp.com',
    schemes: ['https']
};

const outputFile = './swagger-wedding-output.json';
const endpointsFiles = ['./routes/index.js'];


swaggerAutogen(outputFile, endpointsFiles, doc);