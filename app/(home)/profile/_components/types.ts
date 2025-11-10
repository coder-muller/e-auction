// Tipos para dados mockados (serão substituídos por tipos reais quando integrar com backend)

export type User = {
  name: string
  email: string
  phone?: string
  avatar?: string
}

export type Address = {
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
}

export type Session = {
  id: string
  device: string
  location: string
  lastActive: string
  current: boolean
}

export type OwnAuction = {
  id: string
  title: string
  currentBid: number
  endTime: string
  status: "active" | "completed"
  bids: number
}

export type ParticipatingAuction = {
  id: string
  title: string
  myBid: number
  currentBid: number
  endTime: string
  status: "leading" | "outbid"
  leadingBidder: string
}

