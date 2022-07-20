// import apollo and define typeDefs for GraphQl
const { gql } = require('apollo-server-express');

// types relate directly to the database schema models
// queries and mutations relate directly to the resolvers

const typeDefs = gql`
type Book {
  _id: ID!
  bookId: ID!
  authors: [String]
  title: String!
  description: String
  image: String
  link: String
}

type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int
    # password: String!
    savedBooks: [Book]
  }

type Auth {
  token: String!
  user: User!
}

type Query {
  me: User
}

type Mutation {
  login(
    email: String!, 
    password: String!
    ): Auth

  addUser(
    username: String!, 
    email: String!, 
    password: String!
    ): Auth

  saveBook(
    bookId: ID!, 
    authors: [String],
    title: String!,
    description: String,
    image: String,
    link: String
    ): User

    removeBook(bookId: ID!
      ): User
  }
`;

module.exports = typeDefs;