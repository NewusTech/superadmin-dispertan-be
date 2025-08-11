import { Request, Response } from 'express'
import { validateInput } from '../../utilities/ValidateHandler'
import prisma from '../../config/database'
import { ResponseData } from '@/utilities/Response'
import { Pagination } from '@/utilities/Pagination'
import { Pengaduan } from '@/Schema/ManajementWebsiteSchema'
import { handleUpload } from '@/utilities/UploadHandler'

const PengaduanController = {
  getAllPengaduan: async (req: Request, res: Response) => {
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
        prisma.pengaduan.findMany({
          where: whereCondition,
          skip: page.offset,
          take: page.limit,
          orderBy: { id: 'desc' },
        }),
        prisma.pengaduan.count({
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
    
  getDetailPengaduan: async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string)
      
      const data = await prisma.pengaduan.findUnique({
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

  createPengaduan: async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return ResponseData.badRequest(res, 'File not found in request')
      }

      const reqBody = req.body

      const validationResult = validateInput(Pengaduan, reqBody)

      if (!validationResult.success) {
        return ResponseData.badRequest(res, 'Invalid Input', validationResult.errors)
      }

      const file = await handleUpload(req, reqBody.title.split(' ').join('_') as string, 'pengaduan')

      const pengaduan = await prisma.pengaduan.create({
        data: { ...validationResult.data!, file },
      })

      return ResponseData.created(res, pengaduan, 'Success create data')
            
    } catch (error) {
      return ResponseData.serverError(res, error)
    }
  },

    
}

export default PengaduanController