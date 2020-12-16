const { ObjectId } = require("mongodb");
const { cloudinary } = require('../utils/cloudinary');

const db = require("../models");
const Shop = db.shop;
const SanPham = db.sanPham;
const GioHang = db.gioHang;
const DonHang = db.donHang;
const DonHangChiTiet = db.donHangChiTiet;
const User = db.user;
const Images = db.images;

exports.registerShop = (req, res) => {
  const shop = new Shop({
    email: req.body.email,
    password: req.body.password
  });

  // Save Tutorial in the database
  shop
    .save(shop)
    .then(data => {
      res.status(200).json({
        msg: data
      });
      console.log(data)
    })
    .catch(err => {
      res.status(400).json({
        msg: err

      });
    });
};

exports.loginShop = async (req, res) => {
  Shop.findOne({ email: req.body.email, password: req.body.password }, (function (err, result) {
    if (result == null) {
      return res.status(400).send("Tài khoản hoặc mật khẩu không đúng");
    } else {
      return res.status(200).json({
        shop: result
      });
    }

  })
  )
}
exports.xacNhanDonHang = async (req, res) => {
  DonHangChiTiet.updateOne({ _id: req.body.idDonHangChiTiet }, { trangThai: "Đóng gói vận chuyển" }, function (err, result) {
    return res.status(200).json({
      msg: "Success !!!"
    })
  })
}
exports.xacNhanDangGiaoHang = async (req, res) => {
  DonHangChiTiet.updateOne({ _id: req.body.idDonHangChiTiet }, { trangThai: "Đã giao hàng" }, function (err, result) {
    return res.status(200).json({
      msg: "Success !!!"
    })
  })
}


exports.xacNhanThanhToanDonHang = async (req, res) => {
  DonHangChiTiet.updateOne({ _id: req.body.idDonHangChiTiet }, { trangThai: "Đã giao hàng" }, function (err, result) {
    return res.status(200).json({
      msg: "Success !!!"
    })
  })
}

exports.huyDonHang = async (req, res) => {
  DonHangChiTiet.updateOne({ _id: req.body.idDonHangChiTiet }, { trangThai: "Huỷ đơn hàng" }, function (err, result) {
    return res.status(200).json({
      msg: "Success !!!"
    })
  })
}
exports.danhSachSanPhamChoXacNhan = async (req, res) => {

  DonHangChiTiet.find({ trangThai: req.body.trangThai }).populate('sanPham.idSanPham').populate('idUser').exec(function (err, result) {
    if (result == null) {
      return res.status(400).json({
        msg: "Không có đơn hàng nào"
      })
    }
    var arrayData = [];
    result.map((value, index) => {
      var StringAllSanPham = '';
      value.sanPham.map((value, index) => {
        console.log(index)
        return StringAllSanPham = value.idSanPham.tenSanPham + " x " + value.soLuongMua + ", " + StringAllSanPham
      })
      let date = new Date(value.ngayMuaHang);
      let stringDate = date.getDate() + "-" + date.getMonth() + "-" + (date.getYear() - 100 + 2000)
      let data = {
        idDonHangChiTiet: value._id,
        stringSanPham: StringAllSanPham,
        nguoiMua: value.idUser.hoVaTen,
        sdt: value.idUser.soDienThoai,
        diaChi: value.idUser.diaChi,
        ngayMuaHang: value.ngayMuaHang,
        tongTien: value.tongTien + "",
      }
      arrayData.push(data)
    })

    // let date = new Date()
    // return res.status(200).send({msg:})
    return res.status(200).send({ msg: arrayData }
    )
  })
}
exports.donHangUser = async (req, res) => {

  DonHangChiTiet.find({ idUser: req.body.idUser }).populate('sanPham.idSanPham').populate('idUser').exec(function (err, result) {
    if (result == null) {
      return res.status(400).json({
        msg: "Không có đơn hàng nào"
      })
    }
    var arrayData = [];
    // let date = new Date(value.ngayMuaHang);
    let date = new Date();
    let stringDate = date.getDate() + "-" + date.getMonth() + "-" + (date.getYear() - 100 + 2000);
    trangThai = result[0].trangThai;
    ngayMuaHang = stringDate,
      result.map((value, index) => {
        var StringAllSanPham = '';
        value.sanPham.map((value, index) => {
          console.log(index)
          return StringAllSanPham = value.idSanPham.tenSanPham + " x " + value.soLuongMua + ", " + StringAllSanPham
        })
        let data = {
          idDonHangChiTiet: value._id,
          stringSanPham: StringAllSanPham,
          // idUser:result.idUser,
          nguoiMua: value.idUser.hoVaTen,
          sdt: value.idUser.soDienThoai,
          diaChi: value.idUser.diaChi,
          tongTien: value.tongTien + "",
        }
        arrayData.push(data)
      })

    // let date = new Date()
    // return res.status(200).send({msg:})
    return res.status(200).send(result
    )
  })
}
exports.donHangTestUser = async (req, res) => {
  donHangChiTiet.aggregate([
    {
      $match: { idUser: req.body.idUser }
    }
  ])
}

