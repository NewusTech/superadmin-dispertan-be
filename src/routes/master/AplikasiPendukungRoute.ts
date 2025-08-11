import AplikasiPendukungController from '@/controllers/master/AplikasiPendukungController'
import { AuthMiddleware } from '@/middleware/AuthMiddleware'
import { Router } from 'express'

export const AplikasiPendukungRouter = (): Router => {
  const router = Router()
  
  router.get('/', AplikasiPendukungController.getAllAplikasiPendukung)
  router.get('/detail/:id', AplikasiPendukungController.getDetailAplikasPendukung)

  router.use(AuthMiddleware)

  router.put('/update/:id', AplikasiPendukungController.updateAplikasiPendukung)

  return router
}
