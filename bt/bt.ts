class Customer {
    id: number;
    name: string;
    email: string;
    shippingAddress: string;

    constructor(id: number, name: string, email: string, shippingAddress: string) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.shippingAddress = shippingAddress;
    }

    getDetails(): string {
        return `id: ${this.id}, name: ${this.name}, email: ${this.email}, shippingAddress: ${this.shippingAddress}`;
    }
}

abstract class Product {
    id: number;
    name: string;
    price: number;
    stock: number;

    constructor(id: number, name: string, price: number, stock: number) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.stock = stock;
    }

    sell(quantity: number): void {
        if(quantity <= this.stock){
            this.stock -= quantity;
        }
    }

    restock(quantity: number): void {
        this.stock += quantity;
    }

    abstract getProductInfo(): string;
    abstract getShippingCost(distance: number): number;
    abstract getCategory(): string;
}

class ElectronicsProduct extends Product {
    warrantyPeriod: number;
    shippingPrice: number = 50000;

    constructor(id: number, name: string, price: number, stock: number, warrantyPeriod: number) {
        super(id, name, price, stock);
        this.warrantyPeriod = warrantyPeriod;
    }

    getProductInfo(): string {
        return `Name: ${this.name} - ID: ${this.id} - Price: ${this.price} - Stock: ${this.stock} - Warranty: ${this.warrantyPeriod} tháng`;
    }

    getShippingCost(distance: number): number {
        return distance * this.shippingPrice;
    }

    getCategory(): string {
        return "ElectronicProduct";
    }
}

class ClothingProduct extends Product {
    size: string;
    color: string;
    shippingPrice: number = 25000;

    constructor(id: number, name: string, price: number, stock: number, size: string, color: string) {
        super(id, name, price, stock);
        this.size = size;
        this.color = color;
    }

    getProductInfo(): string {
        return `Name: ${this.name} - ID: ${this.id} - Price: ${this.price} - Stock: ${this.stock} - Size: ${this.size} - Color: ${this.color}`;
    }

    getShippingCost(distance: number): number {
        return distance * this.shippingPrice;
    }

    getCategory(): string {
        return "ClothingProduct";
    }
}

class Order {
    orderId: number;
    customer: Customer;
    products: { product: Product; quantity: number }[];
    totalAmount: number;

    constructor(orderId: number, customer: Customer, products: { product: Product; quantity: number }[]) {
        this.orderId = orderId;
        this.customer = customer;
        this.products = products;
        this.totalAmount = products.reduce((sum, p) => sum + p.product.price * p.quantity, 0);
    }

    getDetails(): string {
    return `orderId: ${this.orderId} - ${this.customer} - Sản phẩm: ${this.products} - Tổng: ${this.totalAmount}`;
}

}

class Store {
    products: Product[] = [];
    customers: Customer[] = [];
    orders: Order[] = [];
    private orderIdCounter: number = 1;
    private customerIdCounter: number = 1;
    private productIdCounter: number = 1;


    addProduct(product: Product): void {
        this.products.push(product);
    }

    addCustomer(name: string, email: string, address: string): void {
        const newCustomer = new Customer(this.customerIdCounter++, name, email, address);
        this.customers.push(newCustomer);
    }

    createOrder(customerId: number, productQuantities: { productId: number; quantity: number }[]): Order | null {
        const customer = this.findEntityById(this.customers, customerId);
        if (!customer) {
            return null;
        }

        const orderProducts: { product: Product; quantity: number }[] = [];
        for (const pq of productQuantities) {
            const product = this.findEntityById(this.products, pq.productId);
            if (!product) {
                return null;
            }
            product.sell(pq.quantity);
            orderProducts.push({ product, quantity: pq.quantity });
        }
        const order = new Order(this.orderIdCounter++, customer, orderProducts);
        this.orders.push(order);
        return order;
    }

    cancelOrder(orderId: number): void {
        const index = this.orders.findIndex(o => o.orderId === orderId);
        if (index === -1) {
            return;
        }
        const order = this.orders[index];
        for (const item of order.products) {
            item.product.restock(item.quantity);
        }
        this.orders.splice(index, 1);
    }

    listAvailableProducts(): void {
        this.products.filter(p => p.stock > 0).forEach(p => console.log(p.getProductInfo()));
    }

