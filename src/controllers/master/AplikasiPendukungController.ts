import { Request, Response } from 'express'
import { validateInput } from '../../utilities/ValidateHandler'
import prisma from '../../config/database'
import { CONFIG } from '../../config'
import { logActivity } from '../../utilities/LogActivity'
import { ResponseData } from '@/utilities/Response'
import { Pagination } from '@/utilities/Pagination'
import { AplikasiPendukungSchema } from '@/Schema/ManajementWebsiteSchema'

const AplikasiPendukungController = {
    getAllAplikasiPendukung : async (req: Request, res: Response) => {
        try {
            const page = new Pagination(
              parseInt(req.query.page as string),
              parseInt(req.query.limit as string),
            )
      
            const whereCondition = {
              deletedAt: null,
            }
      
            const [rowData, count] = await Promise.all([
              prisma.aplikasiPendukung.findMany({
                where: whereCondition,
                skip: page.offset,
                take: page.limit,
                orderBy: { id: 'desc' },
              }),
              prisma.aplikasiPendukung.count({
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
          }catch (error) {
            return ResponseData.serverError(res, error)
        }
    },
    
    getDetailAplikasPendukung: async (req: Request, res: Response) => {
      try {
        const id = parseInt(req.params.id as string)

        const data = await prisma.aplikasiPendukung.findUnique({
          where: { id: id },
        })

        if (!data) {
          return ResponseData.notFound(res, 'Data not found')
        }

        return ResponseData.ok(res, data, 'Success get data')
      } catch (error) {
        return ResponseData.serverError(res, error)
      }
    },

    updateAplikasiPendukung: async (req: Request, res: Response) => {
      try {
        const id = parseInt(req.params.id as string)
        const reqBody = req.body
        const userLogin = req.user as jwtPayloadInterface

        const validationResult = validateInput(AplikasiPendukungSchema, reqBody)

        if (!validationResult.success) {
          return ResponseData.badRequest(res, 'Invalid Input', validationResult.errors)
        }

        const data = await prisma.aplikasiPendukung.findUnique({
          where: { id: id },
        })

        if (!data) {
          return ResponseData.notFound(res, 'Data not found')
        }

        const updatedData = await prisma.aplikasiPendukung.update({
          where: { id: id },
          data: validationResult.data!,
        })

        logActivity(userLogin.id, 'UPDATE', `update aplikasi pendukung ${reqBody.titleApk}`)  

        return ResponseData.ok(res, updatedData, 'Success update data')
      } catch (error) {
        return ResponseData.serverError(res, error)
      }
    }
}

export default AplikasiPendukungController