exports.donHangChiTietUser = async (req, res) => {
  DonHangChiTiet.findOne({ idHoaDon: req.body.idHoaDon }).populate('idUser').populate('sanPham.idSanPham').exec(function (req, result) {
    return res.status(200).json(
      result.sanPham
    )
  })
}



exports.themSanPham = async (req, res) => {

  var arrayImages = [];

  for (const items of req.files) {
    await cloudinary.uploader.upload(items.path, { use_filename: true, unique_filename: false }, function (error, result) {
      //  console.log(result.url)
      image = {
        url: result.url,
        public_id: result.public_id
      }
      arrayImages.push(image)
      //  return result.url
    }
    )
  }



  const sanPham = new SanPham({
    idShop: req.body.idShop,
    tenSanPham: req.body.tenSanPham,
    nganhHang: req.body.nganhHang,
    gia: req.body.gia,
    soLuong: req.body.soLuong,
    hinh_anh: arrayImages,
    moTa:req.body.moTa
  });
  sanPham
    .save(sanPham)
    .then(data => {
      res.status(200).json({ msg: data });
    })
    .catch(err => {
      res.status(400).json({
        message:
          err.message || "Some error occurred while creating the Tutorial."
      });
    });
}

exports.capNhatSanPham = async (req, res) => {

  var arrayImages = [];

  for (const items of req.files) {
    await cloudinary.uploader.upload(items.path, { use_filename: true, unique_filename: false }, function (error, result) {
      //  console.log(result.url)
      image = {
        url: result.url,
        public_id: result.public_id
      }
      arrayImages.push(image)
      //  return result.url
    }
    )
  }

  let idSanPham = req.body.idSanPham;
  let tenSanPham = req.body.tenSanPham;
  let nganhHang = req.body.nganhHang;
  let gia = req.body.gia;
  let soLuong = req.body.soLuong;
  let moTa = req.body.moTa


  await SanPham.findByIdAndUpdate({ _id: idSanPham }, { tenSanPham: tenSanPham, nganhHang: nganhHang, gia: gia, soLuong: soLuong, hinh_anh: arrayImages, moTa }, function (err, result) {
    if (err) {
      return res.status(400).json(err)
    }
    else {
      return res.status(200).json({ msg: result })
    }
  })
}

exports.xoaSanPham = (req, res) => {
  let idSanPham = req.body.idSanPham
  SanPham.findOneAndDelete({ _id: idSanPham }, function (err, result) {
    if (err) {
      res.send("Err delete")
    } else {
      res.send(result)
    }
  })
}
exports.sanPhamShop = (req, res) => {
  SanPham.find({}, function (err, result) {
    if (result == null) {
      return res.status(400).json({
        msg: "Không có sản phẩm nào"
      })
    }
    return res.status(200).json({
      msg: result
    })
  })
}
exports.sanPhamTheoNganhHang = (req, res) => {
  SanPham.find({ nganhHang: req.body.nganhHang}).limit(5).exec(
    function (err, result) {
      if (err) {
        return res.status(400).json({

        })
      }
      return res.status(200).json({
        msg: result
      })
    }
  ) 
}