    listCustomerOrders(customerId: number): void {
        this.orders.filter(o => o.customer.id === customerId).forEach(o => console.log(o.getDetails()));
    }

    calculateTotalRevenue(): number {
        return this.orders.reduce((sum, o) => sum + o.totalAmount, 0);
    }


    updateProductStock(productId: number, newStock: number): void {
        const index = this.products.findIndex(p => p.id === productId);
        if (index !== -1) {
            this.products[index].stock = newStock;
            console.log("Cập nhật tồn kho thành công.");
        } else {
            console.log("Không tìm thấy sản phẩm.");
        }
    }

}

const store = new Store();
let choice: number;

do {
    Number(prompt(`
        1. Thêm khách hàng mới:  
        2. Thêm sản phẩm mới: 
        3. Tạo đơn hàng mới:
        4. Hủy đơn hàng:
        5. Hiển thị danh sách sản phẩm còn hàng trong kho:
        6. Hiển thị danh sách đơn hàng của một khách hàng:
        7. Tính và hiển thị tổng doanh thu của cửa hàng
        8. Thống kê sản phẩm theo danh mục:
        9. Cập nhật tồn kho cho một sản phẩm:
        10. Tìm kiếm và hiển thị thông tin bằng Id:
        11. Xem thông tin chi tiết:
        12. Thoát chương trình
        nhap lựa chọn:
    `))

    choice = Number(prompt("nhap lựa chọn: "));

    switch (choice) {
        case 1: {
            const name = prompt("ten khách hàng: ");
            const email = prompt("Email: ");
            const address = prompt("đia chỉ: ");
            if(name && email && address){
                store.addCustomer(name, email, address);
                console.log("đã thêm khách hàng");
            } else {
                console.log("thông tin ko hop lệ");
            }
            break;
        }
        case 2: {
            const type = prompt("loại sản phẩm (1: điện tử, 2: quần áo):");
            const name = prompt("Tên sản phẩm:") || "";const price = Number(prompt("Giá:") || "0");
            const stock = Number(prompt("Số lượng:") || "0");
            
            if (!type) {
                console.log("Loại sản phẩm không hợp lệ.");
                break;
            }
            if (type === "1") {
                const warranty = Number(prompt("Thời hạn bảo hành:") || "0");
                store.addProduct(new ElectronicsProduct(store["productIdCounter"]++, name, price, stock, warranty));
            } else if (type === "2") {
                const size = prompt("Size:") || "0";
                const color = prompt("Color:") || "Không xác định";
                store.addProduct(new ClothingProduct(store["productIdCounter"]++, name, price, stock, size, color));
            } else {
                console.log("Loại sản phẩm không hợp lệ");
            }
            break;
        }
        case 3: {
            const customerId = Number(prompt("id khách hàng: "));
            const productCount = Number(prompt("số lượng sản phẩm trong đơn hàng: "));
            const productQuantities: { productId: number; quantity: number }[] = [];
            for (let i = 0; i < productCount; i++) {
                const productId = Number(prompt("id sản phẩm: "));
                const quantity = Number(prompt("số lượng: "));
                productQuantities.push({ productId, quantity });
            }
            const order = store.createOrder(customerId, productQuantities);
            if (order) {
                console.log("Tạo đơn hàng thành công:", order.getDetails());
            } else {
                console.log("Tạo đơn hàng thất bại. Kiểm tra lại ID khách hàng hoặc sản phẩm.");
            }
            break;
        }
        case 4: {
            const orderId = Number(prompt("ID đơn hàng để hủy: "));
            store.cancelOrder(orderId);
            break;
        }
        case 5:
            store.listAvailableProducts();
            break;
        case 6: {
            const customerId = Number(prompt("id khách hàng: "));
            store.listCustomerOrders(customerId);
            break;
        }
        case 7:
            console.log("tổng doanh thu:", store.calculateTotalRevenue());
            break;
        case 8:
            store.countProductsByCategory();
            break;
        case 9: {
            const productId = Number(prompt("id sản phẩm: "));
            const newStock = Number(prompt("số lượng tồn kho mới: "));
            store.updateProductStock(productId, newStock);
            break;
        }
        case 10: 
        case 11:
        case 12:
            console.log("Thoát chương trình");
            break;
        default:
            console.log("lựa chọn ko hơp lệ");
            break;
    }

} while (choice !== 12);

