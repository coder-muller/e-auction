
interface Billing {
    product: {
        id: string // _id do produto no convex
        name: string // nome do produto
        quantity: number // acredito que normalmente 1
        price: number // preço em *centavos*, min. 100 (1 real)
    }
    returnUrl: string
    completionUrl: string
    customer: {
        id: string // _id do comprador no convex
        name: string
        cellphone: string
        email: string
        taxId: string // cpf/cnpj do comprador
    }
    recipient: {

    }
    externalId: string // _id da transaction no convex
}

export function createBilling({ product, returnUrl, completionUrl, customer, externalId }: Billing) {



}
