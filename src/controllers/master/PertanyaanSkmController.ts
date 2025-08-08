import { Request, Response } from 'express'
import { validateInput } from '../../utilities/ValidateHandler'
import prisma from '../../config/database'
import { logActivity } from '../../utilities/LogActivity'
import { ResponseData } from '@/utilities/Response'
import { Pagination } from '@/utilities/Pagination'
import { PertanyaanSkm } from '@/Schema/ManajementWebsiteSchema'

const PertanyaanSkmController = {
  getAllPertanyaanSkm: async (req: Request, res: Response) => {
    try {
      const page = new Pagination(
        parseInt(req.query.page as string),
        parseInt(req.query.limit as string),
      )

      const whereCondition = {
        deletedAt: null,
      } as any

      if (req.query.search) {
        whereCondition.OR = [
          {
            pertanyaan: {
              contains: String(req.query.search),
              mode: 'insensitive',
            },
          },
        ]
      }

      const [rowData, count] = await Promise.all([
        prisma.pertanyaanSkm.findMany({
          where: whereCondition,
          skip: page.offset,
          take: page.limit,
          orderBy: { id: 'desc' },
        }),
        prisma.pertanyaanSkm.count({
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

  getDetailPertanyaanSkm: async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string)

      const data = await prisma.pertanyaanSkm.findUnique({
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

  createPertanyaanSkm: async (req: Request, res: Response) => {
    try {
      const reqBody = req.body
      const userLogin = req.user as jwtPayloadInterface

      const validationResult = validateInput(PertanyaanSkm, reqBody)

      if (!validationResult.success) {
        return ResponseData.badRequest(res, 'Invalid Input', validationResult.errors)
      }

      const data = await prisma.pertanyaanSkm.create({
        data: validationResult.data!,
      })

      logActivity(userLogin.id, 'CREATE', `create pertanyaan skm ${reqBody.question}`)

      return ResponseData.created(res, data, 'Success create data')
    } catch (error) {
      return ResponseData.serverError(res, error)
    }
  },

  updatePertanyaanSkm: async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string)
      const reqBody = req.body
      const userLogin = req.user as jwtPayloadInterface

      const validationResult = validateInput(PertanyaanSkm, reqBody)

      if (!validationResult.success) {
        return ResponseData.badRequest(res, 'Invalid Input', validationResult.errors)
      }

      const data = await prisma.pertanyaanSkm.findUnique({
        where: { id, deletedAt: null },
      })

      if (!data) {
        return ResponseData.notFound(res, 'Data not found')
      }

      const updatedData = await prisma.pertanyaanSkm.update({
        where: { id },
        data: validationResult.data!,
      })

      logActivity(userLogin.id, 'UPDATE', `update pertanyaan skm ${reqBody.question}`)

      return ResponseData.ok(res, updatedData, 'Success update data')
    } catch (error) {
      return ResponseData.serverError(res, error)
    }
  },

  deletePertanyaanSkm: async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id as string)
      const userLogin = req.user as jwtPayloadInterface

      const data = await prisma.pertanyaanSkm.findUnique({
        where: { id, deletedAt: null },
      })

      if (!data) {
        return ResponseData.notFound(res, 'Data not found')
      }

      const deletedData = await prisma.pertanyaanSkm.update({
        where: { id },
        data: { deletedAt: new Date() },
      })

      logActivity(userLogin.id, 'DELETE', `delete pertanyaan skm ${data.question}`)

      return ResponseData.ok(res, deletedData, 'Success delete data')
    } catch (error) {
      return ResponseData.serverError(res, error)
    }
  },
}

export default PertanyaanSkmController