exports.tatCaSanPham = (req, res) => {
  SanPham.find({}, function (err, result) {
    if (err) {
      return res.status(400).json({

      })
    }
    return res.status(200).json({
      data: result
    })
  })
}

exports.uploadImage = async (req, res) => {
  try {
    ;
    var arrayImages = [];
    const uploadResponse = await cloudinary.uploader.upload(fileStr, function (error, result) {
      image = {
        url: result.url,
        public_id: result.public_id
      }
      arrayImages.push(image)
    });

    const images = new Images({
      images: arrayImages
    })
    images.save(images).then(data => {
      console.log("==============================================")
      console.log("Success")
    })

  } catch (err) {
    console.log(fileStr);
    res.status(500).json({ err: 'Something went wrong' });
  }
}

exports.uploadMultipleImage = async (req, res) => {
  var arrayImages = [];

  for (const items of req.files) {
    await cloudinary.uploader.upload(items.path, { use_filename: true, unique_filename: false }, function (error, result) {
      //  console.log(result.url)
      image = {
        url: result.url,
        public_id: result.public_id
      }
      arrayImages.push(image)
      //  return result.url


    }
    )
  }
  const images = new Images({
    images: arrayImages
  })
  images.save(images).then(data => {
    console.log("==============================================")
    console.log("Success")
  })
}

//========================
exports.thongKeDoanhThu = (req, res) => {
  DonHangChiTiet.aggregate(
    [
      {

      }
    ]
  )
}

exports.thongKeDoanhThuTheoCacThangTrongNam = (req, res) => {
  DonHangChiTiet.aggregate(
    [
      {
        '$match': {
          "ngayMuaHang": {
            '$gte': new Date("2020-01-01"),
            '$lt': new Date("2020-12-31")
          }
        }
      },
      {
        $group:
        {
          "_id": {
            month: { "$month": { "$toDate": "$ngayMuaHang" } },

            // year:{"$year": { "$toDate": "$date"} }
          },
          // months: { $push: "$month" } ,

          Total: { $sum: "$tongTien" }
        },
      },
      {
        $sort: {
          '_id.month': 1
        }
      }
    ], function (err, result) {
      res.status(200).json({ msg: result })
    }
  )
}

exports.thongKeTheoCacNgayTrongThang = async (req, res) => {
  await DonHangChiTiet.aggregate([
    {
      '$match': {
        "ngayMuaHang": {
          '$gte': new Date("2020-01-01"),
          '$lt': new Date("2020-12-31")
        }
      }
    },
    {
      $group:
      {
        "_id": {
          // date: "$ngayMuaHang",
          "day": { "$dayOfMonth": "$ngayMuaHang" }
        },
        Total: { $sum: "$tongTien" }
      },
    },
    {
      $sort: {
        '_id.day': 1
      }
    }
  ], function (err, result) {
    if (err) {
      console.log(err)
      return res.send({ err })
    } else {
      console.log(result)
      return res.send({
        msg: result
      })
    }
  })
}

exports.sanPhamBanChayTuDauNamDenNay = async (req, res) => {
  await DonHangChiTiet.aggregate([
    // { $limit: 1 },

    {
      '$match': {
        "ngayMuaHang": {
          // '$gte': new Date(req.body.year + "-01-01"),
          // '$lt': new Date(req.body.year + "-12-31"),
          '$gte': new Date("2020-01-01"),
          '$lt': new Date("2020-12-31"),
        }
      }
    },
    {
      $unwind:
        '$sanPham'
    },
    {
      $group: {
        _id: "$sanPham.idSanPham",
        soLuong: { $sum: "$sanPham.soLuongMua" }

      }
    },
    {
      $lookup: {
        from: "SanPham",
        localField: "_id",
        foreignField: "_id",
        as: "sanPham"

      }
    },
    {
      $unwind:
        '$sanPham'
    },
    {
      $project: {
        tenSanPham: "$sanPham.tenSanPham",
        soLuong: "$soLuong"
      }
    }

    // { $sort: { so_luong: -1 } },
  ], function (err, result) {
    if (err) {
      console.log(err)
      return res.json({ err })
    } else {
      console.log(result)
      return res.send({ msg: result })
    }
  })
}


