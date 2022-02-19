const express = require("express");
const { buildSchema } = require("graphql");
const { graphqlHTTP } = require("express-graphql");
const axios = require("axios");
const app = express();

let message = "hello Mutation test";

const schema = buildSchema(`
    type User{
        name: String
        age: Int
        address: String
    }
    
    type Posts{
        userId: Int
        id: Int
        title: String
        body: String    
    }
    
    type Query {
        hello: String
        welcomeMessage(name: String, today: String!): String
        getUser: User
        getUsers: [User]
        getPostsFromExternalApi: [Posts]
        getMessage: String
    }
    
    input UserInput{
        name: String!
        age: Int!
        address: String!
    }

    type Mutation{
        setMessage(newMessage: String): String
        createUser(user:UserInput ): User
    }
`);

const root = {
  hello: () => {
    return " GraphQL Test ";
  },
  welcomeMessage: (args) => {
    return `parameter test for ${args.name} and today is ${args.today}`;
  },
  getUser: () => {
    const user = {
      name: "Mohko",
      age: 7,
      address: "Turku",
    };
    return user;
  },
  getUsers: () => {
    const users = [
      {
        name: "Mohko",
        age: 7,
        address: "Turku",
      },
      {
        name: "Dohko",
        age: 7,
        address: "Turku",
      },
      {
        name: "Bohko",
        age: 7,
        address: "Turku",
      },
    ];
    return users;
  },

  getPostsFromExternalApi: async () => {
    const res = await axios.get("https://jsonplaceholder.typicode.com/posts");
    return res.data;
  },

  getMessage: () => message,

  setMessage: ({ newMessage }) => {
    message = newMessage;
    return message;
  },

  createUser: (args) => {
    return args.user;
  },
};

app.use(
  "/graphql",
  graphqlHTTP({
    graphiql: true,
    schema: schema,
    rootValue: root,
  })
);

const PORT = 4000

app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
