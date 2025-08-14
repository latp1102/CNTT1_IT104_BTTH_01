var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Customer = /** @class */ (function () {
    function Customer(id, name, email, shippingAddress) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.shippingAddress = shippingAddress;
    }
    Customer.prototype.getDetails = function () {
        return "id: ".concat(this.id, ", name: ").concat(this.name, ", email: ").concat(this.email, ", shippingAddress: ").concat(this.shippingAddress);
    };
    return Customer;
}());
var Product = /** @class */ (function () {
    function Product(id, name, price, stock) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.stock = stock;
    }
    Product.prototype.sell = function (quantity) {
        if (quantity <= this.stock) {
            this.stock -= quantity;
        }
    };
    Product.prototype.restock = function (quantity) {
        this.stock += quantity;
    };
    return Product;
}());
var ElectronicsProduct = /** @class */ (function (_super) {
    __extends(ElectronicsProduct, _super);
    function ElectronicsProduct(id, name, price, stock, warrantyPeriod) {
        var _this = _super.call(this, id, name, price, stock) || this;
        _this.shippingPrice = 50000;
        _this.warrantyPeriod = warrantyPeriod;
        return _this;
    }
    ElectronicsProduct.prototype.getProductInfo = function () {
        return "Name: ".concat(this.name, " - ID: ").concat(this.id, " - Price: ").concat(this.price, " - Stock: ").concat(this.stock, " - Warranty: ").concat(this.warrantyPeriod, " th\u00E1ng");
    };
    ElectronicsProduct.prototype.getShippingCost = function (distance) {
        return distance * this.shippingPrice;
    };
    ElectronicsProduct.prototype.getCategory = function () {
        return "ElectronicProduct";
    };
    return ElectronicsProduct;
}(Product));
var ClothingProduct = /** @class */ (function (_super) {
    __extends(ClothingProduct, _super);
    function ClothingProduct(id, name, price, stock, size, color) {
        var _this = _super.call(this, id, name, price, stock) || this;
        _this.shippingPrice = 25000;
        _this.size = size;
        _this.color = color;
        return _this;
    }
    ClothingProduct.prototype.getProductInfo = function () {
        return "Name: ".concat(this.name, " - ID: ").concat(this.id, " - Price: ").concat(this.price, " - Stock: ").concat(this.stock, " - Size: ").concat(this.size, " - Color: ").concat(this.color);
    };
    ClothingProduct.prototype.getShippingCost = function (distance) {
        return distance * this.shippingPrice;
    };
    ClothingProduct.prototype.getCategory = function () {
        return "ClothingProduct";
    };
    return ClothingProduct;
}(Product));
var Order = /** @class */ (function () {
    function Order(orderId, customer, products) {
        this.orderId = orderId;
        this.customer = customer;
        this.products = products;
        this.totalAmount = products.reduce(function (sum, p) { return sum + p.product.price * p.quantity; }, 0);
    }
    Order.prototype.getDetails = function () {
        var customerInfo = this.customer.getDetails();
        var productsInfo = this.products.map(function (p) { return "".concat(p.product.name, " x").concat(p.quantity); }).join(", ");
        return "orderId: ".concat(this.orderId, " - ").concat(customerInfo, " - S\u1EA3n ph\u1EA9m: ").concat(productsInfo, " - T\u1ED5ng: ").concat(this.totalAmount);
    };
    return Order;
}());
var Store = /** @class */ (function () {
    function Store() {
        this.products = [];
        this.customers = [];
        this.orders = [];
        this.orderIdCounter = 1;
        this.customerIdCounter = 1;
        this.productIdCounter = 1;
    }
    Store.prototype.addProduct = function (product) {
        this.products.push(product);
    };
    Store.prototype.addCustomer = function (name, email, address) {
        var newCustomer = new Customer(this.customerIdCounter++, name, email, address);
        this.customers.push(newCustomer);
    };
    Store.prototype.createOrder = function (customerId, productQuantities) {
        var customer = this.findEntityById(this.customers, customerId);
        if (!customer) {
            return null;
        }
        var orderProducts = [];
        for (var _i = 0, productQuantities_1 = productQuantities; _i < productQuantities_1.length; _i++) {
            var pq = productQuantities_1[_i];
            var product = this.findEntityById(this.products, pq.productId);
            if (!product) {
                return null;
            }
            product.sell(pq.quantity);
            orderProducts.push({ product: product, quantity: pq.quantity });
        }
        var order = new Order(this.orderIdCounter++, customer, orderProducts);
        this.orders.push(order);
        return order;
    };
    Store.prototype.cancelOrder = function (orderId) {
        var index = this.orders.findIndex(function (o) { return o.orderId === orderId; });
        if (index === -1) {
            return;
        }
        var order = this.orders[index];
        for (var _i = 0, _a = order.products; _i < _a.length; _i++) {
            var item = _a[_i];
            item.product.restock(item.quantity);
        }
        this.orders.splice(index, 1);
    };
    Store.prototype.listAvailableProducts = function () {
        this.products.filter(function (p) { return p.stock > 0; }).forEach(function (p) { return console.log(p.getProductInfo()); });
    };
    Store.prototype.listCustomerOrders = function (customerId) {
        this.orders.filter(function (o) { return o.customer.id === customerId; }).forEach(function (o) { return console.log(o.getDetails()); });
    };
    Store.prototype.calculateTotalRevenue = function () {
        return this.orders.reduce(function (sum, o) { return sum + o.totalAmount; }, 0);
    };
    Store.prototype.updateProductStock = function (productId, newStock) {
        var index = this.products.findIndex(function (p) { return p.id === productId; });
        if (index !== -1) {
            this.products[index].stock = newStock;
            console.log("Cập nhật tồn kho thành công.");
        }
        else {
            console.log("Không tìm thấy sản phẩm.");
        }
    };
    return Store;
}());
var store = new Store();
var choice;
do {
    Number(prompt("\n        1. Th\u00EAm kh\u00E1ch h\u00E0ng m\u1EDBi:  \n        2. Th\u00EAm s\u1EA3n ph\u1EA9m m\u1EDBi: \n        3. T\u1EA1o \u0111\u01A1n h\u00E0ng m\u1EDBi:\n        4. H\u1EE7y \u0111\u01A1n h\u00E0ng:\n        5. Hi\u1EC3n th\u1ECB danh s\u00E1ch s\u1EA3n ph\u1EA9m c\u00F2n h\u00E0ng trong kho:\n        6. Hi\u1EC3n th\u1ECB danh s\u00E1ch \u0111\u01A1n h\u00E0ng c\u1EE7a m\u1ED9t kh\u00E1ch h\u00E0ng:\n        7. T\u00EDnh v\u00E0 hi\u1EC3n th\u1ECB t\u1ED5ng doanh thu c\u1EE7a c\u1EEDa h\u00E0ng\n        8. Th\u1ED1ng k\u00EA s\u1EA3n ph\u1EA9m theo danh m\u1EE5c:\n        9. C\u1EADp nh\u1EADt t\u1ED3n kho cho m\u1ED9t s\u1EA3n ph\u1EA9m:\n        10. T\u00ECm ki\u1EBFm v\u00E0 hi\u1EC3n th\u1ECB th\u00F4ng tin b\u1EB1ng Id:\n        11. Xem th\u00F4ng tin chi ti\u1EBFt:\n        12. Tho\u00E1t ch\u01B0\u01A1ng tr\u00ECnh\n        nhap l\u1EF1a ch\u1ECDn:\n    "));
    choice = Number(prompt("nhap lựa chọn: "));
    switch (choice) {
        case 1: {
            var name_1 = prompt("ten khách hàng: ");
            var email = prompt("Email: ");
            var address = prompt("đia chỉ: ");
            if (name_1 && email && address) {
                store.addCustomer(name_1, email, address);
                console.log("đã thêm khách hàng");
            }
            else {
                console.log("thông tin ko hop lệ");
            }
            break;
        }
        case 2: {
            var type = prompt("loại sản phẩm (1: điện tử, 2: quần áo):");
            var name_2 = prompt("Tên sản phẩm:") || "";
            var price = Number(prompt("Giá:") || "0");
            var stock = Number(prompt("Số lượng:") || "0");
            if (!type) {
                console.log("Loại sản phẩm không hợp lệ.");
                break;
            }
            if (type === "1") {
                var warranty = Number(prompt("Thời hạn bảo hành:") || "0");
                store.addProduct(new ElectronicsProduct(store["productIdCounter"]++, name_2, price, stock, warranty));
            }
            else if (type === "2") {
                var size = prompt("Size:") || "0";
                var color = prompt("Color:") || "Không xác định";
                store.addProduct(new ClothingProduct(store["productIdCounter"]++, name_2, price, stock, size, color));
            }
            else {
                console.log("Loại sản phẩm không hợp lệ");
            }
            break;
        }
        case 3: {
            var customerId = Number(prompt("id khách hàng: "));
            var productCount = Number(prompt("số lượng sản phẩm trong đơn hàng: "));
            var productQuantities = [];
            for (var i = 0; i < productCount; i++) {
                var productId = Number(prompt("id sản phẩm: "));
                var quantity = Number(prompt("số lượng: "));
                productQuantities.push({ productId: productId, quantity: quantity });
            }
            var order = store.createOrder(customerId, productQuantities);
            if (order) {
                console.log("Tạo đơn hàng thành công:", order.getDetails());
            }
            else {
                console.log("Tạo đơn hàng thất bại. Kiểm tra lại ID khách hàng hoặc sản phẩm.");
            }
            break;
        }
        case 4: {
            var orderId = Number(prompt("ID đơn hàng để hủy: "));
            store.cancelOrder(orderId);
            break;
        }
        case 5:
            store.listAvailableProducts();
            break;
        case 6: {
            var customerId = Number(prompt("id khách hàng: "));
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
            var productId = Number(prompt("id sản phẩm: "));
            var newStock = Number(prompt("số lượng tồn kho mới: "));
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
