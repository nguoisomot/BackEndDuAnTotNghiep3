const user = require("../controllers/user.controller");
module.exports = app => {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.post("/registerUser", user.registerUser)
  app.post("/loginUser", user.loginUser)
  app.post("/capNhatThongTinUser", user.capNhatThongTinUser)
  app.post("/doiMatKhau", user.doiMatKhau)
  app.post("/resetPassword", user.resetPassword)
  app.post("/themSanPhamVaoGioHang", user.themSanPhamVaoGioHang)
  app.post("/sanPhamYeuThich", user.sanPhamYeuThich)
  app.post("/sanPhamMuaSau", user.sanPhamMuaSau)
  app.post("/thanhToan", user.checkThongTin, user.thanhToan)
  app.post("/sanPhamTrongGioHang", user.sanPhamTrongGioHang)
  app.post("/xoaSanPhamTrongGioHang", user.xoaSanPhamTrongGioHang)
  app.post("/chiTietSanPham", user.chiTietSanPham)
  app.post("/forgotPassword", user.forgotPassword)
  // app.post("/thongKeTheoNam", user.thongKeTheoNam)
  app.post("/findDonHang", user.findDonHang)

  app.post("/lienKet", user.lienKet)

}