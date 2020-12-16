const shop = require("../controllers/shop.controller");
const middleware = require("../middleware/checkEmail");

const uploadImage = require('../middleware/uploadImage');
const { user } = require("../models");
module.exports = app => {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.post("/registerShop",shop.registerShop);
  app.post("/loginShop", shop.loginShop);

  app.post("/themSanPham", uploadImage.array('hinh_anh',6), shop.themSanPham)
  app.post("/capNhatSanPham", uploadImage.array('hinh_anh', 6), shop.capNhatSanPham)
  app.post("/xoaSanPham", uploadImage.array('hinh_anh', 6), shop.xoaSanPham);
  app.get("/sanPhamShop", shop.sanPhamShop);
  app.post("/sanPhamTheoNganhHang", shop.sanPhamTheoNganhHang);
  app.post("/tatCaSanPham", shop.tatCaSanPham);
  app.post("/xacNhanDonHang", shop.xacNhanDonHang);
  app.post("/xacNhanDangGiaoHang", shop.xacNhanDangGiaoHang);
  app.post("/xacNhanThanhToanDonHang", shop.xacNhanThanhToanDonHang);
  app.post("/huyDonHang", shop.huyDonHang);
  app.post("/danhSachSanPhamChoXacNhan", shop.danhSachSanPhamChoXacNhan);
  app.post("/donHangUser", shop.donHangUser);
  app.post("/donHangTestUser", shop.donHangTestUser);
  app.post("/uploadImage", shop.uploadImage);

  app.post("/uploadMultipleImage",uploadImage.array('hinh_anh', 6), shop.uploadMultipleImage);


  app.post("/thongKeDoanhThuTheoCacThangTrongNam", shop.thongKeDoanhThuTheoCacThangTrongNam)
  app.post("/thongKeTheoCacNgayTrongThang", shop.thongKeTheoCacNgayTrongThang)

  app.post("/sanPhamBanChayThangNay", shop.sanPhamBanChayThangNay)
  app.post("/sanPhamBanChayTuDauNamDenNay", shop.sanPhamBanChayTuDauNamDenNay)
  //=============
  app.post("/thongKeTheoNgay", shop.thongKeTheoNgay)
  app.post("/thongKeTheoThang", shop.thongKeTheoThang)
  app.post("/thongKeTheoNam", shop.thongKeTheoNam)
  app.post("/sanPhamBanChayHomNay", shop.sanPhamBanChayHomNay)
  // app.post("/sanPhamBanChayThangNay1", shop.sanPhamBanChayThangNay1)
  app.post("/sanPhamBanChayNamNay", shop.sanPhamBanChayNamNay)
  app.post("/donHangChiTietUser", shop.donHangChiTietUser)
  app.post("/tatCaDonHangHoatDong", shop.tatCaDonHangHoatDong)
  app.post("/timKiemSanPham", shop.timKiemSanPham)
  app.post("/topSanPhamBanChayThangNay", shop.topSanPhamBanChayThangNay)
  app.post("/top10SanPhamCoDoanhThuCaoNhat", shop.top10SanPhamCoDoanhThuCaoNhat)
  app.post("/top10SanPhamBanChayNhat", shop.top10SanPhamBanChayNhat)
  app.post("/topKhachHang", shop.topKhachHang)
}

