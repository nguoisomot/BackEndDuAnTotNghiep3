const { ObjectId } = require("mongodb");
const { hoaDonChiTietShop, hoaDonChiTietUser } = require("../models");
const db = require("../models");
const Shop = db.shop;
const SanPham = db.sanPham;
const GioHang = db.gioHang;
const User = db.user;
const SanPhamYeuThich = db.sanPhamYeuThich;
const SanPhamMuaSau = db.sanPhamMuaSau;
const DonHang = db.donHang;
const DonHangChiTiet = db.donHangChiTiet;
const sendMail = require('./sendMail')
const jwt = require('jsonwebtoken')


exports.registerUser = (req, res) => {
  User.findOne({email:req.body.email},function(
    err,result){
      if(err) return res.status(500).send("Err Server")
      if(result == null){
        const user = new User({
          // _id: req.body._id,
          hoVaTen: req.body.hoVaTen || '',
          email: req.body.email,
          soDienThoai: req.body.soDienThoai || '',
          password: req.body.password,
          diaChi: req.body.diaChi || ''
        });

        user
          .save(user)
          .then(data => {
            res.status(200).json({
              msg: data
            });
            console.log(data)
          })
          .catch(err => {
            res.status(400).json({
              msg: "Email đã tồn tại"
            });
          });
      }else{
        return res.status(201).json({
          msg: "Tài khoản đã tồn tại"
        })
      }
    })
  
}

exports.loginUser = async (req, res) => {
  User.findOne({
    email: req.body.email,
    password: req.body.password
  }).exec(function (err, result) {
    if (err) {
      return res.status(500).json({
        msg: err
      })
    }
    if(result == null){
      return res.status(400).json({ msg: result });
    }
     return res.status(200).json({ msg: result });
  })
}

exports.capNhatThongTinUser = (req, res) => {
  User.findOneAndUpdate({
    _id: req.body.idUser
  }, {
    hoVaTen: req.body.hoVaTen,
    soDienThoai: req.body.soDienThoai,
    diaChi: req.body.diaChi
  }, function (err, result) {
    if (err) {
      return res.status(400).json({
        err: err
      })

    }
    return res.status(200).json({
      data: result
    })
  })
}

exports.doiMatKhau =(req,res)=>{
  User.findOneAndUpdate({_id:req.body.idUser,password:req.body.password1},{
    password: req.body.password2
  },function(err,result){
    if(result == null){
      return res.status(400).json({
        msg: "Mật khẩu cũ không đúng"
      })
    }
      return res.status(200).json({
        msg: "Đã đổi mật khẩu"
      })
  })

}


exports.chiTietSanPham = (req, res) => {

  SanPham.findOne({ _id: req.body.idSanPham }, function (err, result) {
    if (err) {
      return res.status(400).json({
        msg: err
      })
    }
    else {
      return res.status(200).json({
        sanPham: result
      })
    }
  })

}

exports.sanPhamYeuThich = async (req, res) => {
  SanPhamYeuThich.findOne({
    idUser: req.body.idUser,
    idSanPham: req.body.idSanPham
  }, function (err, result) {
    if (result) {
      return res.status(200).json({
        msg: "Sản phẩm đã tồn tại trong danh sách"
      })
    }
    else {
      const sanPhamYeuThich = new SanPhamYeuThich({
        idUser: req.body.idUser,
        idSanPham: req.body.idSanPham
      })
      sanPhamYeuThich.save(sanPhamYeuThich).then(data => {
        return res.status(200).json({
          msg: data
        })
      }).catch(err => {
        return res.status(400).json({
          msg: err
        })
      })
    }
  })
}
exports.deleteSanPhamYeuThich = (req, res) => {
  SanPhamYeuThich.deleteOne({
    idUser: req.body.idUser,
    idSanPham: req.body.idSanPham
  }, function (err, result) {
    if (err) {
      return res.status(400).json({
        msg: err
      })
    } else {
      return res.status(200).json({
        msg: "Đã xóa"
      })
    }
  })
}
exports.sanPhamMuaSau = async (req, res) => {
  SanPhamMuaSau.findOne({
    idUser: req.body.idUser,
    idSanPham: req.body.idSanPham,
  }, function (err, result) {
    if (result) {
      return res.status(200).json({
        msg: "Sản phẩm đã tồn tại trong danh sách"
      })
    }
    else {
      const sanPhamMuaSau = new SanPhamMuaSau({
        idUser: req.body.idUser,
        idSanPham: req.body.idSanPham
      })
      sanPhamMuaSau.save(sanPhamMuaSau).then(data => {
        return res.status(200).json({
          msg: data
        })
      }).catch(err => {
        return res.status(400).json({
          msg: err
        })
      })
    }
  })
}

