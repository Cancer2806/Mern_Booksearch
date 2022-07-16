import { gql } from '@apollo/client';

// LOGIN_USER will execute the loginUser mutation set up using Apollo Server.
export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    user {
        _id
        username
      }
      token
  }
}
`;


// ADD_USER will execute the addUser mutation.
export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      user {
        _id
        username
        email
        password
      }
      token
  }
}
`

// SAVE_BOOK will execute the saveBook mutation.
export const SAVE_BOOK = gql`
  mutation saveBook($bookId: String!, $authors: [String], $description: String, $title: String!, $image: String, $link: String){
  saveBook(bookId: $bookId, authors: $authors, description: $description, title: $title, image: $image, link: $link) {
    username
    savedBooks {
      bookId
      title
      authors
      link
      image
      description
    }
  }
}
`

// REMOVE_BOOK will execute the removeBook mutation.
export const REMOVE_BOOK = gql`
  mutation removeBook($bookId: String!){
  removeBook(bookId: $bookId) {
    username
    savedBooks {
      bookId
      title
    }
  }
}
`
