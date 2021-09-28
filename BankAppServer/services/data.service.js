const db = require('./db')
users = {
  1000: { acno: 1000, username: "Aahil", password: "userone", balance: 5000, transaction: [] },
  1001: { acno: 1001, username: "Bahit", password: "usertwo", balance: 7000, transaction: [] },
  1002: { acno: 1002, username: "Cahit", password: "userthree", balance: 6000, transaction: [] },
  1003: { acno: 1003, username: "Dahit", password: "userfour", balance: 4000, transaction: [] }
}

const register = (acno, username, password) => {

  return db.User.findOne({ acno })
    .then(user => {
       console.log(user)
      if (user) {
        return {
          statusCode: 422,
          status: false,
          message: "User already exist... Please Log In"
        }
      }
      else {
        const newUser = new db.User({
          acno,
          username,
          password,
          balance: 0,
          transaction: []
        })
        newUser.save()
        return {
          statusCode: 200,
          status: true,
          message: "Sucessfully Registered"
        }
      }
    })
}

const login = (req, acno, pswd) => {

  return db.User.findOne({
     acno,
    password: pswd
  })
    .then(user => {
      if (user) {
        req.session.currentAcc = acno
        return {
          statusCode: 200,
          status: true,
          message: "sucessfully login"
        }
      }
      return {
        statusCode: 422,
        status: false,
        message: "invalid Account details"
      }
    })
}
const deposit = (acno, pswd, amount) => {

  var amt = parseInt(amount)
  return db.User.findOne({
     acno,
    password:pswd
  })
  .then(user=>{
    if(!user){
      return {
        statusCode: 422,
        status: false,
        message: "invalid user"
      }
    }
    user.balance=user.balance + amt
    user.transaction.push({
      amount:amt,
      type:"CREDIT"
    })
    user.save()
    return {
      statusCode: 200,
      status: true,
      message: amt + "succesfully deposited and new balance is: " + user.balance
    }
  })
}
  

const withdraw = (req,acno, pswd, amount) => {

  var amt = parseInt(amount)
  return db.User.findOne({
    acno,
    password:pswd
  })
  .then(user=>{
    if(!user){
      return {
        statusCode: 422,
        status: false,
        message: "invalid user"
      }
    }
    if(req.session.currentAcc != user.acno){
      return{
        statusCode: 422,
        status: false,
        message: "operation Denied"
      }
    }
    if(user.balance < amt){
      return {
        statusCode: 422,
        status: false,
        message: "insufficient balance"
      }
    }
    user.balance=user.balance - amt
    user.transaction.push({
      amount:amt,
      type:"DEBIT"
    })
    user.save()
    return {
      statusCode: 200,
      status: true,
      message: amt + "succesfully debited and new balance is: " + user.balance
    }
  })
}
  
const getTransaction = (req) => {
  return db.User.findOne({
    acno:req.session.currentAcc

  }).then(user=>{
    if(user){
   
  return {
    statusCode: 200,
    status: true,
    transaction: user.transaction
  }
}

else{
  return{
    statusCode:422,
    status:false,
    message:"Invalid Operation"
  }
}
  })
  }

module.exports = {
  register,
  login,
  deposit,
  withdraw,
  getTransaction
}