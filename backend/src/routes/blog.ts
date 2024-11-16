import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {sign,verify,decode} from 'hono/jwt'
import {blogcreate,updateblog} from '@mannepalliharshavardhan/medium-blog'
export const blogRouter=new Hono<{
      Bindings : {
        DATABASE_URL : string
        Jwtpass : string
      },
      Variables : {
          authorid : string
      }
}>();
blogRouter.use('/*',async function(c,next){
    const header : string =c.req.header("Authorization") || " ";
    const response=await verify(header,c.env.Jwtpass)
    if(response.id){
      c.set('authorid',response.id);
        await next();
    }
    else {
        c.status(403);
        return c.json({
           msg : "Invalid authorization"
        })
    }
})
blogRouter.post('/', async (c) => {
    const prisma =new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL,}).$extends(withAccelerate())
      const body =await c.req.json();
      const {success} =blogcreate.safeParse(body);
      if(!success){
          c.status(403);
          return c.json({
             msg : "wrong inputs"
          })
      }
      const authorid=c.get("authorid");
      console.log(authorid);
     try{
        const response=  await prisma.Post.create({
              data : {
                  title : body.title,
                  content : body.content,
                  authorId: authorid
              }
          })
          return c.json({
              msg : response.id
          })
     }
     catch(e){
        c.status(411);
         console.log(e);
        return  c.json({
              msg : "server issue"
         })
     }
})
blogRouter.put('/', async (c) => {
    const prisma =new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL,}).$extends(withAccelerate())
     const body =await c.req.json();
     const {success} =updateblog.safeParse(body);
     if(!success){
         c.status(403);
         return c.json({
            msg : "wrong inputs"
         })
     }
     try{
        const blogs=  await prisma.Post.update({
              where : {
                   id : body.id
              },
              data : {
                  title : body.title,
                  content : body.content
              }
          })
          return c.json({
              blogs
          })

     }
     catch(e){
          c.status(411);
           return c.json({
              msg : "internal issue"
           })
     }
})
blogRouter.get('/:id',async (c)=>{
    const prisma =new PrismaClient({
    datasourceUrl:c.env.DATABASE_URL,}).$extends(withAccelerate())
    const id= c.req.param("id");
    console.log(id);
      try{
         const blogs= await prisma.Post.findUnique({
               where : {
                   id : id
               }
          })
          return c.json({
              blogs
          })
      }
      catch(e){
          c.status(411);
          c.json({
              msg : "Internal issue"
          })
      }
})
blogRouter.get('/bulk',async (c)=>{
    const prisma =new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL,}).$extends(withAccelerate())
          try{
             const blogs= await prisma.Post.findMany({})
              return c.json({
                  blogs
              })
          }
          catch(e){
              c.status(411);
              c.json({
                  msg : "Internal issue"
              })
          }
})