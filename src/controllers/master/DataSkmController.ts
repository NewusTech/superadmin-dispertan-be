import { Request, Response } from 'express'
import { validateInput } from '../../utilities/ValidateHandler'
import prisma from '../../config/database'
import { logActivity } from '../../utilities/LogActivity'
import { ResponseData } from '@/utilities/Response'
import { Pagination } from '@/utilities/Pagination'
import { PertanyaanSkm } from '@/Schema/ManajementWebsiteSchema'

const DataSkmController = {
    getAllDataSkm: async (req: Request, res: Response) => {
        try {
            const page = new Pagination(
                parseInt(req.query.page as string),
                parseInt(req.query.limit as string),
            )

            const { date_strat, date_end, search } = req.query

            const whereCondition = {
                deletedAt: null,
            } as any

            if(!!search){
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
                prisma.dataSkm.findMany({
                    where: whereCondition,
                    skip: page.offset,
                    take: page.limit,
                    orderBy: { id: 'desc' },
                }),
                prisma.dataSkm.count({
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

    getDetailDataSkm: async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id as string)

            const data = await prisma.dataSkm.findUnique({
                where: { id, deletedAt: null },
                include: {
                    jawabanSkm: true,
                }
            })

            if (!data) {
                return ResponseData.notFound(res, 'Data not found')
            }

            return ResponseData.ok(res, data, 'Success get data')
        } catch (error) {
            return ResponseData.serverError(res, error)
        }
    },

    createDataSkm: async (req: Request, res: Response) => {
        try {
            const reqBody = req.body

            const result = await prisma.$transaction(async (tx) => {
                const data = await tx.dataSkm.create({
                    data: {
                        name: reqBody.name as string,
                        gender: reqBody.gender as string,
                        age: reqBody.age as string,
                        alamat: reqBody.alamat as string,
                    },
                })
    
                if(typeof reqBody.question == 'string'){
                    reqBody.question = JSON.parse(reqBody.question);
                }
    
                if(typeof reqBody.answer == 'string'){
                    reqBody.answer = JSON.parse(reqBody.answer);
                }

                if(typeof reqBody.opsi == 'string'){
                    reqBody.opsi = JSON.parse(reqBody.opsi);
                }
    
                for(let i = 0; i < reqBody.question.length; i++){
                    await tx.jawabanSkm.create({
                        data: {
                            dataSkmId: data.id,
                            question: reqBody.question[i],
                            answer: reqBody.answer[i],
                            opsi: reqBody.opsi[i]
                        },
                    })
                }

                return data
            })


            return ResponseData.created(res, result, 'Success create data')
        } catch (error) {
            return ResponseData.serverError(res, error)
        }
    }
}

export default DataSkmController