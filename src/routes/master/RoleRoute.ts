import RoleController from '@/controllers/master/RoleController'
import { AuthMiddleware } from '@/middleware/AuthMiddleware'
import { Router } from 'express'

export const RoleRouter = (): Router => {
  const router = Router()

  router.use(AuthMiddleware)

  router.get('/', RoleController.getAllRole)
  router.get('/detail/:id', RoleController.getDetailRole)
  router.post('/create', RoleController.createRole)
  router.put('/update/:id', RoleController.updateRole)
  router.delete('/delete/:id', RoleController.deleteRole)

  return router
}
