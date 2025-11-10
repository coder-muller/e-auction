import type { User, Address, Session, OwnAuction, ParticipatingAuction } from "./types"

export const mockUser: User = {
  name: "Guilherme Müller",
  email: "guilherme.muller@example.com",
  phone: "+55 (11) 98765-4321",
  avatar: "https://github.com/coder-muller.png",
}

export const mockAddress: Address = {
  street: "Rua das Flores",
  number: "123",
  complement: "Apto 45",
  neighborhood: "Centro",
  city: "São Paulo",
  state: "SP",
  zipCode: "01310-100",
}

export const mockSessions: Session[] = [
  {
    id: "1",
    device: "Chrome on macOS",
    location: "São Paulo, BR",
    lastActive: "Agora",
    current: true,
  },
  {
    id: "2",
    device: "Safari on iPhone",
    location: "São Paulo, BR",
    lastActive: "2 horas atrás",
    current: false,
  },
  {
    id: "3",
    device: "Chrome on Windows",
    location: "Rio de Janeiro, BR",
    lastActive: "1 dia atrás",
    current: false,
  },
]

export const mockOwnAuctions: OwnAuction[] = [
  {
    id: "1",
    title: "Rolex Submariner 2020",
    currentBid: 45000,
    endTime: "2 dias",
    status: "active",
    bids: 12,
  },
  {
    id: "2",
    title: "Porsche 911 Vintage",
    currentBid: 120000,
    endTime: "5 dias",
    status: "active",
    bids: 8,
  },
  {
    id: "3",
    title: "Colar de Diamante 5ct",
    currentBid: 85000,
    endTime: "Finalizado",
    status: "completed",
    bids: 25,
  },
]

export const mockParticipatingAuctions: ParticipatingAuction[] = [
  {
    id: "4",
    title: "Ferrari F40",
    myBid: 500000,
    currentBid: 520000,
    endTime: "1 dia",
    status: "outbid",
    leadingBidder: "João Silva",
  },
  {
    id: "5",
    title: "Pintura Original Van Gogh",
    myBid: 2500000,
    currentBid: 2500000,
    endTime: "3 dias",
    status: "leading",
    leadingBidder: "Você",
  },
  {
    id: "6",
    title: "Relógio Patek Philippe",
    myBid: 150000,
    currentBid: 180000,
    endTime: "6 horas",
    status: "outbid",
    leadingBidder: "Maria Santos",
  },
]

