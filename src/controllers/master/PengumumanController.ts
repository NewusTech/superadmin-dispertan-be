import { Request, Response } from 'express'
import { validateInput } from '../../utilities/ValidateHandler'
import prisma from '../../config/database'
import { CONFIG } from '../../config'
import { logActivity } from '../../utilities/LogActivity'
import { ResponseData } from '@/utilities/Response'
import { Pagination } from '@/utilities/Pagination'
import { PengumumanSchema } from '@/Schema/ManajementWebsiteSchema'
import { handleUpload } from '@/utilities/UploadHandler'
import { deleteFileFromS3 } from '@/utilities/AwsHandler'

const PengumumanController = {
  getAllPengumuman: async (req: Request, res: Response) => {
    try {
      const page = new Pagination(
        parseInt(req.query.page as string),
        parseInt(req.query.limit as string),
      )
      const { start_date, end_date, search } = req.query
      
      const whereCondition = {
        deletedAt: null,
      } as any

      if(!!start_date && !!end_date){
        whereCondition.date = {
          gte: new Date(String(start_date) + 'T00:00:00.000Z'),
          lte: new Date(String(end_date) + 'T23:59:59.999Z'),
        }
      }
            
      if(search){
        whereCondition.OR = [
          {
            title: {
              contains: String(search),
              mode: 'insensitive',
            },
          },
          {
            value: {
              contains: String(search),
              mode: 'insensitive',
            },
          },
        ]
      }
      
      const [rowData, count] = await Promise.all([
        prisma.pengumuman.findMany({
          where: whereCondition,
          skip: page.offset,
          take: page.limit,
          orderBy: { id: 'desc' },
        }),
        prisma.pengumuman.count({
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

  getDetailPengumuman: async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string)
      
      const data = await prisma.pengumuman.findUnique({
        where: { id: id, deletedAt: null },
      })
      
      if (!data) {
        return ResponseData.notFound(res, 'Data not found')
      }
      
      return ResponseData.ok(res, data, 'Success get data')
    } catch (error) {
      return ResponseData.serverError(res, error)
    }
  },

  createPengumuman: async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return ResponseData.badRequest(res, 'File not found in request')
      }

      const reqBody = req.body
      const userLogin = req.user as jwtPayloadInterface
      
      const validationResult = validateInput(PengumumanSchema, reqBody)
      
      if (!validationResult.success) {
        return ResponseData.badRequest(res, 'Invalid Input', validationResult.errors)
      }

      const file = await handleUpload(req, reqBody.title.split(' ').join('_') as string, 'pengumuman')
      
      const data = await prisma.pengumuman.create({
        data: { ...validationResult.data!, file, date: new Date(String(reqBody.date)) },
      })
      
      logActivity(userLogin.id, 'CREATE', `create pengumuman ${reqBody.title}`)
      
      return ResponseData.created(res, data, 'Success create data')
    } catch (error) {
      return ResponseData.serverError(res, error)
    }
  },

  updatePengumuman: async (req: Request, res: Response) => {
    try {

      const id = parseInt(req.params.id as string)
      const reqBody = req.body
      const userLogin = req.user as jwtPayloadInterface

      console.log(reqBody)
      
      const validationResult = validateInput(PengumumanSchema, reqBody)
      
      if (!validationResult.success) {
        return ResponseData.badRequest(res, 'Invalid Input', validationResult.errors)
      }
      
      const data = await prisma.pengumuman.findUnique({
        where: { id: id },
      })
      
      if (!data) {
        return ResponseData.notFound(res, 'Data not found')
      }

      let file = data.file

      if(req.file){
        await deleteFileFromS3(data?.file || '')
        file = await handleUpload(req, reqBody.title.split(' ').join('_') as string, 'pengumuman')
      }
      
      const updatedData = await prisma.pengumuman.update({
        where: { id: id },
        data: { ...validationResult.data!, file, date: new Date(String(reqBody.date)) },
      })
      
      logActivity(userLogin.id, 'UPDATE', `update pengumuman ${reqBody.title}`)
      
      return ResponseData.ok(res, updatedData, 'Success update data')
    } catch (error) {
      return ResponseData.serverError(res, error)
    }
  },

  deletePengumuman: async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string)
      const userLogin = req.user as jwtPayloadInterface
      
      const data = await prisma.pengumuman.findUnique({
        where: { id: id },
      })
      
      if (!data) {
        return ResponseData.notFound(res, 'Data not found')
      }
      
      await deleteFileFromS3(data?.file || '')

      const deletedData = await prisma.pengumuman.update({
        where: { id: id },
        data: { deletedAt: new Date() },
      })
      
      logActivity(userLogin.id, 'DELETE', `delete pengumuman ${data.title}`)
      
      return ResponseData.ok(res, deletedData, 'Success delete data')
    } catch (error) {
      return ResponseData.serverError(res, error)
    }
  },
}

export default PengumumanController