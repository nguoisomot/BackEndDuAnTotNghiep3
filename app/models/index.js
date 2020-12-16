const dbConfig = require("../config/db.config.js");
const mongoose = require("mongoose");
const model = require("./model");
const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;

// phần user
db.user = model.User(mongoose);
db.shop = model.Shop(mongoose);
db.sanPhamMuaSau = model.SanPhamMuaSau(mongoose);
db.sanPhamYeuThich = model.SanPhamYeuThich(mongoose);
db.gioHang = model.GioHang(mongoose);
db.donHang = model.DonHang(mongoose);
db.donHangChiTiet = model.DonHangChiTiet(mongoose);
// phần shop
db.sanPham = model.SanPham(mongoose);

module.exports = db;
