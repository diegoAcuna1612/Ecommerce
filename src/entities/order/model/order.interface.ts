export interface OrderItemInput {
    product_id: number | string;
    title: string;
    quantity: number;
    unit_price: number;
}

export interface OrderInput {
    nombre: string;
    email: string;
    tipo_entrega: 'casa' | 'recojo';
    direccion: string | null;
    ciudad: string | null;
    metodo_pago: 'tarjeta' | 'contraentrega';
    total: number;
    items: OrderItemInput[];
}

export interface Order extends Omit<OrderInput, 'items'> {
    id: number;
    created_at: string;
}
