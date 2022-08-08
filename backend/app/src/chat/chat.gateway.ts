import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { AsyncApiPub, AsyncApiService, AsyncApiSub } from 'nestjs-asyncapi'
import { Server, Socket } from 'socket.io'
import { chatEvent } from 'configs/chat-event.constants'
import { ChatMessageDto } from './chat.dto'

@AsyncApiService()
@WebSocketGateway({ namespace: 'chat', cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Server

  clients = []

  afterInit(server: Server) {
    console.log('chat:', 'new server')
  }

  handleConnection(client: Socket) {
    console.log('chat:', 'new connection')
  }

  handleDisconnect(client: Socket) {
    console.log('chat:', 'disconnected')
  }

  @SubscribeMessage(chatEvent.SEND)
  @AsyncApiPub({
    channel: chatEvent.SEND,
    summary: '클라이언트->서버로 메시지 전송',
    message: { name: 'msg', payload: { type: ChatMessageDto } },
  })
  async onSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() msg: ChatMessageDto,
  ) {
    const { senderUid, msgContent, roomId } = msg
    console.log(JSON.stringify(msg))
    console.log('chat:', senderUid + '(' + client.id + ') sent: ' + msgContent)
    this.broadcastMessage(client, msg)
  }

  @AsyncApiSub({
    channel: chatEvent.RECEIVE,
    summary: '메시지 전송',
    message: { name: 'msg', payload: { type: ChatMessageDto } },
  })
  async broadcastMessage(client, data: ChatMessageDto) {
    client.broadcast.to(data.roomId).emit(chatEvent.RECEIVE, data)
  }

  @SubscribeMessage(chatEvent.JOIN)
  @AsyncApiPub({
    channel: chatEvent.JOIN,
    summary: '채팅방에 참가',
    description: 'user가 채팅방에 새로 입장. 알림메시지를 모든 구성원에게 전송',
    message: { name: 'data', payload: { type: ChatMessageDto } },
  })
  async onJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: ChatMessageDto,
  ) {
    const { senderUid, roomId } = data
    client.join(roomId)
    console.log('chat:', senderUid + ' has entered to ' + roomId)
    this.emitNotice(roomId, senderUid, 'join')
    this.clients.push(client)
  }

  @AsyncApiSub({
    channel: chatEvent.NOTICE,
    summary: '공지msg',
    description: 'user 입장, 퇴장 등의 메시지',
    message: { name: 'data', payload: { type: ChatMessageDto } },
  })
  async emitNotice(roomId: string, senderUid: number, msg: string) {
    const data: ChatMessageDto = {
      roomId: roomId,
      senderUid: senderUid,
      msgContent: msg,
    }
    this.server.to(roomId).emit(chatEvent.NOTICE, data)
  }
}