//==================
exports.thongKeTheoNgay = async (req, res) => {
  await DonHangChiTiet.aggregate([
    {
      '$match': {
        "ngayMuaHang": {
          // '$gte': new Date(req.body.year + "-01-01"),
          // '$lt': new Date(req.body.year + "-12-31"),
          '$gte': new Date("" + req.body.date1),
          '$lt': new Date("" + req.body.date2)
        }
      }
    },

    {
      $group: {
        _id: null,
        tongTien: { $sum: "$tongTien" }

      }
    },

  ], function (err, result) {
    if (err) {
      console.log(err)
      return res.json({ err })
    } else {
      console.log(result)
      return res.send({ msg: result })
    }
  })
}
exports.thongKeTheoThang = async (req, res) => {
  await DonHangChiTiet.aggregate([
    {
      '$match': {
        "ngayMuaHang": {
          // '$gte': new Date(req.body.year + "-01-01"),
          // '$lt': new Date(req.body.year + "-12-31"),
          '$gte': new Date(req.body.month + "-01"),
          '$lt': new Date(req.body.month + "-31"),
        }
      }
    },

    {
      $group: {
        _id: null,
        tongTien: { $sum: "$tongTien" }

      }
    },

  ], function (err, result) {
    if (err) {
      console.log(err)
      return res.json({ err })
    } else {
      console.log(result)
      return res.send({ msg: result })
    }
  })
}

exports.thongKeTheoNam = async (req, res) => {
  await DonHangChiTiet.aggregate([
    {
      '$match': {
        "ngayMuaHang": {
          // '$gte': new Date(req.body.year + "-01-01"),
          // '$lt': new Date(req.body.year + "-12-31"),
          '$gte': new Date(req.body.year + "-01-01"),
          '$lt': new Date(req.body.year + "-12-31")
        }
      }
    },

    {
      $group: {
        _id: null,
        tongTien: { $sum: "$tongTien" }

      }
    },

  ], function (err, result) {
    if (err) {
      console.log(err)
      return res.json({ err })
    } else {
      console.log(result)
      return res.send({ msg: result })
    }
  })
}

exports.sanPhamBanChayHomNay = async (req, res) => {
  await DonHangChiTiet.aggregate([
    {
      '$match': {
        "ngayMuaHang": {
          '$gte': new Date(req.body.date1),
          '$lt': new Date(req.body.date2)
        }
      }
    },
    {
      $unwind:
        '$sanPham'
    },
    {
      $group: {
        _id: "$sanPham.idSanPham",
        soLuong: { $sum: "$sanPham.soLuongMua" }

      }
    },
    {
      $lookup: {
        from: "SanPham",
        localField: "_id",
        foreignField: "_id",
        as: "sanPham"

      }
    },
    {
      $unwind:
        '$sanPham'
    },
    {
      $project: {
        tenSanPham: "$sanPham.tenSanPham",
        soLuong: "$soLuong"
      }
    },


    { $sort: { soLuong: -1 } },
    { $limit: 1 },
  ], function (err, result) {
    if (err) {
      console.log(err)
      return res.json({ err })
    } else {
      console.log(result)
      return res.send({ msg: result })
    }
  })
}

