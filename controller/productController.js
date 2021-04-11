const Product = require("./../models").Products;
const catchAsync = require("../utills/catchAsync");
const { Validator, assert } = require("node-input-validator");
const fetch = require("node-fetch");

exports.index = catchAsync(async (req, res) => {
  const allProducts = await Product.findAll({
    where: {
      deleted: 0,
    },
  });
  fetch(
    "http://api.currencylayer.com/live?access_key=72804836023bec35e8feee36854125a3&currencies=USD,CAD,EUR,GBP&format=1"
  )
    .then((res) => res.json())
    .then((json) => {
      console.log(json.quotes);
      var newProduct = priceDEtails(json.quotes, allProducts);
      return res.status(200).json({
        status: true,
        message: "all products",
        product: newProduct,
      });
    });
});

exports.create = catchAsync(async (req, res) => {
  const v = new Validator(req.body, {
    name: "required",
    price: "required|integer",
    description: "required",
  });

  if (!(await v.check())) {
    return res.status(422).json({
      status: false,
      message: "validation fail",
      errors: v.errors,
    });
  }
  const product = await Product.create(req.body);

  fetch(
    "http://api.currencylayer.com/live?access_key=72804836023bec35e8feee36854125a3&currencies=USD,CAD,EUR,GBP&format=1"
  )
    .then((res) => res.json())
    .then((json) => {
      var newProduct = priceDEtailsDingle(json.quotes, product);
      res.status(200).json({
        status: true,
        message: "product created successfully",
        product: newProduct,
      });
    });
});

exports.oneProduct = catchAsync(async (req, res) => {
  const id = req.params.id;
  const singleProduct = await Product.findOne({
    where: {
      deleted: 0,
      id,
    },
  });
  if (!singleProduct) {
    return res.status(404).json({
      status: false,
      message: "product not found",
    });
  }
  singleProduct.update({
    view_count: parseInt(singleProduct.view_count) + 1,
  });
  fetch(
    "http://api.currencylayer.com/live?access_key=72804836023bec35e8feee36854125a3&currencies=USD,CAD,EUR,GBP&format=1"
  )
    .then((res) => res.json())
    .then((json) => {
      var newProduct = priceDEtailsDingle(json.quotes, singleProduct);
      return res.status(200).json({
        status: true,
        message: "product",
        product: newProduct,
      });
    });
});

exports.mostViewed = catchAsync(async (req, res) => {
  const limit = req.params.limit ?? 5;
 
  const most_viewed = await Product.findAll({
    where: {
      deleted: 0,
    },
    limit: parseInt(limit),
    order: [["view_count", "DESC"]],
  });

  fetch(
    "http://api.currencylayer.com/live?access_key=72804836023bec35e8feee36854125a3&currencies=USD,CAD,EUR,GBP&format=1"
  )
    .then((res) => res.json())
    .then((json) => {
      console.log(json.quotes);
      var newProduct = priceDEtails(json.quotes, most_viewed);
      return res.status(200).json({
        status: true,
        message: "most viewed product",
        product: most_viewed,
      });
    });
});

exports.delete = catchAsync(async (req, res) => {
  const id = req.params.id;
  const singleProduct = await Product.findOne({
    where: {
      deleted: 0,
      id,
    },
  });

  if (!singleProduct) {
    return res.status(404).json({
      status: false,
      message: "product not found",
    });
  }

  const query = await singleProduct.update({
    deleted: 1,
  });

  if (query) {
    return res.status(200).json({
      status: true,
      message: "product deleted",
    });
  } else {
    return res.status(500).json({
      status: false,
      message: "something went wrong please try again letter",
    });
  }
});

const priceDEtails = (cur, arr) => {
  var USD = 1;
  var CAD = cur.USDCAD;
  var EUR = cur.USDEUR;
  var GBP = cur.USDGBP;
  var product = new Array();
  arr.forEach((v, i) => {
    v["dataValues"]["all_price"] = {
      USD: parseFloat(v.price) * USD,
      CAD: parseFloat(v.price) * CAD,
      EUR: parseFloat(v.price) * EUR,
      GBP: parseFloat(v.price) * GBP,
    };
    product.push(v);
  });
  return product;
};

const priceDEtailsDingle = (cur, product) => {
  var USD = 1;
  var CAD = cur.USDCAD;
  var EUR = cur.USDEUR;
  var GBP = cur.USDGBP;
  product["dataValues"]["all_price"] = {
    USD: parseFloat(product.price) * USD,
    CAD: parseFloat(product.price) * CAD,
    EUR: parseFloat(product.price) * EUR,
    GBP: parseFloat(product.price) * GBP,
  };
  return product;
};
