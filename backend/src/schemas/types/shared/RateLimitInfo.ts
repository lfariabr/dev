import { GraphQLObjectType, GraphQLBoolean, GraphQLInt } from 'graphql'

export const RateLimitInfoType = new GraphQLObjectType({
  name: 'RateLimitInfo',
  fields: () => ({
    allowed: { type: GraphQLBoolean },
    resetIn: { type: GraphQLInt }, // seconds
  }),
})