exports.topSanPhamBanChayThangNay = async (req, res) => {
  await DonHangChiTiet.aggregate([
    {
      '$match': {
        "ngayMuaHang": {
          '$gte': new Date(req.body.month + "-01"),
          '$lt': new Date(req.body.month + "-31"),
        }
      }
    },
    {
      $unwind:
        '$sanPham'
    },
    {
      $group: {
        _id: "$sanPham.idSanPham",
        soLuong: { $sum: "$sanPham.soLuongMua" }
      }
    },
    {
      $lookup: {
        from: "SanPham",
        localField: "_id",
        foreignField: "_id",
        as: "sanPham"

      }
    },
    {
      $unwind:
        '$sanPham'
    },
    {
      $project: {
        tenSanPham: "$sanPham.tenSanPham",
        soLuong: "$soLuong"
      }
    },

    { $sort: { soLuong: -1 } },
    {$limit:5}
    // { $limit: 1 },
  ], function (err, result) {
    if (err) {
      console.log(err)
      return res.json({ err })
    } else {
      console.log(result)
      return res.send({ msg: result })
    }
  })
}
exports.sanPhamBanChayThangNay = async (req, res) => {
  await DonHangChiTiet.aggregate([
    {
      '$match': {
        "ngayMuaHang": {
          '$gte': new Date(req.body.month + "-01"),
          '$lt': new Date(req.body.month + "-31"),
        }
      }
    },
    {
      $unwind:
        '$sanPham'
    },
    {
      $group: {
        _id: "$sanPham.idSanPham",
        soLuong: { $sum: "$sanPham.soLuongMua" }
      }
    },
    {
      $lookup: {
        from: "SanPham",
        localField: "_id",
        foreignField: "_id",
        as: "sanPham"

      }
    },
    {
      $unwind:
        '$sanPham'
    },
    {
      $project: {
        tenSanPham: "$sanPham.tenSanPham",
        soLuong: "$soLuong"
      }
    },


    { $sort: { soLuong: -1 } },
    { $limit: 1 },
  ], function (err, result) {
    if (err) {
      console.log(err)
      return res.json({ err })
    } else {
      console.log(result)
      return res.send({ msg: result })
    }
  })
}
exports.sanPhamBanChayNamNay = async (req, res) => {
  await DonHangChiTiet.aggregate([
    {
      '$match': {
        "ngayMuaHang": {
          '$gte': new Date(req.body.year + "-01-01"),
          '$lt': new Date(req.body.year + "-12-31")
        }
      }
    },
    {
      $unwind:
        '$sanPham'
    },
    {
      $group: {
        _id: "$sanPham.idSanPham",
        soLuong: { $sum: "$sanPham.soLuongMua" }

      }
    },
    {
      $lookup: {
        from: "SanPham",
        localField: "_id",
        foreignField: "_id",
        as: "sanPham"

      }
    },
    {
      $unwind:
        '$sanPham'
    },
    {
      $project: {
        tenSanPham: "$sanPham.tenSanPham",
        soLuong: "$soLuong"
      }
    },


    { $sort: { soLuong: -1 } },
    { $limit: 1 },
  ], function (err, result) {
    if (err) {
      console.log(err)
      return res.json({ err })
    } else {
      console.log(result)
      return res.send({ msg: result })
    }
  })
}

exports.tatCaDonHangHoatDong = async (req, res) => {
  DonHangChiTiet.find({ idUser: req.body.idUser, trangThai: { $nin: ["Huỷ đơn hàng"] } }).sort({ ngayMuaHang: -1 }
  ).exec(function (err, result) {
    return res.status(200).json({
      msg: result
    })
  })
}

exports.timKiemSanPham = async (req, res) => {
  SanPham.find({ tenSanPham: { $regex: req.body.tenSanPham } }, function (err, result) {

    if (err) {
      res.send(err)
    }
    else {
      res.json(result)
    }
})
}

