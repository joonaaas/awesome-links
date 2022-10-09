import { ApolloServer } from 'apollo-server-micro'
import { schema } from '../../graphql/schema';
import { resolvers } from '../../graphql/resolvers'
import Cors from 'micro-cors'
import { MicroRequest } from 'apollo-server-micro/dist/types'
import { ServerResponse, IncomingMessage } from 'http'
import { createContext } from '../../graphql/context';

const cors = Cors()

const apolloServer = new ApolloServer({ schema, resolvers, context: createContext })

const startServer = apolloServer.start()

export default cors(async function handler(req: MicroRequest, res: ServerResponse<IncomingMessage>) {
  if (req.method === 'OPTIONS') {
    res.end()
    return false
  }
  await startServer

  await apolloServer.createHandler({
    path: '/api/graphql',
  })(req, res)
})

export const config = {
  api: {
    bodyParser: false,
  },
}
