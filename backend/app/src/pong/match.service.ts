import { Injectable } from '@nestjs/common'
import { Socket } from 'socket.io'

type UserSocket = Socket & { uid: number }

type MatchData = {
  uid: number
  socket: UserSocket
}

@Injectable()
export class MatchService {
  private readonly quickQueue: MatchData[] = []
  private readonly rankedQueue: MatchData[] = []

  matchRanked(player: MatchData): { left: MatchData; right: MatchData } | null {
    this.rankedQueue.push(player)
    if (this.rankedQueue.length >= 2) {
      const left = this.rankedQueue.shift()
      const right = this.rankedQueue.shift()
      return { left, right }
    }
    return null
  }

  matchQuick(player: MatchData): { left: MatchData; right: MatchData } | null {
    this.quickQueue.push(player)
    console.log(this.quickQueue.map((elem) => elem.uid))
    if (this.quickQueue.length >= 2) {
      const left = this.quickQueue.shift()
      const right = this.quickQueue.shift()
      return { left, right }
    }
    return null
  }

  removeFromQueue(player: Socket) {
    this.quickQueue.splice(
      this.quickQueue.findIndex((p) => p.socket.id === player.id),
      1,
    )
    this.rankedQueue.splice(
      this.rankedQueue.findIndex((p) => p.socket.id === player.id),
      1,
    )
  }
}
