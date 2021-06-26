const Cart = require('./../models/cartModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.createCartItem = catchAsync(async (req, res) => {
    let flag = true;
    const cartCheck = await Cart.find({owner:{$exists:true , $in:[req.body.owner]}});
    if(cartCheck.length == 0 ){
      flag = false;
    }
    if(flag){
      console.log("msc")
      let updateCart = await Cart.findOneAndUpdate({owner:req.body.owner},
        {$push: {items: req.body.items}}
        )
        res.status(200).json({
          status: 'success',
          data: {
            item: updateCart,
          },
        });
    }else{
      const newCartItem = await Cart.create(req.body);
      res.status(200).json({
        status: 'success',
        data: {
          item: newCartItem,
        },
      });

    }


    
  });

exports.getCart = catchAsync(async(req,res)=>{

  const cart = await Cart.findOne({owner:req.body.owner});
  let totalPrice = 0;
  for(let i = 0 ; i<cart.items.length ; i++){
    totalPrice += cart.items[i].price;
  }
    
  res.status(200).json(
    {
      status:'success',
      data:{
        totalPrice: totalPrice,
        items:cart
      }
    }
  
  )
  
})

exports.deleteCartItem = catchAsync(async(req,res)=>{
  const cart = await Cart.findOneAndDelete({owner:req.body.owner});
  if (!cart) {
    return next(new AppError('No item found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });

});