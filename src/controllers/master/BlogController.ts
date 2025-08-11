import { Request, Response } from 'express'
import { validateInput } from '../../utilities/ValidateHandler'
import prisma from '../../config/database'
import { logActivity } from '../../utilities/LogActivity'
import { ResponseData } from '@/utilities/Response'
import { Pagination } from '@/utilities/Pagination'
import { Blog } from '@/Schema/ManajementWebsiteSchema'
import { handleUpload } from '@/utilities/UploadHandler'
import { deleteFileFromS3 } from '@/utilities/AwsHandler'

const slugify = (title: string) => {
    return title.toLowerCase().trim().replace(" ", "-")
}

const BlogController = {
    getAllBlog: async (req: Request, res: Response) => {
        try {
            const page = new Pagination(
              parseInt(req.query.page as string),
              parseInt(req.query.limit as string),
            )
      
            const { date_strat, date_end, search } = req.query
      
            const whereCondition = {
              deletedAt: null,
            } as any
      
            if(search){
              whereCondition.OR = [
                {
                  name: {
                    contains: String(search),
                    mode: 'insensitive',
                  },
                },
                {
                  gender: {
                    contains: String(search),
                    mode: 'insensitive',
                  },
                },
              ]
            }
      
            if(!!date_strat && !!date_end){
              whereCondition.date = {
                gte: new Date(String(date_strat) + 'T00:00:00.000Z'),
                lte: new Date(String(date_end) + 'T23:59:59.999Z'),
              }
            }
      
            const [rowData, count] = await Promise.all([
              prisma.blog.findMany({
                where: whereCondition,
                skip: page.offset,
                take: page.limit,
                orderBy: { id: 'desc' },
              }),
              prisma.blog.count({
                where: whereCondition,
              }),
            ])
      
            return ResponseData.ok(
              res,
              page.paginate({
                count,
                rows: rowData,
              }),
              'Success',
            )
        } catch (error) {
            return ResponseData.serverError(res, error)
        }
    },
    
    getDetailBlog: async (req: Request, res: Response) => {
        try {
            const slug = req.params.slug as string
      
            const data = await prisma.blog.findFirst({
              where: { slug, deletedAt: null }
            })
      
            if (!data) {
              return ResponseData.notFound(res, 'Data not found')
            }
      
            return ResponseData.ok(res, data, 'Success get data')
        } catch (error) {
            return ResponseData.serverError(res, error)
        }
    },

    createBlog: async (req: Request, res: Response) => {
        try {
            if(!req.file){
                return ResponseData.badRequest(res, 'File not found in request')
            }

            const userLogin = req.user as jwtPayloadInterface
            const reqBody = req.body

            const validationResult = validateInput(Blog, reqBody)

            if (!validationResult.success) {
              return ResponseData.badRequest(res, 'Invalid Input', validationResult.errors)
            }

            const file = await handleUpload(req, reqBody.title.split(' ').join('_') as string, 'blog')
            const slug = slugify(reqBody.title) as any

            const blog = await prisma.blog.create({
                data: {...validationResult.data!, file, slug, date: new Date(String(reqBody.date))}
            })

            logActivity(userLogin.id, 'CREATE', 'Menambahkan blog / artikel dengan judul ' + reqBody.title)

            return ResponseData.created(res, blog, 'Success create data')
        } catch (error) {
            return ResponseData.serverError(res, error)
        }
    },

    updateBlog: async (req: Request, res: Response) => {
        try {
            const slugy = req.params.slug as string
            const reqBody = req.body
            const userLogin = req.user as jwtPayloadInterface

            const cekBlog = await prisma.blog.findFirst({
                where: {
                    slug: slugy,
                    deletedAt: null
                }
            })

            if(!cekBlog){
                return ResponseData.notFound(res, "Not Found Blog")
            }

            const validationResult = validateInput(Blog, reqBody)

            if (!validationResult.success) {
              return ResponseData.badRequest(res, 'Invalid Input', validationResult.errors)
            }

            let file = cekBlog?.file as any
            if(req.file){
                file = await handleUpload(req, reqBody.title.split(' ').join('_') as string, 'blog')
            }

            const slug = slugify(reqBody.title) as any

            const blog = await prisma.blog.update({
                where: {id: cekBlog?.id},
                data: {...validationResult.data!, file, slug, date: new Date(String(reqBody.date))}
            })

            logActivity(userLogin.id, 'UPDATE', 'Update blog / artikel dengan judul' + reqBody.title)

            return ResponseData.created(res, blog, 'Success update data')
        } catch (error) {
            return ResponseData.serverError(res, error)
        }
    },

    deleteBlog: async (req: Request, res: Response) => {
        try {
            const slug = req.params.slug as string
            
            const cekBlog = await prisma.blog.findFirst({
                where:{slug, deletedAt: null}
            })

            if(!cekBlog){
                return ResponseData.notFound(res, 'Data Blog Not Found')
            }

            deleteFileFromS3(cekBlog?.file as string)

            const blog = await prisma.blog.delete({
                where:{id: cekBlog?.id, deletedAt: null}
            })

            return ResponseData.created(res, blog, 'Success delete data')
        } catch (error) {
            return ResponseData.serverError(res, error)
        }
    }
}

export default BlogController