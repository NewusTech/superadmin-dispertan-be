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
        prisma.role.findMany({
          where: whereCondition,
          skip: page.offset,
          take: page.limit,
          orderBy: { id: 'desc' },
        }),
        prisma.role.count({
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
            
      const data = await prisma.role.findUnique({
        where: { id, deletedAt: null },
        include: {
          rolePermissions: {
            include: {
              permission: true,
            },
          },
        },
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

      if(typeof reqBody.permissions == 'string'){
        reqBody.permissions = JSON.parse(reqBody.permissions)
      }
            
      const result = await prisma.$transaction(async (tx) => {
                
        const role = await tx.role.create({
          data: {
            name : reqBody.name,
          },
        })

        for (let i = 0; i < reqBody.permissions.length; i++) {
          const permissions = reqBody.permissions[i]

          const dataPermissions = await tx.permissions.create({
            data: {
              name: permissions,
            },
          })

          await tx.rolePermission.create({
            data: {
              roleId: role?.id,
              permissionId: dataPermissions.id,
              canRead: true,
              canWrite: true,
              canUpdate: true,
              canDelete: true,
            },
          })
        }

        return role
      })
            
      logActivity(userLogin.id, 'CREATE', 'Menambahkan role dengan nama ' + result.name)
            
      return ResponseData.created(res, result, 'Success create data')
    } catch (error) {
      return ResponseData.serverError(res, error)
    }
  },

  updateRole : async (req: Request, res: Response) => {
    try{
      const id      = Number(req.params.id)
      const reqBody = req.body
      const userLogin = req.user as jwtPayloadInterface

      const validationResult = validateInput(RoleSchema, reqBody)
            
      if (!validationResult.success) {
        return ResponseData.badRequest(res, 'Invalid Input', validationResult.errors)
      }

      if(typeof reqBody.permissions == 'string'){
        reqBody.permissions = JSON.parse(reqBody.permissions)
      }
            
      const result = await prisma.$transaction(async (tx) => {
                
        const role = await tx.role.update({
          where: { id },
          data: {
            name : reqBody.name,
          },
        })

        const rolePermission = await tx.rolePermission.findMany({
          where: {
            roleId : role?.id,
          },
        })

        const permissionIds = rolePermission.map(rp => rp.permissionId)

        await tx.rolePermission.deleteMany({
          where: {
            roleId: role?.id,
          },
        })

        await tx.permissions.deleteMany({
          where: {
            id: {
              in: permissionIds,
            },
          },
        })

        for (let i = 0; i < reqBody.permissions.length; i++) {
          const permissions = reqBody.permissions[i]

          const dataPermissions = await tx.permissions.create({
            data: {
              name: permissions,
            },
          })

          await tx.rolePermission.create({
            data: {
              roleId: role?.id,
              permissionId: dataPermissions.id,
              canRead: true,
              canWrite: true,
              canUpdate: true,
              canDelete: true,
            },
          })
        }

        return role
      })
            
      logActivity(userLogin.id, 'UPDATE', 'Perubahan role dengan nama ' + result.name)
            
      return ResponseData.created(res, result, 'Success update data')
    } catch (error) {
      return ResponseData.serverError(res, error)
    }
  },

  deleteRole : async (req: Request, res: Response) => {
    try {
      const id      = Number(req.params.id)
      const userLogin = req.user as jwtPayloadInterface
      
      const cekRole = await prisma.role.findFirst({
        where: {
          id,
        },
      })

      if(!cekRole){
        return ResponseData.notFound(res, 'Data not found')
      }

      const deletedData = await prisma.role.update({
        where: { id: id },
        data: { deletedAt: new Date(), name: `${cekRole.name}_${new Date()}` },
      })
      
      logActivity(userLogin.id, 'DELETE', `delete role ${deletedData.name}`)
      
      return ResponseData.ok(res, deletedData, 'Success delete data')

    } catch (error) {
      return ResponseData.serverError(res, error)
    }
  },
}

export default RoleController