import { Request, Response } from 'express'
import { validateInput } from '../../utilities/ValidateHandler'
import prisma from '../../config/database'
import { CONFIG } from '../../config'
import { logActivity } from '../../utilities/LogActivity'
import { ResponseData } from '@/utilities/Response'
import { Pagination } from '@/utilities/Pagination'
import { Faq } from '@/Schema/ManajementWebsiteSchema'

const FaqController = {
  getAllFaq: async (req: Request, res: Response) => {
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
        whereCondition.createdAt = {
          gte: new Date(String(date_strat) + 'T00:00:00.000Z'),
          lte: new Date(String(date_end) + 'T23:59:59.999Z'),
        }
      }
      
      const [rowData, count] = await Promise.all([
        prisma.faq.findMany({
          where: whereCondition,
          skip: page.offset,
          take: page.limit,
          orderBy: { id: 'desc' },
        }),
        prisma.faq.count({
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

  getDetailFaq: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id as string)
      
      const data = await prisma.faq.findFirst({
        where: { id, deletedAt: null },
      })
      
      if (!data) {
        return ResponseData.notFound(res, 'Data not found')
      }
      
      return ResponseData.ok(res, data, 'Success get data')
    } catch (error) {
      return ResponseData.serverError(res, error)
    }
  },

  createFaq: async (req: Request, res: Response) => {
    try {
      const reqBody = req.body
      const userLogin = req.user as jwtPayloadInterface
      
      const validationResult = validateInput(Faq, reqBody)
      
      if (!validationResult.success) {
        return ResponseData.badRequest(res, 'Invalid Input', validationResult.errors)
      }
      
      const data = await prisma.faq.create({
        data: validationResult.data!,
      })
      
      logActivity(userLogin.id, 'CREATE', `create Faq ${reqBody.question}`)
      
      return ResponseData.created(res, data, 'Success create data')
    } catch (error: any) {
      if (error.code === 'P2002') {
        return ResponseData.badRequest(res, `Duplicate value for field: ${error.meta.target}`)
      }
      return ResponseData.serverError(res, 'Internet Server Error '+ error)
    }
  },

  updateFaq: async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string)
      const reqBody = req.body
      const userLogin = req.user as jwtPayloadInterface
    
      const validationResult = validateInput(Faq, reqBody)
    
      if (!validationResult.success) {
        return ResponseData.badRequest(res, 'Invalid Input', validationResult.errors)
      }
    
      const data = await prisma.faq.findUnique({
        where: { id, deletedAt: null },
      })
    
      if (!data) {
        return ResponseData.notFound(res, 'Data not found')
      }
    
      const updatedData = await prisma.faq.update({
        where: { id },
        data: validationResult.data!,
      })
    
      logActivity(userLogin.id, 'UPDATE', `update faq ${reqBody.question}`)
    
      return ResponseData.ok(res, updatedData, 'Success update data')
    } catch (error: any) {
      if (error.code === 'P2002') {
        return ResponseData.badRequest(res, `Duplicate value for field: ${error.meta.target}`)
      }
      return ResponseData.serverError(res, error)
    }
  },

  deleteFaq: async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string)
      const userLogin = req.user as jwtPayloadInterface
      
      const data = await prisma.faq.findUnique({
        where: { id, deletedAt: null },
      })
      
      if (!data) {
        return ResponseData.notFound(res, 'Data not found')
      }
      
      const deletedData = await prisma.faq.update({
        where: { id },
        data: { deletedAt: new Date() },
      })
      
      logActivity(userLogin.id, 'DELETE', `delete faq ${data.question}`)
      
      return ResponseData.ok(res, deletedData, 'Success delete data')
    } catch(error : any){
      return ResponseData.badRequest(res, 'Internet Server Error '+ error)
    }
  },
}

export default FaqController