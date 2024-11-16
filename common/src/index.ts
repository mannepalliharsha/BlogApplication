import zod from 'zod'
export const signup=zod.object({
      email : zod.string().email(),
      password : zod.string(),
      name : zod.string(),
})
export const signin=zod.object({
      email : zod.string().email(),
      password :zod.string()
})
export const blogcreate=zod.object({
      title : zod.string(),
      content : zod.string()
})
export const updateblog=zod.object({
      title : zod.string(),
      content : zod.string(),
       id : zod.string()
})
export type signupinput=zod.infer<typeof signup>;
export type signininput=zod.infer<typeof signin>;
export type blogcreateinput=zod.infer<typeof blogcreate>
export type updatebloginput=zod.infer<typeof updateblog>