exports.deleteSanPhamMuaSau = (req, res) => {
  SanPhamMuaSau.deleteOne({
    idUser: req.body.idUser,
    idSanPham: req.body.idSanPham
  }, function (err, result) {
    if (err) {
      return res.status(400).json({
        msg: err
      })
    } else {
      return res.status(200).send({
        msg: result
      })
    }
  })
}

exports.themSanPhamVaoGioHang = async (req, res) => {
  
  GioHang.findOne({
    idUser: req.body.idUser
  }).exec(function (err, result) {
    if (result) {
      GioHang.updateOne({
        'idUser': req.body.idUser,
        'items.idSanPham': ObjectId(req.body.idSanPham)
      }, { '$inc': { 'items.$.soLuong': req.body.soLuongMua } }).exec(function (err1, result1) {
        if (result1.nModified == 0) {
          GioHang.update({
            'idUser': req.body.idUser,
          }, {
            '$push': {
              'items': { 'idSanPham': ObjectId(req.body.idSanPham), soLuongMua: req.body.soLuongMua }
            }
          }, function (err2, result2) {
            if (result2) {
              return res.status(200).json({
                msg: result2
              })
            }
            return
          })
          // return res.send(err);
        } else {
          return res.json({ result1: "oke" });
        }
      })

    }
    else {
      let sanPham = [{ idSanPham: req.body.idSanPham, soLuongMua: req.body.soLuongMua }]
      const gioHang = new GioHang({
        idUser: req.body.idUser,
        items: sanPham
      });
      gioHang.save(gioHang).then(
        data => {
          return res.status(200).json({ msg: data });
        }).catch(err => {
          return res.status(400).json({
            msg: "Server đang gặp sự cố"

          });
        })
    }
  })
}

exports.hienThanhSanPhamTheoNganhHang = (req, res) => {
  SanPham.find({ nganhHang: req.body.nganhHang }, function (err, result) {
    if (err) {
      return res.status(400).json({
        msg: err
      })
    } else {
      return res.status(200).json({
        msg: result
      })
    }
  })
}

exports.xoaSanPhamTrongGioHang = (req, res) => {
  GioHang.update(
    { idUser: req.body.idUser },
    { $pull: { "items": { idSanPham: req.body.idSanPham } } }, function (err, result) {
      if (err) {
        return res.status(400).json({
          msg: "err"
        })
      }
      else {
        return res.status(200).json({
          msg: result
        })
      }
    }
  )
}

// exports.sanPhamTrongGioHang = async (req, res) => {
//   GioHang.find({ idUser: req.body.idUser }).populate('items.idSanPham').populate('idUser').exec(function(err,result){
//     if(result == null){
//       return res.status(400).send("Không có sản phẩm nào")
//     }
//     return res.status(200).send(result)
//   })
// }
exports.sanPhamTrongGioHang = async (req, res) => {
  GioHang.aggregate([
    
  ])
}

