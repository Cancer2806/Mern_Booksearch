// Define front end queries matching backend query resolvers
import { gql } from '@apollo/client';

export const GET_ME = gql`
query me {
  me {
    _id
    username
    email
    bookCount
    savedBooks {
      bookId
      authors
      title
      description
      image
      link
    }
  }
}
`;