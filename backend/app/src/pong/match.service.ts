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
  private readonly privateMap: Map<number, MatchData> = new Map()

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
    if (this.quickQueue.length >= 2) {
      const left = this.quickQueue.shift()
      const right = this.quickQueue.shift()
      return { left, right }
    }
    return null
  }

  matchPrivate(
    player: MatchData,
    opponent?: number,
  ): { left: MatchData; right: MatchData } | null {
    console.log(player.uid, opponent)
    if (opponent && this.privateMap.has(opponent)) {
      const left = this.privateMap.get(opponent)
      this.privateMap.delete(opponent)
      return { left, right: player }
    } else {
      this.privateMap.set(player.uid, player)
      return null
    }
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