exports.thanhToan = (req, res) => {
  GioHang.findOne({ idUser: req.body.idUser }).populate('items.idSanPham').exec(function (err, result) {
    if (err) {
      return res.status(500).json({
        msg: err
      })
    }
    else {
      // if(result == null){
      //   return res.status(201).json({
      //     msg:"Không có sản phẩm nào"
      //   })
      // }
      var sanPham = [];
      var tongTien = 0
      result.items.map((value, index) => {
        console.log("tongTien: " + (value.idSanPham.gia * value.soLuongMua + tongTien));
        tongTien = value.idSanPham.gia * value.soLuongMua + tongTien;
        return sanPham.push({
          idSanPham: value.idSanPham,
          soLuong: value.soLuong,
        })
      })
      const donHang = new DonHang({
        idUser:req.body.idUser,
        tongTien:tongTien
      })
      
      donHang.save(donHang).then(
        data =>{
          const donHangChiTiet = new DonHangChiTiet({
            idHoaDon: data._id,
            idUser:req.body.idUser,
            sanPham:result.items,
            tongTien:tongTien,
            trangThai:"Đã tiếp nhận đơn hàng"
          })
          donHangChiTiet.save(donHangChiTiet).then(
            data =>{
              GioHang.deleteOne({idUser:req.body.idUser},function(err,result){
                if(result){
                  console.log(result)
                }
              })
             return res.status(200).json({
                msg:data
              })
            }
          ).catch(err=>{
            return res.status(400).json({
              msg: err
            })
          })
        }
      )
    }
  })
}



exports.findDonHang = (req, res) => {
  GioHang.aggregate([
    {
      '$match': {
        idUser: ObjectId(req.body.idUser),
      }
    },
    {
      $lookup: {
        from: "SanPham",
        localField: "items.idSanPham",
        foreignField: "_id",
        as: "san_pham",
      }
    },
    {
      $project: {
        items: "$san_pham",
      }
    },
  ], function (err, result) {
    if (err) {
      return res.status(400).json({
        msg: err
      })
    }
    else {
      let tongTien = 0;
      result[0].items.map((value, index) => {
        tongTien = value.gia * value.soLuong + tongTien
      })
      result.push({ "tongTien": tongTien })
      return res.status(200).json(
        {
          msg: result,
        })
    }
  })
}

exports.lienKet = (req, res) => {
  SanPhamYeuThich.find({}).populate('idUser').exec(function (err, result) {
    if (err) return handleError(err);
    return res.status(200).json({
      msg: result
    });
  });
}
exports.checkThongTin = async (req, res, next) => {
  User.findOne({ _id: req.body.idUser }, function (err, result) {
    if (result == null) {
      return res.status(400).json({
        msg: "Không tìm thấy"
      })
    }
    else if (result.diaChi == '' || result.soDienThoai == '' || result.hoVaTen == '') {
      return res.status(202).json({
        msg: "Bạn chưa cập nhật xong thông tin"
      })
    }
    next()
  })
}

const { CLIENT_URL } = process.env
const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
}
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ msg: "This email does not exist." })

    const access_token = createAccessToken({ id: user._id })
    const url = `${CLIENT_URL}/user/reset/${access_token}`

    sendMail(email, url, "Reset your password")
    res.json({ msg: "Re-send the password, please check your email." })
  } catch (err) {
    return res.status(500).json({ msg: err.message })
  }
}
exports.resetPassword = async (req, res) => {
  try {
 
    const { password } = req.body
   await jwt.verify(req.headers.authorization, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        // return res.status(401).send({
        //   message: "Unauthorized!"
        // });
      }
      console.log(req.headers.authorization)
      console.log(decoded)

      // const passwordHash = await bcrypt.hash(password, 12)

    await User.findOneAndUpdate({ _id: decoded.id }, {
      password: password
    },function(err,result){
      if(err) return
      console.log("Okay")
      return res.status(200).json({
        msg:"Mật khẩu khôi phục thành công"
      })
    })

    });
    
  } catch (err) {
    return res.status(500).json({ msg: err.message })
  }

}