import { Request, Response } from 'express'
import { Pagination } from '@/utilities/Pagination'
import prisma from '@/config/database'
import { validateInput } from '@/utilities/ValidateHandler'
import { RoleSchema } from '@/Schema/UserSchema'
import { hashPassword } from '@/utilities/PasswordHandler'
import { getIO } from '@/config/socket'
import { logActivity } from '@/utilities/LogActivity'
import { ResponseData } from '@/utilities/Response'

const RoleController = {
  getAllRole: async (req: Request, res: Response) => {
    try {
      const page = new Pagination(
        parseInt(req.query.page as string),
        parseInt(req.query.limit as string),
      )
      
      const whereCondition = {
        deletedAt: null,
      } as any

      if(req.query.search){
        whereCondition.OR = [
          {
            name: {
              contains: String(req.query.search),
              mode: 'insensitive',
            },
          },
        ]
      }
      
      const [userData, count] = await Promise.all([
        prisma.user.findMany({
          where: whereCondition,
          skip: page.offset,
          take: page.limit,
          orderBy: { id: 'desc' },
        }),
        prisma.user.count({
          where: whereCondition,
        }),
      ])
      
      return ResponseData.ok(
        res,
        page.paginate({
          count,
          rows: userData,
        }),
        'Success get all ',
      )
    } catch (error: any) {
      return ResponseData.serverError(res, error)
    }
  },

  getDetailRole: async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string)
            
      const data = await prisma.user.findUnique({
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

  createRole : async (req: Request, res: Response) => {
    try{
      const reqBody = req.body
      const userLogin = req.user as jwtPayloadInterface

      const validationResult = validateInput(RoleSchema, reqBody)
            
      if (!validationResult.success) {
        return ResponseData.badRequest(res, 'Invalid Input', validationResult.errors)
      }
            
      const result = await prisma.$transaction(async (tx) => {
                
        const data = await tx.role.create({
          data: validationResult.data!,
        })

        // await tx.

        return data
      })
            
      logActivity(userLogin.id, 'CREATE', 'Menambahkan role dengan nama ' + result.name)
            
      return ResponseData.created(res, result, 'Success create data')
    } catch (error) {
      return ResponseData.serverError(res, error)
    }
  },
}

export default RoleController