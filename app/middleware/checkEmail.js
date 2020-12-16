const db = require("../models");
const Shop = db.shop;
const SanPham = db.sanPham;
const GioHang = db.gioHang;
const DonHang = db.donHang;
const User = db.user;
exports.checkEmail = (req,res,next)=>{
  Shop.findOne({email:req.body.email},function(err,result){
    if(err){
    return  res.status(400).send({
        data:false
      })
    }
   next();
  })
}