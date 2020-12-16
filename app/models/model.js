const { ObjectID, ObjectId } = require("mongodb");
// Phần model của User
User = mongoose => {
  var User = new mongoose.Schema({
    email: { type: String,unique:true },
    hoVaTen: { type: String },
    soDienThoai: { type: String },
    password: { type: String },
    diaChi: { type: String }
  }, {
    collection: 'User'
  });
  const UserModal = mongoose.model('User', User);
  return UserModal;
}
Shop = mongoose => {
  var Shop = new mongoose.Schema({
    email: { type: String },
    password: { type: String }
  }, {
      collection: 'Shop'
  });
  const ShopModel = mongoose.model('Shop', Shop);
  return ShopModel;
}
SanPhamMuaSau = mongoose => {
  var SanPhamMuaSau = new mongoose.Schema({
    idUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    idSanPham: { type: mongoose.Schema.Types.ObjectId, ref: 'SanPham' }  ,
    soLuong:{type:Number, default:1}
  }, {
    collection: 'SanPhamMuaSau'
  });
  const SanPhamMuaSauModel = mongoose.model('SanPhamMuaSau', SanPhamMuaSau);
  return SanPhamMuaSauModel;
}

SanPhamYeuThich = mongoose => {
  var SanPhamYeuThich = new mongoose.Schema({
    idUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    idSanPham: { type: mongoose.Schema.Types.ObjectId, ref: 'SanPham',require:true }
  }, {
    collection: 'SanPhamYeuThich'
  });
  const SanPhamYeuThichModel = mongoose.model('SanPhamYeuThich', SanPhamYeuThich);
  return SanPhamYeuThichModel;
}
GioHang = mongoose => {
  var GioHang = new mongoose.Schema({
    idUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [{ idSanPham: { type: mongoose.Schema.Types.ObjectId, ref: 'SanPham' } , soLuongMua: { type: Number } }],
  }, {
    collection: 'GioHang'
  });
  const GioHangModel = mongoose.model('GioHang', GioHang);
  return GioHangModel;
}

DonHang = mongoose => {
  var DonHang = new mongoose.Schema({
    idUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    ngayMuaHang: { type: Date, default: Date.now },
    tongTien:{type:Number},
    
  }, {
      collection: 'DonHang'
  });
  const DonHangModel = mongoose.model('DonHang', DonHang);
  return DonHangModel;
}
DonHangChiTiet = mongoose => {
  var DonHangChiTiet = new mongoose.Schema({
    idHoaDon: { type: mongoose.Schema.Types.ObjectId, ref: 'DonHang' },
    idUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    sanPham: [{ idSanPham: { type: mongoose.Schema.Types.ObjectId, ref: 'SanPham' }, soLuongMua: { type: Number } }],
    ngayMuaHang:{type:Date, default:Date.now},
    tongTien: { type: Number },
    trangThai:{type:String}
   
  }, {
      collection: 'DonHangChiTiet'
  });
  const DonHangChiTietModel = mongoose.model('DonHangChiTiet', DonHangChiTiet);
  return DonHangChiTietModel;
}

// Phần model của Shop


SanPham = mongoose => {
  var SanPham = new mongoose.Schema({
    tenSanPham: { type: String },
    nganhHang: { type: String },
    gia: { type: Number },
    soLuong: { type: Number },
    hinh_anh: { type: Array },
    moTa: { type: String },
  }, {
    collection: 'SanPham'
  });
  const SanPhamModel = mongoose.model('SanPham', SanPham);
  return SanPhamModel;
}


const Model = {
  User:User,
  SanPhamMuaSau: SanPhamMuaSau,
  SanPhamYeuThich: SanPhamYeuThich,
  GioHang: GioHang,
  DonHang: DonHang,
  DonHangChiTiet: DonHangChiTiet,
  // shop
  Shop:Shop,
  SanPham: SanPham,
}
module.exports = Model