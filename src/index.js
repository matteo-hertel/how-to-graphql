const express = require('express');

// This package automatically parses JSON requests.
const bodyParser = require('body-parser');

// This package will handle GraphQL server requests and responses
// for you, based on your schema.
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');

const schema = require('./schema');
const connectMongo = require('./mongo-connector');
const { authenticate } = require('./authentication');

const start = async () => {

    const mongo = await connectMongo();
    var app = express();
    const buildOptions = async (req, res) => {
        const user = await authenticate(req, mongo.Users);
        return {
            context: { mongo, user }, // This context object is passed to all resolvers.
            schema,
        };
    };

    app.use('/graphql', [bodyParser.json(), (req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
        if (req.method === 'OPTIONS') {
            res.sendStatus(200);
        } else {
            next();
        }
    }], graphqlExpress(buildOptions));
    app.use('/graphiql', graphiqlExpress({
        endpointURL: '/graphql',
        passHeader: `'Authorization': 'bearer token-test@test.com'`,
    }));

    const PORT = process.env.SERVER_PORT || 3456;
    app.listen(PORT, () => {
        console.log(`Hackernews GraphQL server running on port ${PORT}.`)
    });
};


start();
