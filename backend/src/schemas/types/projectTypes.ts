export const projectTypes = `#graphql
  type Project {
    id: ID!
    slug: String!
    title: String!
    description: String!
    technologies: [String!]!
    imageUrl: String!
    githubUrl: String
    liveUrl: String
    featured: Boolean!
    order: Int!
    createdAt: String!
    updatedAt: String!
  }

  input ProjectInput {
    title: String!
    description: String!
    technologies: [String!]!
    imageUrl: String!
    githubUrl: String
    liveUrl: String
    featured: Boolean
    order: Int
    slug: String
  }

  input ProjectUpdateInput {
    title: String
    description: String
    technologies: [String!]
    imageUrl: String
    githubUrl: String
    liveUrl: String
    featured: Boolean
    order: Int
    slug: String
  }
`;
