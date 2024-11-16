import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {sign,verify,decode} from 'hono/jwt'
import {signin,signup} from '@mannepalliharshavardhan/medium-blog'
interface check{
    email : string,
    name : string
    password : string,
}
export const userRouter = new Hono<{
    Bindings : {
        DATABASE_URL : string
         Jwtpass : string
    }
 }>();
userRouter.post('/signup', async (c) => {
    const prisma =new PrismaClient({
      datasourceUrl:c.env.DATABASE_URL,}).$extends(withAccelerate())
      const body =await c.req.json()
        const {success} =signup.safeParse(body);
       if(!success){
           c.status(403);
           return c.json({
              msg : "wrong inputs"
           })
       }

        const identify=await prisma.User.findUnique({
             where : {
                email : body.email
             }
        })
  
        console.log(identify);
        const identify2=await prisma.user.findUnique({
            where : { 
               email :body.email
            },
            select : {
                id :true,
                email : true,
                password : true,
                name : true,
            }
        })
        console.log(identify2)
        if(identify){
            return c.json({
                msg : "Already email exist"
            })
        }
     const user= await prisma.User.create({
            data : {
                email : body.email,
                name : body.name,
                password : body.password
            }
      })
      console.log(user.id)
      const token =await sign(user.id,c.env.Jwtpass);
  
    return c.json({
       "jwt" :token
     })
  })
  interface hey{
       email : string,
       password : string
  }
  userRouter.post('/signin',async (c) => {
    const prisma =new PrismaClient({
      datasourceUrl:c.env.DATABASE_URL,}).$extends(withAccelerate())
      const body =await c.req.json()
      const {success} =signin.safeParse(body);
      if(!success){
          c.status(403);
          return c.json({
             msg : "wrong inputs"
          })
      }
        const validate  =await prisma.User.findUnique({
             where : {
                 email : body.email,
                 password : body.password
             }
        }) 
        if(!validate){
             return c.json({
                msg : "invalid Credentials"
             })
        }
  
       const token=await sign({id :validate.id},c.env.Jwtpass);
       return c.json({
           msg : token
       })
  
  })