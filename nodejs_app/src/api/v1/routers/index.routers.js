
const auth =require("../modules/auth/auth.routes")
const user =require("../modules/user/user.routes")

module.exports =(app)=>{
    const v1 ="/api/v1"

    app.use(v1+"/auth",auth)
    app.use(v1+"/user",user)
}