exports.top10SanPhamCoDoanhThuCaoNhat = async(req,res)=>{
  await DonHangChiTiet.aggregate([
    {
      '$match': {
        "trangThai":"Đã giao hàng",
        // "ngayMuaHang": {
        //   '$gte': new Date(req.body.year + "-01-01"),
        //   '$lt': new Date(req.body.year + "-12-31")
        // }
      }
    },
    {
      $project:{
        trangThai:'$trangThai',
        sanPham:'$sanPham'
      }
    },

    {
      $unwind:
        '$sanPham'
    },
    {
      $group: {
        _id: "$sanPham.idSanPham",
        soLuongMua: { $sum: "$sanPham.soLuongMua" }

      }
    },
    
    {
      $lookup: {
        from: "SanPham",
        localField: "_id",
        foreignField: "_id",
        as: "sanPham",
     
    }
  },
   {
      $unwind:
        '$sanPham',
        
    },
    
    
  {
    $project:{
      tenSanPham:'$sanPham.tenSanPham',
      soLuongMua:'$soLuongMua',
      gia:'$sanPham.gia',
      hinh_anh:'$sanPham.hinh_anh.url',
      nganhHang:'$sanPham.nganhHang',
      tongTien: { $multiply: ['$sanPham.gia', '$soLuongMua'] }
    }
  },
    {
      $unwind:
        '$hinh_anh',

    },
    {
      $sort:{tongTien:-1}
    },
    {
      $limit:10
    }

  ], function (err, result) {
    if (err) {
      console.log(err)
      return res.json({ err })
    } else {
      // console.log(result)
      return res.send({msg:result})
    }
  })
}
exports.top10SanPhamBanChayNhat = async(req,res)=>{
  await DonHangChiTiet.aggregate([
    {
      '$match': {
        "trangThai":"Đã giao hàng",
        // "ngayMuaHang": {
        //   '$gte': new Date(req.body.year + "-01-01"),
        //   '$lt': new Date(req.body.year + "-12-31")
        // }
      }
    },
    {
      $project:{
        trangThai:'$trangThai',
        sanPham:'$sanPham'
      }
    },

    {
      $unwind:
        '$sanPham'
    },
    {
      $group: {
        _id: "$sanPham.idSanPham",
        soLuongMua: { $sum: "$sanPham.soLuongMua" }

      }
    },
    
    {
      $lookup: {
        from: "SanPham",
        localField: "_id",
        foreignField: "_id",
        as: "sanPham",
     
    }
  },
   {
      $unwind:
        '$sanPham',
        
    },
    
    
  {
    $project:{
      tenSanPham:'$sanPham.tenSanPham',
      soLuongMua:'$soLuongMua',
      gia:'$sanPham.gia',
      hinh_anh:'$sanPham.hinh_anh.url',
      nganhHang:'$sanPham.nganhHang',
      tongTien: { $multiply: ['$sanPham.gia', '$soLuongMua'] }
    }
  },
    {
      $unwind:
        '$hinh_anh',

    },
    {
      $sort:{soLuongMua:-1}
    },
    {
      $limit:10
    }

  ], function (err, result) {
    if (err) {
      console.log(err)
      return res.json({ err })
    } else {
      // console.log(result)
      return res.send({msg:result})
    }
  })
}

exports.topKhachHang = async (req,res)=>{
  DonHangChiTiet.aggregate([
    {
      $match:{
        trangThai:"Đã giao hàng"
      }
    },
    {
      $group:{
        _id:
          {idUser:'$idUser'},
        tongTien:{'$sum':'$tongTien'}
        // count:{$sum:1}
        
      }
    },
    {
      $lookup: {
        from: "User",
        localField: "_id.idUser",
        foreignField: "_id",
        as: "user",

      }
    },
    {$unwind:'$user'},
    {
      $project:{
        _id:'$_id.idUser',
        hoVaTen:'$user.hoVaTen',
        email:'$user.email',
        soDienThoai:'$user.soDienThoai',
        tongTien:'$tongTien',
        diaChi:'$user.diaChi'
      }
    },
    {
      $sort:{tongTien:-1}
    },
    {
      $limit:10
    }
  ], function (err, result) {
    if (err) {
      console.log(err)
      return res.json({ err })
    } else {
      // console.log(result)
      return res.send({msg:result } )
    }
  })
}
