import { INestApplication } from '@nestjs/common'
import {
  AsyncApiDocumentBuilder,
  AsyncApiModule,
  AsyncServerObject,
} from 'nestjs-asyncapi'

export async function setupAsyncApi(app: INestApplication): Promise<void> {
  const server: AsyncServerObject = {
    url: 'http://localhost:3000/chat',
    protocol: 'socket.io',
    protocolVersion: '4',
  }

  const options = new AsyncApiDocumentBuilder()
    .setTitle('SocketIO API for Chat')
    .setVersion('1.0')
    .addServer('', server)
    .build()

  const document = await AsyncApiModule.createDocument(app, options)
  await AsyncApiModule.setup('/api-ws', app, document)
}
